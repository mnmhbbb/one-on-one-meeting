"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function signup(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const email = formData.get("user_id") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm_password") as string;
  const name = formData.get("name") as string;
  const signNum = formData.get("sign_num") as string;
  const department = formData.get("department") as string;
  const role = formData.get("role") as string;
  const interviewLocation = formData.get("interview_location") as string | null;

  if (password !== confirmPassword) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  const pwRegex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!pwRegex.test(password)) {
    throw new Error("비밀번호는 8자 이상, 소문자 + 숫자를 포함해야 합니다.");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        signNum,
        department,
        role,
        notificationEmail: email,
        ...(role === "professor" && interviewLocation && { interviewLocation }),
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/", "layout");
  redirect("/student/login");
}
