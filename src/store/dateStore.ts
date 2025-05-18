import { createStore } from "@/store/store";
import { InterviewInfo } from "@/types/interview";

interface DateState {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  interviewList: InterviewInfo[];
  setInterviewList: (interviews: InterviewInfo[]) => void;
}

export const useDateStore = createStore<DateState>(set => ({
  currentDate: new Date(),
  setCurrentDate: (date: Date) => set({ currentDate: date }),
  interviewList: [],
  setInterviewList: (interviews: InterviewInfo[]) => set({ interviewList: interviews }),
}));
