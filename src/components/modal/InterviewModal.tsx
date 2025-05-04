"use client";

import { InterviewModalType } from "@/common/const";
import CancelInterviewView from "@/components/modal/CancelInterviewView";
import ConfirmInterviewView from "@/components/modal/ConfirmInterviewView";
import CreateInterviewView from "@/components/modal/CreateInterviewView";
import InterviewListView from "@/components/modal/InterviewListView";
import RecordInterviewView from "@/components/modal/RecordInterviewView";
import RejectInterviewView from "@/components/modal/RejectInterviewView";
import RequestInterviewView from "@/components/modal/RequestInterviewView";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useInterviewModalStore } from "@/store/interviewModalStore";

export const InterviewModal = () => {
  const { isOpen, type, close } = useInterviewModalStore();

  // 임시
  const isLoading = false;

  //   const { data, isLoading } = useQuery({
  //     queryKey: ["interview", interviewId],
  //     queryFn: () => fetchInterviewDetails(interviewId!), // 비동기 요청
  //     enabled: isOpen && !!interviewId,
  //   });
  const modalViewMap = {
    [InterviewModalType.REQUESTED]: RequestInterviewView,
    [InterviewModalType.REJECTED]: RejectInterviewView,
    [InterviewModalType.CANCELLED]: CancelInterviewView,
    [InterviewModalType.CONFIRMED]: ConfirmInterviewView,
    [InterviewModalType.RECORDED]: RecordInterviewView,
    [InterviewModalType.CREATE]: CreateInterviewView,
    [InterviewModalType.LIST]: InterviewListView,
  };
  const ModalView = modalViewMap[type as keyof typeof modalViewMap];

  if (!isOpen || !type) return null;

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        {isLoading && <div>로딩 중...</div>}
        {!isLoading && <ModalView />}
      </DialogContent>
    </Dialog>
  );
};
