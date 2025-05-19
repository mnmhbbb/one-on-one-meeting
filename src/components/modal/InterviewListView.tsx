"use client";

import dayjs from "dayjs";
import { memo, useEffect, useMemo, useState } from "react";

import {
  INTERVIEW_MODAL_TYPE,
  InterviewModalType,
  InterviewStatus,
  UserRole,
} from "@/common/const";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useDateStore } from "@/store/dateStore";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { useProfessorsStore } from "@/store/professorsStore";
import { useUserStore } from "@/store/userStore";
import { InterviewInfo } from "@/types/interview";

import StatusBadge from "../StatusBadge";

/**
 * 면담 목록 조회 모달
 * 학생용: 선택한 교수님의 선택 날짜의 면담 목록 조회
 * 교수용: 선택 날짜의 일정 + 면담 목록 조회
 */
const InterviewListView = () => {
  const interviewInfo = useInterviewModalStore(state => state.interviewInfo);
  const userRole = useUserStore(state => state.role);
  const openInterviewModal = useInterviewModalStore(state => state.open);
  const interviewList = useDateStore(state => state.interviewList);
  const selectedProfessor = useProfessorsStore(state => state.selectedProfessor);

  const [studentInterviewList, setStudentInterviewList] = useState<InterviewInfo[]>([]);
  const [professorInterviewList, setProfessorInterviewList] = useState<InterviewInfo[]>([]);

  useEffect(() => {
    if (userRole === UserRole.STUDENT) {
      const filteredInterviewList = interviewList.filter(
        interview => interview.interview_date === interviewInfo?.interview_date
      );
      setStudentInterviewList(filteredInterviewList);
      return;
    }

    if (userRole === UserRole.PROFESSOR) {
      const filteredInterviewList = interviewList.filter(
        interview => interview.interview_date === interviewInfo?.interview_date
      );
      setProfessorInterviewList(filteredInterviewList);
      return;
    }
  }, [userRole, interviewInfo, interviewList]);

  const formattedDate = useMemo(() => {
    return interviewInfo?.interview_date
      ? dayjs(interviewInfo.interview_date).format("YYYY년 MM월 DD일 dddd")
      : "";
  }, [interviewInfo]);

  // 새 면담 등록하기
  const openCreateInterviewModal = () => {
    openInterviewModal(null, INTERVIEW_MODAL_TYPE.CREATE);
  };

  // 면담 클릭: 면담 모달 오픈
  const handleClickInterview = (interview: InterviewInfo) => () => {
    openInterviewModal(interview, interview.interview_state as InterviewModalType);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left text-2xl font-bold">
          {selectedProfessor?.name}님 교수님 면담 조회
        </DialogTitle>
      </DialogHeader>
      <div className="mt-4 p-1">
        <div className="flex items-center justify-between">
          <div className="text-left text-sm font-bold">{formattedDate}</div>
          <Button onClick={openCreateInterviewModal} size="sm">
            새 면담 등록하기
          </Button>
        </div>
        <Separator className="!my-4" />

        {userRole === UserRole.STUDENT &&
          studentInterviewList.map(interview => (
            <div
              key={interview.id}
              className="mb-3 flex w-full cursor-pointer items-center justify-around rounded-xl bg-gray-50 p-4 shadow-sm hover:opacity-80"
              role="button"
              onClick={handleClickInterview(interview)}
            >
              <div className="flex flex-col items-center gap-2">
                <StatusBadge status={interview.interview_state as InterviewStatus} />
                <div>
                  {interview.interview_time.map(time => (
                    <div className="text-sm font-bold text-stone-600" key={time}>
                      {time}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 text-base">
                <div>{interview.professor_name} 교수님</div>
                <div>{selectedProfessor?.college}</div>
              </div>
            </div>
          ))}

        {/* 교수 일정 목록 */}
      </div>
    </>
  );
};

export default memo(InterviewListView);
