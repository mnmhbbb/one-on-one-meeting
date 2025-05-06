import dayjs from "dayjs";
import { useEffect, useMemo, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { INTERVIEW_PURPOSES, InterviewStatus, STATUS_LABELS, UserRole } from "@/common/const";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { useUserStore } from "@/store/userStore";
import "dayjs/locale/ko";

interface InterviewInfoFormProps {
  isBeforeInterviewDate?: boolean;
}

const InterviewInfoForm = ({ isBeforeInterviewDate }: InterviewInfoFormProps) => {
  const userRole = useUserStore(state => state.role);
  const { interviewInfo, selectedTime, setInterviewInfo } = useInterviewModalStore(
    useShallow(state => ({
      interviewInfo: state.interviewInfo,
      selectedTime: state.selectedTime,
      setInterviewInfo: state.setInterviewInfo,
    }))
  );

  const [status, setStatus] = useState<InterviewStatus | string>(interviewInfo?.status ?? ""); // 면담 상태
  const [purpose, setPurpose] = useState(interviewInfo?.purpose); // 면담 목적
  const [reason, setReason] = useState(interviewInfo?.reason); // 면담 희망 내용
  const [cancelReason, setCancelReason] = useState(interviewInfo?.cancellationReason); // 면담 취소/거절 사유

  const prevInterviewInfo = useRef(interviewInfo);

  // '확인요청', '면담확정(면담일이 도래하지 않은)'이 아닐 경우 인풋 비활성화
  // TODO: 면담확정일 경우 면담일시와 현재일시 비교하는 로직 추가 필요
  const isDisabled = useMemo(
    () =>
      status !== InterviewStatus.REQUESTED && status !== InterviewStatus.CONFIRMED ? true : false,
    [status]
  );

  const isStudent = useMemo(() => (userRole === UserRole.STUDENT ? true : false), [userRole]);

  useEffect(() => {
    if (!prevInterviewInfo.current) return;

    // '확인요청', '기록된 면담'은 직접 변경 불가
    if (status === InterviewStatus.REQUESTED || status === InterviewStatus.RECORDED) {
      alert(`${STATUS_LABELS[status]} 상태는 선택 불가합니다.`);
      return;
    }

    // 인풋 변화 시, 스토어에 저장된 interviewInfo 업데이트
    setInterviewInfo({
      ...prevInterviewInfo.current!,
      status,
      purpose: purpose ?? "",
      reason: reason ?? "",
    });
  }, [status, purpose, reason, prevInterviewInfo, setInterviewInfo]);

  // 면담 시간 포맷 설정
  const formattedSelectedTimeList = useMemo(() => {
    if (!interviewInfo?.date) return [];
    const baseDate = dayjs(interviewInfo.date).locale("ko").format("YYYY년 MM월 DD일 dddd");
    return selectedTime.map(time => `${baseDate} ${time}`);
  }, [selectedTime, interviewInfo?.date]);

  return (
    <>
      <div>
        {formattedSelectedTimeList.map(time => (
          <div key={time} className="text-left text-sm font-bold">
            {time}
          </div>
        ))}

        <p className="text-left text-sm">면담 신청 정보를 확인해주세요.</p>
      </div>
      <Separator className="!my-4" />
      <div>
        <div className="mb-4 flex flex-col items-start space-y-1">
          <label className="text-base font-medium">면담 목적</label>
          <Select disabled={isDisabled} value={purpose} onValueChange={setPurpose}>
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
          <Input
            placeholder="예: 과제 문의"
            value={reason}
            required
            disabled={isDisabled}
            onChange={e => setReason(e.target.value)}
          />
        </div>

        <div className="mb-4 flex flex-col items-start space-y-1">
          <label className="text-base font-medium">면담 상태</label>
          <Select
            disabled={userRole === UserRole.PROFESSOR && status !== InterviewStatus.CONFIRMED}
            value={status}
            onValueChange={setStatus}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="면담 상태 선택" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(STATUS_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            {isStudent
              ? "※ 변경 저장 - 확인 요청 / 면담 삭제 - 면담 취소"
              : "면담 확정, 면담 취소, 면담 거절만 선택 가능합니다."}
          </p>

          {/* 면담 취소 사유 조회 */}
          {interviewInfo?.cancellationReason && (
            <div className="mb-4 flex w-full flex-col items-start space-y-1">
              <label className="text-base font-medium">면담 취소 사유</label>
              <Input
                required
                disabled
                placeholder="면담 취소 사유를 입력해주세요."
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
              />
            </div>
          )}

          {/* TODO: 확인요청, 면담일이 도래하지 않은 면담확정일 경우만 입력 가능 처리 필요 */}
          {/* (교수 권한) 면담 거절 사유 입력 & 조회 */}
          {/* {status === InterviewStatus.REJECTED && (
            <div className="mb-4 flex w-full flex-col items-start space-y-1">
              <label className="text-base font-medium">면담 거절 사유</label>
              <Input
                required
                placeholder="면담 거절 사유를 입력해주세요."
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
              />
            </div>
          )} */}
        </div>
      </div>
    </>
  );
};

export default InterviewInfoForm;
