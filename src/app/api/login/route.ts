import { NextResponse } from "next/server";

import { UserRole } from "@/common/const";
import { mockCredentials, mockProfessors, mockStudents } from "@/mocks/data/users";

/**
 * POST /api/login - 로그인 API
 * MSW 목업 데이터 사용 (Supabase 전환 전 임시)
 */
export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    // 1. 자격증명 확인
    const credentials =
      role === UserRole.STUDENT ? mockCredentials.students : mockCredentials.professors;
    const userCredential = credentials.find(cred => cred.email === email);

    if (!userCredential) {
      return NextResponse.json({ message: "사용자 정보를 불러올 수 없습니다." }, { status: 500 });
    }

    // 2. 비밀번호 확인
    if (userCredential.password !== password) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 잘못되었습니다." },
        { status: 400 }
      );
    }

    // 3. 사용자 데이터 조회
    const userData =
      role === UserRole.STUDENT
        ? mockStudents.find(s => s.id === userCredential.userId)
        : mockProfessors.find(p => p.id === userCredential.userId);

    if (!userData) {
      return NextResponse.json({ message: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    // 4. 로그인 성공 응답
    return NextResponse.json(
      {
        message: "로그인 성공",
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("로그인 에러:", error);
    return NextResponse.json({ message: "로그인 중 오류가 발생했습니다." }, { status: 500 });
  }
}
