import { NextResponse, NextRequest } from "next/server";
import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 안내사항 API====================*/
}
// GET: 안내사항 불러오기
export async function GET() {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  const { data, error } = await supabase.from("interview_guide").select("*");
  if (error) {
    return NextResponse.json({ message: "안내사항 조회 실패", error }, { status: 500 });
  }

  return NextResponse.json({ data });
}
