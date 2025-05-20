import { memo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useInterviewModalStore } from "@/store/interviewModalStore";

/**
 * (교수용) 면담 거절 사유 입력 모달
 */
const RejectionReason = () => {
  const [rejectionReason, setRejectionReason] = useState("");
  const close = useInterviewModalStore(state => state.close);

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
        <Button>저장</Button>
        <Button variant="outline" onClick={close}>
          취소
        </Button>
      </div>
    </div>
  );
};

export default memo(RejectionReason);
