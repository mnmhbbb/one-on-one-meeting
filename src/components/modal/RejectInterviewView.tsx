"use client";

import dayjs from "dayjs";
import { memo, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { InterviewStatus, STATUS_LABELS } from "@/common/const";
import InterviewInfoForm from "@/components/modal/InterviewInfoForm";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInterviewModalStore } from "@/store/interviewModalStore";

import ProfessorNotice from "./ProfessorNotice";

const RejectInterviewView = () => {
  const close = useInterviewModalStore(state => state.close);
  const { interviewInfo } = useInterviewModalStore(
    useShallow(state => ({
      interviewInfo: state.interviewInfo,
    }))
  );

  const headerText = useMemo(() => {
    return `${interviewInfo?.professor_name} 교수님 ${STATUS_LABELS[interviewInfo?.interview_state as InterviewStatus]}`;
  }, [interviewInfo?.professor_name, interviewInfo?.interview_state]);

  const formattedInterviewDatetimeList = useMemo(() => {
    if (!interviewInfo?.interview_date || !interviewInfo?.interview_time) return [];

    return interviewInfo.interview_time.map(time => {
      const [startTime] = time.split(" - ");
      return `${interviewInfo.interview_date} ${startTime}`;
    });
  }, [interviewInfo]);

  // 면담 일시 현재와 비교해서 이전인지 여부
  const isBeforeInterviewDate = useMemo(() => {
    if (!interviewInfo?.interview_date || !interviewInfo?.interview_time?.length) return false;

    const now = dayjs();
    const interviewDateTime = dayjs(
      `${interviewInfo.interview_date} ${interviewInfo.interview_time[0].split(" - ")[0]}`
    );

    return now.isBefore(interviewDateTime);
  }, [interviewInfo]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left text-2xl font-bold">{headerText}</DialogTitle>
      </DialogHeader>

      <div className="mt-4 max-h-[50vh] overflow-y-auto p-1">
        <InterviewInfoForm
          interviewDatetimeList={formattedInterviewDatetimeList}
          isBeforeInterviewDate={isBeforeInterviewDate}
        />
        <ProfessorNotice
          notice={interviewInfo?.notice_content || ""}
          guide={interviewInfo?.guide_content || ""}
        />
        <div className="mt-5 flex justify-end">
          <Button onClick={close}>닫기</Button>
        </div>
      </div>
    </>
  );
};

export default memo(RejectInterviewView);
