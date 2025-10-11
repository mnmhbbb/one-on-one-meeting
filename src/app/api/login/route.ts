import { NextResponse } from "next/server";

// import { createClient } from "@/utils/supabase/server";
import { UserRole } from "@/common/const";

/**
 * 목 데이터 - MSW 전환 전까지 사용
 */
const MOCK_USERS = {
  students: [
    {
      email: "student@test.com",
      password: "password123",
      is_verified: true,
      id: "student-1",
      name: "테스트 학생",
    },
  ],
  professors: [
    {
      email: "professor@test.com",
      password: "password123",
      is_verified: true,
      id: "professor-1",
      name: "테스트 교수",
    },
  ],
};

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    // 목 데이터 사용
    const table = role === UserRole.STUDENT ? "students" : "professors";
    const mockUsers = MOCK_USERS[table];

    // 1. 사용자 찾기
    const userData = mockUsers.find(user => user.email === email);

    if (!userData) {
      return NextResponse.json({ message: "사용자 정보를 불러올 수 없습니다." }, { status: 500 });
    }

    // 2. 이메일 인증 확인
    if (!userData.is_verified) {
      return NextResponse.json(
        { message: "이메일 인증이 완료되지 않았습니다. 이메일을 확인해 주세요." },
        { status: 403 }
      );
    }

    // 3. 비밀번호 확인 (목 데이터에서는 단순 비교)
    if (userData.password !== password) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 잘못되었습니다." },
        { status: 400 }
      );
    }

    // 4. 로그인 성공
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

    /* 
    // 실제 Supabase 연결 (나중에 MSW로 대체)
    const supabase = await createClient();

    const table = role === UserRole.STUDENT ? "students" : "professors";
    const { data: userData, error: queryError } = await supabase
      .from(table)
      .select("is_verified")
      .eq("email", email)
      .single();

    if (queryError || !userData) {
      return NextResponse.json({ message: "사용자 정보를 불러올 수 없습니다." }, { status: 500 });
    }

    if (!userData.is_verified) {
      return NextResponse.json(
        { message: "이메일 인증이 완료되지 않았습니다. 이메일을 확인해 주세요." },
        { status: 403 }
      );
    }

    const { data: loginData, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !loginData.user) {
      return NextResponse.json(
        { message: "이메일 또는 비밀번호가 잘못되었습니다." },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: "로그인 성공" }, { status: 200 });
    */
  } catch (error) {
    console.error("로그인 에러:", error);
    return NextResponse.json({ message: "로그인 중 오류가 발생했습니다." }, { status: 500 });
  }
}
