import axiosInstance from "@/lib/axios";

import { tryApiWithToast } from "./common";

export const emailApi = {
  sendVerificationCode: async (email: string): Promise<string | null> => {
    return await tryApiWithToast(() => axiosInstance.post("/email/send", { email }));
  },

  verifyCode: async (email: string, code: string): Promise<string | null> => {
    return await tryApiWithToast(() => axiosInstance.post("/email/verify", { email, code }));
  },
};
