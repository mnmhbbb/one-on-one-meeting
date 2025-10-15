"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/utils/api/user";

/**
 * 사용자 정보를 관리하는 커스텀 훅
 * - TanStack Query만 사용하여 상태 관리 단순화
 * - 서버에서 초기 데이터를 받아온 경우 캐시 활용
 * - 클라이언트에서 실시간 업데이트 가능
 */
export function useUser() {
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user"],
    queryFn: userApi.getCurrentUser,
    retry: false,
    refetchOnWindowFocus: true,
    // 서버에서 받아온 초기 데이터가 있으면 사용(prefetchQuery)
    initialData: () => {
      return queryClient.getQueryData(["user"]);
    },
  });

  const clearUser = () => {
    // 쿼리 캐시에서 사용자 데이터 제거
    queryClient.removeQueries({ queryKey: ["user"] });
  };

  return {
    user: userData?.user || null,
    role: userData?.role || null,
    isLoading,
    error,
    refetch,
    clearUser,
  };
}
