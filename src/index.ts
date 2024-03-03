import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from "cors";
import { generate, getAllFiles } from "./utils";
import simpleGit from "simple-git";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";
const publisher = createClient();
publisher.connect();

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello, TypeScript with Express!");
});

app.post("/deploy", async (req, res) => {
  const { repoUrl } = req.body;
  const id = generate();
  await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));
  const files = getAllFiles(path.join(__dirname, `output/${id}`));
  files.forEach(async (file) => {
    await uploadFile(file.slice(__dirname.length + 1), file);
  });
  publisher.lPush("build-queue",id)
 // publisher.hSet("status", id, "uploaded");
  res.json({ id });
});

// app.get("/status", async (req, res) => {
//     const id = req.query.id;
//     const response = await subscriber.hGet("status", id as string);
//     res.json({
//         status: response
//     })
// })

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


