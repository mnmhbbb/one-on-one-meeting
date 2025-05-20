import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";
import { InterviewInfo } from "@/types/interview";

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
      .from("interview_get_detail")
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

// PUT: 면담 수락/거절 사유, 상태 업데이트
export async function PUT(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const body = await req.json();
    const requiredKeys = [
      "id",
      "student_id",
      "professor_id",
      "interview_date",
      "interview_time",
      "interview_accept",
    ];

    const hasAllRequired = requiredKeys.every(
      key => key in body && body[key] !== null && body[key] !== ""
    );
    if (!hasAllRequired) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }

    const requestedTime = body.interview_time[0];
    const matchCondition = { id: body.id };

    const updateFields: Partial<InterviewInfo> = {
      interview_accept: body.interview_accept,
      interview_state: body.interview_accept ? "면담 확정" : "면담 거절",
    };

    if (body.interview_accept === true) {
      updateFields.interview_close_at = null;
      updateFields.interview_reject_reason = null;
    } else {
      if (!body.interview_reject_reason) {
        return NextResponse.json(
          { message: "거절 시 사유와 종료 시간이 필요합니다." },
          { status: 400 }
        );
      }
      updateFields.interview_close_at = new Date().toISOString();
      updateFields.interview_reject_reason = body.interview_reject_reason;
    }

    const { data: updatedInterview, error: updateInterviewError } = await supabase
      .from("create_interview")
      .update(updateFields)
      .match(matchCondition)
      .select()
      .single();

    if (updateInterviewError) {
      console.error(updateInterviewError);
      return NextResponse.json({ message: "면담 수락/거절 실패" }, { status: 500 });
    }

    const { data: allowRows, error: allowError } = await supabase
      .from("professor_interview_allow_date")
      .select("id, already_apply_time, allow_time, allow_date")
      .eq("professor_id", body.professor_id)
      .eq("allow_date", body.interview_date);

    if (allowError || !allowRows?.length) {
      return NextResponse.json({ message: "면담 가능 시간 정보 조회 실패" }, { status: 500 });
    }

    const matchedSlot = allowRows.find(slot => (slot.allow_time || []).includes(requestedTime));
    if (!matchedSlot) {
      return NextResponse.json({ message: "해당 시간대 정보 없음" }, { status: 404 });
    }

    let updatedApplyTime: string[] = [];

    if (body.interview_accept === false) {
      // 시간 제거
      updatedApplyTime = (matchedSlot.already_apply_time || []).filter(
        (time: string) => time !== requestedTime
      );
    } else {
      // 시간 추가
      updatedApplyTime = Array.from(
        new Set([...(matchedSlot.already_apply_time || []), requestedTime])
      );
    }

    const { error: timeUpdateError } = await supabase
      .from("professor_interview_allow_date")
      .update({ already_apply_time: updatedApplyTime })
      .eq("id", matchedSlot.id);

    if (timeUpdateError) {
      console.error(timeUpdateError);
      return NextResponse.json({ message: "면담 가능 시간 업데이트 실패" }, { status: 500 });
    }

    const resBody = {
      interview: updatedInterview,
      allowInfo: {
        id: matchedSlot.id,
        allow_date: matchedSlot.allow_date,
        allow_time: matchedSlot.allow_time,
        already_apply_time: updatedApplyTime,
      },
    };

    return NextResponse.json(
      {
        message: body.interview_accept ? "면담 신청 완료" : "면담 거절 및 시간 회수 완료",
        data: resBody,
      },
      { status: body.interview_accept ? 201 : 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
