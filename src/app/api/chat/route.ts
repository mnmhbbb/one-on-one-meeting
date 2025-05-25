import OpenAI from "openai";

import { NextRequest, NextResponse } from "next/server";
import { tools } from "@/utils/ai/tools";
import { handleGetInterviewsToolCall } from "@/utils/ai/handleGetInterviewsToolCall";
// import { handleAllowRejectviewsToolCall } from "@/utils/ai/handleAllowRejectviewsToolCall";
import { getSessionUser } from "@/utils/auth/getSessionUser";
import { format, startOfWeek, endOfWeek } from "date-fns";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: NextRequest) {
  const { user, accessToken, response } = await getSessionUser();
  if (!user) return response;

  const { messages } = await req.json();

  // ✅ 날짜 관련 변수 정의
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const startDate = format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd"); // 월요일 시작
  const endDate = format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd"); // 일요일 끝

  // 사용자가 면담 수락 또는 거절을 요청할 때는 반드시 다음 절차를 따르세요:
  // 1. 면담 정보를 알고 있지 않다면, 먼저 조회(get_professor_interviews_by_period) tool을 호출하여 면담 목록을 확인합니다.
  // 2. 사용자가 날짜나 시간만 말한 경우, 해당 날짜에 해당하는 면담 정보를 바탕으로 확인 질문을 합니다.
  // 3. "이 면담을 수락/거절할까요?"라고 물어보고, 거절이라면 거절 사유를 반드시 요청합니다.
  // 4. 사용자가 명확하게 확인해줄 때까지 tool call을 실행하지 마세요.
  // 5. 모든 정보(면담 id, 시간, 사유 등)가 확정되었을 때만 process_*_interview tool을 호출합니다.

  const chat = await openai.chat.completions.create({
    model: "openai/gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: `
                당신은 면담 일정을 관리하는 AI 비서입니다. 한국어로 답변하세요.
                면담 날짜, 시간대 등을 추론하여 반드시 툴을 호출하세요.
                "면담", "일정", "오늘", "이번주", "이번달", "내일" 키워드 외에 질문은
                "해당 기능은 챗봇에서 지원하지 않습니다. 웹사이트를 통해 이용해 주시길 바랍니다."
                라고 정중하게 답하세요.
                질문마다 tool call을 호출해서 질문에 맞는 답변을 해주세요.
                텍스트로 응답하지 말고 tool call을 통해 작업 요청을 보내야 합니다.
                오늘은 ${todayStr}입니다.
                "이번 주", "오늘" 같은 날짜 표현은 반드시 오늘 날짜를 기준으로 계산하세요.
                예: 이번 주는 ${startDate} ~ ${endDate}입니다.
                `.trim(),
      },
      ...messages.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content,
      })),
    ],
    tools,
    tool_choice: "auto",
  });

  console.log("toolCalls = ", chat.choices[0].message.tool_calls);

  const toolCalls = chat.choices[0].message.tool_calls;
  if (toolCalls && toolCalls.length > 0) {
    const toolCall = toolCalls[0];
    const toolName = toolCall.function.name;

    let result;

    if (toolName === "get_professor_interviews_by_period") {
      result = await handleGetInterviewsToolCall(toolCall, { accessToken });
      // } else if (
      //   toolName === "process_today_interview" ||
      //   toolName === "process_tomorrow_interview" ||
      //   toolName === "process_this_week_interview" ||
      //   toolName === "process_this_month_interview"
      // ) {
      //   result = await handleAllowRejectviewsToolCall(toolCall, { accessToken });
    } else {
      return NextResponse.json({ reply: `지원하지 않는 tool입니다: ${toolName}` });
    }

    return NextResponse.json({
      reply: result?.reply,
      data: result?.result,
    });
  }

  return NextResponse.json({ reply: chat.choices[0].message.content });
}
