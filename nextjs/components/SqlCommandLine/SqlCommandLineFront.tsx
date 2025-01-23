"use client";

import { useState } from "react";
import { Spinner } from "@heroui/spinner";

function splitIntoChunks(str: string, chunkSize: number) {
  const result = [];
  for (let i = 0; i < str.length; i += chunkSize) {
    result.push(str.slice(i, i + chunkSize));
  }
  return result;
}

function processData(data: string[][], chunkSize: number) {
  if (data.length === 2 && data[1].length === 1) return data[1][0];

  const split = data.map((row) =>
    row.map((entry) => splitIntoChunks(entry, chunkSize))
  );

  const rows = split.map((row) => {
    const max = row.reduce(
      (max, entry) => (entry.length > max ? entry.length : max),
      0
    );
    const result = [];
    for (let i = 0; i < max; i += 1) {
      const tmp = [];
      for (let j = 0; j < row.length; j += 1) {
        tmp.push(
          row[j].length > i
            ? `${row[j][i]}${" ".repeat(chunkSize - row[j][i].length)}`
            : " ".repeat(chunkSize)
        );
      }
      result.push(`| ${tmp.join(" | ")} |`);
    }
    result.push(
      "-".repeat(
        result.reduce(
          (max, entry) => (entry.length > max ? entry.length : max),
          0
        )
      )
    );

    return result.join("\n");
  });

  return rows.join("\n");
}

export default function SqlCommandLine({
  executeCommandF,
}: {
  executeCommandF: (command: string) => Promise<string[][]>;
}) {
  const [command, setCommand] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");

  async function executeCommand() {
    setLoading(true);
    setResult("");
    const tmp = await executeCommandF(command);
    setResult(processData(tmp, 20));
    setLoading(false);
  }

  function handleCtrlEnter(event: KeyboardEvent) {
    // Check if both Ctrl and Enter are pressed
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault(); // Prevent default behavior if necessary
      console.log(command);
      executeCommand();
    }
  }

  return (
    <div className="relative ">
      <button
        className="absolute z-20 top-1 right-1 flex bg-orange-500 rounded-xl p-1 align-middle bg-opacity-75 hover:bg-opacity-100"
        onClick={executeCommand}
      >
        <b className="pt-1">Run</b>
        {loading ? (
          <Spinner className="stroke-12" color="default" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        )}
      </button>
      <textarea
        className="absolute z-10 top-0 p-2 rounded-xl max-h-[70vh] h-[10vh] min-h-[10vh] w-full bg-slate-800"
        value={command}
        onChange={(e) => setCommand(e.target.value)}
        onKeyDown={(e) => handleCtrlEnter(e as unknown as KeyboardEvent)}
      />
      <div className="absolute z-0 bottom-0 h-[80%] text-sm rounded-xl w-full overflow-y-auto text-pretty p-2">
        {result.split("\n").map((line, index) => (
          <p key={index} className="font-mono whitespace-pre-wrap">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
