import { InterviewStatus } from "@/common/const";

export interface InterviewInfo {
  id: string;
  status: InterviewStatus;
  date: string; // "YYYY-MM-DD HH:mm" 형식
  professor: string;
  memo?: string;
  reason: string;
  department: string;
  studentName: string;
}

// FIXME: 확인용 더미데이터
export const EVENTS: InterviewInfo[] = [
  {
    id: "1",
    status: InterviewStatus.REQUESTED,
    date: "2025-03-31 14:00",
    professor: "김영훈",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "2",
    status: InterviewStatus.CONFIRMED,
    date: "2025-04-07 10:00",
    professor: "이준호",
    department: "콘텐츠IT",
    studentName: "홍길동",
    reason:
      "이 곳은 아주 아주 아주 긴 면담 사유입니다. 예를 들면 과제에 대한 문의라든가, 진로 상담이겠지요. 이 곳은 아주 아주 아주 긴 면담 사유입니다. 예를 들면 과제에 대한 문의라든가, 진로 상담이겠지요. 이 곳은 아주 아주 아주 긴 면담 사유입니다. 예를 들면 과제에 대한 문의라든가, 진로 상담이겠지요. 이 곳은 아주 아주 아주 긴 면담 사유입니다. 예를 들면 과제에 대한 문의라든가, 진로 상담이겠지요. 이 곳은 아주 아주 아주 긴 면담 사유입니다. 예를 들면 과제에 대한 문의라든가, 진로 상담이겠지요. ",
  },
  {
    id: "3",
    status: InterviewStatus.RECORDED,
    date: "2025-04-14 11:00",
    professor: "박서연",
    memo: "자바 제네릭 타입 사용법에 대해 문의하였다. OOO이 OOOO해서 어렵고, 문제의 요점을...",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "4",
    status: InterviewStatus.CANCELLED,
    date: "2025-04-21 12:00",
    professor: "김영훈",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "5",
    status: InterviewStatus.CANCELLED,
    date: "2025-04-23 09:00",
    professor: "이준호",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "6",
    status: InterviewStatus.REQUESTED,
    date: "2025-04-23 10:00",
    professor: "박서연",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "7",
    status: InterviewStatus.REQUESTED,
    date: "2025-04-23 10:30",
    professor: "박서연",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "8",
    status: InterviewStatus.REQUESTED,
    date: "2025-04-23 11:30",
    professor: "박서연",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "9",
    status: InterviewStatus.REJECTED,
    date: "2025-04-28 13:00",
    professor: "김영훈",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "10",
    status: InterviewStatus.RECORDED,
    date: "2025-04-29 14:00",
    professor: "박서연",
    reason: "과제 문의",
    memo: "자바 제네릭 타입 사용법에 대해 문의하였다. OOO이 OOOO해서 어렵고, 문제의 요점을...",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "11",
    status: InterviewStatus.REJECTED,
    date: "2025-05-02 10:30",
    professor: "김영훈",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "12",
    status: InterviewStatus.REQUESTED,
    date: "2025-05-07 16:30",
    professor: "이준호",
    reason: "과제 문의",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
];
