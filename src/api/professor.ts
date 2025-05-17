import axiosInstance from "@/lib/axios";

import { tryApiWithToast } from "./common";

export interface Professor {
  id: string;
  email: string;
  name: string;
  college: string;
  phone_num: string;
  interview_location: string;
}

export const professorApi = {
  getDepartments: async (): Promise<{ colleges: string[] } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.get<{ colleges: string[] }>("/professor/search/department")
    );
  },
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
};
