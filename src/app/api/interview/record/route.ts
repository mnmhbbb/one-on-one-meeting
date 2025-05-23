import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 면담 기록 API====================*/
}
// GET: 유저 면담 기록 불러오기
export async function GET(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  const { searchParams } = new URL(req.url);
  const interview_id = searchParams.get("id");

  const { data, error } = await supabase
    .from("interview_record")
    .select("*")
    .eq("writer_id", user.id)
    .eq("interview_id", interview_id)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ message: "면담 기록 조회 실패", error }, { status: 500 });
  }

  return NextResponse.json({ data });
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

    const { data, error: insertError } = await supabase
      .from("interview_record")
      .insert([
        { writer_id: user.id, interview_id, interview_record, role: user.user_metadata.role },
      ])
      .select()
      .single();

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ message: "기록 저장 실패" }, { status: 500 });
    }
    return NextResponse.json({ message: "면담 기록 저장 완료", data }, { status: 201 });
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

    const { data, error: updateError } = await supabase
      .from("interview_record")
      .update({ interview_record })
      .eq("interview_id", interview_id)
      .eq("writer_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ message: "기록 수정 실패" }, { status: 500 });
    }

    return NextResponse.json({ message: "면담 기록 수정 완료", data }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
