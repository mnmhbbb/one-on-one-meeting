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

    const { data, error: insertError } = await supabase
      .from("interview_record")
      .insert([{ interview_id, interview_record }])
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
