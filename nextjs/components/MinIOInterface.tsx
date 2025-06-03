"use server";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function minIoGetObjectUrl(bucket: string, path: string) {
  "use server";

  const client = new S3Client({
    endpoint: process.env.MINIO_HOST ?? "http://localhost:9000",
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.MINIO_USER ?? "admin",
      secretAccessKey: process.env.MINIO_PASSWORD ?? "password",
    },
    forcePathStyle: true,
  });
  const getCmd = new GetObjectCommand({
    Bucket: bucket,
    Key: path,
  });
  const url = await getSignedUrl(client, getCmd, {
    expiresIn: 60 * 5,
  });
  return url;
}

export async function minIoPutObject(
  bucket: string,
  path: string,
  buffer: Buffer<ArrayBufferLike>,
  type: string
) {
  "use server";

  const client = new S3Client({
    endpoint: process.env.MINIO_HOST ?? "http://localhost:9000",
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.MINIO_USER ?? "admin",
      secretAccessKey: process.env.MINIO_PASSWORD ?? "password",
    },
    forcePathStyle: true,
  });
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: path,
      Body: buffer,
      ContentType: type, // e.g. "image/png"
    })
  );
  return true;
}
