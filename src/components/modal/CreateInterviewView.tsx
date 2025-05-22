"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { memo, useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { InterviewStatus, UserRole } from "@/common/const";
import InterviewInfoForm from "@/components/modal/InterviewInfoForm";
import ProfessorNotice from "@/components/modal/ProfessorNotice";
import TimeSelect from "@/components/modal/TimeSelect";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useDateStore } from "@/store/dateStore";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { useProfessorsStore } from "@/store/professorsStore";
import { useToastStore } from "@/store/toastStore";
import { useUserStore } from "@/store/userStore";
import { InterviewCreateBody } from "@/types/interview";
import { interviewApi } from "@/utils/api/interview";

/**
 * 면담 신청 모달(확정 요청 모달과 거의 동일함)
 */
const CreateInterviewView = () => {
  const userRole = useUserStore(state => state.role);
  const userId = useUserStore(state => state.userInfo?.id ?? "");
  const selectedProfessor = useProfessorsStore(state => state.selectedProfessor);
  const { interviewInfo, selectedTime, close } = useInterviewModalStore(
    useShallow(state => ({
      interviewInfo: state.interviewInfo,
      selectedTime: state.selectedTime,
      close: state.close,
    }))
  );
  const professorAllowDateList = useDateStore(state => state.professorAllowDateList);
  const setUpdateTarget = useDateStore(state => state.setUpdateTarget);

  const [step, setStep] = useState(() => (userRole === UserRole.STUDENT ? 1 : 2));

  const setToast = useToastStore(state => state.setToast);

  // 면담 신청 가이드 불러오기
  const { data: guideData } = useQuery({
    queryKey: ["interviewGuide"],
    queryFn: () => interviewApi.getInterviewGuide(),
  });

  const createInterviewMutation = useMutation({
    mutationFn: async (data: InterviewCreateBody) => {
      const result = await interviewApi.createInterview(data);
      if (result) {
        setToast("면담이 성공적으로 신청되었습니다.", "success");
        close();

        // 면담 목록, 면담 가능 시간 업데이트
        setUpdateTarget(
          userRole === UserRole.PROFESSOR ? "professorInterviewList" : "studentInterviewList"
        );
      }
      return result;
    },
  });

  const handleStepChange = useCallback((step: number) => {
    setStep(step);
  }, []);

  const handleNextStep = useCallback(() => {
    handleStepChange(2);
  }, [handleStepChange]);

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

    createInterviewMutation.mutate({
      student_id: userId,
      professor_id: selectedProfessor?.id ?? "",
      interview_date: interviewInfo?.interview_date ?? "",
      interview_time: interviewInfo?.interview_time ?? [],
      interview_category: interviewInfo?.interview_category ?? "",
      interview_content: interviewInfo?.interview_content ?? "",
      interview_state: InterviewStatus.REQUESTED,
    });
  }, [interviewInfo, selectedProfessor, userId, createInterviewMutation, setToast]);

  const formatProfessorInfo = () => {
    return `- 이메일: ${selectedProfessor?.notification_email}\n- 면담 위치: ${selectedProfessor?.interview_location}`;
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left text-2xl font-bold">{`${selectedProfessor?.name} 교수님 면담 신청`}</DialogTitle>
      </DialogHeader>

      {/* 면담 시간 선택 */}
      {step === 1 && (
        <div className="mt-4 p-1">
          <div>
            <div className="text-left text-sm font-bold">{formattedDate}</div>
            <p className="text-left text-sm">면담시간을 선택해주세요.</p>
          </div>
          <Separator className="!my-4" />
          <div className="mb-5 h-[300px] overflow-y-auto">
            <TimeSelect timeList={professorAllowDateList} />
          </div>
          <div className="flex justify-end gap-4">
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
          />
          <div className="mt-2 mb-8">
            <ProfessorNotice
              professorInfo={formatProfessorInfo() || ""}
              notice={selectedProfessor?.notice_content || ""}
              guide={guideData?.data[0]?.guide_content || ""}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={createInterviewMutation.isPending}>
              {createInterviewMutation.isPending ? "저장 중..." : "저장"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(CreateInterviewView);
