"use client";

import { lazy, Suspense, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { INTERVIEW_MODAL_TYPE, InterviewModalType } from "@/common/const";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { EVENTS } from "@/utils/data/mockData";

// Lazy load components
const RequestInterviewView = lazy(() => import("@/components/modal/RequestInterviewView"));
const RejectInterviewView = lazy(() => import("@/components/modal/RejectInterviewView"));
const CancelInterviewView = lazy(() => import("@/components/modal/CancelInterviewView"));
const ConfirmInterviewView = lazy(() => import("@/components/modal/ConfirmInterviewView"));
const RecordedInterviewView = lazy(() => import("@/components/modal/RecordedInterviewView"));
const CreateInterviewView = lazy(() => import("@/components/modal/CreateInterviewView"));
const InterviewListView = lazy(() => import("@/components/modal/InterviewListView"));

export const InterviewModal = () => {
  const { isOpen, type, close, interviewId, setInterviewInfo } = useInterviewModalStore(
    useShallow(state => ({
      isOpen: state.isOpen,
      type: state.type,
      close: state.close,
      interviewId: state.interviewId,
      setInterviewInfo: state.setInterviewInfo,
    }))
  );

  // 임시
  const isLoading = false;

  useEffect(() => {
    const interview = EVENTS.find(event => event.id === interviewId);
    if (interview) {
      setInterviewInfo(interview);
    }
  }, [interviewId, setInterviewInfo]);

  // TODO: 면담 id를 토대로 해당 면담 정보 api 호출하여 intervieModalStore에 저장하기, isLoading도 여기에서 한번에 처리.
  // const { data, isLoading } = useQuery({
  //   queryKey: ["interview", interviewId],
  //   queryFn: () => fetchInterviewDetails(interviewId!), // 비동기 요청
  //   enabled: isOpen && !!interviewId,
  // });

  const modalViewMap = {
    [INTERVIEW_MODAL_TYPE.REQUESTED]: RequestInterviewView,
    [INTERVIEW_MODAL_TYPE.REJECTED]: RejectInterviewView,
    [INTERVIEW_MODAL_TYPE.CANCELLED]: CancelInterviewView,
    [INTERVIEW_MODAL_TYPE.CONFIRMED]: ConfirmInterviewView, // 미사용
    [INTERVIEW_MODAL_TYPE.RECORDED]: RecordedInterviewView,
    [INTERVIEW_MODAL_TYPE.CREATE]: CreateInterviewView,
    [INTERVIEW_MODAL_TYPE.LIST]: InterviewListView,
  } satisfies Record<InterviewModalType, React.ComponentType>;

  // 면담 모달 타입에 따라 모달 뷰 컴포넌트 적용
  const ModalView = useMemo(() => {
    if (!type) return null;

    // '면담 확정'의 경우, 현재 일시 - 면담 일시 > 0 ? RECORDED : REQUESTED
    if (type === INTERVIEW_MODAL_TYPE.CONFIRMED) {
      const interview = EVENTS.find(event => event.id === interviewId);
      if (!interview) return null;

      const now = new Date();
      const interviewDateTime = new Date(
        `${interview.date.split(" ")[0]}T${interview.date.split(" ")[1]}`
      );
      console.log(now, interviewDateTime);

      return now > interviewDateTime ? RecordedInterviewView : RequestInterviewView;
    }

    return modalViewMap[type];
  }, [type, interviewId, modalViewMap]);

  if (!isOpen || !type) return null; // 모달이 열려있지 않거나 타입이 없으면 렌더링 하지 않음

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="text-primary">
        {!isLoading && (
          <DialogHeader>
            <DialogTitle>
              <Suspense fallback={<div>로딩 중...</div>}>{ModalView && <ModalView />}</Suspense>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
};
