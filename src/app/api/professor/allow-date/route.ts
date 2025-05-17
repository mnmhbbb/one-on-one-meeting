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

// POST: 교수 예약 활성화 Date 저장
export async function POST(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const body = await req.json();
    const requiredKeys = ["professor_id", "allow_date", "allow_day", "allow_time"];
    const hasAllRequired = requiredKeys.every(key => key in body && body[key]);

    if (!hasAllRequired) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("professor_interview_allow_date")
      .insert([body])
      .select();

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "일정 활성화 실패" }, { status: 500 });
    }

    return NextResponse.json({ message: "일정 활성화 완료", data }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// PUT: 교수 예약 활성화 Date 업데이트
export async function PUT(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const body = await req.json();
    const requiredKeys = ["professor_id", "allow_date", "allow_day", "allow_time"];
    const hasAllRequired = requiredKeys.every(key => key in body && body[key]);

    if (!hasAllRequired) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("professor_interview_allow_date")
      .update({
        allow_time: body.allow_time,
      })
      .match({
        professor_id: body.professor_id,
        allow_date: body.allow_date,
        allow_day: body.allow_day,
      })
      .select();

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "일정 활성화 업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json({ message: "일정 활성화 업데이트 완료", data }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// DELETE: 교수 예약 활성화 Date 삭제
export async function DELETE(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const { searchParams } = new URL(req.url);
    const allow_date = searchParams.get("allow_date");
    const professor_id = user.id;

    if (!professor_id || !allow_date) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }

    const { error } = await supabase
      .from("professor_interview_allow_date")
      .delete()
      .match({ professor_id, allow_date });

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "삭제 실패" }, { status: 500 });
    }

    return NextResponse.json({ message: "삭제 완료" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
