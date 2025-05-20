"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useUserStore } from "@/store/userStore";
import { userApi } from "@/utils/api/user";

import LoadingUI from "../LoadingUI";

export const FetchUser = () => {
  const setUserInfo = useUserStore(state => state.setUserInfo);

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: userApi.getCurrentUser,
    retry: false,
  });

  // 유저 정보를 store에 반영
  useEffect(() => {
    if (userData) {
      const { user, role } = userData;
      setUserInfo({ ...user, role });
    }
  }, [userData, setUserInfo]);

  if (isLoading) {
    return <LoadingUI />;
  }

  return null;
};

export default FetchUser;
