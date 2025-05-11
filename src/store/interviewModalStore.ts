import { InterviewModalType } from "@/common/const";
import { createStore } from "@/store/store";
import { InterviewInfo } from "@/utils/data/mockData";

type InterviewModalState = {
  pathname: string;

  isOpen: boolean;
  isProfessorSearchOpen: boolean; // 교수 검색 모달 열림 여부
  interviewId: string | null;
  type: InterviewModalType | null;
  interviewInfo: InterviewInfo | null;

  selectedTime: string[];

  setPathname: (path: string) => void;

  open: (id: string, type: InterviewModalType) => void;
  close: () => void;
  openProfessorSearch: () => void;
  closeProfessorSearch: () => void;
  setInterviewInfo: (info: InterviewInfo) => void;
  resetInterviewModal: () => void;

  setSelectedTime: (time: string[]) => void;
};

export const useInterviewModalStore = createStore<InterviewModalState>((set, get) => ({
  pathname: "",

  isOpen: false,
  isProfessorSearchOpen: false,
  interviewId: null,
  type: null,
  interviewInfo: null,

  selectedTime: [],

  setPathname: (newPath: string) => {
    const prevPath = get().pathname;
    if (newPath !== prevPath) {
      // 페이지가 변경됐고 모달이 열려있다면 닫기
      if (get().isProfessorSearchOpen) {
        set({ isProfessorSearchOpen: false });
      }
      if (get().isOpen) {
        set({ isOpen: false, interviewId: null, type: null });
      }
    }
    set({ pathname: newPath });
  },

  open: (id, type) => set({ isOpen: true, interviewId: id, type }),
  close: () => set({ isOpen: false, interviewId: null, type: null }),
  openProfessorSearch: () => set({ isProfessorSearchOpen: true }),
  closeProfessorSearch: () => set({ isProfessorSearchOpen: false }),
  setInterviewInfo: info => set({ interviewInfo: info }),
  resetInterviewModal: () =>
    set({
      isOpen: false,
      type: null,
      interviewId: null,
      interviewInfo: null,
    }),

  setSelectedTime: (time: string[]) => set({ selectedTime: time }),
}));
