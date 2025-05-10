"use client";

import dayjs from "dayjs";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import InterviewInfoForm from "@/components/modal/InterviewInfoForm";
import ProfessorNotice from "@/components/modal/ProfessorNotice";
import TimeSelect from "@/components/modal/TimeSelect";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { availableInterviewTime, professorCheckList, professorNotice } from "@/utils/data/mockData";

/**
 * 면담 상태: 확인 요청 & 면담 확정(면담 시간 이전)
 */
const RequestInterviewView = () => {
  const { interviewInfo, selectedTime } = useInterviewModalStore(
    useShallow(state => ({
      interviewInfo: state.interviewInfo,
      selectedTime: state.selectedTime,
    }))
  );

  const [step, setStep] = useState(1);
  const [cancelReason, setCancelReason] = useState(""); // 면담 취소 사유
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

  const handleCancelReasonChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCancelReason(e.target.value);
  }, []);

  const handleNextStep = useCallback(() => {
    handleStepChange(2);
    // TODO: 현재 선택된 시간을 interviewInfo에 반영, 이후 저장할 때 그대로 저장하기 위함
  }, [handleStepChange]);

  // 면담 취소 사유 입력 중 취소
  const resetCancelReason = useCallback(() => {
    setStep(1);
    setCancelReason("");
  }, []);

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
        <DialogTitle className="text-left text-2xl font-bold">{`${interviewInfo?.professor} 교수님 면담 변경`}</DialogTitle>
      </DialogHeader>

      {/* 면담 시간 선택 */}
      {step === 1 && (
        <div className="mt-4 p-1">
          <div>
            <div className="text-left text-sm font-bold">{formattedDate}</div>
            <p className="text-left text-sm">변경할 면담시간을 선택해주세요.</p>
          </div>
          <Separator className="!my-4" />
          <div className="mb-5 h-[300px] overflow-y-scroll">
            <TimeSelect timeList={timeInfoList} />
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
        <div className="mt-4 max-h-[50vh] overflow-y-scroll p-1">
          <InterviewInfoForm
            isBeforeInterviewDate
            interviewDatetimeList={formattedSelectedTimeList}
            interviewDatetimeGuideText="면담 신청 정보를 확인해주세요."
          />
          <div className="mt-2 mb-8">
            <ProfessorNotice notice={professorNotice} checklist={professorCheckList} />
          </div>
          <div className="flex justify-between gap-4">
            <Button onClick={() => handleStepChange(1)}>이전</Button>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => handleStepChange(3)}>
                면담취소
              </Button>
              <Button>저장</Button>
            </div>
          </div>
        </div>
      )}

      {/* 면담 취소 사유 입력 */}
      {step === 3 && (
        <div className="mt-4 p-1">
          <div className="mb-1 text-left text-base font-bold">면담 취소 사유</div>
          <input
            type="text"
            required
            value={cancelReason}
            onChange={handleCancelReasonChange}
            placeholder="면담 취소 사유를 입력해주세요."
            className="mb-4 w-full rounded-md border border-[#c6b9b1] px-2 py-1.5 text-sm"
          />
          <div className="flex justify-end gap-4">
            <Button>저장</Button>
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
