import SqlCommandLine from "@/components/SqlCommandLine/SqlCommandLineFront";

import { createClient } from "@clickhouse/client-web";

export default function Advanced() {
  async function executeCommand(command: string) {
    "use server";

    let data = [];
    try {
      const client = createClient({
        url: process.env.CLICKHOUSE_HOST ?? "http://localhost:8123",
        username: process.env.CLICKHOUSE_USER ?? "user",
        password: process.env.CLICKHOUSE_PASSWORD ?? "password",
      });

      const results = await client.query({
        query: `${command}`,
        format: "JSONCompactStringsEachRowWithNames",
      });
      data = (await results.json()) as string[][];
    } catch (e) {
      data = [["error"], [`${e}`]];
    }
    return data;
  }

  return (
    <div className="grid gap-4 p-4 h-[80vh]">
      <SqlCommandLine executeCommandF={executeCommand} />
    </div>
  );
}
