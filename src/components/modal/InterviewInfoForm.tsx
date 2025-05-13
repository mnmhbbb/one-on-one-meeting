import { useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { INTERVIEW_PURPOSES, InterviewStatus, STATUS_LABELS, UserRole } from "@/common/const";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { useUserStore } from "@/store/userStore";

interface InterviewInfoFormProps {
  interviewDatetimeList: string[]; // 면담일시 목록
  isBeforeInterviewDate?: boolean; // 면담일이 지났는지 여부
  interviewDatetimeGuideText?: string; // 면담일시 하위 가이드 문구
}

/**
 * 면담 정보 확인 & 입력
 */
const InterviewInfoForm = (props: InterviewInfoFormProps) => {
  const MAX_REASON_LENGTH = 100;

  const userRole = useUserStore(state => state.role);
  const { interviewInfo, setInterviewInfo } = useInterviewModalStore(
    useShallow(state => ({
      interviewInfo: state.interviewInfo,
      selectedTime: state.selectedTime,
      setInterviewInfo: state.setInterviewInfo,
    }))
  );

  const [status, setStatus] = useState<InterviewStatus | string>(interviewInfo?.status ?? ""); // 선택된 면담 상태(from 교수 권한)
  const [purpose, setPurpose] = useState(interviewInfo?.purpose); // 면담 목적
  const [reason, setReason] = useState(interviewInfo?.reason); // 면담 희망 내용
  const [cancellationReason, setCancellationReason] = useState(interviewInfo?.cancellationReason); // 면담 취소 사유
  const [rejectionReason, setRejectionReason] = useState(interviewInfo?.rejectionReason); // 면담 거절 사유

  const prevInterviewInfo = useRef(interviewInfo);

  // 학생이 작성하는 면담 신청 폼(면담목적, 면담희망내용) select 비활성화 여부
  // TODO: 새 면담 신청일 경우도 return false 처리 필요
  const isInterviewFormDisabled = useMemo(() => {
    if (userRole === UserRole.STUDENT) {
      // 확인요청일 땐 false(활성화)
      if (interviewInfo?.status === InterviewStatus.REQUESTED) return false;
      // 면담확정이면서 면담일이 지나지 않았을 땐 false(활성화)
      if (interviewInfo?.status === InterviewStatus.CONFIRMED && props.isBeforeInterviewDate)
        return false;
      // 그 외 모든 경우는 true(비활성화)
      return true;
    }
    return true;
  }, [interviewInfo?.status, userRole, props.isBeforeInterviewDate]);

  // 면담상태 select 비활성화 여부
  const isInterviewStatusDisabled = useMemo(() => {
    if (userRole === UserRole.PROFESSOR) {
      // 확인요청일 땐 false(활성화)
      if (interviewInfo?.status === InterviewStatus.REQUESTED) return false;
      // 면담확정이면서 면담일이 지나지 않았을 땐 false(활성화)
      if (interviewInfo?.status === InterviewStatus.CONFIRMED && props.isBeforeInterviewDate)
        return false;
    }
    return true;
  }, [interviewInfo?.status, userRole, props.isBeforeInterviewDate]);

  const isStudent = useMemo(() => (userRole === UserRole.STUDENT ? true : false), [userRole]);

  useEffect(() => {
    if (!prevInterviewInfo.current) return;

    // 인풋 변화 시, 스토어에 저장된 interviewInfo 업데이트
    setInterviewInfo({
      ...prevInterviewInfo.current!,
      // TODO: status는 저장 클릭하면 그때 store에 반영하기
      status: interviewInfo?.status ?? "",
      purpose: purpose ?? "",
      reason: reason ?? "",
    });
  }, [purpose, reason, prevInterviewInfo, setInterviewInfo, interviewInfo?.status]);

  // isInterviewStatusDisabled이 false일 때는, 교수님이 선택할 수 있는 면담상태 item을 3가지만 제한함
  // (면담확정, 면담거절, 면담취소)
  const interviewStatusItems = useMemo(() => {
    if (!isInterviewStatusDisabled) {
      return Object.entries(STATUS_LABELS).filter(
        ([key]) =>
          key === InterviewStatus.CONFIRMED ||
          key === InterviewStatus.REJECTED ||
          key === InterviewStatus.CANCELLED ||
          key === InterviewStatus.REQUESTED // 확인요청 텍스트를 보여주기 위해
      );
    }
    return Object.entries(STATUS_LABELS);
  }, [isInterviewStatusDisabled]);

  return (
    <>
      <div>
        {props.interviewDatetimeList.map(time => (
          <div key={time} className="text-left text-sm font-bold">
            {time}
          </div>
        ))}
        {props.interviewDatetimeGuideText && (
          <p className="text-left text-sm">{props.interviewDatetimeGuideText}</p>
        )}
      </div>
      <Separator className="!my-4" />
      <div>
        <div className="mb-4 flex flex-col items-start space-y-1">
          <label className="text-base font-medium">면담 목적</label>
          <Select disabled={isInterviewFormDisabled} value={purpose} onValueChange={setPurpose}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="면담 목적 선택" />
            </SelectTrigger>
            <SelectContent>
              {INTERVIEW_PURPOSES.map(purpose => (
                <SelectItem key={purpose} value={purpose}>
                  {purpose}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 flex flex-col items-start space-y-1">
          <label className="text-base font-medium">면담 희망 내용</label>
          <Textarea
            placeholder="예: 과제 문의"
            value={reason}
            required
            maxLength={MAX_REASON_LENGTH}
            className="text-sm whitespace-pre-line"
            disabled={isInterviewFormDisabled}
            onChange={e => setReason(e.target.value)}
          />
        </div>

        <div className="mb-4 flex flex-col items-start space-y-1">
          <label className="text-base font-medium">면담 상태</label>
          <Select
            disabled={isInterviewStatusDisabled}
            value={status}
            defaultValue={interviewInfo?.status}
            onValueChange={setStatus}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="면담 상태 선택" />
            </SelectTrigger>
            <SelectContent>
              {interviewStatusItems.map(([key, label]) => (
                <SelectItem key={key} value={key} disabled={key === InterviewStatus.REQUESTED}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {props.isBeforeInterviewDate && isStudent && (
            <p className="text-xs text-gray-500">※ 변경 저장 - 확인 요청 / 면담 삭제 - 면담 취소</p>
          )}
        </div>

        {/* 교수 권한으로 면담 취소 선택한 경우, 사유 인풋 노출 */}
        {!isInterviewStatusDisabled && status === InterviewStatus.CANCELLED && (
          <div className="mb-4 flex w-full flex-col items-start space-y-1">
            <label className="text-base font-medium">면담 취소 사유</label>
            <Textarea
              placeholder="면담 취소 사유를 입력해주세요."
              value={cancellationReason}
              required
              maxLength={MAX_REASON_LENGTH}
              className="text-sm whitespace-pre-line"
              onChange={e => setCancellationReason(e.target.value)}
            />
          </div>
        )}

        {/* 교수 권한으로 면담 거절 선택한 경우, 사유 인풋 노출 */}
        {!isInterviewStatusDisabled && status === InterviewStatus.REJECTED && (
          <div className="mb-4 flex w-full flex-col items-start space-y-1">
            <label className="text-base font-medium">면담 거절 사유</label>
            <Textarea
              placeholder="면담 거절 사유를 입력해주세요."
              value={rejectionReason}
              required
              maxLength={MAX_REASON_LENGTH}
              className="text-sm whitespace-pre-line"
              onChange={e => setRejectionReason(e.target.value)}
            />
          </div>
        )}

        {/* 면담 취소 사유 조회 */}
        {interviewInfo?.cancellationReason && (
          <div className="mb-4 flex w-full flex-col items-start space-y-1">
            <label className="text-base font-medium">면담 취소 사유</label>
            <Textarea
              required
              disabled
              placeholder="면담 취소 사유를 입력해주세요."
              className="text-sm whitespace-pre-line"
              defaultValue={interviewInfo?.cancellationReason}
            />
          </div>
        )}

        {/* 면담 거절 사유 조회 */}
        {interviewInfo?.rejectionReason && (
          <div className="mb-4 flex w-full flex-col items-start space-y-1">
            <label className="text-base font-medium">면담 거절 사유</label>
            <Textarea
              required
              disabled
              placeholder="면담 거절 사유를 입력해주세요."
              className="text-sm whitespace-pre-line"
              defaultValue={interviewInfo?.rejectionReason}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default InterviewInfoForm;
