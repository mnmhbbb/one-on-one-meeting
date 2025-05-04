import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // 서버 컴포넌트와 달리 미들웨어에서는 NextResponse.cookies.set()을 통해 쿠키 설정이 보장되므로 try/catch 불필요
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Supabase에 저장된 토큰을 사용해 현재 로그인된 사용자를 확인하고,
  // supabase.auth.getUser();는 쿠키에 저장된 refresh_token을 백그라운드에서 사용하여 access_token을 갱신한다.
  // 성공하면 새로운 토큰 정보가 setAll()을 통해 응답 쿠키로 반영한다.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const PUBLIC_KEYWORDS = ["/login", "/register", "/find-password"];
  const isPublicPage =
    request.nextUrl.pathname === "/" ||
    PUBLIC_KEYWORDS.some(keyword => request.nextUrl.pathname.includes(keyword));

  // 로그인하지 않은 상태에서 보호된(private) 페이지에 접근하면 메인 페이지로 리다이렉트
  if (!user && !isPublicPage) {
    const url = request.nextUrl.clone(); // 원본 URL 객체를 수정하지 않기 위해 복제본 생성
    url.pathname = "/";

    // 1. "/" 경로로 접근 후, 로그인
    if (request.nextUrl.pathname === "/student/login") {
      url.searchParams.set("redirectTo", "/student/my");
    } else if (request.nextUrl.pathname === "/professor/login") {
      url.searchParams.set("redirectTo", "/professor/consultation-requests");
    }

    // 2. 보호된 페이지로 접근 후, 로그인
    else {
      url.searchParams.set("redirectTo", request.nextUrl.pathname);
    }

    return NextResponse.redirect(url);
  }

  // 세션을 갱신한 후 페이지를 계속해서 처리
  return supabaseResponse;
}
