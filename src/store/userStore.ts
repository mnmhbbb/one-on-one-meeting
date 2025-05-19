import { RoleViewType, UserRole } from "@/common/const";
import { createStore } from "@/store/store";
import { UserInfo } from "@/types/user";

interface UserState {
  userInfo: UserInfo | null;
  role: UserRole | null;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
  roleViewType: RoleViewType | null; // 유저 권한에 따른 뷰 타입(학생-학생, 학생-교수, 교수-교수)
  setRoleViewType: (roleViewType: RoleViewType) => void;
}

export const useUserStore = createStore<UserState>(set => ({
  userInfo: null,
  role: null,
  roleViewType: null,
  setUserInfo: (userInfo: UserInfo) => set({ userInfo, role: userInfo.role }),
  clearUserInfo: () => set({ userInfo: null, role: null }),
  setRoleViewType: (roleViewType: RoleViewType) => set({ roleViewType }),
}));
