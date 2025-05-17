import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export async function getSessionUser() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ message: "로그인 필요" }, { status: 401 }),
    };
  }

  return { user, supabase };
}
