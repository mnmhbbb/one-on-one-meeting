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

export enum InterviewStatus {
  REQUESTED = "requested",
  CONFIRMED = "confirmed",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  RECORDED = "recorded",
}

export const STATUS_COLORS: Record<InterviewStatus, string> = {
  [InterviewStatus.REQUESTED]: "bg-blue-300",
  [InterviewStatus.CONFIRMED]: "bg-green-300",
  [InterviewStatus.REJECTED]: "bg-pink-300",
  [InterviewStatus.CANCELLED]: "bg-red-300",
  [InterviewStatus.RECORDED]: "bg-yellow-300",
};

export const STATUS_LABELS: Record<InterviewStatus, string> = {
  [InterviewStatus.REQUESTED]: "확정 요청",
  [InterviewStatus.CONFIRMED]: "면담 확정",
  [InterviewStatus.REJECTED]: "면담 거절",
  [InterviewStatus.CANCELLED]: "면담 취소",
  [InterviewStatus.RECORDED]: "기록된 면담",
};
