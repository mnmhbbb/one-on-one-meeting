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

export interface UserResponse {
  user: UserInfo;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

export interface Professor {
  id: string;
  email: string;
  name: string;
  college: string;
  phone_num: string;
  interview_location: string;
}
