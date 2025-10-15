import { authHandlers } from "@/mocks/handlers/auth";
import { departmentHandlers } from "@/mocks/handlers/department";
import { emailHandlers } from "@/mocks/handlers/email";
import { signupHandlers } from "@/mocks/handlers/signup";
import { userHandlers } from "@/mocks/handlers/user";

/**
 * MSW 핸들러 통합
 * - auth: 인증 관련 (로그인, 로그아웃)
 * - department: 학과/단과대학 관련
 * - email: 이메일 인증 관련 (코드 전송, 검증)
 * - signup: 회원가입 관련
 * - user: 유저 정보 관련 (조회, 수정)
 */
export const handlers = [
  ...authHandlers,
  ...departmentHandlers,
  ...emailHandlers,
  ...signupHandlers,
  ...userHandlers,
  // 추가 핸들러들...
];

export default handlers;
