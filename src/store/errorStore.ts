import { create } from "zustand";

interface ErrorState {
  error: {
    message: string | null;
    status?: number;
  } | null;
  setError: (message: string | null, status?: number) => void;
}

/**
 * 전역에서 에러 상태를 관리하기 위한 스토어
 */
export const useErrorStore = create<ErrorState>(set => ({
  error: null,
  setError: (message, status) => {
    // 401 에러 시 토스트 노출없이 즉시 리다이렉트
    if (status === 401 && typeof window !== "undefined") {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/student")) {
        window.location.href = "/student/login";
      } else if (pathname.startsWith("/professor")) {
        window.location.href = "/professor/login";
      }
      return;
    }

    set({ error: message ? { message, status } : null });
  },
}));
