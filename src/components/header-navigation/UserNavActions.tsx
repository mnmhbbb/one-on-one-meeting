"use client";

import { useRouter } from "next/navigation";

import { userApi } from "@/api/user";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";

const UserNavActions = () => {
  const router = useRouter();
  const userInfo = useUserStore(state => state.userInfo);
  const role = useUserStore(state => state.role);
  const clearUserInfo = useUserStore(state => state.clearUserInfo);

  const handleLogout = async () => {
    const res = await userApi.logout();
    if (res) {
      clearUserInfo();
      router.push("/");
    }
  };

  if (!userInfo || !role) return null;

  // const linkHref = role === "student" ? "/student/my" : "/professor/consultation-requests";

  return (
    <div className="flex items-center gap-4">
      {/* TODO: 페이지 추가 필요 */}
      {/* <Link href={linkHref} className="text-xs text-white sm:text-sm md:text-base">
        👤 내 정보
      </Link> */}
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
