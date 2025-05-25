export async function handleAllowRejectviewsToolCall(
  toolCall: any,
  context: { accessToken: string }
) {
  const accessToken = context;

  // 파싱된 파라미터
  const args = JSON.parse(toolCall.function.arguments);
  // interviews: [{ id, student_id, interview_date, interview_time, interview_accept, interview_reject_reason }]
  const interviews = Array.isArray(args) ? args : [args];
  const results: any[] = [];

  for (const iv of interviews) {
    const {
      id,
      student_id,
      professor_id,
      interview_date,
      interview_time,
      interview_accept,
      interview_reject_reason,
    } = iv;

    // 거절인데 사유가 없으면 에러
    if (interview_accept === false && !interview_reject_reason) {
      results.push({
        ...iv,
        status: "실패",
        error: "면담을 거절하려면 거절 사유가 필요합니다.",
      });
      continue;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/ai-res/professor`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        id,
        student_id,
        professor_id,
        interview_date,
        interview_time,
        interview_accept,
        interview_reject_reason,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      results.push({ ...iv, status: "실패", error: error.message });
    } else {
      results.push({ ...iv, status: "성공" });
    }
  }

  const successCount = results.filter(r => r.status === "성공").length;
  const failedCount = results.length - successCount;

  const acceptedCount = results.filter(
    r => r.interview_accept === true && r.status === "성공"
  ).length;
  const rejectedCount = results.filter(
    r => r.interview_accept === false && r.status === "성공"
  ).length;

  return {
    reply: `이번 주 면담 처리 결과:\n- 수락 ${acceptedCount}건\n- 거절 ${rejectedCount}건\n${failedCount > 0 ? `- 실패 ${failedCount}건` : ""}`,
    result: results,
  };
}
