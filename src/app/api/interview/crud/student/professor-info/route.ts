import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 교수 예약 활성화 API====================*/
}
// GET: 학생 페이지에서 교수 페이지 들어가면 교수 정보 불러오기
export async function GET(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  const { searchParams } = new URL(req.url);
  const professor_id = searchParams.get("professor_id");

  try {
    const { data, error } = await supabase
      .from("professor_with_notice")
      .select("*")
      .eq("id", professor_id);

    if (error || !data || data.length === 0) {
      console.error(error);
      return NextResponse.json({ message: "조회 실패" }, { status: 500 });
    }

    return NextResponse.json({ data: data[0] }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// POST: 학생 페이지에서 교수 예약 활성화 Date 불러오기
export async function POST(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  const body = await req.json();
  const { professor_id, start, end } = body;

  if (!professor_id || !start || !end) {
    return NextResponse.json({ message: "필수 값이 누락되었습니다." }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("professor_interview_allow_date")
      .select(
        `
        *,
        professors (
          name
        )
        `
      )
      .eq("professor_id", professor_id)
      .gte("allow_date", start)
      .lte("allow_date", end);

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "조회 실패" }, { status: 500 });
    }

    const renamedData = data.map(({ professors, ...rest }) => ({
      ...rest,
      professor_name: professors?.name,
    }));

    return NextResponse.json({ data: renamedData }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
