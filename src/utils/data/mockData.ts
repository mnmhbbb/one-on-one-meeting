import { InterviewStatus } from "@/common/const";

export interface InterviewEvent {
  date: string; // "YYYY-MM-DD HH:mm" 형식
  status: InterviewStatus;
}

// FIXME: 확인용 더미데이터
export const EVENTS: InterviewEvent[] = [
  { date: "2025-04-07 10:00", status: "CONFIRMED" },
  { date: "2025-03-31 14:00", status: "REQUESTED" },
  { date: "2025-04-14 11:00", status: "COMPLETED" },
  { date: "2025-04-21 12:00", status: "CANCELLED" },
  { date: "2025-04-23 09:00", status: "CANCELLED" },
  { date: "2025-04-23 10:00", status: "REQUESTED" },
  { date: "2025-04-23 10:30", status: "REQUESTED" },
  { date: "2025-04-23 11:30", status: "REQUESTED" },
  { date: "2025-04-28 13:00", status: "REJECTED" },
  { date: "2025-04-29 14:00", status: "RECORDED" },
  { date: "2025-05-02 10:30", status: "REJECTED" },
];
