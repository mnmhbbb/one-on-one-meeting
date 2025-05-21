"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

import { useUserStore } from "@/store/userStore";

const ProfessorHeader = () => {
  const pathname = usePathname();
  const userName = useUserStore(state => state.userInfo?.name);
  const links = [
    { href: "/professor/notice", label: "공지 등록" },
    ...(pathname === "/professor/interview-requests"
      ? [{ href: "/professor/my", label: "메인으로" }]
      : [{ href: "/professor/interview-requests", label: "신청현황" }]),
  ];

  return (
    <>
      {/* 데스크랍 화면 */}
      <div className="hidden grid-cols-3 items-end gap-2 lg:grid">
        <div className="flex h-fit gap-2">
          {links.map(link => (
            <Link
              key={link.href}
              className={`flex items-center rounded-md rounded-b-none border border-b-0 px-4 py-1 text-sm whitespace-nowrap md:px-8 md:py-1.5 md:text-base ${
                pathname === link.href ? "bg-stone-600 text-white" : ""
              }`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <h2 className="mb-4 text-center text-2xl font-semibold">
          {userName} 교수님의 면담 일정 {pathname === "/professor/schedule" && "관리"}
        </h2>
      </div>
      {/* 모바일 화면 */}
      <div className="lg:hidden">
        <h2 className="mb-2 text-center text-xl font-semibold">
          {userName} 교수님의 면담 일정 {pathname === "/professor/schedule" && "관리"}
        </h2>
        <div className="flex h-fit gap-2">
          {links.map(link => (
            <Link
              key={link.href}
              className={`flex items-center rounded-md rounded-b-none border border-b-0 px-4 py-1 text-sm whitespace-nowrap md:px-8 md:py-1.5 md:text-base ${
                pathname === link.href ? "bg-stone-600 text-white" : ""
              }`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default memo(ProfessorHeader);
