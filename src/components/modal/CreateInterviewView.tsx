"use client";

import dayjs from "dayjs";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { UserRole } from "@/common/const";
import InterviewInfoForm from "@/components/modal/InterviewInfoForm";
import ProfessorNotice from "@/components/modal/ProfessorNotice";
import TimeSelect from "@/components/modal/TimeSelect";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { useUserStore } from "@/store/userStore";
import { availableInterviewTime, professorCheckList, professorNotice } from "@/utils/data/mockData";

/**
 * 면담 신청 모달(확정 요청 모달과 거의 동일함)
 */
const CreateInterviewView = () => {
  const userRole = useUserStore(state => state.role);
  const { interviewInfo, selectedTime } = useInterviewModalStore(
    useShallow(state => ({
      interviewInfo: state.interviewInfo,
      selectedTime: state.selectedTime,
    }))
  );

  const [step, setStep] = useState(() => (userRole === UserRole.STUDENT ? 1 : 2));
  const [timeInfoList, setTimeInfoList] = useState(() => availableInterviewTime); // TODO: 최초 로드 시 interviewInfo.date의 교수 면담 가능 시간 불러오기

  // 기존 timeInfoList 기준으로, selectedTime에 포함된 시간의 type을 interview로 변경
  // interview 타입이었는데 selectedTime에 포함되지 않으면 available로 변경
  useEffect(() => {
    setTimeInfoList(prev => {
      return prev.map(time => {
        const isSelected = selectedTime.includes(time.time);

        if (isSelected) {
          // 현재 유저에 의해 클릭된 시간이면 interview
          return { ...time, type: "interview" };
        }

        if (time.type === "interview") {
          // 이전에 interview였는데 선택이 해제되면 available로 되돌림
          return { ...time, type: "available" };
        }

        // 나머지는 그대로 유지
        return time;
      });
    });
  }, [selectedTime]);

  const handleStepChange = useCallback((step: number) => {
    setStep(step);
  }, []);

  const handleNextStep = useCallback(() => {
    handleStepChange(2);
    // TODO: 현재 선택된 시간을 interviewInfo에 반영, 이후 저장할 때 그대로 저장하기 위함
  }, [handleStepChange]);

  // 1단계 면담 날짜 포맷팅
  const formattedDate = useMemo(() => {
    return interviewInfo?.date ? dayjs(interviewInfo.date).format("YYYY년 MM월 DD일 dddd") : "";
  }, [interviewInfo?.date]);

  // 선택된 면담 시간 포맷 설정
  const formattedSelectedTimeList = useMemo(() => {
    if (!interviewInfo?.date) return [];
    const baseDate = dayjs(interviewInfo.date).format("YYYY년 MM월 DD일 dddd");
    return selectedTime.map(time => `${baseDate} ${time}`);
  }, [selectedTime, interviewInfo?.date]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left text-2xl font-bold">{`${interviewInfo?.professor} 교수님 면담 신청`}</DialogTitle>
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
            <TimeSelect timeList={timeInfoList} />
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
            interviewDatetimeGuideText="면담 신청 정보를 확인해주세요."
          />
          <div className="mt-2 mb-8">
            <ProfessorNotice notice={professorNotice} checklist={professorCheckList} />
          </div>

          <div className="flex justify-end">
            <Button>저장</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(CreateInterviewView);
