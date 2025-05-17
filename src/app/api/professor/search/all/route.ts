import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

{
  /*================== 교수 검색 API====================*/
}
// GET: 전체 불러오기
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("professors")
    .select("id, email, name, college, phone_num, interview_location");

  if (error) {
    return NextResponse.json({ message: "데이터 조회 실패", error }, { status: 500 });
  }

  return NextResponse.json({ professors: data });
}
