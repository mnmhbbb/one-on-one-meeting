import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 교수 공지사항 관련 API====================*/
}
// GET: 교수 페이지의 공지사항 불러오기
export async function GET() {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  const { data, error } = await supabase
    .from("professor_notice")
    .select("*")
    .eq("professor_id", user.id)
    .single();
  if (error) {
    return NextResponse.json({ message: "교수 공지사항 조회 실패", error }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// PUT: 공지사항 업데이트
export async function PUT(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  const { notice_content } = await req.json();

  // 교수 공지 레코드가 존재하는지 확인
  const { error: noticeError } = await supabase
    .from("professor_notice")
    .select("id")
    .eq("professor_id", user.id)
    .single();

  if (noticeError && noticeError.code !== "PGRST116") {
    return NextResponse.json({ message: "공지 조회 실패", error: noticeError }, { status: 500 });
  }

  // 공지 업데이트 수행
  const { error: updateError } = await supabase
    .from("professor_notice")
    .update({
      notice_content,
      last_update_at: new Date().toISOString(),
    })
    .eq("professor_id", user.id);

  if (updateError) {
    return NextResponse.json(
      { message: "공지 업데이트 실패", error: updateError },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "공지 업데이트 성공" }, { status: 200 });
}
