"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

import ProfessorSearchModal from "@/components/modal/ProfessorSearchModal";
import { Button } from "@/components/ui/button";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { useUserStore } from "@/store/userStore";

const StudentHeader = () => {
  const userName = useUserStore(state => state.userInfo?.name);

  const pathname = usePathname();
  const openProfessorSearch = useInterviewModalStore(state => state.openProfessorSearch);

  const links = [
    { href: "/student/my", label: "MY" },
    { href: "/student/interview-requests", label: "신청현황" },
  ];

  return (
    <>
      {/* 데스크탑 화면(모바일과 화면 배치가 다름) */}
      <div className="hidden grid-cols-3 items-end gap-0 md:grid md:gap-2">
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
        <h2 className="mb-4 text-center text-2xl font-semibold whitespace-nowrap">
          {userName}님의 면담 일정
        </h2>
        <div className="flex justify-end">
          <Button
            onClick={openProfessorSearch}
            variant="outline"
            className="max-w-auto mb-4 max-w-fit text-neutral-400"
          >
            <Search className="mr-2 h-4 w-4" />
            교수님을 검색하세요.
          </Button>
        </div>
        <ProfessorSearchModal />
      </div>
      {/* 모바일 화면(화면 배치를 다르게 하기 위함) */}
      <div className="flex flex-col-reverse gap-0 md:hidden md:gap-2">
        <div className="flex h-fit gap-2">
          {links.map(link => (
            <Link
              key={link.href}
              className={`flex items-center rounded-md rounded-b-none border border-b-0 px-6 py-1.5 text-sm whitespace-nowrap md:px-8 md:text-base ${
                pathname === link.href ? "bg-stone-600 text-white" : ""
              }`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-end justify-between gap-0">
          <h2 className="mb-5 text-center text-xl font-semibold whitespace-nowrap md:mb-4">
            {userName}님의 면담 일정
          </h2>
          <div className="flex justify-end">
            <Button
              onClick={openProfessorSearch}
              variant="outline"
              className="max-w-auto mb-4 max-w-fit gap-0 text-xs text-neutral-400 md:text-sm"
            >
              <Search className="mr-1 h-3 w-3 md:mr-2 md:h-4 md:w-4" />
              교수님을 검색하세요.
            </Button>
          </div>
          <ProfessorSearchModal />
        </div>
      </div>
    </>
  );
};

export default memo(StudentHeader);
