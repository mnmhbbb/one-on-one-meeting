"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { userApi } from "@/utils/api/user";

const UserNavActions = () => {
  const userInfo = useUserStore(state => state.userInfo);
  const clearUserInfo = useUserStore(state => state.clearUserInfo);

  const handleLogout = async () => {
    const res = await userApi.logout();
    if (res) {
      clearUserInfo();
      window.location.replace("/");
    }
  };

  if (!userInfo) return null;

  return (
    <div className="flex items-center gap-4">
      <Link href="/mypage" className="text-xs text-white sm:text-sm md:text-base">
        👤 내 정보
      </Link>
      <Button
        variant="outline"
        size="sm"
        className="text-xs sm:text-sm md:text-base"
        onClick={handleLogout}
      >
        로그아웃
      </Button>
    </div>
  );
};

export default UserNavActions;
