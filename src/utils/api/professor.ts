import axiosInstance from "@/lib/axios";
import { Professor } from "@/types/user";

import { tryApiWithToast } from "./common";

export const professorApi = {
  getColleges: async (): Promise<{ colleges: string[] } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.get<{ colleges: string[] }>("/professor/search/college")
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
