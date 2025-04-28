// 요일 및 시간 데이터
export const DAYS: string[] = ["월", "화", "수", "목", "금"];
export const TIMES: string[] = [
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
];

export type ConsultationStatus = "REQUESTED" | "REJECTED" | "CONFIRMED" | "CANCELLED" | "RECORDED";

export const STATUS_COLORS: Record<ConsultationStatus, string> = {
  REQUESTED: "bg-blue-300",
  REJECTED: "bg-pink-300",
  CONFIRMED: "bg-green-300",
  CANCELLED: "bg-red-300",
  RECORDED: "bg-yellow-300",
};

export const STATUS_LABELS: Record<ConsultationStatus, string> = {
  REQUESTED: "확정 요청",
  REJECTED: "면담 거절",
  CONFIRMED: "면담 확정",
  CANCELLED: "면담 취소",
  RECORDED: "기록된 면담",
};
