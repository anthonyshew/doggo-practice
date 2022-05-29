import { randomUUID } from "crypto";
import express from "express";
import {
  PutObjectCommand,
  S3Client,
  CreateBucketCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import cors from "cors";
const app = express();
const port = 5000;

app.use(cors());

const client = new S3Client({ region: "us-east-1" });
const bucketName = "test-bucket";

app.get("/", (req, res) => {
  return res.json({ message: "Hello World!" });
});

app.post("/create-bucket", async (req, res) => {
  const command = new CreateBucketCommand({ Bucket: bucketName });
  const created = await client.send(command);
  return res.json({ created });
});

app.get("/s3-url", async (req, res) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: randomUUID(),
  });

  const url = await getSignedUrl(client, command, { expiresIn: 30 });
  return res.json({ url });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
