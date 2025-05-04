import { create } from "zustand";

import { InterviewModalType } from "@/common/const";

type InterviewModalState = {
  isOpen: boolean;
  interviewId: string | null;
  type: InterviewModalType | null;
  open: (id: string, type: InterviewModalType) => void;
  close: () => void;
};

export const useInterviewModalStore = create<InterviewModalState>(set => ({
  isOpen: false,
  interviewId: null,
  type: null,
  open: (id, type) => set({ isOpen: true, interviewId: id, type }),
  close: () => set({ isOpen: false, interviewId: null, type: null }),
}));
