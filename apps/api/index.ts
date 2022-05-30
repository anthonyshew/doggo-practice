import { randomUUID } from "crypto";
import express from "express";
import {
  PutObjectCommand,
  PutBucketCorsCommand,
  DeleteBucketCommand,
  ListBucketsCommand,
  CORSConfiguration,
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
  try {
    // Create new bucket and...
    const command = new CreateBucketCommand({ Bucket: bucketName });
    const created = client.send(command).then(async () => {
      // ... set up CORS for it
      const corsConfig: CORSConfiguration = {
        CORSRules: [
          {
            AllowedHeaders: ["Authorization"],
            AllowedMethods: [],
            AllowedOrigins: ["*"],
            ExposeHeaders: [],
          },
        ],
      };

      const corsCommand = new PutBucketCorsCommand({
        Bucket: bucketName,
        CORSConfiguration: corsConfig,
      });
      const corsPolicy = await client.send(corsCommand);
      return res.json({ created, corsPolicy });
    });
  } catch (error) {
    console.error(error);
    return res.json({ ...error });
  }
});

app.post("/delete-bucket", async (req, res) => {
  try {
    const command = new DeleteBucketCommand({ Bucket: bucketName });
    const deleted = client.send(command).then(() => {
      return res.json({ deleted });
    });
  } catch (error) {
    console.error(error);
    return res.json({ ...error });
  }
});

app.get("/list-buckets", async (req, res) => {
  try {
    const command = new ListBucketsCommand({});
    const buckets = await client.send(command);
    return res.json({ buckets });
  } catch (error) {
    console.error(error);
    return res.json({ ...error });
  }
});

app.get("/s3-url", async (req, res) => {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: randomUUID(),
    });

    const url = await getSignedUrl(client, command, { expiresIn: 30 });
    return res.json({ url, bucketName });
  } catch (error) {
    console.error(error);
    return res.json({ ...error });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
