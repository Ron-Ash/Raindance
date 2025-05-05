export const runtime = "nodejs";
import { Kafka, Partitioners } from "kafkajs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { topic, messages } = await request.json();
  const kafka = new Kafka({
    clientId: "nextjs-app",
    brokers: ["localhost:29092", "localhost:39092", "localhost:49092"],
  });
  const producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
  });
  await producer.connect();
  console.log("***  KAFKA producer CONNECTED  ***");
  try {
    await producer.send({ topic, messages });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kafka produce error:", error);
    return NextResponse.json({ error: "Failed to produce" }, { status: 500 });
  } finally {
    await producer.disconnect();
    console.log("***  KAFKA producer DISCONNECTED  ***");
  }
}
