"use client";

import dayjs from "dayjs";
import { memo, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { InterviewStatus, STATUS_LABELS } from "@/common/const";
import InterviewInfoForm from "@/components/modal/InterviewInfoForm";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { professorCheckList, professorNotice } from "@/utils/data/mockData";

import ProfessorNotice from "./ProfessorNotice";

const RejectInterviewView = () => {
  const close = useInterviewModalStore(state => state.close);
  const { interviewInfo } = useInterviewModalStore(
    useShallow(state => ({
      interviewInfo: state.interviewInfo,
    }))
  );

  const headerText = useMemo(() => {
    return `${interviewInfo?.professor} 교수님 ${STATUS_LABELS[interviewInfo?.status as InterviewStatus]}`;
  }, [interviewInfo?.professor, interviewInfo?.status]);

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

      <div className="mt-4 max-h-[50vh] overflow-y-scroll p-1">
        <InterviewInfoForm interviewDatetimeList={formattedInterviewDatetimeList} />
        <ProfessorNotice notice={professorNotice} checklist={professorCheckList} />
        <div className="mt-5 flex justify-end">
          <Button onClick={close}>닫기</Button>
        </div>
      </div>
    </>
  );
};

export default memo(RejectInterviewView);
