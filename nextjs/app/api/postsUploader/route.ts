"use server";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { minIoPutObject } from "@/components/MinIOInterface";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { success: false, error: "Unauthorized (no session)" },
      { status: 401 }
    );
  }
  const data = await request.formData();
  let file = data.get("file");
  console.log(file);
  let message = data.get("message");
  if (!file && !message) return NextResponse.json({ success: false });

  let key = "anonymous";
  if ((data.get("isAnonymous") as unknown as string) === "false") {
    key = session.user.email;
  }
  const path = `${key}/posts/${Date.now()}`;

  console.log(file, !file, file == null, file !== undefined);
  console.log(message, !message, message == null);
  console.log(undefined as unknown as string);

  if (file) {
    file = file as unknown as File;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const res = await minIoPutObject("socialnetwork", path, buffer, file.type);
    if (!res) {
      console.error("S3 PutObject error");
      return NextResponse.json({ success: false, error: "Upload failed" });
    }
  }

  if (message) {
    message = message.toString() as unknown as string;
    const res = await fetch("http://localhost:3000/api/kafka/produce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: "socialNetwork_postStream",
        messages: [
          {
            key: key,
            value: `{"message": "${message.replace(
              '"',
              "'"
            )}", "attachmentPath": "${!file ? "null" : path}"}`,
          },
        ],
      }),
    });
    if (!res.ok) {
      console.error("Kafka produce PutObject error");
      return NextResponse.json({ success: false, error: "Upload failed" });
    }
  }

  return NextResponse.json({ success: true });
}
