import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 교수 예약 활성화 API====================*/
}
// GET: 교수 예약 활성화 Date 불러오기
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
      .from("professor_interview_allow_date")
      .select("*")
      .eq("professor_id", user.id)
      .gte("allow_date", start)
      .lte("allow_date", end);

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

// POST: 교수 예약 활성화 Date 신청 (덮어쓰기 방식)
export async function POST(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ message: "start 또는 end 쿼리 누락" }, { status: 400 });
  }

  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ message: "입력 데이터가 유효하지 않습니다." }, { status: 400 });
    }

    const professorId = body[0]?.professor_id || user.id; // body가 빈 배열일 경우 fallback

    // 기존 일정 삭제
    const { error: deleteError } = await supabase
      .from("professor_interview_allow_date")
      .delete()
      .eq("professor_id", professorId)
      .gte("allow_date", start)
      .lte("allow_date", end);

    if (deleteError) {
      console.error(deleteError);
      return NextResponse.json({ message: "기존 일정 삭제 실패" }, { status: 500 });
    }

    // 새 일정이 있으면 insert
    if (body.length > 0) {
      const requiredKeys = ["professor_id", "allow_date", "allow_time"];
      const hasAllRequired = body.every(item =>
        requiredKeys.every(key => key in item && item[key])
      );

      if (!hasAllRequired) {
        return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
      }

      const { data, error: insertError } = await supabase
        .from("professor_interview_allow_date")
        .insert(body)
        .select();

      if (insertError) {
        console.error(insertError);
        return NextResponse.json({ message: "일정 저장 실패" }, { status: 500 });
      }

      return NextResponse.json({ message: "일정 수정 완료", data }, { status: 200 });
    }

    // insert 없이 삭제만 한 경우
    return NextResponse.json({ message: "일정 삭제 완료" }, { status: 200 });
  } catch (e) {
    console.error("서버 오류:", e);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
