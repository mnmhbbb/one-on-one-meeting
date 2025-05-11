import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import UserNavActions from "./UserNavActions";

const NavigationBar = () => {
  return (
    <nav className="m-6 flex items-center justify-between">
      <Link href="/">
        <div className="flex items-center space-x-2">
          <Image
            src="/logo_long.png"
            alt="KNOCK Logo"
            width={200}
            height={60}
            className="h-15 w-auto" // 비율 유지하면서 높이 맞춤
          />
          <h1 className="text-sm font-bold whitespace-nowrap text-[#6b5545] sm:text-base md:text-3xl">
            |&nbsp;&nbsp;면담 예약 사이트
          </h1>
        </div>
      </Link>
      <UserNavActions />
    </nav>
  );
};

export default memo(NavigationBar);
