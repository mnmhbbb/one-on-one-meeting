import { createServerClient } from "@supabase/ssr";
// cookies는 헤더에 길게 들어오는 내용을 서버가 쉽게 이해할 수 있도록 정리해준 next에서 제공하는 기능
// Next.js의 서버 사이드 쿠키 API
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies(); // 클라이언트 요청에 포함된 쿠키들을 저장하는 곳

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // cookies: Supabase 인증 정보를 유지하기 위한 쿠키 처리 로직을 정의하는 부분
      // (Supabase가 세션 정보를 Next.js 쿠키 API로 관리할 수 있게 하는 어댑터 역할)
      cookies: {
        // 브라우저에서 전달된 모든 쿠키를 읽어서 유저를 식별함
        getAll() {
          return cookieStore.getAll();
        },

        // 세션 갱신 후 새 토큰을 쿠키에 저장하여 브라우저에 전달
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 서버 컴포넌트에서는 쿠키를 읽는 것만 가능하고, 설정은 불가능하기 때문에
            // 오류가 발생할 수 있어서 try/catch로 감싸는 것
          }
        },
      },
    }
  );
}
