import { type NextRequest } from "next/server";

import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  // 세션을 갱신하고 인증 체크
  return await updateSession(request);
}

export const config = {
  /*
   * 다음 경로로 시작하는 요청을 제외한 모든 요청 경로에 매칭됩니다:
   * - _next/static (정적 파일)
   * - _next/image (이미지 최적화 파일)
   * - favicon.ico (파비콘 파일)
   * - api (API 요청)
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
