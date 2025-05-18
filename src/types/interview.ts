export interface InterviewInfo {
  id: string;
  professor_id: string;
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
  professor_notice: {
    notice_content: string | null;
  };
  interview_guide: {
    guide_content: string; // 면담 상태에 따른 가이드 메시지
  };
}
