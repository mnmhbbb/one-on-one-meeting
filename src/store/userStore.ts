import { UserRole } from "@/common/const";
import { createStore } from "@/store/store";
import { UserInfo } from "@/types/user";
interface UserState {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  role: UserRole | null;
}

export const useUserStore = createStore<UserState>(set => ({
  // userInfo: null,
  // role: null,
  userInfo: {
    id: "1",
    name: "김철수",
    email: "kim@test.com",
    role: UserRole.STUDENT,
    department: "컴퓨터공학과",
    signNum: "2025123456",
  },
  role: UserRole.STUDENT,
  setUserInfo: (userInfo: UserInfo) => set({ userInfo, role: userInfo.role }),
}));
