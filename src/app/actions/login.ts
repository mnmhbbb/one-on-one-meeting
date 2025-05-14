"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const role = formData.get("role") as "student" | "professor";
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirectTo") as string | null;

  const { data: loginData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !loginData.user) {
    throw new Error("이메일 또는 비밀번호가 잘못되었습니다.");
  }
  console.log("role: ", role);

  const table = role === "student" ? "students" : "professors";
  const { data: userData, error: queryError } = await supabase
    .from(table)
    .select("is_verified")
    .eq("email", email)
    .single();
  console.log("userData: ", userData);
  if (queryError || !userData) {
    throw new Error("사용자 정보를 불러올 수 없습니다.");
  }

  if (!userData.is_verified) {
    throw new Error("이메일 인증이 완료되지 않았습니다. 이메일을 확인해 주세요.");
  }

  // TODO: accessToken 기간 줄이기
  revalidatePath("/", "layout");
  redirect(redirectTo ?? "/");
}
