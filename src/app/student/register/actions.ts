"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/utils/supabase/server";

// TODO: 우리 서비스에 맞게 조정 필요
// 지금은 공식 문서 코드 그대로 가져옴
export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
