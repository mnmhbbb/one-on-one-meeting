import type { ChatCompletionTool } from "openai/resources/index.mjs";

const sharedParameters = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "면담의 고유 ID입니다.",
    },
    student_id: {
      type: "string",
      description: "면담 대상 학생의 ID입니다.",
    },
    professor_id: {
      type: "string",
      description: "면담 요청을 처리하는 교수의 ID입니다.",
    },
    interview_date: {
      type: "string",
      description: "면담 날짜 (예: 2025-05-27)",
    },
    interview_time: {
      type: "array",
      description: "면담 시간대 (예: ['10:00 - 10:30'])",
      items: {
        type: "string",
      },
    },
    interview_accept: {
      type: "boolean",
      description: "면담을 수락하는 경우 true, 거절하는 경우 false",
    },
    interview_reject_reason: {
      type: "string",
      description: "면담을 거절하는 경우 사유",
    },
  },
  required: [
    "id",
    "student_id",
    "professor_id",
    "interview_date",
    "interview_time",
    "interview_accept",
  ],
};

export const tools: ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "process_today_interview",
      description: "오늘의 면담 요청을 수락 또는 거절합니다.",
      parameters: sharedParameters,
    },
  },
  {
    type: "function",
    function: {
      name: "process_tomorrow_interview",
      description: "내일의 면담 요청을 수락 또는 거절합니다.",
      parameters: sharedParameters,
    },
  },
  {
    type: "function",
    function: {
      name: "process_this_week_interview",
      description: "이번 주의 면담 요청들을 수락 또는 거절합니다.",
      parameters: sharedParameters,
    },
  },
  {
    type: "function",
    function: {
      name: "process_this_month_interview",
      description: "이번 달의 면담 요청들을 수락 또는 거절합니다.",
      parameters: sharedParameters,
    },
  },
];
