import axiosInstance from "@/lib/axios";
import { InterviewCreateBody, InterviewInfo, InterviewUpdateBody } from "@/types/interview";
import { Professor, ProfessorAllowDate } from "@/types/user";

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
  // 교수 기본 정보
  getProfessorInfo: async (professor_id: string): Promise<{ data: Professor } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.get<{ data: Professor }>("/interview/crud/student/professor-info", {
        params: { professor_id },
      })
    );
  },
  // 교수 면담 가능 날짜 가져오기(학생 화면일 때)
  getProfessorAllowDate: async (
    professor_id: string,
    start: string,
    end: string
  ): Promise<{ data: ProfessorAllowDate[] } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.post<{ data: ProfessorAllowDate[] }>("/interview/crud/student/professor-info", {
        professor_id,
        start,
        end,
      })
    );
  },
  // 면담 카테고리 가져오기
  getInterviewCategory: async (): Promise<{
    data: { id: string; interview_category: string }[];
  } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.get<{ data: { id: string; interview_category: string }[] }>(
        "/interview/category"
      )
    );
  },
  // 면담 저장
  createInterview: async (
    interview: InterviewCreateBody
  ): Promise<{ data: InterviewInfo[]; message: string } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.post<{ data: InterviewInfo[]; message: string }>(
        "/interview/crud/student",
        interview
      )
    );
  },
  // 면담 수정
  updateInterview: async (
    interview: InterviewUpdateBody
  ): Promise<{ data: InterviewInfo[]; message: string } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.put<{ data: InterviewInfo[]; message: string }>(
        "/interview/crud/student",
        interview
      )
    );
  },
};
