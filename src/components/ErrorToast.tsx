"use client";

import { useEffect } from "react";
import { toast, Toaster } from "sonner";

import { useErrorStore } from "@/store/errorStore";

export default function ErrorToast() {
  const { error, setError } = useErrorStore();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
      setError(null); // 한번 띄운 후 초기화
    }
  }, [error, setError]);

  return <Toaster position="top-center" richColors />;
}
