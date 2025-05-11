"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

const UserNavActions = () => {
  const supabase = createClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "professor" | null>(null);

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);

        // 유저 정보 가져오기
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const role = user?.user_metadata?.role;
        console.log("role = ", role);
        if (role === "student" || role === "professor") {
          setUserRole(role);
        }
      }
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoggedIn(!!session);

      if (session) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const role = user?.user_metadata?.role;
        if (role === "student" || role === "professor") {
          setUserRole(role);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    console.log("로그아웃 시도 중...");
    const res = await fetch("/api/logout", {
      method: "POST",
      credentials: "include", // 쿠키 포함 필수
    });

    if (res.ok) {
      console.log("로그아웃 성공");
      window.location.href = "/";
    } else {
      const data = await res.json();
      console.error("로그아웃 실패:", data.error);
    }
  };

  if (!isLoggedIn || !userRole) return null;

  const linkHref = userRole === "student" ? "/student/my" : "/professor/consultation-requests";

  return (
    <div className="flex items-center gap-4">
      <Link href={linkHref} className="text-xs sm:text-sm md:text-base">
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
