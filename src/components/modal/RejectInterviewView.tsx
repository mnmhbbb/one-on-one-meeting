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
    if (!interviewInfo?.interview_date) return [];

    const baseDate = dayjs(interviewInfo?.interview_date).format("YYYY년 MM월 DD일 dddd");
    return interviewInfo?.interview_time.map(time => `${baseDate} ${time}`);
  }, [interviewInfo?.interview_date, interviewInfo?.interview_time]);

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left text-2xl font-bold">{headerText}</DialogTitle>
      </DialogHeader>

      <div className="mt-4 max-h-[50vh] overflow-y-auto p-1">
        <InterviewInfoForm interviewDatetimeList={formattedInterviewDatetimeList} />
        <ProfessorNotice
          notice={interviewInfo?.notice_content || ""}
          guide={interviewInfo?.notice_content || ""}
        />
        <div className="mt-5 flex justify-end">
          <Button onClick={close}>닫기</Button>
        </div>
      </div>
    </>
  );
};

export default memo(RejectInterviewView);
