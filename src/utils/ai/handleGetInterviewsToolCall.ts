export async function handleGetInterviewsToolCall(toolCall: any, context: { accessToken: string }) {
  const { arguments: rawArgs } = toolCall.function;
  const args = JSON.parse(rawArgs);

  const { start, end } = args;

  // 필수 파라미터 검증
  if (!start || !end) {
    throw new Error("시작 날짜(start)와 종료 날짜(end)가 필요합니다.");
  }

  // 날짜 형식 검증 (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(start) || !dateRegex.test(end)) {
    throw new Error("날짜는 YYYY-MM-DD 형식이어야 합니다.");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/ai-res/professor?start=${start}&end=${end}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${context.accessToken}`,
        },
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "면담 목록 조회 실패");
    }

    const result = await res.json();
    const interviews = result.data || [];

    // 면담 목록이 비어있는 경우
    if (interviews.length === 0) {
      return {
        reply: `${start}부터 ${end}까지 등록된 면담이 없습니다.`,
        result: { interviews: [], count: 0 },
      };
    }

    // 면담 상태별 분류
    const statusSummary = interviews.reduce((acc: any, interview: any) => {
      const status = interview.interview_state || "상태 미정";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // 인터뷰 목록 받아서 요약 문장 생성
    const interviewSummaries = interviews.map((iv: any, index: number) => {
      const date = iv.interview_date;
      const time = Array.isArray(iv.interview_time)
        ? iv.interview_time.join(", ")
        : iv.interview_time || "시간 정보 없음";
      const state = iv.interview_state || "상태 미지정";
      const category = iv.interview_category || "유형 없음";
      const student = iv.student_name || "이름 없음";
      const department = iv.student_department || "학과 없음";

      return (
        `${index + 1}. 날짜: ${date}<br>` +
        `&nbsp;&nbsp;시간: ${time}<br>` +
        `&nbsp;&nbsp;학생: ${student} (${department})<br>` +
        `&nbsp;&nbsp;상태: ${state}<br>` +
        `&nbsp;&nbsp;목적: ${category}<br>`
      );
    });

    const totalCount = interviews.length;
    const statusText = Object.entries(statusSummary)
      .map(([status, count]) => `${status}: ${count}건`)
      .join(", ");

    return {
      reply:
        `면담 일정 요약(총 ${totalCount}건)<br>
        (${start} ~ ${end} 기준)<br><br>` + interviewSummaries.join("<br><br>"),
      result: {
        interviews,
        count: totalCount,
        summary: statusText,
        period: { start, end },
      },
    };
  } catch (error) {
    console.error("면담 목록 조회 오류:", error);
    throw error;
  }
}
