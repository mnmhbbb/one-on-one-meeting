import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // 메인, 로그인, 회원가입 페이지는 예외
  const publicPaths = [
    "/student/login",
    "/student/register",
    "/professor/login",
    "/professor/register",
    "/admin/login",
    "/",
  ];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (!isPublicPath) {
    if (
      (pathname.startsWith("/student") ||
        pathname.startsWith("/professor") ||
        pathname.startsWith("/admin")) &&
      !session
    ) {
      return NextResponse.redirect(new URL("/", req.url)); // 기본 리다이렉트 경로 설정
    }
  }

  return res;
}

export const config = {
  matcher: ["/student/:path*", "/professor/:path*", "/admin/:path*"],
};
