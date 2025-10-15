import { UserRole } from "@/common/const";
import type { Professor, UserInfo } from "@/types/user";

/**
 * MSW 목업 데이터 - 학생 사용자
 */
export const mockStudents: UserInfo[] = [
  {
    id: "student-1",
    role: UserRole.STUDENT,
    name: "김학생",
    email: "student@test.com",
    department: "컴퓨터공학과",
    college: "공과대학",
    sign_num: "20210001",
    phone_num: "010-1234-5678",
    notification_email: "student@test.com",
    interview_location: "",
  },
  {
    id: "student-2",
    role: UserRole.STUDENT,
    name: "이학생",
    email: "student2@test.com",
    department: "전자공학과",
    college: "공과대학",
    sign_num: "20210002",
    phone_num: "010-2345-6789",
    notification_email: "student2@test.com",
    interview_location: "",
  },
];

/**
 * MSW 목업 데이터 - 교수 사용자
 */
export const mockProfessors: Professor[] = [
  {
    id: "professor-1",
    email: "professor@test.com",
    name: "박교수",
    college: "공과대학",
    phone_num: "010-9876-5432",
    interview_location: "공학관 301호",
    notice_content: "면담 전 이메일로 미리 연락 주시면 감사하겠습니다.",
    notification_email: "professor@test.com",
  },
  {
    id: "professor-2",
    email: "professor2@test.com",
    name: "최교수",
    college: "자연과학대학",
    phone_num: "010-8765-4321",
    interview_location: "과학관 201호",
    notice_content: "화요일과 목요일 오후 시간대가 가능합니다.",
    notification_email: "professor2@test.com",
  },
];

/**
 * MSW 목업 데이터 - 인증 정보 (이메일/비밀번호)
 */
export const mockCredentials = {
  students: [
    {
      email: "student@test.com",
      password: "password123",
      userId: "student-1",
    },
    {
      email: "student2@test.com",
      password: "password123",
      userId: "student-2",
    },
  ],
  professors: [
    {
      email: "professor@test.com",
      password: "password123",
      userId: "professor-1",
    },
    {
      email: "professor2@test.com",
      password: "password123",
      userId: "professor-2",
    },
  ],
};

/**
 * 세션 저장소
 * MSW 테스트용으로 인메모리 저장
 */
export const mockSessions = new Map<string, { userId: string; role: UserRole }>();
