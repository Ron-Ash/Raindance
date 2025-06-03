import { minIoGetObjectUrl } from "@/components/MinIOInterface";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const bucket = url.searchParams.get("bucket") ?? "default";
  const path = url.searchParams.get("path") ?? "anonymous";
  const res = await minIoGetObjectUrl(bucket, path);
  return NextResponse.json({ success: true, url: res });
}
