// 요일 및 시간 데이터
export const DAYS: string[] = ["월", "화", "수", "목", "금"];
export const TIMES: string[] = [
  "07:00 - 07:30",
  "07:30 - 08:00",
  "08:00 - 08:30",
  "08:30 - 09:00",
  "09:00 - 09:30",
  "09:30 - 10:00",
  "10:00 - 10:30",
  "10:30 - 11:00",
  "11:00 - 11:30",
  "11:30 - 12:00",
  "12:00 - 12:30",
  "12:30 - 13:00",
  "13:00 - 13:30",
  "13:30 - 14:00",
  "14:00 - 14:30",
  "14:30 - 15:00",
  "15:00 - 15:30",
  "15:30 - 16:00",
  "16:00 - 16:30",
  "16:30 - 17:00",
  "17:00 - 17:30",
  "17:30 - 18:00",
  "18:00 - 18:30",
  "18:30 - 19:00",
  "19:00 - 19:30",
  "19:30 - 20:00",
  "20:00 - 20:30",
  "20:30 - 21:00",
  "21:00 - 21:30",
  "21:30 - 22:00",
  "22:00 - 22:30",
  "22:30 - 23:00",
  "23:00 - 23:30",
  "23:30 - 00:00",
];

export type InterviewStatus =
  | "REQUESTED"
  | "REJECTED"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "RECORDED";

export const STATUS_COLORS: Record<InterviewStatus, string> = {
  REQUESTED: "bg-blue-300",
  REJECTED: "bg-pink-300",
  CONFIRMED: "bg-green-300",
  CANCELLED: "bg-red-300",
  COMPLETED: "bg-stone-300",
  RECORDED: "bg-yellow-300",
};

export const STATUS_LABELS: Record<InterviewStatus, string> = {
  REQUESTED: "확정 요청",
  REJECTED: "면담 거절",
  CONFIRMED: "면담 확정",
  CANCELLED: "면담 취소",
  COMPLETED: "면담 완료",
  RECORDED: "기록된 면담",
};
