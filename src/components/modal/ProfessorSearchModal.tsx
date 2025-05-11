"use client";

import { usePathname, useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInterviewModalStore } from "@/store/interviewModalStore";

interface Professor {
  id: string;
  name: string;
  department: string;
  isFavorite: boolean;
}

const DEPARTMENTS = [
  { value: "all", label: "전체" },
  { value: "콘텐츠IT", label: "콘텐츠IT학과" },
  { value: "빅데이터", label: "빅데이터학과" },
  { value: "스마트IoT", label: "스마트IoT학과" },
];

// TODO: API 연동 후 제거
const MOCK_PROFESSORS: Professor[] = [
  { id: "1", name: "김철수 교수님", department: "콘텐츠IT", isFavorite: true },
  { id: "2", name: "이영희 교수님", department: "빅데이터", isFavorite: true },
  { id: "3", name: "박지민 교수님", department: "스마트IoT", isFavorite: false },
  { id: "4", name: "최수진 교수님", department: "콘텐츠IT", isFavorite: false },
  { id: "5", name: "정민호 교수님", department: "빅데이터", isFavorite: false },
];

const ProfessorSearchModal = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const { isProfessorSearchOpen, closeProfessorSearch, setPathname } = useInterviewModalStore(
    useShallow(state => ({
      isProfessorSearchOpen: state.isProfessorSearchOpen,
      closeProfessorSearch: state.closeProfessorSearch,
      setPathname: state.setPathname,
    }))
  );

  // 검색 모달이 열려있는 상태에서 페이지 변경 시 모달 닫음
  useEffect(() => {
    setPathname(pathname);
  }, [pathname, setPathname]);

  const handleProfessorClick = (professorId: string) => {
    const targetPath = `/student/professor/${professorId}`;
    // 이미 해당 교수 페이지에 있으면 모달 닫기
    if (pathname === targetPath) {
      closeProfessorSearch();
    } else {
      router.push(targetPath);
    }
  };

  const filteredProfessors = MOCK_PROFESSORS.filter(
    professor => selectedDepartment === "all" || professor.department === selectedDepartment
  );

  const renderProfessorCard = (professor: Professor) => (
    <div
      key={professor.id}
      onClick={() => handleProfessorClick(professor.id)}
      className="cursor-pointer rounded-lg border p-4 hover:bg-gray-100"
    >
      <div className="font-semibold">{professor.name}</div>
      <div className="text-sm text-gray-500">{professor.department}학과</div>
    </div>
  );

  return (
    <Dialog open={isProfessorSearchOpen} onOpenChange={closeProfessorSearch}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>교수 검색창</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="교수님을 검색하세요." className="mb-3" />
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="학과를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map(dept => (
                <SelectItem key={dept.value} value={dept.value}>
                  {dept.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Tabs defaultValue="favorite">
            <TabsList className="w-full">
              <TabsTrigger value="favorite">즐겨찾기</TabsTrigger>
              <TabsTrigger value="all">전체보기</TabsTrigger>
            </TabsList>
            <TabsContent value="favorite">
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                {filteredProfessors.filter(p => p.isFavorite).map(renderProfessorCard)}
              </div>
            </TabsContent>
            <TabsContent value="all">
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                {filteredProfessors.map(renderProfessorCard)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex justify-end">
          <Button>저장</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ProfessorSearchModal);
