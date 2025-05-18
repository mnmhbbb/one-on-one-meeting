import { createStore } from "@/store/store";
import { InterviewInfo } from "@/types/interview";

interface DateState {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  monthlyInterviews: InterviewInfo[];
  setMonthlyInterviews: (interviews: InterviewInfo[]) => void;
}

export const useDateStore = createStore<DateState>(set => ({
  currentDate: new Date(),
  setCurrentDate: (date: Date) => set({ currentDate: date }),
  monthlyInterviews: [],
  setMonthlyInterviews: (interviews: InterviewInfo[]) => set({ monthlyInterviews: interviews }),
}));
