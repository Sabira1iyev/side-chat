import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { Message } from "@/src/types/type";
const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as { messages: Message[] };

    const response = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 1024,
      messages,
    });

    const block = response.content[0];
    const reply = block.type === "text" ? block.text : "";

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Assistant server error!",
      },
      {
        status: 500,
      },
    );
  }
}
