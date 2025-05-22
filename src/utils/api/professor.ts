import axiosInstance from "@/lib/axios";
import { Professor, ProfessorAllowDate, ProfessorAllowDateRequest } from "@/types/user";

import { tryApiWithToast } from "./common";

export const professorApi = {
  getProfessors: async (): Promise<{ professors: Professor[] } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.get<{ professors: Professor[] }>("/professor/search/all")
    );
  },
  getFavoriteProfessors: async (): Promise<{ professors: Professor[] } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.get<{ professors: Professor[] }>("/professor/search/bookmark")
    );
  },
  postBookmark: async (professorId: string): Promise<{ status: string } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.post<{ status: string }>("/professor/search/bookmark", {
        professor_id: professorId,
      })
    );
  },
  // 교수 자신이 활성화 시킨 면담 가능 날짜 조회
  getAllowDate: async (
    start: string,
    end: string
  ): Promise<{ data: ProfessorAllowDate[] } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.get<{ data: ProfessorAllowDate[] }>("/professor/allow-date", {
        params: { start, end },
      })
    );
  },

  // 교수의 면담 가능 날짜 저장
  postAllowDate: async (
    body: ProfessorAllowDateRequest[],
    start: string,
    end: string
  ): Promise<{ data: ProfessorAllowDate[] } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.post<{ data: ProfessorAllowDate[] }>("/professor/allow-date", body, {
        params: { start, end },
      })
    );
  },
};
