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
  email: string;
  name: string;
  college: string;
  phone_num: string;
  interview_location: string;
  isFavorite: boolean;
}

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
  const [colleges, setColleges] = useState<{ value: string; label: string }[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  // DB에서 가져온 즐겨찾기 교수들의 id만 모아서 저장
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  // 학과 불러오기
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await fetch("/api/professor/search/department");
        const { colleges } = await res.json();

        const formatted = [{ value: "all", label: "전체" }].concat(
          colleges.map((c: string) => ({
            value: c,
            label: c,
          }))
        );

        setColleges(formatted);
      } catch (e) {
        console.error("학과 목록을 불러오지 못했습니다.", e);
      }
    };

    fetchColleges();
  }, []);

  // 즐겨찾기 토글 요청
  const toggleFavorite = async (professorId: string) => {
    try {
      const res = await fetch("/api/professor/search/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professor_id: professorId }),
      });

      const result = await res.json();
      setFavoriteIds(prev => {
        const updated = new Set<string>(prev);
        if (result.status === "added") {
          updated.add(professorId);
        } else {
          updated.delete(professorId);
        }
        return updated;
      });
    } catch (err) {
      console.error("즐겨찾기 토글 실패", err);
    }
  };

  // 즐겨찾기, 전체 가져오기
  useEffect(() => {
    const fetchData = async () => {
      const [allRes, favRes] = await Promise.all([
        fetch("/api/professor/search/all").then(res => res.json()),
        fetch("/api/professor/search/bookmark").then(res => res.json()),
      ]);

      const favoriteSet = new Set<string>(favRes.professors.map((p: Professor) => p.id));
      setFavoriteIds(favoriteSet);
      setProfessors(allRes.professors);
    };

    fetchData();
  }, []);

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

  const filteredProfessors = professors.filter(
    professor => selectedDepartment === "all" || professor.college === selectedDepartment
  );

  const renderProfessorCard = (professor: Professor) => {
    const isFavorite = favoriteIds.has(professor.id);

    return (
      <div
        key={professor.id}
        onClick={() => handleProfessorClick(professor.id)}
        className="group relative cursor-pointer rounded-lg border p-4 hover:bg-gray-100"
      >
        <div className="font-semibold">{professor.name}</div>
        <div className="text-sm text-gray-500">{professor.college}학과</div>

        <div
          onClick={e => {
            e.stopPropagation(); // 카드 클릭 방지
            toggleFavorite(professor.id);
          }}
          className="absolute top-4 right-4 text-xl text-yellow-500"
        >
          {isFavorite ? "★" : "☆"}
        </div>
      </div>
    );
  };

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
              {colleges.map(dept => (
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
                {filteredProfessors.filter(p => favoriteIds.has(p.id)).map(renderProfessorCard)}
              </div>
            </TabsContent>
            <TabsContent value="all">
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                {filteredProfessors.map(renderProfessorCard)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ProfessorSearchModal);
