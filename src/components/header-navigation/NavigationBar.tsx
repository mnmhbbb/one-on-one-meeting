import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import UserNavActions from "./UserNavActions";

const NavigationBar = () => {
  return (
    <nav className="bg-primary flex w-full items-center justify-between p-3">
      <Link href="/">
        <div className="flex items-center">
          <Image
            src="/logo_long3.png"
            alt="KNOCK Logo"
            width={200}
            height={48}
            className="h-7 w-auto lg:h-12" // 비율 유지하면서 높이 맞춤
          />
          <h1 className="text-sm font-bold whitespace-nowrap text-white sm:text-base md:text-2xl">
            |&nbsp;면담 예약 사이트
          </h1>
        </div>
      </Link>
      {/*TODO: 내 정보(구현 되면 넣기), 로그아웃 버튼 로그인 되고 나면 바로 보이도록 하기*/}
      <UserNavActions />
    </nav>
  );
};

export default memo(NavigationBar);
