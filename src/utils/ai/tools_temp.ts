import type { ChatCompletionTool } from "openai/resources/index.mjs";

// 공통 파라미터 정의
const sharedParameters = {
  type: "object",
  properties: {
    id: { type: "string", description: "면담의 고유 ID입니다." },
    student_id: { type: "string", description: "면담 대상 학생의 ID입니다." },
    professor_id: { type: "string", description: "면담 요청을 처리하는 교수의 ID입니다." },
    interview_date: { type: "string", description: "면담 날짜 (예: 2025-05-27)" },
    interview_time: {
      type: "array",
      description: "면담 시간대 (예: ['10:00 - 10:30'])",
      items: { type: "string" },
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

// 전체 tools 배열
export const tools: ChatCompletionTool[] = [
  // 조회용
  // {
  //   type: "function",
  //   function: {
  //     name: "get_professor_interviews_by_period",
  //     description: "지정된 기간(start~end)에 해당하는 교수의 면담 정보를 조회합니다.",
  //     parameters: {
  //       type: "object",
  //       properties: {
  //         professor_id: { type: "string", description: "면담을 관리하는 교수의 ID" },
  //         start: { type: "string", description: "조회 시작일 (YYYY-MM-DD)" },
  //         end: { type: "string", description: "조회 종료일 (YYYY-MM-DD)" },
  //       },
  //       required: ["professor_id", "start", "end"],
  //     },
  //   },
  // },

  // 처리용 (수락/거절)
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
