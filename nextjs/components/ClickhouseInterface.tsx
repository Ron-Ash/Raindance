"use server";

import { createClient } from "@clickhouse/client-web";

export async function clickhouseGetRecords(query: string) {
  "use server";

  const client = createClient({
    url: process.env.CLICKHOUSE_HOST ?? "http://localhost:8123",
    username: process.env.CLICKHOUSE_USER ?? "user",
    password: process.env.CLICKHOUSE_PASSWORD ?? "password",
  });

  const rows = await client.query({
    query: query,
    format: "JSONEachRow",
  });

  const data = await rows.json();
  return data;
}
