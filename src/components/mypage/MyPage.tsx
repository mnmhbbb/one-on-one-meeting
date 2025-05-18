"use client";

import { useUserStore } from "@/store/userStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { UserRole } from "@/common/const";
import { useQuery } from "@tanstack/react-query";

export const MyPage = () => {
  const role = useUserStore(state => state.role);

  // 전체 교수 목록 조회
  // const { data: professorsData, isLoading: isProfessorsLoading } = useQuery({
  //   queryKey: ["professors"],
  //   queryFn: async () => {
  //     const res = await professorApi.getProfessors();
  //     return res?.professors ?? [];
  //   },
  //   enabled: isProfessorSearchOpen,
  // });

  return (
    <div className="mx-auto max-w-xl py-8">
      <h1 className="mb-8 text-center text-2xl font-medium text-[#6b5545]">내 정보</h1>

      <div className="overflow-hidden rounded-lg bg-white p-8 shadow-md">
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block font-medium text-[#6b5545]">
              아이디
            </label>
            <Input
              type="email"
              id="email"
              defaultValue="OOOO@naver.com"
              disabled
              className="w-full rounded-md border-0 bg-[#f8f6f4] p-3 ring-1 ring-[#6b5545]/20 transition-all outline-none focus:ring-2 focus:ring-[#6b5545] disabled:pointer-events-auto"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="block font-medium text-[#6b5545]">
              이름
            </label>
            <Input
              type="text"
              id="name"
              defaultValue="OOO"
              disabled
              className="w-full rounded-md border-0 bg-[#f8f6f4] p-3 ring-1 ring-[#6b5545]/20 transition-all outline-none focus:ring-2 focus:ring-[#6b5545] disabled:pointer-events-auto"
            />
          </div>

          {role === UserRole.STUDENT && (
            <div className="space-y-2">
              <label htmlFor="studentId" className="block font-medium text-[#6b5545]">
                학번
              </label>
              <Input
                type="text"
                id="studentId"
                defaultValue="20250000"
                disabled
                className="w-full rounded-md border-0 bg-[#f8f6f4] p-3 ring-1 ring-[#6b5545]/20 transition-all outline-none focus:ring-2 focus:ring-[#6b5545] disabled:pointer-events-auto"
              />
            </div>
          )}

          {role === UserRole.PROFESSOR && (
            <div className="space-y-2">
              <label htmlFor="studentId" className="block font-medium text-[#6b5545]">
                교번
              </label>
              <Input
                type="text"
                id="studentId"
                defaultValue="20250000"
                disabled
                className="w-full rounded-md border-0 bg-[#f8f6f4] p-3 ring-1 ring-[#6b5545]/20 transition-all outline-none focus:ring-2 focus:ring-[#6b5545] disabled:pointer-events-auto"
              />
            </div>
          )}

          {role === "student" && (
            <div className="space-y-2">
              <label htmlFor="department" className="block font-medium text-[#6b5545]">
                학과
              </label>
              <Input
                type="text"
                id="department"
                defaultValue="OOOO학과"
                className="w-full rounded-md border-0 bg-[#f8f6f4] p-3 ring-1 ring-[#6b5545]/20 transition-all outline-none focus:ring-2 focus:ring-[#6b5545]"
              />
            </div>
          )}

          {role === "professor" && (
            <div className="space-y-2">
              <label htmlFor="department" className="block font-medium text-[#6b5545]">
                학부
              </label>
              <Input
                type="text"
                id="department"
                defaultValue="OOOO학과"
                className="w-full rounded-md border-0 bg-[#f8f6f4] p-3 ring-1 ring-[#6b5545]/20 transition-all outline-none focus:ring-2 focus:ring-[#6b5545]"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="department" className="block font-medium text-[#6b5545]">
              전화번호
            </label>
            <Input
              type="text"
              id="department"
              defaultValue="OOOO학과"
              className="w-full rounded-md border-0 bg-[#f8f6f4] p-3 ring-1 ring-[#6b5545]/20 transition-all outline-none focus:ring-2 focus:ring-[#6b5545]"
            />
          </div>

          {role === "professor" && (
            <div className="space-y-2">
              <label htmlFor="department" className="block font-medium text-[#6b5545]">
                면담 장소
              </label>
              <Input
                type="text"
                id="department"
                defaultValue="OOOO학과"
                className="w-full rounded-md border-0 bg-[#f8f6f4] p-3 ring-1 ring-[#6b5545]/20 transition-all outline-none focus:ring-2 focus:ring-[#6b5545]"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="department" className="block font-medium text-[#6b5545]">
              알림 이메일
            </label>
            <Input
              type="text"
              id="department"
              defaultValue="OOOO학과"
              className="w-full rounded-md border-0 bg-[#f8f6f4] p-3 ring-1 ring-[#6b5545]/20 transition-all outline-none focus:ring-2 focus:ring-[#6b5545]"
            />
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button
              type="button"
              className="rounded-md border border-[#6b5545] bg-white px-5 py-2 text-[#6b5545] transition-all hover:bg-[#6b5545]/5"
            >
              메인으로
            </Button>
            <Button
              type="submit"
              className="rounded-md bg-[#6b5545] px-5 py-2 text-white transition-all hover:bg-[#5a4838]"
            >
              저장
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
