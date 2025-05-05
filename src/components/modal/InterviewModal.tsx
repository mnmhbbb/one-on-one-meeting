"use client";

import { lazy, Suspense } from "react";

import { INTERVIEW_MODAL_TYPE, InterviewModalType } from "@/common/const";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useInterviewModalStore } from "@/store/interviewModalStore";

// Lazy load components
const RequestInterviewView = lazy(() => import("@/components/modal/RequestInterviewView"));
const RejectInterviewView = lazy(() => import("@/components/modal/RejectInterviewView"));
const CancelInterviewView = lazy(() => import("@/components/modal/CancelInterviewView"));
const ConfirmInterviewView = lazy(() => import("@/components/modal/ConfirmInterviewView"));
const RecordInterviewView = lazy(() => import("@/components/modal/RecordInterviewView"));
const CreateInterviewView = lazy(() => import("@/components/modal/CreateInterviewView"));
const InterviewListView = lazy(() => import("@/components/modal/InterviewListView"));

export const InterviewModal = () => {
  const { isOpen, type, close } = useInterviewModalStore();

  // 임시
  const isLoading = false;

  // TODO: 면담 id를 토대로 해당 면담 정보 api 호출하여 intervieModalStore에 저장하기, isLoading도 여기에서 한번에 처리.
  //   const { data, isLoading } = useQuery({
  //     queryKey: ["interview", interviewId],
  //     queryFn: () => fetchInterviewDetails(interviewId!), // 비동기 요청
  //     enabled: isOpen && !!interviewId,
  //   });

  const modalViewMap = {
    [INTERVIEW_MODAL_TYPE.REQUESTED]: RequestInterviewView,
    [INTERVIEW_MODAL_TYPE.REJECTED]: RejectInterviewView,
    [INTERVIEW_MODAL_TYPE.CANCELLED]: CancelInterviewView,
    [INTERVIEW_MODAL_TYPE.CONFIRMED]: ConfirmInterviewView,
    [INTERVIEW_MODAL_TYPE.RECORDED]: RecordInterviewView,
    [INTERVIEW_MODAL_TYPE.CREATE]: CreateInterviewView,
    [INTERVIEW_MODAL_TYPE.LIST]: InterviewListView,
  } satisfies Record<InterviewModalType, React.ComponentType>;

  if (!isOpen || !type) return null; // 모달이 열려있지 않거나 타입이 없으면 렌더링 하지 않음

  const ModalView = modalViewMap[type]; // 면담 모달 타입에 따른 모달 뷰 선택

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        {!isLoading && (
          <Suspense fallback={<div>로딩 중...</div>}>
            <ModalView />
          </Suspense>
        )}
      </DialogContent>
    </Dialog>
  );
};
