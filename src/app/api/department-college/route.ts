import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

{
  /*================== 학과, 학부 API====================*/
}
// GET: 학과, 학부 불러오기
export async function GET() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("department").select("*");

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
