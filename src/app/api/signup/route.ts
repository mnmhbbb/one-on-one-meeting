import { NextResponse } from "next/server";

import { UserRole } from "@/common/const";
import { mockCredentials, mockProfessors, mockStudents } from "@/mocks/data/users";
import { isEmailVerified } from "@/mocks/data/verification";
import type { ProfessorSignupRequest, StudentSignupRequest } from "@/types/auth";

/**
 * POST /api/signup - 회원가입 API
 * MSW 목업 데이터 사용 (Supabase 전환 전 임시)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, role } = body;

    // 1. 이메일 인증 확인
    if (!isEmailVerified(email)) {
      return NextResponse.json({ message: "이메일 인증을 먼저 완료해주세요." }, { status: 400 });
    }

    // 2. 이메일 중복 확인
    const existingCredentials =
      role === UserRole.STUDENT ? mockCredentials.students : mockCredentials.professors;

    if (existingCredentials.some(cred => cred.email === email)) {
      return NextResponse.json({ message: "이미 가입된 이메일입니다." }, { status: 400 });
    }

    // 3. 역할별 회원가입 처리
    if (role === UserRole.STUDENT) {
      const studentData = body as StudentSignupRequest;

      // 신규 ID 생성
      const newUserId = `student-${mockStudents.length + 1}`;

      // 학생 데이터 추가
      mockStudents.push({
        id: newUserId,
        role: UserRole.STUDENT,
        name: studentData.name,
        email: studentData.email,
        department: studentData.department,
        college: "", // 학생은 학과만 있고 단과대학은 비어있음
        sign_num: studentData.studentId,
        phone_num: studentData.phoneNum || "",
        notification_email: studentData.email,
        interview_location: "",
      });

      // 자격증명 추가
      mockCredentials.students.push({
        email: studentData.email,
        password: studentData.password,
        userId: newUserId,
      });

      return NextResponse.json(
        {
          message: "회원가입이 완료되었습니다.",
          userId: newUserId,
        },
        { status: 201 }
      );
    } else if (role === UserRole.PROFESSOR) {
      const professorData = body as ProfessorSignupRequest;

      // 신규 ID 생성
      const newUserId = `professor-${mockProfessors.length + 1}`;

      // 교수 데이터 추가
      mockProfessors.push({
        id: newUserId,
        email: professorData.email,
        name: professorData.name,
        college: professorData.college,
        phone_num: professorData.phoneNum || "",
        interview_location: professorData.interviewLocation,
        notice_content: "",
        notification_email: professorData.email,
      });

      // 자격증명 추가
      mockCredentials.professors.push({
        email: professorData.email,
        password: professorData.password,
        userId: newUserId,
      });

      return NextResponse.json(
        {
          message: "회원가입이 완료되었습니다.",
          userId: newUserId,
        },
        { status: 201 }
      );
    }

    return NextResponse.json({ message: "지원되지 않는 역할입니다." }, { status: 400 });
  } catch (error) {
    console.error("회원가입 에러:", error);
    return NextResponse.json({ message: "회원가입 중 오류가 발생했습니다." }, { status: 500 });
  }
}
