"use client";

import { lazy, memo, Suspense, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { INTERVIEW_MODAL_TYPE, InterviewModalType, InterviewStatus } from "@/common/const";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInterviewModalStore } from "@/store/interviewModalStore";

// Lazy load components
const RequestInterviewView = lazy(() => import("@/components/modal/RequestInterviewView"));
const RejectInterviewView = lazy(() => import("@/components/modal/RejectInterviewView"));
const RecordedInterviewView = lazy(() => import("@/components/modal/RecordedInterviewView"));
const CreateInterviewView = lazy(() => import("@/components/modal/CreateInterviewView"));
const InterviewListView = lazy(() => import("@/components/modal/InterviewListView"));
const RejectionReason = lazy(() => import("@/components/modal/RejectionReason"));

export const InterviewModal = () => {
  const { isOpen, type, close, interviewInfo } = useInterviewModalStore(
    useShallow(state => ({
      isOpen: state.isOpen,
      type: state.type,
      close: state.close,
      interviewInfo: state.interviewInfo,
      setInterviewInfo: state.setInterviewInfo,
    }))
  );

  // 임시
  const isLoading = false;

  const modalViewMap = {
    [INTERVIEW_MODAL_TYPE.REQUESTED]: RequestInterviewView,
    [INTERVIEW_MODAL_TYPE.REJECTED]: RejectInterviewView,
    [INTERVIEW_MODAL_TYPE.CANCELLED]: RejectInterviewView, // reject랑 동일 컴포넌트(interviewModalStore에서 interviewInfo.status로 워딩 분기처리하기)
    [INTERVIEW_MODAL_TYPE.CONFIRMED]: () => <></>, // 아래에서 분기처리 하기 떄문에 빈 컴포넌트
    [INTERVIEW_MODAL_TYPE.RECORDED]: RecordedInterviewView,
    [INTERVIEW_MODAL_TYPE.CREATE]: CreateInterviewView,
    [INTERVIEW_MODAL_TYPE.LIST]: InterviewListView,
    [INTERVIEW_MODAL_TYPE.REJECTION_REASON]: RejectionReason,
  } satisfies Record<InterviewModalType, React.ComponentType>;

  // 면담 모달 타입에 따라 모달 뷰 컴포넌트 적용
  const ModalView = useMemo(() => {
    if (!type || !interviewInfo) return null;

    // '면담 확정'의 경우, 현재 일시 - 면담 일시 > 0 ? RECORDED : REQUESTED
    if (type === INTERVIEW_MODAL_TYPE.CONFIRMED) {
      if (!interviewInfo) return null;

      const now = new Date();
      const [startTime] = interviewInfo.interview_time[0].split(" - ");
      const interviewDateTime = new Date(`${interviewInfo.interview_date}T${startTime}`);
      return now > interviewDateTime ? RecordedInterviewView : RequestInterviewView;
    }

    // 상태가 바뀐 경우에도 View 교체
    if (type === INTERVIEW_MODAL_TYPE.REJECTED) {
      if (interviewInfo.interview_state === InterviewStatus.CONFIRMED) {
        const now = new Date();
        const [startTime] = interviewInfo.interview_time[0].split(" - ");
        const interviewDateTime = new Date(`${interviewInfo.interview_date}T${startTime}`);
        return now > interviewDateTime ? RecordedInterviewView : RequestInterviewView;
      }
    }
    return modalViewMap[type];
  }, [type, interviewInfo]);

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

export default memo(InterviewModal);
