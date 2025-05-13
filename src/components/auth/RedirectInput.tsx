"use client";

import { useSearchParams } from "next/navigation";

/**
 * 로그인 완료 후 이동할 대상 경로(redirectTo)를 설정하는 입력 필드
 */
const RedirectInput = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";

  return <input type="hidden" name="redirectTo" value={redirectTo} />;
};

export default RedirectInput;
