import { NextRequest, NextResponse } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 유저 정보 API====================*/
}
// GET: 유저 정보 불러오기
export async function GET() {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  // 1. 유저 role 확인
  const { data: userMetadata, error: userError } = await supabase.auth.getUser();
  if (userError || !userMetadata.user?.user_metadata?.role) {
    console.error("유저 메타데이터 조회 실패", userError);
    return NextResponse.json({ message: "유저 정보 조회 실패" }, { status: 500 });
  }

  const role = userMetadata.user.user_metadata.role;

  // 2. role에 따라 테이블, 컬럼 결정
  const tableMap = {
    student: { table: "students" },
    professor: { table: "professors" },
  };

  const mapping = tableMap[role as "student" | "professor"];
  if (!mapping) {
    return NextResponse.json({ message: "유효하지 않은 역할입니다." }, { status: 400 });
  }

  // 3. 해당 테이블에서 데이터 조회
  const { data, error } = await supabase.from(mapping.table).select("*").eq("id", user.id).single();

  if (error) {
    console.error("역할별 데이터 조회 실패", error);
    return NextResponse.json({ message: "유저 정보 조회 실패" }, { status: 500 });
  }

  // 4. 응답: role + 데이터
  return NextResponse.json({ role, user: data }, { status: 200 });
}

// PUT: 유저 정보 업데이트
export async function PUT(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  const tableMap = {
    student: { table: "students" },
    professor: { table: "professors" },
  };

  try {
    const body = await req.json();
    const { role, id } = body;

    const mapping = tableMap[role as "student" | "professor"];

    if (!mapping) {
      return NextResponse.json({ message: "잘못된 역할(role)" }, { status: 400 });
    }

    const updateFields: Record<string, string> = {};

    if (role === "student") {
      if ("department" in body) updateFields.department = body.department;
      if ("phone_num" in body) updateFields.phone_num = body.phone_num;
      if ("notification_email" in body) updateFields.notification_email = body.notification_email;
    } else if (role === "professor") {
      if ("college" in body) updateFields.college = body.college;
      if ("phone_num" in body) updateFields.phone_num = body.phone_num;
      if ("notification_email" in body) updateFields.notification_email = body.notification_email;
      if ("interview_location" in body) updateFields.interview_location = body.interview_location;
    }

    const { data, error } = await supabase
      .from(mapping.table)
      .update(updateFields)
      .eq("id", id)
      .select();

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "유저 정보 업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "유저 정보 업데이트 완료", ...data[0], role },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
