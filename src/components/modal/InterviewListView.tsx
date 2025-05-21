"use client";

import clsx from "clsx";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { memo, useEffect, useMemo, useState } from "react";

import { STATUS_COLORS, TIMES } from "@/common/const";
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
import { DEFAULT_INTERVIEW_INFO, InterviewInfo } from "@/types/interview";
import { ProfessorAllowDate } from "@/types/user";

import StatusBadgeSmall from "../StatusBadgeSmall";

/**
 * 면담 목록 조회 모달
 * 학생용: 선택한 교수님의 선택 날짜의 면담 목록 조회
 * 교수용: 선택 날짜의 교수 일정(면담 신청 가능 여부) + 면담 목록 조회
 */
const InterviewListView = () => {
  const router = useRouter();

  const interviewInfo = useInterviewModalStore(state => state.interviewInfo);
  const userRole = useUserStore(state => state.role);
  const userInfo = useUserStore(state => state.userInfo);
  const openInterviewModal = useInterviewModalStore(state => state.open);
  const interviewList = useDateStore(state => state.interviewList);
  const professorAllowDateList = useDateStore(state => state.professorAllowDateList);
  const selectedProfessor = useProfessorsStore(state => state.selectedProfessor);
  const setInterviewInfo = useInterviewModalStore(state => state.setInterviewInfo);

  const [studentInterviewList, setStudentInterviewList] = useState<InterviewInfo[]>([]);
  const [professorInterviewList, setProfessorInterviewList] = useState<InterviewInfo[]>([]);
  const [filteredProfessorAllowDateList, setFilteredProfessorAllowDateList] = useState<
    ProfessorAllowDate[]
  >([]);

  useEffect(() => {
    // 학생 유저: 선택한 날짜와 일치하는 면담 데이터 세팅
    if (userRole === UserRole.STUDENT) {
      const filteredInterviewList = interviewList.filter(
        interview => interview.interview_date === interviewInfo?.interview_date
      );
      setStudentInterviewList(filteredInterviewList);
      return;
    }

    // 교수 유저: 선택한 날짜와 일치하는 면담 데이터 & 선택한 날짜의 면담 가능 시간 세팅
    if (userRole === UserRole.PROFESSOR) {
      const filteredInterviewList = interviewList.filter(
        interview => interview.interview_date === interviewInfo?.interview_date
      );
      const filteredProfessorAllowDateList = professorAllowDateList.filter(
        interview => interview.allow_date === interviewInfo?.interview_date
      );
      setProfessorInterviewList(filteredInterviewList);
      setFilteredProfessorAllowDateList(filteredProfessorAllowDateList);
      return;
    }
  }, [userRole, interviewInfo, interviewList, professorAllowDateList]);

  const formattedDate = useMemo(() => {
    return interviewInfo?.interview_date
      ? dayjs(interviewInfo.interview_date).format("YYYY년 MM월 DD일 dddd")
      : "";
  }, [interviewInfo]);

  const titleName = useMemo(() => {
    return userRole === UserRole.STUDENT ? selectedProfessor?.name : userInfo?.name;
  }, [userRole, selectedProfessor, userInfo]);

  // 새 면담 등록하기
  const openCreateInterviewModal = () => {
    openInterviewModal(null, INTERVIEW_MODAL_TYPE.CREATE);
    setInterviewInfo({
      ...DEFAULT_INTERVIEW_INFO,
      // 면담 날짜 전달하여 모달 내에서 해당 날짜의 교수 면담 가능 날짜 표시
      interview_date: interviewInfo?.interview_date || "",
    });
  };

  // 면담 클릭: 면담 모달 오픈
  const handleClickInterview = (interview: InterviewInfo) => () => {
    openInterviewModal(interview, interview.interview_state as InterviewModalType);
  };

  // 교수 일정 클릭: 면담을 클릭한 경우 신청 현황, 그 외는 일정 관리 페이지로 이동
  const handleClickProfessorSchedule = (interview?: InterviewInfo) => () => {
    if (interview) {
      router.push(`/professor/interview-requests?tab=day&date=${interview.interview_date}`);
    } else {
      router.push(`/professor/schedule`);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left text-2xl font-bold">
          {titleName} 교수님 면담 조회
        </DialogTitle>
      </DialogHeader>
      <div className="mt-4 p-1">
        <div className="flex items-center justify-between">
          <div className="text-left text-sm font-bold">{formattedDate}</div>
          {userRole === UserRole.STUDENT && (
            <Button onClick={openCreateInterviewModal} size="sm">
              새 면담 등록하기
            </Button>
          )}
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
                <StatusBadgeSmall status={interview.interview_state as InterviewStatus} />
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
        {userRole === UserRole.PROFESSOR && (
          <div className="grid grid-cols-2 gap-2">
            {TIMES.map(time => {
              // 1. 교수 허용 시간 정보
              const allowTime = filteredProfessorAllowDateList[0]?.allow_time || [];
              const isAvailable = allowTime.includes(time);

              // 2. 이미 신청된 면담 정보
              const interview = professorInterviewList.find(i => i.interview_time.includes(time));
              const status = interview?.interview_state as InterviewStatus | undefined;

              // 3. 상태별 스타일
              const baseClass =
                "h-12 rounded-md border text-sm font-semibold flex flex-col items-center justify-center";
              const disabledClass = "border-gray-50 bg-gray-200 text-gray-400";
              const availableClass = "bg-white border-gray-300 text-black";
              const statusClass = STATUS_COLORS[status as InterviewStatus];

              return (
                <div
                  role="button"
                  onClick={handleClickProfessorSchedule(interview)}
                  key={time}
                  className={clsx(
                    baseClass,
                    !isAvailable && disabledClass, // 면담 가능 시간이 아니면 비활성화 스타일
                    isAvailable && !interview && availableClass, // 면담 가능 시간이면서 면담 없으면 활성화 스타일
                    interview && statusClass // 면담 있으면 면담 상태 컬러 적용
                  )}
                >
                  {interview && <StatusBadgeSmall status={status as InterviewStatus} />}
                  {time}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default memo(InterviewListView);
