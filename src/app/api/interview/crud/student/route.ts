import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 면담 신청 API====================*/
}
// GET: 학생 기준 면담 정보 전체 불러오기
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
      .from("create_interview")
      .select(
        `
      *,
      professors (
        name
      ),
      professor_notice (
        notice_content
      ),
      interview_guide (
        guide_content
      )
    `
      )
      .eq("student_id", user.id)
      .gte("interview_date", start)
      .lte("interview_date", end);

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "조회 실패" }, { status: 500 });
    }

    const renamedData = data.map(({ professors, professor_notice, interview_guide, ...rest }) => ({
      ...rest,
      professor_name: professors?.name,
      professor_notice: professor_notice?.notice_content,
      interview_guide: interview_guide?.guide_content,
    }));

    return NextResponse.json({ data: renamedData }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// POST: 면담 저장
export async function POST(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const body = await req.json();

    const requiredKeys = [
      "student_id",
      "professor_id",
      "interview_date",
      "interview_time",
      "interview_category",
      "interview_content",
      "interview_state",
    ];

    const hasAllRequired = requiredKeys.every(
      key => key in body && body[key] !== null && body[key] !== ""
    );

    if (!hasAllRequired) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }

    // 허용된 일정인지 체크
    const { data: allowDate, error: allowError } = await supabase
      .from("professor_interview_allow_date")
      .select("id, applied_interview_time, allow_time")
      .eq("professor_id", body.professor_id)
      .eq("allow_date", body.interview_date);

    if (allowError) {
      console.error(allowError);
      return NextResponse.json({ message: "면담 가능 날짜 조회 실패" }, { status: 500 });
    }

    if (!allowDate || allowDate.length === 0) {
      return NextResponse.json({ message: "면담 신청이 불가한 일정입니다." }, { status: 409 });
    }

    const targetSlot = allowDate[0];
    const rowId = targetSlot.id;
    const appliedTimes: string[] = targetSlot.applied_interview_time || [];
    const allowTimes: string[] = targetSlot.allow_time || [];

    // 요청된 시간이 허용된 시간대에 포함되는지 확인
    if (!allowTimes.includes(body.interview_time[0])) {
      return NextResponse.json({ message: "허용되지 않은 시간대입니다." }, { status: 409 });
    }

    // 시간 중복 체크
    const { data: existingInterviews, error: checkError } = await supabase
      .from("create_interview")
      .select("interview_time")
      .eq("student_id", body.student_id)
      .eq("professor_id", body.professor_id)
      .eq("interview_date", body.interview_date);

    if (checkError) {
      console.error(checkError);
      return NextResponse.json({ message: "중복 확인 실패" }, { status: 500 });
    }

    const isTimeTaken = existingInterviews.some(
      interview => interview.interview_time === body.interview_time[0]
    );

    if (isTimeTaken) {
      return NextResponse.json({ message: "이미 해당 시간에 면담이 존재합니다." }, { status: 409 });
    }

    // create_interview에 면담 신청 저장
    const { data: insertedInterview, error: insertError } = await supabase
      .from("create_interview")
      .insert([body])
      .select();

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ message: "면담 예약 실패" }, { status: 500 });
    }

    // professor_interview_allow_date에 면담 신청한 시간 업데이트
    const newAppliedTimes = [...appliedTimes, body.interview_time[0]];
    const { error: updateError } = await supabase
      .from("professor_interview_allow_date")
      .update({ applied_interview_time: newAppliedTimes })
      .eq("id", rowId);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ message: "면담 신청 시간 업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json(
      { message: "면담 예약 완료", data: insertedInterview },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// PUT: 면담 업데이트
export async function PUT(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from("create_interview")
      .update({
        interview_time: body.interview_time,
        interview_category: body.interview_category,
        interview_content: body.interview_content,
      })
      .eq("id", body.id)
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
