import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

{
  /*================== 교수 검색 API====================*/
}
// GET: 학부 불러오기
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("department").select("college");

  if (error) {
    return NextResponse.json({ message: "데이터 조회 실패", error }, { status: 500 });
  }

  const uniqueColleges = Array.from(new Set(data.map(d => d.college)));
  return NextResponse.json({ colleges: uniqueColleges });
}
