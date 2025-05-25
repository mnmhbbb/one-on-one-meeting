import type { ChatCompletionTool } from "openai/resources/index.mjs";

export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_professor_interviews_by_period",
      description: "지정된 기간(start~end)에 해당하는 교수의 면담 정보를 조회합니다.",
      parameters: {
        type: "object",
        properties: {
          professor_id: {
            type: "string",
            description: "면담을 관리하는 교수의 ID",
          },
          start: {
            type: "string",
            description: "조회 시작일 (YYYY-MM-DD 형식)",
          },
          end: {
            type: "string",
            description: "조회 종료일 (YYYY-MM-DD 형식)",
          },
        },
        required: ["professor_id", "start", "end"],
      },
    },
  },
];
