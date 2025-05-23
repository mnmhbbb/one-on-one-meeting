export interface InterviewInfo {
  id: string;
  professor_id: string;
  professor_name: string;
  student_id: string;
  interview_date: string;
  interview_time: string[];
  interview_category: string; // 면담목적
  interview_content: string;
  interview_state: string; // 면담상태
  interview_accept: boolean | null; // 면담 수락 여부
  interview_cancel_reason: string | null; // 면담 취소 사유
  interview_reject_reason: string | null; // 면담 거절 사유
  created_at: string;
  interview_close_at: string | null; // 취소/거절한 날짜
  professor_notice: string | null;
  interview_guide: string; // 면담 상태에 따른 가이드 메시지
  interview_record?: string; // 면담 기록
  student_name: string; // 면담 신청 학생 이름
  student_sign_num: string; // 면담 신청 학생 학번
  student_department: string; // 면담 신청 학생 학과
}

export const DEFAULT_INTERVIEW_INFO: InterviewInfo = {
  id: "",
  professor_id: "",
  professor_name: "",
  student_id: "",
  interview_date: "",
  interview_time: [],
  interview_category: "",
  interview_content: "",
  interview_state: "",
  interview_accept: null,
  interview_cancel_reason: null,
  interview_reject_reason: null,
  created_at: "",
  interview_close_at: null,
  professor_notice: null,
  interview_guide: "",
  student_name: "",
  student_sign_num: "",
  student_department: "",
};

export interface InterviewCreateBody {
  student_id: string;
  professor_id: string;
  interview_date: string; // yyyy-mm-dd
  interview_time: string[]; // ["hh:mm - hh:mm"]
  interview_category: string; // 면담 목적
  interview_content: string; // 면담 희망 내용
  interview_state: string; // 면담 상태
}

export interface InterviewUpdateBody extends InterviewCreateBody {
  id: string;
}

export interface InterviewCancelBody {
  id: string;
  student_id: string;
  professor_id: string;
  interview_date: string;
  interview_time: string[];
  interview_cancel_reason: string;
}
