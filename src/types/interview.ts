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
  notice_content: string | null;
  guide_content: string; // 면담 상태에 따른 가이드 메시지
  student_name: string; // 면담 신청 학생 이름
  student_sign_num: string; // 면담 신청 학생 학번
  student_department: string; // 면담 신청 학생 학과
  student_notification_email: string; // 면담 신청 학생 이메일
  professor_interview_location: string; // 교수 면담 장소
  professor_notification_email: string; // 면담 신청 교수 이메일
  interview_record_student: string; // 학생 면담 기록
  interview_record_professor: string; // 교수 면담 기록
  interview_record_state_student: string; // 학생 면담 기록 상태
  interview_record_state_professor: string; // 교수 면담 기록 상태
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
  notice_content: null,
  guide_content: "",
  student_name: "",
  student_sign_num: "",
  student_department: "",
  student_notification_email: "",
  professor_interview_location: "",
  professor_notification_email: "",
  interview_record_student: "",
  interview_record_professor: "",
  interview_record_state_student: "",
  interview_record_state_professor: "",
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

// 교수가 면담 수락/거절 등 상태 업데이트
export interface InterviewAcceptBody {
  id: string;
  student_id: string;
  professor_id: string;
  interview_date: string;
  interview_time: string[];
  interview_accept: boolean; // 면담 수락 여부
  interview_reject_reason?: string | null; // 거절 사유
}

// 학생이 면담 취소
export interface InterviewCancelBody {
  id: string;
  student_id: string;
  professor_id: string;
  interview_date: string;
  interview_time: string[];
  interview_cancel_reason: string;
}

// 면담 기록
export interface InterviewRecordBody {
  id?: string;
  writer_id: string;
  interview_id: string;
  interview_record: string;
  created_at?: string;
  role: string;
}
