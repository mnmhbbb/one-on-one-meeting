export async function handleToolCall(toolCall: any) {
  const { name, arguments: rawArgs } = toolCall.function;
  const args = JSON.parse(rawArgs);

  const {
    id,
    student_id,
    professor_id,
    interview_date,
    interview_time,
    interview_accept,
    interview_reject_reason,
  } = args;

  // 거절 시 사유 없으면 오류
  if (interview_accept === false && !interview_reject_reason) {
    throw new Error("면담을 거절할 경우 거절 사유가 필요합니다.");
  }

  // 실제 API 요청
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/interview/crud/professor`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
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
    const err = await res.json();
    throw new Error(err.message || "면담 업데이트 실패");
  }

  const result = await res.json();

  return {
    reply: interview_accept
      ? `${interview_date} ${interview_time.join(", ")} 면담을 수락했습니다.`
      : `${interview_date} ${interview_time.join(", ")} 면담을 거절했습니다.`,
    result,
  };
}
