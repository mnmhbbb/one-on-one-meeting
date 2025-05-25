import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { InterviewStatus, STATUS_LABELS, UserRole } from "@/common/const";
import LoadingUI from "@/components/LoadingUI";
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
import { interviewApi } from "@/utils/api/interview";

interface InterviewInfoFormProps {
  interviewDatetimeList: string[]; // 면담일시 목록
  isBeforeInterviewDate?: boolean; // 면담일이 지났는지 여부
  interviewDatetimeGuideText?: string; // 면담일시 하위 가이드 문구
  isRejected?: boolean; // 본 컴포넌트가 면담 거절 모달에서 사용됐는지 여부
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
      setInterviewInfo: state.setInterviewInfo,
    }))
  );

  const [status, setStatus] = useState<InterviewStatus | string>(
    interviewInfo?.interview_state ?? ""
  ); // 선택된 면담 상태(from 교수 권한)
  const [category, setCategory] = useState(interviewInfo?.interview_category); // 면담 목적
  const [content, setContent] = useState(interviewInfo?.interview_content); // 면담 희망 내용
  const [rejectionReason, setRejectionReason] = useState(
    interviewInfo?.interview_reject_reason || ""
  ); // 면담 거절 사유

  const prevInterviewInfo = useRef(interviewInfo);

  const isInterviewFormDisabled = useMemo(() => {
    if (userRole === UserRole.STUDENT) {
      // 면담 상태가 없거나 확인요청일 땐 false(활성화)
      if (
        !interviewInfo?.interview_state ||
        interviewInfo?.interview_state === InterviewStatus.REQUESTED
      )
        return false;

      // 면담확정이면서 면담일이 지나지 않았을 땐 false(활성화)
      if (
        interviewInfo?.interview_state === InterviewStatus.CONFIRMED &&
        props.isBeforeInterviewDate
      )
        return false;

      // 그 외 모든 경우는 true(비활성화)
      return true;
    }
    return true;
  }, [interviewInfo, userRole, props.isBeforeInterviewDate]);

  // 면담상태 select 비활성화 여부(교수 권한)
  // 면담일이 지나지 않았을 땐 false(=활성화)
  const isInterviewStatusDisabled = useMemo(() => {
    const isProfessor = userRole === UserRole.PROFESSOR;
    const isBeforeInterview = props.isBeforeInterviewDate;
    return !(isProfessor && isBeforeInterview);
  }, [userRole, props.isBeforeInterviewDate]);

  const isStudent = useMemo(() => (userRole === UserRole.STUDENT ? true : false), [userRole]);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // 디바운스 타이머

  // 인풋 변화 시, 스토어에 저장된 interviewInfo 업데이트
  const updateInterviewInfo = useCallback(
    (newContent: string, newCategory: string) => {
      setInterviewInfo({
        ...prevInterviewInfo.current!,
        interview_state: status,
        interview_category: newCategory,
        interview_content: newContent,
        interview_reject_reason: rejectionReason!,
      });
    },
    [setInterviewInfo, status, rejectionReason]
  );

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // content나 category가 변경될 때만 업데이트
  useEffect(() => {
    updateInterviewInfo(content ?? "", category ?? "");
  }, [content, category, updateInterviewInfo]);

  // isInterviewStatusDisabled이 false일 때는, 교수님이 선택할 수 있는 면담상태 item을 2가지만 제한함
  // (면담확정, 면담거절)
  const interviewStatusItems = useMemo(() => {
    if (!isInterviewStatusDisabled) {
      return Object.entries(STATUS_LABELS).filter(
        ([key]) =>
          key === InterviewStatus.CONFIRMED ||
          key === InterviewStatus.REJECTED ||
          key === InterviewStatus.REQUESTED // 확인요청 텍스트를 보여주기 위해
      );
    }
    return Object.entries(STATUS_LABELS);
  }, [isInterviewStatusDisabled]);

  // 면담 목록 옵션 호출
  const { data: interviewCategory, isLoading } = useQuery({
    queryKey: ["interview-category"],
    queryFn: async () => {
      const res = await interviewApi.getInterviewCategory();
      return res?.data ?? [];
    },
  });

  return (
    <>
      <div>
        {userRole === UserRole.PROFESSOR && (
          <div className="mb-2 text-sm">
            이름: {interviewInfo?.student_name}
            <br />
            학번: {interviewInfo?.student_sign_num}
            <br />
            학과: {interviewInfo?.student_department}
            <br />
            이메일: {interviewInfo?.student_notification_email}
          </div>
        )}
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
          <Select disabled={isInterviewFormDisabled} value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="면담 목적 선택" />
            </SelectTrigger>
            <SelectContent>
              {interviewCategory?.map(category => (
                <SelectItem key={category.id} value={category.interview_category}>
                  {category.interview_category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 flex flex-col items-start space-y-1">
          <label className="text-base font-medium">면담 희망 내용</label>
          <Textarea
            placeholder="예: 과제 문의"
            value={content}
            required
            maxLength={MAX_REASON_LENGTH}
            className="text-sm whitespace-pre-line"
            disabled={isInterviewFormDisabled}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        <div className="mb-4 flex flex-col items-start space-y-1">
          <label className="text-base font-medium">면담 상태</label>
          <Select
            disabled={isInterviewStatusDisabled}
            value={status}
            defaultValue={interviewInfo?.interview_state}
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

        {/* 교수 권한으로 면담 거절 선택한 경우, 사유 인풋 노출 */}
        {status === InterviewStatus.REJECTED && (
          <div className="mb-4 flex w-full flex-col items-start space-y-1">
            <label className="text-base font-medium">면담 거절 사유</label>
            <Textarea
              placeholder="면담 거절 사유를 입력해주세요."
              value={rejectionReason ?? interviewInfo?.interview_reject_reason ?? ""}
              onChange={e => setRejectionReason(e.target.value)}
              required
              maxLength={MAX_REASON_LENGTH}
              disabled={isInterviewStatusDisabled || props.isRejected} // 권한 없거나 거절 컴포넌트에서 사용된 경우, 읽기 전용
              className="text-sm whitespace-pre-line"
            />
          </div>
        )}

        {/* 면담 취소 사유 조회 */}
        {interviewInfo?.interview_cancel_reason && (
          <div className="mb-4 flex w-full flex-col items-start space-y-1">
            <label className="text-base font-medium">면담 취소 사유</label>
            <Textarea
              required
              disabled
              placeholder="면담 취소 사유를 입력해주세요."
              className="text-sm whitespace-pre-line"
              defaultValue={interviewInfo?.interview_cancel_reason}
            />
          </div>
        )}
      </div>

      {isLoading && <LoadingUI />}
    </>
  );
};

export default InterviewInfoForm;
