import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { Message } from "@/src/types/type";
const client = new Anthropic();

export async function POST(req: Request) {
  try {
    const { messages, system } = (await req.json()) as {
      messages: Message[];
      system?: string;
    };

    const response = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 4096,
      system,
      messages,
    });


    const reply = response.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join();

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
