import { NextResponse, NextRequest } from "next/server";

import { getSessionUser } from "@/utils/auth/getSessionUser";
import { CreateInterviewToProfessorEmail } from "@/utils/email/CreateInterviewToProfessorEmail";
import { UpdateInterviewToProfessorEmail } from "@/utils/email/UpdateInterviewToProfessorEmail";

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

    // 0. 필수 값 확인
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

    // 1. 교수 면담 가능 시간 조회
    const { data: allowList, error: allowError } = await supabase
      .from("professor_interview_allow_date")
      .select("id, allow_time, already_apply_time, allow_date")
      .eq("professor_id", professor_id)
      .eq("allow_date", interview_date);

    if (allowError) {
      console.error(allowError);
      return NextResponse.json({ message: "면담 가능 날짜 조회 실패" }, { status: 500 });
    }

    if (!allowList?.length) {
      return NextResponse.json({ message: "면담 신청이 불가한 날짜입니다." }, { status: 409 });
    }

    // allowList는 이 날짜에 대해 하나라고 가정
    const matchedSlot = allowList[0];

    // 2. 모든 요청 시간대가 허용 목록에 있는지 확인
    const allowTimeSet = new Set(matchedSlot.allow_time || []);
    const alreadySet = new Set(matchedSlot.already_apply_time || []);

    // 1) 허용되지 않은 시간대 검사
    const invalidTimes = interview_time.filter((time: string) => !allowTimeSet.has(time));
    if (invalidTimes.length > 0) {
      return NextResponse.json(
        { message: `허용되지 않은 시간대입니다: ${invalidTimes.join(", ")}` },
        { status: 409 }
      );
    }

    // 2) 이미 신청된 시간대 검사
    const duplicates = interview_time.filter((time: string) => alreadySet.has(time));
    if (duplicates.length > 0) {
      return NextResponse.json(
        { message: `이미 신청된 시간대입니다: ${duplicates.join(", ")}` },
        { status: 409 }
      );
    }

    // 3. 교수/학생 정보 조회
    const [professorRes, studentRes] = await Promise.all([
      supabase
        .from("professors")
        .select("name, notification_email")
        .eq("id", professor_id)
        .single(),
      supabase.from("students").select("name, notification_email").eq("id", student_id).single(),
    ]);

    if (professorRes.error || !professorRes.data) {
      return NextResponse.json({ message: "교수 정보 조회 실패" }, { status: 500 });
    }
    if (studentRes.error || !studentRes.data) {
      return NextResponse.json({ message: "학생 정보 조회 실패" }, { status: 500 });
    }

    // 4. 이메일 전송
    try {
      await CreateInterviewToProfessorEmail({
        studentName: studentRes.data.name,
        professorName: professorRes.data.name,
        interviewDate: interview_date,
        interviewTime: interview_time,
        professorNotificationEmail: professorRes.data.notification_email,
      });
    } catch (mailErr) {
      console.error("메일 전송 실패:", mailErr);
      return NextResponse.json(
        { message: "메일 전송 실패로 면담이 저장되지 않았습니다." },
        { status: 500 }
      );
    }

    // 5. 면담 신청 저장
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

    // 1. 기존 시간 배열
    const original = matchedSlot.already_apply_time || [];
    // 2. 새 요청 시간
    const requested = body.interview_time || [];

    // 3. 병합 후 중복 제거
    const mergedTimes = Array.from(new Set([...original, ...requested]));

    // 4. 업데이트
    const { error: updateError } = await supabase
      .from("professor_interview_allow_date")
      .update({ already_apply_time: mergedTimes })
      .eq("id", matchedSlot.id);

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ message: "면담 신청 시간 업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "면담 신청 완료 & 신청 이메일 교수에게 전송",
        data: {
          interview: insertedInterview,
          allowInfo: {
            allow_date: matchedSlot.allow_date,
            allow_time: matchedSlot.allow_time,
            already_apply_time: mergedTimes,
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

// PUT: 면담 재신청 (내용 및 시간 수정)
export async function PUT(req: NextRequest) {
  const { user, supabase, response } = await getSessionUser();
  if (!user) return response;

  try {
    const body = await req.json();
    const {
      id,
      student_id,
      professor_id,
      interview_date,
      interview_time,
      interview_category,
      interview_content,
    } = body;

    if (
      !id ||
      !student_id ||
      !professor_id ||
      !interview_date ||
      !interview_time ||
      interview_time.length === 0 ||
      !interview_category ||
      !interview_content
    ) {
      return NextResponse.json({ message: "필수 값 누락" }, { status: 400 });
    }

    // 1. 기존 면담 정보 조회
    const { data: interviewData, error: fetchError } = await supabase
      .from("create_interview")
      .select("interview_time, interview_category, interview_content")
      .eq("id", id)
      .single();

    if (fetchError || !interviewData) {
      return NextResponse.json({ message: "기존 면담 정보 조회 실패" }, { status: 500 });
    }

    const originalTimes: string[] = interviewData.interview_time || [];
    const requestedTimes: string[] = interview_time;

    const isTimeChanged =
      requestedTimes.length !== originalTimes.length ||
      requestedTimes.some(t => !originalTimes.includes(t));

    const isCategoryChanged = interview_category !== interviewData.interview_category;
    const isContentChanged = interview_content !== interviewData.interview_content;

    // 2. 변경 사항 없음 → 무시
    if (!isTimeChanged && !isCategoryChanged && !isContentChanged) {
      return NextResponse.json({ message: "변경된 내용이 없습니다." }, { status: 200 });
    }

    let updatedApplyTimes: string[] = [];
    let allowInfo = null;

    if (isTimeChanged) {
      // 3. 교수의 해당 날짜 면담 가능 목록 조회
      const { data: allowList, error: allowError } = await supabase
        .from("professor_interview_allow_date")
        .select("id, allow_time, already_apply_time, allow_date")
        .eq("professor_id", professor_id)
        .eq("allow_date", interview_date);

      if (allowError || !allowList?.length) {
        return NextResponse.json({ message: "면담 가능 시간 조회 실패" }, { status: 500 });
      }

      const removedTimes = originalTimes.filter(t => !requestedTimes.includes(t));
      const newlyAddedTimes = requestedTimes.filter(t => !originalTimes.includes(t));

      const allAlreadyApplied = allowList.flatMap(slot => slot.already_apply_time || []);
      const conflicting = newlyAddedTimes.filter(t => allAlreadyApplied.includes(t));

      if (conflicting.length > 0) {
        return NextResponse.json(
          { message: `이미 신청된 시간대입니다: ${conflicting.join(", ")}` },
          { status: 409 }
        );
      }

      const matchedSlot = allowList.find(slot =>
        newlyAddedTimes.every(t => (slot.allow_time || []).includes(t))
      );

      if (!matchedSlot) {
        return NextResponse.json({ message: "해당 시간대 정보 없음" }, { status: 404 });
      }

      const originalApplyTime = matchedSlot.already_apply_time || [];

      updatedApplyTimes = Array.from(
        new Set([
          ...originalApplyTime.filter((t: string) => !removedTimes.includes(t)),
          ...newlyAddedTimes,
        ])
      );

      const { error: updateAllowError } = await supabase
        .from("professor_interview_allow_date")
        .update({ already_apply_time: updatedApplyTimes })
        .eq("id", matchedSlot.id);

      if (updateAllowError) {
        console.error(updateAllowError);
        return NextResponse.json({ message: "면담 가능 시간 업데이트 실패" }, { status: 500 });
      }

      allowInfo = {
        allow_date: matchedSlot.allow_date,
        allow_time: matchedSlot.allow_time,
        already_apply_time: updatedApplyTimes,
      };
    } else {
      // 시간 변경이 없을 때도 allowInfo 반환
      const { data: allowSlot, error: allowError } = await supabase
        .from("professor_interview_allow_date")
        .select("allow_date, allow_time, already_apply_time")
        .eq("professor_id", professor_id)
        .eq("allow_date", interview_date)
        .single();

      if (allowError || !allowSlot) {
        return NextResponse.json({ message: "면담 가능 시간 조회 실패" }, { status: 500 });
      }

      allowInfo = {
        allow_date: allowSlot.allow_date,
        allow_time: allowSlot.allow_time,
        already_apply_time: allowSlot.already_apply_time || [],
      };
    }

    // 변경된 사항 저장
    const diffs: Record<string, { before: string[] | string; after: string[] | string }> = {};

    if (isTimeChanged) {
      diffs["면담 시간"] = { before: originalTimes, after: requestedTimes };
    }

    if (isCategoryChanged) {
      diffs["면담 카테고리"] = {
        before: interviewData.interview_category,
        after: interview_category,
      };
    }

    if (isContentChanged) {
      diffs["면담 내용"] = { before: interviewData.interview_content, after: interview_content };
    }

    // 4. 교수/학생 정보 조회
    const [professorRes, studentRes] = await Promise.all([
      supabase
        .from("professors")
        .select("name, notification_email")
        .eq("id", body.professor_id)
        .single(),
      supabase
        .from("students")
        .select("name, notification_email")
        .eq("id", body.student_id)
        .single(),
    ]);

    const professorInfo = professorRes.data;
    const studentInfo = studentRes.data;

    if (professorRes.error || !professorInfo) {
      console.error(professorRes.error);
      return NextResponse.json({ message: "교수 정보 조회 실패" }, { status: 500 });
    }

    if (studentRes.error || !studentInfo) {
      console.error(studentRes.error);
      return NextResponse.json({ message: "학생 정보 조회 실패" }, { status: 500 });
    }

    // 5. 이메일 발송
    try {
      await UpdateInterviewToProfessorEmail({
        studentName: studentInfo.name,
        professorName: professorInfo.name,
        interviewDate: interview_date,
        interviewTime: interview_time,
        diffs,
        professorNotificationEmail: professorInfo.notification_email,
      });
    } catch (mailErr) {
      console.error("메일 전송 실패:", mailErr);
      return NextResponse.json(
        { message: "메일 전송 실패로 면담이 업데이트되지 않았습니다." },
        { status: 500 }
      );
    }

    // 6. 면담 정보 업데이트
    const { data: updatedInterview, error: updateError } = await supabase
      .from("create_interview")
      .update({
        ...(isTimeChanged && { interview_time: requestedTimes }),
        ...(isCategoryChanged && { interview_category }),
        ...(isContentChanged && { interview_content }),
        interview_state: "확정 대기",
        interview_accept: null,
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error(updateError);
      return NextResponse.json({ message: "면담 업데이트 실패" }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "면담 재신청 완료 & 수정 이메일 교수에게 전송",
        data: {
          interview: updatedInterview,
          allowInfo,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("서버 오류:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
