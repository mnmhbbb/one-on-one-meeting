import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 면담 수락/거절 API====================*/
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

    const matchCondition = {
      id: body.id,
    };

    const updateFields: any = {
      interview_accept: body.interview_accept,
      interview_state: body.interview_accept ? "면담 확정" : "면담 거절",
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

    // 1. 면담 상태 업데이트
    const { data: updatedInterview, error } = await supabase
      .from("create_interview")
      .update(updateFields)
      .match(matchCondition)
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "면담 수락/거절 실패" }, { status: 500 });
    }

    // 2. 거절인 경우만 해당 날짜의 professor_interview_allow_date 가져오기
    if (body.interview_accept === false) {
      const { data: allowRows, error: allowError } = await supabase
        .from("professor_interview_allow_date")
        .select("id, already_apply_time, allow_time")
        .eq("professor_id", body.professor_id)
        .eq("allow_date", body.interview_date);

      if (allowError || !allowRows || allowRows.length === 0) {
        console.error(allowError);
        return NextResponse.json({ message: "면담 가능 시간 정보 조회 실패" }, { status: 500 });
      }
      const requestedTime = body.interview_time[0];

      // 3. 해당 시간대를 포함한 슬롯 찾기
      const matchedSlot = allowRows.find(slot => (slot.allow_time || []).includes(requestedTime));

      if (!matchedSlot) {
        return NextResponse.json({ message: "해당 시간대 정보 없음" }, { status: 404 });
      }

      // 4. 시간 제거 후 업데이트
      const filteredTimes = (matchedSlot.already_apply_time || []).filter(
        (time: string) => time !== requestedTime
      );

      const { error: timeUpdateError } = await supabase
        .from("professor_interview_allow_date")
        .update({ already_apply_time: filteredTimes })
        .eq("id", matchedSlot.id);

      if (timeUpdateError) {
        console.error(timeUpdateError);
        return NextResponse.json({ message: "시간 회수 실패" }, { status: 500 });
      }

      return NextResponse.json(
        {
          message: "면담 거절 및 시간 회수 완료",
          data: {
            interview: updatedInterview,
            allowSlot: {
              id: matchedSlot.id,
              updated_apply_time: filteredTimes,
            },
          },
        },
        { status: 200 }
      );
    }

    // 5. 수락일 경우는 여기서 단순 응답
    return NextResponse.json(
      { message: "면담 수락 완료", data: updatedInterview },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
