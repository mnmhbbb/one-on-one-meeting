import { NextRequest, NextResponse } from "next/server";

import { UserRole } from "@/common/const";
import { mockProfessors, mockStudents } from "@/mocks/data/users";

/**
 * GET /api/user - 유저 정보 불러오기
 * MSW 목업 데이터 사용 (Supabase 전환 전 임시)
 */
export async function GET() {
  // MSW 임시 구현: 첫 번째 학생 데이터 반환 (인증 구현 전)
  // 실제로는 세션에서 userId를 가져와서 해당 유저 정보 반환
  const mockUser = mockStudents[0];

  return NextResponse.json(
    {
      role: mockUser.role,
      user: mockUser,
    },
    { status: 200 }
  );
}

/**
 * PUT /api/user - 유저 정보 업데이트
 * MSW 목업 데이터 사용 (Supabase 전환 전 임시)
 */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { role, id } = body;

    // MSW 임시 구현: 목업 데이터 직접 수정
    if (role === UserRole.STUDENT) {
      const studentIndex = mockStudents.findIndex(s => s.id === id);
      if (studentIndex === -1) {
        return NextResponse.json({ message: "학생을 찾을 수 없습니다." }, { status: 404 });
      }

      if ("department" in body) mockStudents[studentIndex].department = body.department;
      if ("phone_num" in body) mockStudents[studentIndex].phone_num = body.phone_num;
      if ("notification_email" in body)
        mockStudents[studentIndex].notification_email = body.notification_email;

      return NextResponse.json(
        {
          message: "유저 정보 업데이트 완료",
          ...mockStudents[studentIndex],
          role,
        },
        { status: 201 }
      );
    } else if (role === UserRole.PROFESSOR) {
      const professorIndex = mockProfessors.findIndex(p => p.id === id);
      if (professorIndex === -1) {
        return NextResponse.json({ message: "교수를 찾을 수 없습니다." }, { status: 404 });
      }

      if ("college" in body) mockProfessors[professorIndex].college = body.college;
      if ("phone_num" in body) mockProfessors[professorIndex].phone_num = body.phone_num;
      if ("notification_email" in body)
        mockProfessors[professorIndex].notification_email = body.notification_email;
      if ("interview_location" in body)
        mockProfessors[professorIndex].interview_location = body.interview_location;

      return NextResponse.json(
        {
          message: "유저 정보 업데이트 완료",
          ...mockProfessors[professorIndex],
          role,
        },
        { status: 201 }
      );
    }

    return NextResponse.json({ message: "잘못된 역할(role)" }, { status: 400 });
  } catch {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
