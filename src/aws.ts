import { S3 } from "aws-sdk";
import fs from "fs";

const s3 = new S3({
    accessKeyId: "ce825f7a6b2d4367860eca38a698b045",
    secretAccessKey: "05f2bda0e2ef204bb327e86c737c26f16bd94e0ae8478b0321d066946ab9a947",
    endpoint: "https://3675b1c87f7ee8daae28ea194f4de2ba.r2.cloudflarestorage.com "
})

// fileName => output/12312/src/App.jsx
// filePath => /Users/harkiratsingh/vercel/dist/output/12312/src/App.jsx
export const uploadFile = async (fileName: string, localFilePath: string) => {
    const fileContent = fs.readFileSync(localFilePath);
    const response = await s3.upload({
        Body: fileContent,
        Bucket: "vercel",
        Key: fileName,
    }).promise();
}