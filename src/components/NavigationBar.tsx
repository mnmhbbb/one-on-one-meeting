import { memo } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const NavigationBar = () => {
  return (
    <nav className="flex items-center justify-between m-6">
      <Link href="/">
        <div className="flex items-center">
          <div className="mr-2 h-10 w-10">
            <Image src="/logo.png" alt="KNOCK Logo" width={40} height={40} />
          </div>
          <h1 className="text-sm sm:text-lg md:text-2xl font-bold text-[#6b5545]">
            KNOCK | 면담 예약 사이트
          </h1>
        </div>
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/my" className="text-xs sm:text-sm md:text-base">
          👤 내 정보
        </Link>
        <Button variant="outline" size="sm" className="text-xs sm:text-sm md:text-base">
          로그아웃
        </Button>
      </div>
    </nav>
  );
};

export default memo(NavigationBar);
