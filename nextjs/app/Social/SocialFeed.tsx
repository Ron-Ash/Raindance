"use client";

import SocialPostCard from "@/components/SocialPostCard/SocialPostCard";
import { useEffect, useState } from "react";

interface postData {
  author: string;
  eventTime: string;
  message: string;
  attachmentPath: string;
  reply_author: string;
  reply_eventTime: string;
}

export default function SocialFeed({
  topic,
  user,
  handleRetrieveRepliesF,
}: {
  topic: string;
  user: string;
  handleRetrieveRepliesF: (
    author: string,
    eventTime: string
  ) => Promise<postData[]>;
}) {
  const [messages, setMessages] = useState<
    { key: string; value: { message: string; attachmentPath: string } }[]
  >([]);

  useEffect(() => {
    console.log("useEffect runs");
    const interval = setInterval(async () => {
      console.log("Hello world");
    }, 1000);
    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    const evt = new EventSource(
      `/api/kafka/consume?topic=${topic}&user=${user}`
    );
    evt.onmessage = async (e) => {
      // each e.data is one of your JSON-stringified Kafka values
      const message = JSON.parse(e.data);
      const value = JSON.parse(message.value);
      let trueUrl = null;
      if (value.attachmentPath !== "null") {
        const res = await fetch(
          `/api/minIo/get-url?bucket=socialnetwork&path=${value.attachmentPath}`
        );
        const data = await res.json();
        if (data.success) trueUrl = data.url;
        console.log(data);
      }
      setMessages((prev) => [
        ...prev,
        { key: message.key, value: { ...value, attachmentPath: trueUrl } },
      ]);
    };
    evt.onerror = (err) => {
      console.error("SSE error:", err);
      evt.close();
    };
    return () => {
      evt.close();
    };
  }, [topic, user]);

  return (
    <div className="grid flex flex-col gap-4 p-2 overflow-auto flex">
      {[...messages].reverse().map((message, index) => {
        const values = message.value ?? {};
        const author = message.key ?? "anonymous";

        return (
          <SocialPostCard
            key={index}
            profilePic={""}
            author={author}
            eventTime={`2025-06-03`}
            message={values.message ?? ""}
            attachmentPath={values.attachmentPath}
            reply_author={author}
            reply_eventTime={`2025-06-02`}
            handleRetrieveRepliesFF={handleRetrieveRepliesF}
          />
        );
      })}
    </div>
  );
}
