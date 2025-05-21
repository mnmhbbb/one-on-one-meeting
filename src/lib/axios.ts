import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, CanceledError } from "axios";

import { useToastStore } from "@/store/toastStore";

export const axiosBase = axios.create({
  baseURL: "/api",
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 응답값 중 data만 반환하는 형태로 타입 재정의
const onResponse = <T>(res: AxiosResponse<T>): T => {
  return res.data;
};

const onError = async (error: AxiosError | Error): Promise<never> => {
  if (typeof window !== "undefined") {
    const store = useToastStore.getState();

    if (error instanceof CanceledError) {
      return Promise.reject();
    }

    // 에러 스토어에 에러 상태 저장
    if (axios.isAxiosError(error)) {
      console.log("🚀 ~ onError ~ isAxiosError:", error);
      const message =
        error.response?.data?.message || error.message || "예상치 못한 에러가 발생했습니다.";
      const status = error.response?.status;
      store.setToast(message, "error", status);
    }
  }

  return Promise.reject(error instanceof Error ? error : new Error("알 수 없는 오류입니다."));
};

// 인터셉터 연결
axiosBase.interceptors.response.use(onResponse, onError);

// data만 반환하는 형태로 타입 재정의
type AxiosDataOnly = {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
};

// 타입 단언
const axiosInstance = axiosBase as AxiosDataOnly;
export default axiosInstance;
