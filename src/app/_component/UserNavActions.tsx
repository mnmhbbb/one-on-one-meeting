"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { userApi } from "@/utils/api/user";

const UserNavActions = () => {
  const { user, clearUser } = useUser();

  const handleLogout = async () => {
    const res = await userApi.logout();
    if (res) {
      clearUser();
      window.location.replace("/");
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <Link href="/mypage" className="text-xs text-white sm:text-sm md:text-base">
        👤 {user.name}님
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
