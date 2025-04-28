import { ConsultationStatus } from "@/common/const";

export interface ConsultationInfo {
  date: string; // "YYYY-MM-DD HH:mm" 형식
  status: ConsultationStatus;
  professor: string;
  memo?: string;
  reason: string;
  department: string;
  studentName: string;
}

// FIXME: 확인용 더미데이터
export const EVENTS: ConsultationInfo[] = [
  {
    date: "2025-03-31 14:00",
    status: "REQUESTED",
    professor: "김영훈",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    date: "2025-04-07 10:00",
    status: "CONFIRMED",
    professor: "이준호",
    department: "콘텐츠IT",
    studentName: "홍길동",
    reason:
      "이 곳은 아주 아주 아주 긴 면담 사유입니다. 예를 들면 과제에 대한 문의라든가, 진로 상담이겠지요. 이 곳은 아주 아주 아주 긴 면담 사유입니다. 예를 들면 과제에 대한 문의라든가, 진로 상담이겠지요. 이 곳은 아주 아주 아주 긴 면담 사유입니다. 예를 들면 과제에 대한 문의라든가, 진로 상담이겠지요. 이 곳은 아주 아주 아주 긴 면담 사유입니다. 예를 들면 과제에 대한 문의라든가, 진로 상담이겠지요. 이 곳은 아주 아주 아주 긴 면담 사유입니다. 예를 들면 과제에 대한 문의라든가, 진로 상담이겠지요. ",
  },
  {
    date: "2025-04-14 11:00",
    status: "RECORDED",
    professor: "박서연",
    memo: "자바 제네릭 타입 사용법에 대해 문의하였다. OOO이 OOOO해서 어렵고, 문제의 요점을...",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    date: "2025-04-21 12:00",
    status: "CANCELLED",
    professor: "김영훈",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    date: "2025-04-23 09:00",
    status: "CANCELLED",
    professor: "이준호",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    date: "2025-04-23 10:00",
    status: "REQUESTED",
    professor: "박서연",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    date: "2025-04-23 10:30",
    status: "REQUESTED",
    professor: "박서연",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    date: "2025-04-23 11:30",
    status: "REQUESTED",
    professor: "박서연",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    date: "2025-04-28 13:00",
    status: "REJECTED",
    professor: "김영훈",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    date: "2025-04-29 14:00",
    status: "RECORDED",
    professor: "박서연",
    reason: "과제 문의",
    memo: "자바 제네릭 타입 사용법에 대해 문의하였다. OOO이 OOOO해서 어렵고, 문제의 요점을...",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    date: "2025-05-02 10:30",
    status: "REJECTED",
    professor: "김영훈",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    date: "2025-05-07 16:30",
    status: "REQUESTED",
    professor: "이준호",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
];
