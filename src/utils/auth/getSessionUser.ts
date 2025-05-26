import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function getSessionUser() {
  const supabase = await createClient(); // 이미 내부에서 cookieStore 처리 중이어야 함
  const headerStore = await headers();

  // 1. Authorization 헤더 우선 처리
  const authHeader = headerStore.get("authorization");
  const accessToken = authHeader?.replace("Bearer ", "");

  if (accessToken) {
    const { data } = await supabase.auth.getUser(accessToken);
    if (data?.user) {
      return { user: data.user, accessToken, supabase };
    }
  }

  // 2. 그 외는 쿠키 기반 세션 처리
  const { data: sessionData } = await supabase.auth.getSession();
  const cookieAccessToken = sessionData.session?.access_token;
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user || !cookieAccessToken) {
    return {
      user: null,
      accessToken: null,
      supabase,
      response: NextResponse.json({ message: "로그인 필요" }, { status: 401 }),
    };
  }

  return { user, accessToken: cookieAccessToken, supabase };
}
