import axiosInstance from "@/lib/axios";
import { LoginRequest, MyPageUserInfo, UserResponse } from "@/types/user";

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

  updateUserInfo: async (userData: MyPageUserInfo): Promise<MyPageUserInfo | null> => {
    return await tryApiWithToast(() => axiosInstance.put<MyPageUserInfo>("/user", userData));
  },

  getDepartmentColleges: async (): Promise<{
    data: { college: string; department: string }[];
  } | null> => {
    return await tryApiWithToast(() =>
      axiosInstance.get<{ data: { college: string; department: string }[] }>("/department-college")
    );
  },
};
