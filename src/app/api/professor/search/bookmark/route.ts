import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 교수 검색 API====================*/
}
// GET: 즐겨찾기 불러오기
export async function GET() {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  const { data, error } = await supabase
    .from("professor_bookmark")
    .select("professors:professor_id(id, email, name, college, phone_num, interview_location)")
    .eq("student_id", user.id);
  if (error) {
    return NextResponse.json({ message: "즐겨찾기 조회 실패", error }, { status: 500 });
  }

  const professors = data.map(d => d.professors);
  return NextResponse.json({ professors });
}

// POST: 즐겨찾기 저장, 삭제
export async function POST(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  const body = await req.json();
  const { professor_id } = body;

  if (!professor_id) {
    return NextResponse.json({ message: "professor_id가 필요합니다." }, { status: 400 });
  }

  // 먼저 기존 즐겨찾기 존재 여부 확인
  const { data: existing, error: selectError } = await supabase
    .from("professor_bookmark")
    .select("id")
    .eq("student_id", user.id)
    .eq("professor_id", professor_id)
    .single();

  if (selectError && selectError.code !== "PGRST116") {
    // "PGRST116" = no rows found (정상적인 경우)
    return NextResponse.json({ message: "조회 실패", error: selectError }, { status: 500 });
  }

  if (existing) {
    // 이미 있으면 삭제 (즐겨찾기 해제)
    const { error: deleteError } = await supabase
      .from("professor_bookmark")
      .delete()
      .eq("id", existing.id);

    if (deleteError) {
      return NextResponse.json(
        { message: "즐겨찾기 삭제 실패", error: deleteError },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "즐겨찾기 삭제됨", status: "removed" }, { status: 200 });
  } else {
    // 없으면 추가
    const { error: insertError } = await supabase.from("professor_bookmark").insert({
      student_id: user.id,
      professor_id,
    });

    if (insertError) {
      return NextResponse.json(
        { message: "즐겨찾기 추가 실패", error: insertError },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "즐겨찾기 추가됨", status: "added" }, { status: 200 });
  }
}
