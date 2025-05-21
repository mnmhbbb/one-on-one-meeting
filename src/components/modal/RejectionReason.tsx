import { useMutation } from "@tanstack/react-query";
import { memo, useState } from "react";

import LoadingUI from "@/components/LoadingUI";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDateStore } from "@/store/dateStore";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { useToastStore } from "@/store/toastStore";
import { InterviewAcceptBody } from "@/types/interview";
import { interviewApi } from "@/utils/api/interview";

/**
 * (교수용) 면담 거절 사유 입력 모달
 */
const RejectionReason = () => {
  const [rejectionReason, setRejectionReason] = useState("");
  const close = useInterviewModalStore(state => state.close);
  const setToast = useToastStore(state => state.setToast);
  const setUpdateTarget = useDateStore(state => state.setUpdateTarget);
  const interviewInfo = useInterviewModalStore(state => state.interviewInfo);

  const updateInterviewStateMutation = useMutation({
    mutationFn: async (data: InterviewAcceptBody) => {
      const result = await interviewApi.putInterviewState(data);
      if (result) {
        setToast("면담 상태가 업데이트되었습니다.", "success");
        setUpdateTarget("professorInterviewList");
      }
      return result;
    },
  });

  const handleSave = () => {
    if (!interviewInfo?.id) {
      setToast("면담 정보를 찾을 수 없습니다.", "error");
      return;
    }

    if (window.confirm("면담을 거절하시겠습니까?")) {
      updateInterviewStateMutation.mutate({
        id: interviewInfo?.id,
        student_id: interviewInfo?.student_id,
        professor_id: interviewInfo?.professor_id,
        interview_date: interviewInfo?.interview_date,
        interview_time: interviewInfo?.interview_time,
        interview_accept: false,
        interview_reject_reason: rejectionReason,
      });
      close();
    }
  };

  return (
    <div className="flex w-full flex-col items-start space-y-1">
      <label className="text-base font-medium">면담 거절 사유</label>
      <Textarea
        required
        placeholder="면담 거절 사유를 입력해주세요."
        className="mt-3 text-sm whitespace-pre-line"
        value={rejectionReason}
        onChange={e => setRejectionReason(e.target.value)}
      />
      <div className="mt-3 flex w-full justify-end gap-2">
        <Button disabled={!rejectionReason} onClick={handleSave}>
          저장
        </Button>
        <Button variant="outline" onClick={close}>
          취소
        </Button>
      </div>
      {updateInterviewStateMutation.isPending && <LoadingUI />}
    </div>
  );
};

export default memo(RejectionReason);
