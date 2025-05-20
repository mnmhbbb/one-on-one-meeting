"use client";

import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";

import LoadingUI from "@/components/LoadingUI";
import ProfessorSearchModal from "@/components/modal/ProfessorSearchModal";
import { Button } from "@/components/ui/button";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { useProfessorsStore } from "@/store/professorsStore";
import { Professor } from "@/types/user";
import { interviewApi } from "@/utils/api/interview";

const ProfessorScheduleHeaderForStudent = ({ professorId }: { professorId: string }) => {
  const pathname = usePathname();
  const openProfessorSearch = useInterviewModalStore(state => state.openProfessorSearch);
  const setSelectedProfessor = useProfessorsStore(state => state.setSelectedProfessor);

  const links = [{ href: "/student/my", label: "MY" }];

  // 현재 페이지(학생 유저가 교수 페이지 방문) id를 통해 교수 정보 조회
  const { data: professorInfo, isLoading: professorInfoLoading } = useQuery<
    { data: Professor } | null,
    Error
  >({
    queryKey: ["professorInfo", professorId],
    queryFn: async () => {
      const result = await interviewApi.getProfessorInfo(professorId);
      setSelectedProfessor(result?.data || null);
      return result;
    },
    enabled: !!professorId,
  });

  return (
    <>
      {professorInfoLoading && <LoadingUI />}
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
        <h2 className="mb-4 text-center text-xl font-semibold">
          {professorInfo?.data.name} 교수님의 면담 일정
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
    </>
  );
};

export default memo(ProfessorScheduleHeaderForStudent);
