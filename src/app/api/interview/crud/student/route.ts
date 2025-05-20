import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";
import { CreateInterviewToProfessorEmail } from "@/utils/email/CreateInterviewToProfessorEmail";

{
  /*================== 면담 신청 API====================*/
}
// GET: 학생 기준 면담 정보 전체 불러오기
export async function GET(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ message: "start 또는 end 값이 없습니다" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("interview_get_detail")
      .select("*")
      .eq("student_id", user.id)
      .gte("interview_date", start)
      .lte("interview_date", end);

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
      interview_category,
      interview_content,
      interview_state,
    } = body;

    if (
      !student_id ||
      !professor_id ||
      !interview_date ||
      !interview_time ||
      !interview_category ||
      !interview_content ||
      !interview_state ||
      interview_time.length === 0
    ) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }

    const requestedTime = interview_time[0];

    // 1. 교수의 해당 날짜 면담 가능 목록 조회
    const { data: allowDateList, error: allowError } = await supabase
      .from("professor_interview_allow_date")
      .select("id, allow_time, already_apply_time, allow_date")
      .eq("professor_id", body.professor_id)
      .eq("allow_date", body.interview_date);

    if (allowError) {
      console.error(allowError);
      return NextResponse.json({ message: "면담 가능 날짜 조회 실패" }, { status: 500 });
    }

    if (!allowDateList || allowDateList.length === 0) {
      return NextResponse.json({ message: "면담 신청이 불가한 날짜입니다." }, { status: 409 });
    }

    // 2. allow_time에 요청한 시간 포함 여부 확인
    const matchedSlot = allowDateList.find(slot => (slot.allow_time || []).includes(requestedTime));

    if (!matchedSlot) {
      return NextResponse.json({ message: "허용되지 않은 시간대입니다." }, { status: 409 });
    }

    // 3. 이미 신청된 시간인지 확인
    const alreadyApplied = (matchedSlot.already_apply_time || []).includes(requestedTime);
    if (alreadyApplied) {
      return NextResponse.json({ message: "이미 신청된 시간대입니다." }, { status: 409 });
    }

    // 4. 이상 없으면 이메일 보내기
    // 교수 이메일 불러오기
    const { data: professorInfo, error: professorError } = await supabase
      .from("professors")
      .select("name, notification_email")
      .eq("id", body.professor_id)
      .single();

    if (professorError || !professorInfo?.notification_email) {
      console.error(professorError);
      return NextResponse.json({ message: "교수 이메일 정보 조회 실패" }, { status: 500 });
    }

    // 학생 이름 불러오기
    const { data: studentInfo, error: studentError } = await supabase
      .from("students")
      .select("name")
      .eq("id", body.student_id)
      .single();

    if (studentError || !studentInfo?.name) {
      console.error(professorError);
      return NextResponse.json({ message: "학생 이름 조회 실패" }, { status: 500 });
    }

    try {
      await CreateInterviewToProfessorEmail({
        professorName: professorInfo.name,
        studentName: studentInfo.name,
        interviewDate: body.interview_date,
        interviewTime: body.interview_time,
        professorNotificationEmail: professorInfo.notification_email,
      });
    } catch (mailErr) {
      console.error("메일 전송 실패", mailErr);
      return NextResponse.json(
        { message: "메일 전송 실패로 면담이 저장되지 않았습니다." },
        { status: 500 }
      );
    }

    // 5. 면담 신청 등록
    const { data: insertedInterview, error: insertError } = await supabase
      .from("create_interview")
      .insert([
        {
          student_id,
          professor_id,
          interview_date,
          interview_time,
          interview_category,
          interview_content,
          interview_state,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error(insertError);
      return NextResponse.json({ message: "면담 예약 실패" }, { status: 500 });
    }

    // 6. already_apply_time 업데이트
    const newAppliedTimes = Array.from(
      new Set([...(matchedSlot.already_apply_time || []), requestedTime])
    );

    const { error: updateError } = await supabase
      .from("professor_interview_allow_date")
      .update({ already_apply_time: newAppliedTimes })
      .eq("id", matchedSlot.id);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ message: "면담 신청 시간 업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "면담 신청 완료",
        data: {
          interview: insertedInterview,
          allowInfo: {
            allow_date: matchedSlot.allow_date,
            allow_time: matchedSlot.allow_time,
            already_apply_time: newAppliedTimes,
          },
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("면담 신청 처리 중 오류:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

// PUT: 면담 업데이트
export async function PUT(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from("create_interview")
      .update({
        interview_time: body.interview_time,
        interview_category: body.interview_category,
        interview_content: body.interview_content,
      })
      .eq("id", body.id)
      .select();

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "면담 업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json({ message: "면담 업데이트 완료", data }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
