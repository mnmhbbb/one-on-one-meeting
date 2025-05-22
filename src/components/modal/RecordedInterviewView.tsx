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
import ProfessorNotice from "./ProfessorNotice";

const RecordedInterviewView = () => {
  const { interviewInfo } = useInterviewModalStore(
    useShallow(state => ({
      interviewInfo: state.interviewInfo,
    }))
  );

  const [step, setStep] = useState(1);
  const [memo, setMemo] = useState(interviewInfo?.interview_record ?? "");

  const handleStepChange = useCallback((step: number) => {
    setStep(step);
  }, []);

  const headerText = useMemo(() => {
    return step === 1
      ? `${interviewInfo?.professor_name} 교수님 면담 완료`
      : `${interviewInfo?.professor_name} 교수님 면담 기록내용`;
  }, [interviewInfo?.professor_name, step]);

  const formattedInterviewDatetimeList = useMemo(() => {
    if (!interviewInfo?.interview_date) return [];

    const baseDate = dayjs(interviewInfo?.interview_date).format("YYYY년 MM월 DD일 dddd");
    return interviewInfo?.interview_time.map(time => `${baseDate} ${time}`);
  }, [interviewInfo?.interview_date, interviewInfo?.interview_time]);

  const formatProfessorInfo = () => {
    return `- 이메일: ${interviewInfo?.professor_notification_email}\n- 면담 위치: ${interviewInfo?.professor_interview_location}`;
  };
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left text-2xl font-bold">{headerText}</DialogTitle>
      </DialogHeader>

      {/* 면담 신청 정보 확인 */}
      {step === 1 && (
        <div className="mt-4 max-h-[50vh] overflow-y-auto p-1">
          <InterviewInfoForm interviewDatetimeList={formattedInterviewDatetimeList} />
          <div className="mt-2 mb-8">
            <ProfessorNotice
              professorInfo={formatProfessorInfo() || ""}
              notice={interviewInfo?.notice_content || ""}
              guide={interviewInfo?.guide_content || ""}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => handleStepChange(2)}>다음</Button>
          </div>
        </div>
      )}

      {/* 면담 기록 입력 */}
      {step === 2 && (
        <div className="mt-4 max-h-[50vh] overflow-y-auto p-1">
          <div>
            {formattedInterviewDatetimeList.map(time => (
              <div key={time} className="text-left text-sm font-bold">
                {time}
              </div>
            ))}
            <p className="text-left text-sm">{`${interviewInfo?.professor_name} 교수님과의 면담을 기록해 보세요!`}</p>
          </div>
          <Separator className="!my-4" />
          <div
            className={`text-primary mb-2 w-fit rounded-lg px-3 py-1 text-sm ${STATUS_COLORS[interviewInfo?.interview_state as InterviewStatus]}`}
          >
            {STATUS_LABELS[interviewInfo?.interview_state as InterviewStatus]}
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
