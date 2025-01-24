import SqlCommandLine from "@/components/SqlCommandLine/SqlCommandLineFront";
import TabsBasedSwitchCasePage from "@/components/SwitchCasePage/TabsBasedSwitchCasePage";
import { createClient } from "@clickhouse/client-web";

export default function Page() {
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
    <div className="p-4 gap-4">
      <TabsBasedSwitchCasePage
        options={{
          Advanced: <SqlCommandLine executeCommandF={executeCommand} />,
          Live: <div>A</div>,
          Statistics: <div>B</div>,
        }}
      />
    </div>
  );
}
