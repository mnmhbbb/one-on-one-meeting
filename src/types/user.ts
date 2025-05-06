import { UserRole } from "@/common/const";

// 임시
export interface UserInfo {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  department: string;
  signNum: string;
}
