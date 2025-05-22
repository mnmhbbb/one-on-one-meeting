import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";
import { UserRole } from "@/common/const";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { email, password, role } = await request.json();

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
  } catch (error) {
    console.error("로그인 에러:", error);
    return NextResponse.json({ message: "로그인 중 오류가 발생했습니다." }, { status: 500 });
  }
}
