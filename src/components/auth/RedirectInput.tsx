"use client";

import { usePathname, useSearchParams } from "next/navigation";

/**
 * 로그인 완료 후 이동할 대상 경로(redirectTo)를 설정하는 입력 필드
 * redirect 기본값은 각 유저의 /my
 */
const RedirectInput = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const defaultRedirectTo = pathname.startsWith("/student") ? "/student/my" : "/professor/my";
  const redirectTo = searchParams.get("redirectTo") ?? defaultRedirectTo;

  return <input type="hidden" name="redirectTo" value={redirectTo} />;
};

export default RedirectInput;
