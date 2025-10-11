"use server";

import { redirect } from "next/navigation";

import { UserRole } from "@/common/const";

/**
 * 로그인 폼 상태 타입
 */
export interface LoginFormState {
  success: boolean;
  message?: string;
  errors?: {
    email?: string;
    password?: string;
  };
}

export async function loginAction(
  prevState: LoginFormState | null,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;

  // 기본 유효성 검사
  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "올바른 이메일 주소를 입력해주세요.",
      errors: { email: "올바른 이메일 주소를 입력해주세요." },
    };
  }

  if (!password || password.length < 6) {
    return {
      success: false,
      message: "비밀번호는 최소 6자 이상이어야 합니다.",
      errors: { password: "비밀번호는 최소 6자 이상이어야 합니다." },
    };
  }

  // API 호출
  let loginSuccess = false;
  let errorMessage = "";

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, role }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage = data.message || "로그인에 실패했습니다.";
    } else {
      loginSuccess = true;
    }
  } catch (error) {
    console.error("로그인 에러:", error);
    errorMessage = "로그인 중 오류가 발생했습니다. 다시 시도해주세요.";
  }

  // 로그인 실패 시 에러 반환
  if (!loginSuccess) {
    return {
      success: false,
      message: errorMessage,
    };
  }

  // 성공 시 리다이렉트 (try-catch 밖에서 호출)
  const redirectTo = role === UserRole.STUDENT ? "/student/my" : "/professor/my";
  redirect(redirectTo);
}
