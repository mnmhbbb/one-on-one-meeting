"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export const FetchUser = () => {
  const setUserInfo = useUserStore(state => state.setUserInfo);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) return;
        const { user, role } = await res.json();
        setUserInfo({ ...user, role });
      } catch (e) {
        console.error("유저 정보 불러오기 실패", e);
      }
    };

    fetchUserInfo();
  }, []);

  return null;
};
