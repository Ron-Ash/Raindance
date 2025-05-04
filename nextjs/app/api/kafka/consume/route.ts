// app/api/kafka/stream/route.ts
export const runtime = "nodejs"; // <-- force Node.js, not Edge

import { Kafka } from "kafkajs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const topic = url.searchParams.get("topic") || "test-topic";
  const kafka = new Kafka({
    clientId: "nextjs-app",
    brokers: ["localhost:29092", "localhost:39092", "localhost:49092"],
  });
  const consumer = kafka.consumer({ groupId: `nextjs-app-${Date.now()}` });

  await consumer.connect();
  await consumer.subscribe({ topic, fromBeginning: true });

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      // Clean up on client disconnect
      request.signal.addEventListener("abort", async () => {
        console.log("🚪 Client aborted, disconnecting consumer…");
        await consumer.disconnect().catch(() => {});
      });

      consumer
        .run({
          eachMessage: async ({ message }) => {
            const payload = message.value?.toString() ?? "<no-payload>";
            // SSE frame: "data: …\n\n"
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(payload)}\n\n`)
            );
          },
        })
        .catch(async (err) => {
          controller.enqueue(
            encoder.encode(
              `event: error\ndata: ${JSON.stringify(err.message)}\n\n`
            )
          );
          controller.close();
        });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
    status: 200,
  });
}
