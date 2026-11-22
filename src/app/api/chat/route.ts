import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { Message } from "@/src/types/type";
const client = new Anthropic();

const BASE_SYSTEM = `You are patient tutor. Write all math in LaTex using dollar signs: $...$ for inline formulas and $$...$$ for display formulas. Never use \\( \\) or \\[ \\] delimiters.`;

export async function POST(req: Request) {
  try {
    const { messages, system } = (await req.json()) as {
      messages: Message[];
      system?: string;
    };

    const fullSystem = system ? `${BASE_SYSTEM}\n\n${system}` : BASE_SYSTEM;

    const response = await client.messages.create({
      model: "claude-haiku-5-5",
      max_tokens: 4096,
      system: fullSystem,
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
