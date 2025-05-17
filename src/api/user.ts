import { UserRole } from "@/common/const";
import axiosInstance from "@/lib/axios";
import { UserInfo } from "@/types/user";

import { tryApiWithToast } from "./common";

export interface UserResponse {
  user: UserInfo;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

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
