"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

import { Button } from "@/components/ui/button";
import { useInterviewModalStore } from "@/store/interviewModalStore";

const StudentsHeader = () => {
  const pathname = usePathname();
  const openProfessorSearch = useInterviewModalStore(state => state.openProfessorSearch);

  const links = [
    { href: "/student/my", label: "MY" },
    { href: "/student/interview-requests", label: "신청현황" },
  ];

  return (
    <>
      <div className="grid grid-cols-3 items-end gap-2">
        <div className="flex h-fit gap-2">
          {links.map(link => (
            <Link
              key={link.href}
              className={`flex items-center rounded-md rounded-b-none border border-b-0 px-8 py-1.5 ${
                pathname === link.href ? "bg-stone-600 text-white" : ""
              }`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        {/* TODO: 학생 이름 표시 */}
        <h2 className="mb-4 text-center text-xl font-semibold">OOO님의 면담 일정</h2>
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
      </div>
    </>
  );
};

export default memo(StudentsHeader);
