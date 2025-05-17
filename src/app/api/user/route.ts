import { NextResponse } from "next/server";

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
