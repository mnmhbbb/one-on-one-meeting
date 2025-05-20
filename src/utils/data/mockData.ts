import { InterviewStatus } from "@/common/const";

export interface InterviewInfo {
  id: string;
  status: InterviewStatus | string;
  date: string; // "YYYY-MM-DD" 형식
  time: string[]; // "HH:mm ~ HH:mm" 형식
  professor: string;
  memo?: string; // 면담 기록
  purpose: string; // 면담 목적
  reason: string; // 면담 희망 내용
  rejectionReason?: string; // 면담 거절 사유
  cancellationReason?: string; // 면담 취소 사유
  department: string;
  studentName: string;
}

// FIXME: 확인용 더미데이터
export const EVENTS: InterviewInfo[] = [
  {
    id: "1",
    status: InterviewStatus.REQUESTED,
    date: "2025-03-31",
    time: ["14:00 ~ 14:30"],
    professor: "김영훈",
    purpose: "과제 문의",
    reason: "과제 문의 내용",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "2",
    status: InterviewStatus.CONFIRMED,
    date: "2025-04-07",
    time: ["10:00 ~ 10:30", "10:30 ~ 11:00"],
    professor: "이준호",
    department: "콘텐츠IT",
    studentName: "홍길동",
    purpose: "과제 문의",
    reason:
      "이 곳은 아주 아주 아주 긴 면담 사유입니다.\n예를 들면 과제에 대한 문의라든가, 진로 상담이겠지요.\n글자수가 아주 많았을 때 말줄임표가 잘 되는지 테스트하기 위함\n\n수고하세요",
  },
  {
    id: "3",
    status: InterviewStatus.RECORDED,
    date: "2025-04-14",
    time: ["11:00 ~ 11:30"],
    professor: "박서연",
    memo: "자바 제네릭 타입 사용법에 대해 문의하였다.\nOOO이 OOOO해서 어렵고,\n문제의 요점을 알려주시고, 보듬어주시고, 사랑해주시고, 응원해주시고, ...",
    purpose: "과제 문의",
    reason: "과제 문의 내용",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "4",
    status: InterviewStatus.CANCELLED,
    date: "2025-04-21",
    time: ["12:00 ~ 12:30"],
    professor: "김영훈",
    purpose: "과제 문의",
    reason: "과제 문의 내용",
    cancellationReason: "면담 취소 사유는 이러이러합니다",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "5",
    status: InterviewStatus.CANCELLED,
    date: "2025-04-23",
    time: ["09:00 ~ 09:30"],
    professor: "이준호",
    purpose: "과제 문의",
    reason: "과제 문의 내용",
    cancellationReason: "면담 취소 사유는 이러이러합니다",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "6",
    status: InterviewStatus.REQUESTED,
    date: "2025-04-23",
    time: ["10:00 ~ 10:30"],
    professor: "박서연",
    purpose: "과제 문의",
    reason: "과제 문의 내용",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "7",
    status: InterviewStatus.REQUESTED,
    date: "2025-04-23",
    time: ["10:30 ~ 11:00"],
    professor: "박서연",
    purpose: "과제 문의",
    reason: "과제 문의 내용",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "8",
    status: InterviewStatus.REQUESTED,
    date: "2025-04-23",
    time: ["11:30 ~ 12:00"],
    professor: "박서연",
    purpose: "과제 문의",
    reason: "과제 문의 내용",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "9",
    status: InterviewStatus.REJECTED,
    date: "2025-04-28",
    time: ["13:00 ~ 13:30"],
    professor: "김영훈",
    purpose: "과제 문의",
    reason: "과제 문의 내용",
    rejectionReason: "이러이러해서 면담을 거절합니다",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "10",
    status: InterviewStatus.RECORDED,
    date: "2025-04-29",
    time: ["14:00 ~ 14:30"],
    professor: "박서연",
    purpose: "과제 문의",
    reason: "과제 문의 내용",
    memo: "자바 제네릭 타입 사용법에 대해 문의하였다.\nOOO이 OOOO해서 어렵고,\n문제의 요점을 알려주시고, 보듬어주시고, 사랑해주시고, 응원해주시고, ...",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "11",
    status: InterviewStatus.REJECTED,
    date: "2025-05-02",
    time: ["10:30 ~ 11:00"],
    professor: "김영훈",
    purpose: "과제 문의",
    reason: "과제 문의 내용",
    rejectionReason: "이러이러해서 면담을 거절합니다",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "12",
    status: InterviewStatus.CONFIRMED,
    date: "2025-05-02",
    time: ["11:30 ~ 12:00"],
    professor: "박대현",
    purpose: "진로 상담",
    reason: "진로 상담 내용",
    department: "콘텐츠IT",
    studentName: "김영훈",
  },
  {
    id: "13",
    status: InterviewStatus.REQUESTED,
    date: "2025-05-07",
    time: ["16:30 ~ 17:00"],
    professor: "이준호",
    purpose: "과제 문의",
    reason: "과제 문의 내용",
    department: "콘텐츠IT",
    studentName: "홍길동",
  },
  {
    id: "14",
    status: InterviewStatus.CONFIRMED,
    date: "2025-05-19",
    time: ["11:30 ~ 12:00"],
    professor: "김철수",
    purpose: "수업 관련",
    reason: "진로 상담 내용",
    department: "콘텐츠IT",
    studentName: "박지원",
  },
];

type TimeSlot = {
  time: string;
  type: "available" | "interview" | "impossible";
};

// OOO 교수님의 XX 날짜 면담 가능한 시간 정보
export const availableInterviewTime: TimeSlot[] = [
  {
    time: "09:00 - 09:30",
    type: "available",
  },
  {
    time: "09:30 - 10:00",
    type: "interview",
  },
  {
    time: "10:00 - 10:30",
    type: "impossible",
  },
  {
    time: "10:30 - 11:00",
    type: "available",
  },
  {
    time: "11:00 - 11:30",
    type: "available",
  },
  {
    time: "11:30 - 12:00",
    type: "available",
  },
  {
    time: "12:00 - 12:30",
    type: "impossible",
  },
  {
    time: "12:30 - 13:00",
    type: "impossible",
  },
  {
    time: "13:00 - 13:30",
    type: "impossible",
  },
  {
    time: "13:30 - 14:00",
    type: "available",
  },
  {
    time: "14:00 - 14:30",
    type: "available",
  },
  {
    time: "14:30 - 15:00",
    type: "available",
  },
  {
    time: "15:00 - 15:30",
    type: "available",
  },
  {
    time: "15:30 - 16:00",
    type: "available",
  },
  {
    time: "16:00 - 16:30",
    type: "available",
  },
  {
    time: "16:30 - 17:00",
    type: "available",
  },
  {
    time: "17:00 - 17:30",
    type: "available",
  },
  {
    time: "17:30 - 18:00",
    type: "available",
  },
];

export const professorNotice =
  "전화번호: 033-248-OOOO\n이메일: OOOO@hallym.ac.kr\n면담 위치: A1400호(공학관)\n\n면담은 30분 이하로 신청바람";

export const professorCheckList =
  "1. 저장 시, 교수님께 면담 변경/삭제 메일이 전송 됩니다.\n2. 교수님 확인 완료 시, 신청자 아이디로 확정/재신청 여부가 전달 됩니다. 확인바랍니다.";
