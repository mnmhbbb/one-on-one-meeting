import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 면담 신청 API====================*/
}
// GET: 교수 기준 면담 정보 전체 불러오기
export async function GET(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ message: "start 또는 end 값이 없습니다" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("interview_with_detail")
      .select("*")
      .eq("professor_id", user.id)
      .gte("interview_date", start)
      .lte("interview_date", end);

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "조회 실패" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// PUT: 면담 상태 업데이트
export async function PUT(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const body = await req.json();

    const requiredKeys = ["student_id", "professor_id", "interview_date", "interview_state"];

    const hasAllRequired = requiredKeys.every(
      key => key in body && body[key] !== null && body[key] !== ""
    );

    if (!hasAllRequired) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("create_interview")
      .update({
        interview_state: body.interview_state,
      })
      .match({
        student_id: body.student_id,
        professor_id: body.professor_id,
        interview_date: body.interview_date,
      })
      .select();

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "면담 업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json({ message: "면담 업데이트 완료", data }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
