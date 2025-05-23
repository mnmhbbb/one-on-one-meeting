import { UserRole } from "@/common/const";

// 임시
export interface UserInfo {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  department: string;
  college: string;
  sign_num: string;
  phone_num: string;
  notification_email: string;
  interview_location: string;
}

export interface UserResponse {
  user: UserInfo;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface Professor {
  id: string;
  email: string;
  name: string;
  college: string;
  phone_num: string;
  interview_location: string;
  notice_content: string;
  notification_email: string;
}

export interface MyPageUserInfo {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  department: string;
  college: string;
  sign_num: string;
  phone_num: string;
  notification_email: string;
  interview_location: string;
}

export interface ProfessorAllowDate {
  id: string;
  professor_id: string;
  professor_name: string;
  allow_date: string;
  allow_time: string[];
  already_apply_time: string[] | null;
}
/**
 * 교수 면담 가능 날짜 요청 타입
 */
export interface ProfessorAllowDateRequest {
  professor_id: string;
  allow_date: string;
  allow_time: string[];
}

export interface ProfessorNoticeType {
  id: string;
  professor_id: string;
  notice_content: string;
  last_update_at: string;
}
