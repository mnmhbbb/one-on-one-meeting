"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { memo, useCallback, useMemo, useState } from "react";

import { InterviewStatus, UserRole } from "@/common/const";
import InterviewInfoForm from "@/components/modal/InterviewInfoForm";
import ProfessorNotice from "@/components/modal/ProfessorNotice";
import TimeSelect from "@/components/modal/TimeSelect";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useDateStore } from "@/store/dateStore";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { useToastStore } from "@/store/toastStore";
import { useUserStore } from "@/store/userStore";
import { InterviewCancelBody, InterviewUpdateBody } from "@/types/interview";
import { ProfessorAllowDate } from "@/types/user";
import { interviewApi } from "@/utils/api/interview";

/**
 * 면담 상태: 확인 요청 & 면담 확정(면담 시간 이전)
 */
const RequestInterviewView = () => {
  const MAX_REASON_LENGTH = 100;

  const userRole = useUserStore(state => state.role);
  const interviewInfo = useInterviewModalStore(state => state.interviewInfo);
  const selectedTime = useInterviewModalStore(state => state.selectedTime);
  const close = useInterviewModalStore(state => state.close);
  const professorAllowDateList = useDateStore(state => state.professorAllowDateList);
  const setToast = useToastStore(state => state.setToast);
  const setUpdateTarget = useDateStore(state => state.setUpdateTarget);
  const setProfessorAllowDateList = useDateStore(state => state.setProfessorAllowDateList);

  const [step, setStep] = useState(() => (userRole === UserRole.STUDENT ? 1 : 2));
  const [cancelReason, setCancelReason] = useState(""); // 면담 취소 사유

  const updateInterviewMutation = useMutation({
    mutationFn: async (data: InterviewUpdateBody) => {
      const result = await interviewApi.updateInterview(data);
      if (result) {
        setToast("면담 내용이 변경되었습니다.", "success");
        close();

        // 면담 목록 업데이트
        setUpdateTarget(
          userRole === UserRole.PROFESSOR ? "professorInterview" : "studentInterview"
        );
      }
      return result;
    },
  });

  // 학생 - 면담취소 요청
  const cancelInterviewMutation = useMutation({
    mutationFn: async (data: InterviewCancelBody) => {
      const result = await interviewApi.cancelInterview(data);
      if (result) {
        setToast("면담 취소 요청이 완료되었습니다.", "success");
        close();

        // 면담 목록 업데이트
        setUpdateTarget(
          userRole === UserRole.PROFESSOR ? "professorInterview" : "studentInterview"
        );
      }
      return result;
    },
  });

  // 교수 면담 가능 날짜 조회(학생 시점)
  useQuery<{ data: ProfessorAllowDate[] } | null, Error>({
    queryKey: ["professorAllowDateListForStudent", interviewInfo],
    queryFn: async () => {
      if (!interviewInfo?.interview_date) return null;
      const result = await interviewApi.getProfessorAllowDate(
        interviewInfo?.professor_id,
        interviewInfo?.interview_date,
        interviewInfo?.interview_date
      );
      setProfessorAllowDateList(result?.data || []);
      return result;
    },
    enabled: userRole === UserRole.STUDENT,
  });

  const handleStepChange = useCallback((step: number) => {
    setStep(step);
  }, []);

  const handleNextStep = useCallback(() => {
    handleStepChange(2);
  }, [handleStepChange]);

  // 면담 취소 사유 입력 중 취소
  const resetCancelReason = useCallback(() => {
    setStep(1);
    setCancelReason("");
  }, []);

  // 1단계 면담 날짜 포맷팅
  const formattedDate = useMemo(() => {
    return interviewInfo?.interview_date
      ? dayjs(interviewInfo.interview_date).format("YYYY년 MM월 DD일 dddd")
      : "";
  }, [interviewInfo?.interview_date]);

  // 선택된 면담 시간 포맷 설정
  const formattedSelectedTimeList = useMemo(() => {
    if (!interviewInfo?.interview_date) return [];
    const baseDate = dayjs(interviewInfo.interview_date).format("YYYY년 MM월 DD일 dddd");
    return selectedTime.map(time => `${baseDate} ${time}`);
  }, [selectedTime, interviewInfo?.interview_date]);

  // 면담 저장
  const handleSave = useCallback(() => {
    if (!interviewInfo?.interview_date || !interviewInfo?.interview_time) {
      setToast("면담 날짜와 시간을 선택해 주세요.", "error");
      return;
    }
    if (!interviewInfo?.interview_category) {
      setToast("면담 목적을 선택해 주세요.", "error");
      return;
    }
    if (!interviewInfo?.interview_content) {
      setToast("면담 내용을 입력해 주세요.", "error");
      return;
    }

    updateInterviewMutation.mutate({
      id: interviewInfo?.id ?? "",
      student_id: interviewInfo?.student_id ?? "",
      professor_id: interviewInfo?.professor_id ?? "",
      interview_date: interviewInfo?.interview_date ?? "",
      interview_time: interviewInfo?.interview_time ?? [],
      interview_category: interviewInfo?.interview_category ?? "",
      interview_content: interviewInfo?.interview_content ?? "",
      interview_state: InterviewStatus.REQUESTED, // 면담 상태를 업데이트하면 면담 신청 상태로 변경
    });
  }, [interviewInfo, updateInterviewMutation, setToast]);

  const handleCancelInterview = () => {
    if (!interviewInfo?.interview_date) {
      setToast("면담 정보를 찾을 수 없습니다.", "error");
      return;
    }
    if (!cancelReason) {
      setToast("면담 취소 사유를 입력해 주세요.", "error");
      return;
    }

    cancelInterviewMutation.mutate({
      id: interviewInfo?.id ?? "",
      student_id: interviewInfo?.student_id ?? "",
      professor_id: interviewInfo?.professor_id ?? "",
      interview_date: interviewInfo?.interview_date ?? "",
      interview_time: interviewInfo?.interview_time ?? [],
      interview_cancel_reason: cancelReason,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left text-2xl font-bold">{`${interviewInfo?.professor_name} 교수님 면담 변경`}</DialogTitle>
      </DialogHeader>

      {/* 면담 시간 선택 */}
      {step === 1 && (
        <div className="mt-4 p-1">
          <div>
            <div className="text-left text-sm font-bold">{formattedDate}</div>
            <p className="text-left text-sm">변경할 면담시간을 선택해주세요.</p>
          </div>
          <Separator className="!my-4" />
          <div className="mb-5 h-[300px] overflow-y-auto">
            <TimeSelect timeList={professorAllowDateList} />
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => handleStepChange(3)}>
              면담취소
            </Button>
            <Button disabled={!selectedTime.length} onClick={handleNextStep}>
              다음
            </Button>
          </div>
        </div>
      )}

      {/* 면담 신청 정보 확인 */}
      {step === 2 && (
        <div className="mt-4 max-h-[50vh] overflow-y-auto p-1">
          <InterviewInfoForm
            isBeforeInterviewDate
            interviewDatetimeList={formattedSelectedTimeList}
            interviewDatetimeGuideText="면담 신청 정보를 확인해주세요."
          />
          <div className="mt-2 mb-8">
            <ProfessorNotice
              notice={interviewInfo?.interview_guide ?? ""}
              guide={interviewInfo?.professor_notice ?? ""}
            />
          </div>
          {userRole === UserRole.STUDENT ? (
            <div className="flex justify-between gap-4">
              <Button onClick={() => handleStepChange(1)}>이전</Button>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => handleStepChange(3)}>
                  면담취소
                </Button>
                <Button onClick={handleSave}>저장</Button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button>저장</Button>
            </div>
          )}
        </div>
      )}

      {/* 면담 취소 사유 입력 */}
      {step === 3 && (
        <div className="mt-4 p-1">
          <div className="mb-1 text-left text-base font-bold">면담 취소 사유</div>
          <Textarea
            required
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
            placeholder="면담 취소 사유를 입력해주세요."
            maxLength={MAX_REASON_LENGTH}
            className="mb-4 w-full text-sm whitespace-pre-line"
          />
          <div className="flex justify-end gap-4">
            <Button onClick={handleCancelInterview}>저장</Button>
            <Button variant="outline" onClick={resetCancelReason}>
              취소
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(RequestInterviewView);
