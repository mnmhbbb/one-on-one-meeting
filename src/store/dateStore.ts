import { createStore } from "@/store/store";
import { InterviewInfo } from "@/types/interview";
import { ProfessorAllowDate } from "@/types/user";

export type UpdateTarget =
  | "studentInterviewList" // 학생 자신 면담 목록 갱신
  | "professorInterviewList" // 교수 자신 면담 목록 갱신
  | "professorAllowDateList" // 교수 자신의 면담 가능 날짜 목록 갱신
  | "professorAllowDateListForStudent" // 학생이 보는 교수의 면담 가능 날짜 목록 갱신
  | null;

interface DateState {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;

  // 현재 날짜에 등록된 면담 목록
  interviewList: InterviewInfo[];
  setInterviewList: (interviews: InterviewInfo[]) => void;

  // 현재 날짜에 교수 면담 가능 날짜 목록
  professorAllowDateList: ProfessorAllowDate[];
  setProfessorAllowDateList: (allowDateList: ProfessorAllowDate[]) => void;

  // 면담 목록 갱신 타겟
  updateTarget: UpdateTarget;
  setUpdateTarget: (target: UpdateTarget) => void;
}

export const useDateStore = createStore<DateState>(set => ({
  currentDate: new Date(),
  setCurrentDate: (date: Date) => set({ currentDate: date }),

  interviewList: [],
  setInterviewList: (interviews: InterviewInfo[]) => set({ interviewList: interviews }),

  professorAllowDateList: [],
  setProfessorAllowDateList: (professorAllowDateList: ProfessorAllowDate[]) =>
    set({ professorAllowDateList }),

  updateTarget: null,
  setUpdateTarget: (target: UpdateTarget) => set({ updateTarget: target }),
}));
