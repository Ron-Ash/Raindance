"use client";

import { useState } from "react";

export default function TextBox({ topic }: { topic: string }) {
  const [msg, setMsg] = useState("");

  async function send() {
    await fetch("/api/kafka/produce", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic: topic,
        messages: [{ key: Date.now().toString(), value: msg }],
      }),
    });
    // setMsg("");
  }

  return (
    <div className="py-2 px-1 flex absolute bottom-0 w-full gap-2">
      <input
        type="text"
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        className="flex-1 rounded-xl text-black px-2"
      />
      <button
        onClick={send}
        className="flex-none p-1 rounded-xl border-2 hover:bg-blue-600 ease-in-out duration-250"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      </button>
    </div>
  );
}
