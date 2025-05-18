import axiosInstance from "@/lib/axios";
import { LoginRequest, UserResponse } from "@/types/user";

import { tryApiWithToast } from "./common";

export const userApi = {
  getCurrentUser: async (): Promise<UserResponse | null> => {
    return await tryApiWithToast(() => axiosInstance.get<UserResponse>("/user"));
  },

  login: async (loginData: LoginRequest): Promise<void | null> => {
    return await tryApiWithToast(() => axiosInstance.post("/login", loginData));
  },

  logout: async (): Promise<void | null> => {
    return await tryApiWithToast(() => axiosInstance.post("/logout"));
  },
};
