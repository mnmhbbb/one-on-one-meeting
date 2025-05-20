import { create } from "zustand";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastState {
  toast: {
    message: string | null;
    type: ToastType;
    status?: number;
  } | null;
  setToast: (message: string | null, type?: ToastType, status?: number) => void;
}

/**
 * 전역에서 토스트 상태를 관리하기 위한 스토어
 */
export const useToastStore = create<ToastState>(set => ({
  toast: null,
  setToast: (message, type, status) => {
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

    set({ toast: message ? { message, type: type!, status } : null });
  },
}));
