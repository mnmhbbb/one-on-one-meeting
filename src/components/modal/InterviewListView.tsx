"use client";

import dayjs from "dayjs";
import { memo, useEffect, useMemo } from "react";

import { INTERVIEW_MODAL_TYPE, UserRole } from "@/common/const";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { useUserStore } from "@/store/userStore";

/**
 * 면담 목록 조회 모달
 * 학생용: 선택한 교수님의 선택 날짜의 면담 목록 조회
 * 교수용: 선택 날짜의 일정 + 면담 목록 조회
 */
const InterviewListView = () => {
  const interviewInfo = useInterviewModalStore(state => state.interviewInfo);
  const userId = useUserStore(state => state.userInfo?.id);
  const userRole = useUserStore(state => state.role);
  const openInterviewModal = useInterviewModalStore(state => state.open);

  // TODO:
  useEffect(() => {
    if (userRole === UserRole.STUDENT) {
      // userId의 interviewInfo.date의 interviewInfo?.professor 면담 목록 api 호출
      return;
    }

    if (userRole === UserRole.PROFESSOR) {
      // interviewInfo.date의 일정 api 호출 조회
      return;
    }
  }, [userRole]);

  const formattedDate = useMemo(() => {
    return interviewInfo?.date ? dayjs(interviewInfo.date).format("YYYY년 MM월 DD일 dddd") : "";
  }, [interviewInfo?.date]);

  const openCreateInterviewModal = () => {
    openInterviewModal("", INTERVIEW_MODAL_TYPE.CREATE);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left text-2xl font-bold">OOO님 교수님 면담 조회</DialogTitle>
      </DialogHeader>
      <div className="mt-4 p-1">
        <div className="flex items-center justify-between">
          <div className="text-left text-sm font-bold">{formattedDate}</div>
          <Button onClick={openCreateInterviewModal} size="sm">
            새 면담 등록하기
          </Button>
        </div>
        <Separator className="!my-4" />
        {/* TODO: 면담 데이터 목록 출력 */}
        {/* TODO: 클릭하면 해당 면담 type 모달 오픈 */}
      </div>
    </>
  );
};

export default memo(InterviewListView);
