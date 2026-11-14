import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { Message } from "@/src/types/types";
const client = new Anthropic();

export async function POST(req: Request) {
  const { messages } = (await req.json()) as { messages: Message[] };

  const response = await client.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 1024,
    messages,
  });

  const block = response.content[0];
  const reply = block.type === "text" ? block.text : "";

  return NextResponse.json({
    reply,
  });
}
