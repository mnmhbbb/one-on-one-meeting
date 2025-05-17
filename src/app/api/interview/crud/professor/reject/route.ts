import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 면담 취소 API====================*/
}
// PUT: 면담 취소 사유, 상태 업데이트
export async function PUT(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const body = await req.json();

    const requiredKeys = ["student_id", "professor_id", "interview_date", "interview_accept"];

    const hasAllRequired = requiredKeys.every(
      key => key in body && body[key] !== null && body[key] !== ""
    );

    if (!hasAllRequired) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }

    const matchCondition = {
      student_id: body.student_id,
      professor_id: body.professor_id,
      interview_date: body.interview_date,
    };

    const updateFields: {
      interview_accept: boolean;
      interview_reject_reason?: string;
      interview_close_at?: string;
    } = {
      interview_accept: body.interview_accept,
    };

    if (body.interview_accept === false) {
      if (!body.interview_reject_reason || !body.interview_close_at) {
        return NextResponse.json(
          { message: "거절 시 사유와 종료 시간이 필요합니다." },
          { status: 400 }
        );
      }

      updateFields.interview_reject_reason = body.interview_reject_reason;
      updateFields.interview_close_at = body.interview_close_at;
    }

    const { data, error } = await supabase
      .from("create_interview")
      .update(updateFields)
      .match(matchCondition)
      .select();

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "면담 수락/거절 실패" }, { status: 500 });
    }

    return NextResponse.json({ message: "면담 수락/거절 완료", data }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
