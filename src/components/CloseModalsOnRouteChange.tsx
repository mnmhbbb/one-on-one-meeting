"use client";

import { usePathname } from "next/navigation";
import { memo, useEffect } from "react";

import { useInterviewModalStore } from "@/store/interviewModalStore";

/**
 * 페이지 변경 시 모달 닫는 컴포넌트
 */
const CloseModalsOnRouteChange = () => {
  const pathname = usePathname();
  const setPathname = useInterviewModalStore(state => state.setPathname);

  useEffect(() => {
    setPathname(pathname);
  }, [pathname, setPathname]);

  return null;
};

export default memo(CloseModalsOnRouteChange);
