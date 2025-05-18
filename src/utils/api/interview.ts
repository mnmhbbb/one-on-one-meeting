import axiosInstance from "@/lib/axios";
import { InterviewInfo } from "@/types/interview";

import { tryApiWithToast } from "./common";

export const interviewApi = {
  // 학생의 면담 데이터 가져오기
  getStudentInterviewList: async (
    start: string, // yyyy-mm-dd
    end: string // yyyy-mm-dd
  ): Promise<{ data: InterviewInfo[] } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.get<{ data: InterviewInfo[] }>("/interview/crud/student", {
        params: { start, end },
      })
    );
  },
  // 교수의 면담 데이터 가져오기
  getProfessorInterviewList: async (
    start: string, // yyyy-mm-dd
    end: string // yyyy-mm-dd
  ): Promise<{ data: InterviewInfo[] } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.get<{ data: InterviewInfo[] }>("/interview/crud/professor", {
        params: { start, end },
      })
    );
  },
};
