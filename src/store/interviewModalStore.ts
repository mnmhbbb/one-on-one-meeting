import { InterviewModalType } from "@/common/const";
import { createStore } from "@/store/store";
import { InterviewInfo } from "@/types/interview";

type InterviewModalState = {
  pathname: string;

  isOpen: boolean;
  isProfessorSearchOpen: boolean; // 교수 검색 모달 열림 여부
  type: InterviewModalType | null;
  interviewInfo: InterviewInfo | null;

  selectedTime: string[];
  selectedTimeWhenEdit: string[]; // 면담 변경 중 선택된 시간 저장용

  setPathname: (path: string) => void;

  open: (info: InterviewInfo | null, type: InterviewModalType) => void;
  close: () => void;
  openProfessorSearch: () => void;
  closeProfessorSearch: () => void;
  setInterviewInfo: (info: InterviewInfo) => void;

  setSelectedTime: (time: string[]) => void;
  setSelectedTimeWhenEdit: (time: string[]) => void;
};

export const useInterviewModalStore = createStore<InterviewModalState>((set, get) => ({
  pathname: "",

  isOpen: false,
  isProfessorSearchOpen: false,
  type: null,
  interviewInfo: null,

  selectedTime: [],
  selectedTimeWhenEdit: [],

  setPathname: (newPath: string) => {
    const prevPath = get().pathname;
    if (newPath !== prevPath) {
      // 페이지가 변경됐고 모달이 열려있다면 닫기
      if (get().isProfessorSearchOpen) {
        set({ isProfessorSearchOpen: false });
      }
      if (get().isOpen) {
        set({ isOpen: false, type: null });
      }
    }
    set({ pathname: newPath });
  },

  open: (info, type) =>
    set({ isOpen: true, type, interviewInfo: info, selectedTime: info?.interview_time ?? [] }),
  close: () =>
    set({
      isOpen: false,
      type: null,
      selectedTime: [],
      selectedTimeWhenEdit: [],
      interviewInfo: null,
    }),
  openProfessorSearch: () => set({ isProfessorSearchOpen: true }),
  closeProfessorSearch: () => set({ isProfessorSearchOpen: false }),
  setInterviewInfo: info => set({ interviewInfo: info, selectedTime: info.interview_time }),

  setSelectedTime: (time: string[]) =>
    set({
      selectedTime: time,
      interviewInfo: get().interviewInfo ? { ...get().interviewInfo!, interview_time: time } : null,
    }),
  setSelectedTimeWhenEdit: (time: string[]) => set({ selectedTimeWhenEdit: time }),
}));
