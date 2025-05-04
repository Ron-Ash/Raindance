"use client";
import { useEffect, useState } from "react";

export default function Messages({ topic }: { topic: string }) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const evt = new EventSource(`/api/kafka/consume?topic=${topic}`);
    evt.onmessage = (e) => {
      // each e.data is one of your JSON-stringified Kafka values
      setMessages((prev) => [...prev, JSON.parse(e.data)]);
    };
    evt.onerror = (err) => {
      console.error("SSE error:", err);
      evt.close();
    };
    return () => {
      evt.close();
    };
  }, []);

  return (
    <div className="px-6 h-[65vh] overflow-y-auto pt-2">
      {messages.map((message, index) => {
        const from = message.split(":")[0];

        return (
          <div
            className={`py-1 ${
              from == "1" ? "flex justify-start" : "flex justify-end"
            }`}
            key={index}
          >
            <div
              className={`px-2 py-1 rounded-full flex-none border-l-3 border-b-3 ${
                from == "1"
                  ? "bg-blue-500 border-blue-800"
                  : "bg-green-600 border-green-800"
              }`}
            >
              {message}
            </div>
          </div>
        );
      })}
    </div>
  );
}
