import type { UserRole } from "@/common/const";

/**
 * 로그인 요청 데이터
 */
export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

/**
 * 로그인 응답 데이터
 */
export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
  sessionToken?: string; // MSW용 임시 토큰
}

/**
 * 로그인 폼 상태 (Server Action 전용)
 */
export interface LoginFormState {
  success: boolean;
  message?: string;
  errors?: {
    email?: string;
    password?: string;
  };
}

/**
 * 회원가입 요청 - 공통 필드
 */
interface SignupRequestBase {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phoneNum?: string;
  role: UserRole;
}

/**
 * 학생 회원가입 요청
 */
export interface StudentSignupRequest extends SignupRequestBase {
  role: UserRole.STUDENT;
  studentId: string; // 학번
  department: string; // 학과
}

/**
 * 교수 회원가입 요청
 */
export interface ProfessorSignupRequest extends SignupRequestBase {
  role: UserRole.PROFESSOR;
  college: string; // 단과대학
  interviewLocation: string; // 면담 장소
}

/**
 * 회원가입 요청 (Union Type)
 */
export type SignupRequest = StudentSignupRequest | ProfessorSignupRequest;

/**
 * 회원가입 응답
 */
export interface SignupResponse {
  message: string;
  userId: string;
}

/**
 * 회원가입 폼 상태 (Server Action 전용)
 */
export interface SignupFormState {
  success: boolean;
  message?: string;
  errors?: {
    email?: string;
    password?: string;
    confirmPassword?: string;
    name?: string;
    studentId?: string;
    department?: string;
    college?: string;
    interviewLocation?: string;
  };
}
