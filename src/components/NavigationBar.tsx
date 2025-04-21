import { memo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavigationBar = () => {
  return (
    <nav className="flex items-center justify-between mb-4">
      <Link href="/">
        <h1 className="text-2xl font-bold">KNOCK KNOCK | 면담 예약 사이트</h1>
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/my" className="text-sm">
          👤 내 정보
        </Link>
        <Button variant="outline" size="sm">
          로그아웃
        </Button>
      </div>
    </nav>
  );
};

export default memo(NavigationBar);
