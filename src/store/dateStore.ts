import { createStore } from "@/store/store";

interface DateState {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export const useDateStore = createStore<DateState>(set => ({
  currentDate: new Date(),
  setCurrentDate: (date: Date) => set({ currentDate: date }),
}));
