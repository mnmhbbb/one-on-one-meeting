import { create } from "zustand";

import { InterviewModalType } from "@/common/const";

type InterviewModalState = {
  isOpen: boolean;
  isProfessorSearchOpen: boolean;
  interviewId: string | null;
  type: InterviewModalType | null;
  open: (id: string, type: InterviewModalType) => void;
  close: () => void;
  openProfessorSearch: () => void;
  closeProfessorSearch: () => void;
};

export const useInterviewModalStore = create<InterviewModalState>(set => ({
  isOpen: false,
  isProfessorSearchOpen: false,
  interviewId: null,
  type: null,
  open: (id, type) => set({ isOpen: true, interviewId: id, type }),
  close: () => set({ isOpen: false, interviewId: null, type: null }),
  openProfessorSearch: () => set({ isProfessorSearchOpen: true }),
  closeProfessorSearch: () => set({ isProfessorSearchOpen: false }),
}));
