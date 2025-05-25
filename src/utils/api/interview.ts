import axiosInstance from "@/lib/axios";
import {
  InterviewAcceptBody,
  InterviewCancelBody,
  InterviewCreateBody,
  InterviewInfo,
  InterviewRecordBody,
  InterviewUpdateBody,
} from "@/types/interview";
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
  // 교수가 면담 상태 업데이트
  putInterviewState: async (
    body: InterviewAcceptBody
  ): Promise<{ data: InterviewInfo[]; message: string } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.put<{ data: InterviewInfo[]; message: string }>(
        "/interview/crud/professor",
        body
      )
    );
  },
  // 학생이 면담 취소 요청
  cancelInterview: async (
    body: InterviewCancelBody
  ): Promise<{ data: InterviewInfo[]; message: string } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.put<{ data: InterviewInfo[]; message: string }>(
        "/interview/crud/student/cancel",
        body
      )
    );
  },

  // 면담 기록 저장
  postInterviewRecord: async (
    body: InterviewRecordBody
  ): Promise<{ data: InterviewRecordBody; message: string } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.post<{ data: InterviewRecordBody; message: string }>("/interview/record", body)
    );
  },
  // 면담 기록 수정
  putInterviewRecord: async (
    body: InterviewRecordBody
  ): Promise<{ data: InterviewRecordBody; message: string } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.put<{ data: InterviewRecordBody; message: string }>("/interview/record", body)
    );
  },

  // 면담 안내사항 가져오기(최초 면담 시에만 사용)
  getInterviewGuide: async (): Promise<{
    data: { id: string; interview_state: string; guide_content: string }[];
  } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.get<{ data: { id: string; interview_state: string; guide_content: string }[] }>(
        "/interview/guide"
      )
    );
  },
};
