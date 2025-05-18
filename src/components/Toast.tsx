"use client";

import { useEffect } from "react";
import { toast, Toaster } from "sonner";

import { useToastStore } from "@/store/toastStore";

export default function Toast() {
  const { toast: toastState, setToast } = useToastStore();

  useEffect(() => {
    if (toastState) {
      switch (toastState.type) {
        case "success":
          toast.success(toastState.message);
          break;
        case "error":
          toast.error(toastState.message);
          break;
        case "info":
          toast.info(toastState.message);
          break;
        case "warning":
          toast.warning(toastState.message);
          break;
      }
      setToast(null); // 한번 띄운 후 초기화
    }
  }, [toastState, setToast]);

  return <Toaster position="top-center" richColors closeButton />;
}
