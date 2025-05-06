"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";

export async function signup(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const email = formData.get("user_id") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;
  const name = formData.get("name") as string;
  const signNum = formData.get("sign_num") as string;
  const department = formData.get("department") as string;
  const phoneNum = (formData.get("phone_num") as string) || null;
  const interviewLocation = formData.get("interview_location") as string;
  const role = formData.get("role") as "student" | "professor";

  if (password !== confirmPassword) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;
  if (!pwRegex.test(password)) {
    throw new Error("비밀번호는 8자 이상, 영문자 + 숫자를 포함해야 합니다.");
  }

  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
      },
    },
  });

  if (signupError) {
    throw signupError;
  }

  const userId = signupData.user?.id;
  if (!userId) {
    throw new Error("회원가입은 되었지만 user.id를 찾을 수 없습니다.");
  }

  // Supabase 사용자 이메일 인증 상태 업데이트
  const { error: confirmError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    user_metadata: {
      email_verified: true,
    },
  });
  if (confirmError) {
    throw new Error("이메일 인증 상태 갱신 실패");
  }

  // 학생, 교수 테이블에 추가 정보 저장
  const commonData = {
    id: userId,
    name,
    sign_num: signNum,
    department,
    phone_num: phoneNum || null,
    notification_email: email,
  };

  if (role === "student") {
    const { error } = await supabase.from("students").insert(commonData);
    if (error) throw error;
  } else if (role === "professor") {
    const { error } = await supabase.from("professors").insert({
      ...commonData,
      interviewLocation,
    });
    if (error) throw error;
  } else {
    throw new Error(`지원되지 않는 역할입니다: ${role}`);
  }

  // TODO: 이메일 인증 완료된 사용자인지 확인하는 로직 추가하기

  revalidatePath("/", "layout");

  // TODO: 회원가입 완료 시, 쿼리 파라미터를 이용하여 toast 메세지 띄우기
  if (role === "student") {
    redirect("/student/login");
  } else {
    redirect("/professor/login");
  }
}
