import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function getSessionUser() {
  const headerStore = await headers();

  const supabase = await createClient();

  const authHeader = headerStore.get("authorization");
  const accessToken = authHeader?.replace("Bearer ", "");

  if (accessToken) {
    const { data } = await supabase.auth.getUser(accessToken);
    if (data?.user) {
      return { user: data.user, accessToken, supabase };
    }
  }

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
