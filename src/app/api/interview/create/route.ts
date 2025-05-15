import { NextResponse, NextRequest } from "next/server";
import { getSessionUser } from "@/utils/auth/getSessionUser";

{
  /*================== 면담 신청 API====================*/
}
// GET: 면담 정보 불러오기
// export async function GET() {
//   const { user, supabase, response } = await getSessionUser();
//   if (!user) return response;

//   const { data, error } = await supabase
//     .from("create_interview")
//     .select("*")
//     .eq("student_id", user.id);
//   if (error) {
//     return NextResponse.json({ message: "즐겨찾기 조회 실패", error }, { status: 500 });
//   }

//   const professors = data.map(d => d.professors);
//   return NextResponse.json({ professors });
// }

// POST: 면담 저장
export async function POST(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const body = await req.json();

    const {
      student_id,
      professor_id,
      interview_date,
      interview_time,
      interview_purpose,
      interview_content,
      interview_state,
    } = body;

    if (!student_id || !professor_id || !interview_date || !interview_time) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("create_interview")
      .insert([
        {
          student_id,
          professor_id,
          interview_date,
          interview_time,
          interview_purpose,
          interview_content,
          interview_state,
        },
      ])
      .select();

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "면담 예약 실패" }, { status: 500 });
    }

    return NextResponse.json({ message: "면담 예약 완료", data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
