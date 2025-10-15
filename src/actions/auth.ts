"use server";

import { redirect } from "next/navigation";

import { baseURL, UserRole } from "@/common/const";
import type { LoginFormState, LoginRequest, SignupFormState } from "@/types/auth";

/**
 * 로그인 Server Action
 * - 클라이언트에서 폼 데이터를 받아 유효성 검사 수행
 * - API Route로 로그인 요청 전달
 * - 성공 시 역할에 따라 리다이렉트
 */
export async function loginAction(
  prevState: LoginFormState | null,
  formData: FormData
): Promise<LoginFormState> {
  // 1. FormData 파싱
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as UserRole;

  // 2. 클라이언트 유효성 검사
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

  // 3. API 요청 데이터 준비
  const loginRequest: LoginRequest = {
    email,
    password,
    role,
  };

  // 4. API 호출
  let loginSuccess = false;
  let errorMessage = "";

  try {
    const response = await fetch(`${baseURL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
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

  // 5. 로그인 성공 - 역할에 따라 리다이렉트 (try-catch 밖에서 호출)
  const redirectTo = role === UserRole.STUDENT ? "/student/my" : "/professor/my";
  redirect(redirectTo);
}

/**
 * 회원가입 Server Action
 * - 클라이언트에서 폼 데이터를 받아 유효성 검사 수행
 * - API Route로 회원가입 요청 전달
 * - 성공 시 로그인 페이지로 리다이렉트
 */
export async function signupAction(
  prevState: SignupFormState | null,
  formData: FormData
): Promise<SignupFormState> {
  // 1. FormData 파싱
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const name = formData.get("name") as string;
  const role = formData.get("role") as UserRole;
  const phoneNum = formData.get("phoneNum") as string | null;

  // 2. 공통 유효성 검사
  if (!email || !email.includes("@")) {
    return {
      success: false,
      message: "올바른 이메일 주소를 입력해주세요.",
      errors: { email: "올바른 이메일 주소를 입력해주세요." },
    };
  }

  const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;
  if (!password || !pwRegex.test(password)) {
    return {
      success: false,
      message: "비밀번호는 8자 이상, 영문자와 숫자를 포함해야 합니다.",
      errors: { password: "비밀번호는 8자 이상, 영문자와 숫자를 포함해야 합니다." },
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: "비밀번호가 일치하지 않습니다.",
      errors: { confirmPassword: "비밀번호가 일치하지 않습니다." },
    };
  }

  if (!name || name.trim().length < 2) {
    return {
      success: false,
      message: "이름을 2자 이상 입력해주세요.",
      errors: { name: "이름을 2자 이상 입력해주세요." },
    };
  }

  // 3. 역할별 요청 데이터 준비
  let signupRequest;

  if (role === UserRole.STUDENT) {
    const studentId = formData.get("studentId") as string;
    const department = formData.get("department") as string;

    if (!studentId || !department) {
      return {
        success: false,
        message: "학번과 학과를 입력해주세요.",
        errors: {
          studentId: studentId ? undefined : "학번을 입력해주세요.",
          department: department ? undefined : "학과를 선택해주세요.",
        },
      };
    }

    signupRequest = {
      email,
      password,
      confirmPassword,
      name,
      phoneNum: phoneNum || undefined,
      role: UserRole.STUDENT,
      studentId,
      department,
    };
  } else if (role === UserRole.PROFESSOR) {
    const college = formData.get("college") as string;
    const interviewLocation = formData.get("interviewLocation") as string;

    if (!college || !interviewLocation) {
      return {
        success: false,
        message: "단과대학과 면담 장소를 입력해주세요.",
        errors: {
          college: college ? undefined : "단과대학을 선택해주세요.",
          interviewLocation: interviewLocation ? undefined : "면담 장소를 입력해주세요.",
        },
      };
    }

    signupRequest = {
      email,
      password,
      confirmPassword,
      name,
      phoneNum: phoneNum || undefined,
      role: UserRole.PROFESSOR,
      college,
      interviewLocation,
    };
  } else {
    return {
      success: false,
      message: "지원되지 않는 역할입니다.",
    };
  }

  // 4. API 호출
  let signupSuccess = false;
  let errorMessage = "";

  try {
    const response = await fetch(`${baseURL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(signupRequest),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      errorMessage = data.message || "회원가입에 실패했습니다.";
    } else {
      signupSuccess = true;
    }
  } catch (error) {
    console.error("회원가입 에러:", error);
    errorMessage = "회원가입 중 오류가 발생했습니다. 다시 시도해주세요.";
  }

  // 회원가입 실패 시 에러 반환
  if (!signupSuccess) {
    return {
      success: false,
      message: errorMessage,
    };
  }

  // 5. 회원가입 성공 - 로그인 페이지로 리다이렉트 (try-catch 밖에서 호출)
  const redirectTo = role === UserRole.STUDENT ? "/student/login" : "/professor/login";
  redirect(redirectTo);
}
