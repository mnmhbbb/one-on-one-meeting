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
  REQUESTED = "확정 대기",
  CONFIRMED = "면담 확정",
  REJECTED = "면담 거절",
  CANCELLED = "면담 취소",
  RECORDED = "면담 기록 완료",
}

export const STATUS_COLORS: Record<InterviewStatus, string> = {
  [InterviewStatus.REQUESTED]: "!bg-blue-300",
  [InterviewStatus.CONFIRMED]: "!bg-green-300",
  [InterviewStatus.REJECTED]: "!bg-pink-300",
  [InterviewStatus.CANCELLED]: "!bg-red-300",
  [InterviewStatus.RECORDED]: "!bg-yellow-300",
};

// FIXME: 이후 삭제
export const STATUS_LABELS: Record<InterviewStatus, string> = {
  [InterviewStatus.REQUESTED]: "확정 대기",
  [InterviewStatus.CONFIRMED]: "면담 확정",
  [InterviewStatus.REJECTED]: "면담 거절",
  [InterviewStatus.CANCELLED]: "면담 취소",
  [InterviewStatus.RECORDED]: "면담 기록 완료",
};

export const INTERVIEW_MODAL_TYPE = {
  // InterviewStatus의 모든 값들을 포함
  ...InterviewStatus,
  // 추가 모달 타입
  CREATE: "create", // 신규 신청
  LIST: "list", // 목록 조회
  REJECTION_REASON: "rejection_reason", // 거절 사유 입력
} as const;

export type InterviewModalType = (typeof INTERVIEW_MODAL_TYPE)[keyof typeof INTERVIEW_MODAL_TYPE];

export enum RoleViewType {
  STUDENT_ON_STUDENT = "STUDENT_ON_STUDENT", // 학생이 학생 화면 조회
  STUDENT_ON_PROFESSOR = "STUDENT_ON_PROFESSOR", // 학생이 교수 화면 조회
  PROFESSOR_ON_PROFESSOR = "PROFESSOR_ON_PROFESSOR", // 교수가 교수 화면 조회
}

export enum UserRole {
  STUDENT = "student",
  PROFESSOR = "professor",
  ADMIN = "admin",
}
