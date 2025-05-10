"use client";

import dayjs from "dayjs";
import { memo, useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { InterviewStatus, STATUS_COLORS, STATUS_LABELS } from "@/common/const";
import InterviewInfoForm from "@/components/modal/InterviewInfoForm";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useInterviewModalStore } from "@/store/interviewModalStore";

import { Textarea } from "../ui/textarea";

const RecordedInterviewView = () => {
  const { interviewInfo } = useInterviewModalStore(
    useShallow(state => ({
      interviewInfo: state.interviewInfo,
    }))
  );

  const [step, setStep] = useState(1);
  const [memo, setMemo] = useState(interviewInfo?.memo ?? "");

  const handleStepChange = useCallback((step: number) => {
    setStep(step);
  }, []);

  const headerText = useMemo(() => {
    return step === 1
      ? `${interviewInfo?.professor} 교수님 면담 완료`
      : `${interviewInfo?.professor} 교수님 면담 기록내용`;
  }, [interviewInfo?.professor, step]);

  const formattedInterviewDatetimeList = useMemo(() => {
    if (!interviewInfo?.date) return [];

    const [dateStr, timeRange] = interviewInfo?.date.split(" ");
    const baseDate = dayjs(dateStr).format("YYYY년 MM월 DD일 dddd");
    const formattedDate = `${baseDate} ${timeRange}`;

    return [formattedDate];
  }, [interviewInfo?.date]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left text-2xl font-bold">{headerText}</DialogTitle>
      </DialogHeader>

      {/* 면담 신청 정보 확인 */}
      {step === 1 && (
        <div className="mt-4 max-h-[50vh] overflow-y-scroll p-1">
          <InterviewInfoForm interviewDatetimeList={formattedInterviewDatetimeList} />
          <div className="flex justify-end">
            <Button onClick={() => handleStepChange(2)}>다음</Button>
          </div>
        </div>
      )}

      {/* 면담 기록 입력 */}
      {step === 2 && (
        <div className="mt-4 max-h-[50vh] overflow-y-scroll p-1">
          <div>
            {formattedInterviewDatetimeList.map(time => (
              <div key={time} className="text-left text-sm font-bold">
                {time}
              </div>
            ))}
            <p className="text-left text-sm">{`${interviewInfo?.professor} 교수님과의 면담을 기록해 보세요!`}</p>
          </div>
          <Separator className="!my-4" />
          <div
            className={`text-primary mb-2 w-fit rounded-lg px-3 py-1 text-sm ${STATUS_COLORS[interviewInfo?.status as InterviewStatus]}`}
          >
            {STATUS_LABELS[interviewInfo?.status as InterviewStatus]}
          </div>
          <Textarea
            placeholder="면담 기록 내용을 입력해 주세요."
            className="!placeholder:text-white bg-primary mb-8 w-full p-3 text-left text-sm whitespace-pre-line text-white"
            value={memo}
            onChange={e => setMemo(e.target.value)}
          />

          <div className="flex justify-between gap-4">
            <Button variant="outline" onClick={() => handleStepChange(1)}>
              이전
            </Button>
            <Button>저장</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(RecordedInterviewView);
