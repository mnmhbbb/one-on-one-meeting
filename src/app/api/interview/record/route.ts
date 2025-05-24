import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 면담 기록 API====================*/
}
// POST: 면담 기록 저장
export async function POST(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const body = await req.json();
    const { interview_id, interview_record } = body;

    if (!interview_id || !interview_record) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }
    const updateField =
      user.user_metadata.role === "student"
        ? "interview_record_student"
        : user.user_metadata.role === "professor"
          ? "interview_record_professor"
          : null;

    const stateField =
      user.user_metadata.role === "student"
        ? "interview_record_state_student"
        : user.user_metadata.role === "professor"
          ? "interview_record_state_professor"
          : null;

    if (!updateField || !stateField) {
      return NextResponse.json({ message: "잘못된 사용자 역할" }, { status: 400 });
    }

    // create_interview 테이블 업데이트
    const { error: updateError } = await supabase
      .from("create_interview")
      .update({
        [updateField]: interview_record,
        [stateField]: "면담 기록 완료",
        interview_state: "면담 기록 완료",
      })
      .eq("id", interview_id);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ message: "기록 업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json({ message: "면담 기록 저장 완료" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// PUT: 면담 기록 수정
export async function PUT(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const body = await req.json();
    const { interview_id, interview_record } = body;

    if (!interview_id || !interview_record) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }

    const updateField =
      user.user_metadata.role === "student"
        ? "interview_record_student"
        : user.user_metadata.role === "professor"
          ? "interview_record_professor"
          : null;

    const stateField =
      user.user_metadata.role === "student"
        ? "interview_record_state_student"
        : user.user_metadata.role === "professor"
          ? "interview_record_state_professor"
          : null;

    if (!updateField || !stateField) {
      return NextResponse.json({ message: "잘못된 사용자 역할" }, { status: 400 });
    }

    // create_interview 테이블 업데이트
    const { data, error: updateError } = await supabase
      .from("create_interview")
      .update({
        [updateField]: interview_record,
        [stateField]: "면담 기록 완료",
        interview_state: "면담 기록 완료",
      })
      .eq("id", interview_id);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ message: "기록 수정 실패 (상태 테이블)" }, { status: 500 });
    }

    return NextResponse.json({ message: "면담 기록 수정 완료", data }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
