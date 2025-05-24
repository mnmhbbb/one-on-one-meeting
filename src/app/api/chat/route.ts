import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { tools } from "@/utils/ai/tools";
import { handleToolCall } from "@/utils/ai/handleToolCall";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const chat = await openai.chat.completions.create({
    model: "meta-llama/llama-4-maverick:free",
    messages,
    tools,
    tool_choice: "auto",
  });

  const toolCalls = chat.choices[0].message.tool_calls;

  if (toolCalls && toolCalls.length > 0) {
    const result = await handleToolCall(toolCalls[0]);

    return NextResponse.json({
      reply: result.reply,
      data: result.result,
    });
  }

  return NextResponse.json({ reply: chat.choices[0].message.content });
}
