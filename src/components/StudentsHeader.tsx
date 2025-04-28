"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";
import ProfessorSearchModal from "@/components/ProfessorSearchModal";

const StudentsHeader = () => {
  const pathname = usePathname();

  const links = [
    { href: "/my", label: "MY" },
    { href: "/consultation-requests", label: "신청현황" },
  ];

  return (
    <>
      <div className="grid grid-cols-3 gap-2 items-end">
        <div className="flex gap-2 h-fit">
          {links.map((link) => (
            <Link
              key={link.href}
              className={`border py-1.5 px-8 rounded-md flex items-center rounded-b-none border-b-0 ${
                pathname === link.href ? "bg-stone-600 text-white" : ""
              }`}
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
        </div>
        {/* TODO: 학생 이름 표시 */}
        <h2 className="text-xl text-center font-semibold mb-4">OOO님의 면담 일정</h2>
        <div className="flex justify-end">
          <ProfessorSearchModal />
        </div>
      </div>
    </>
  );
};

export default memo(StudentsHeader);
