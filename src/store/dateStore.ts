import { create } from "zustand";

interface DateState {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

const useDateStore = create<DateState>((set) => ({
  currentDate: new Date(),
  setCurrentDate: (date: Date) => set({ currentDate: date }),
}));

export default useDateStore;
