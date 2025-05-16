import { UserRole } from "@/common/const";
import { createStore } from "@/store/store";
import { UserInfo } from "@/types/user";

interface UserState {
  userInfo: UserInfo | null;
  role: UserRole | null;
  setUserInfo: (userInfo: UserInfo) => void;
}

export const useUserStore = createStore<UserState>(set => ({
  userInfo: null,
  role: null,
  setUserInfo: (userInfo: UserInfo) => set({ userInfo, role: userInfo.role }),
}));
