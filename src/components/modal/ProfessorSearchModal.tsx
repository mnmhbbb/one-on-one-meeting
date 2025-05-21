"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { memo, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import LoadingUI from "@/components/LoadingUI";
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
import { useDateStore } from "@/store/dateStore";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { Professor } from "@/types/user";
import { professorApi } from "@/utils/api/professor";
import { userApi } from "@/utils/api/user";

const ProfessorSearchModal = () => {
  const queryClient = useQueryClient();

  const pathname = usePathname();
  const router = useRouter();

  const { isProfessorSearchOpen, closeProfessorSearch, setPathname } = useInterviewModalStore(
    useShallow(state => ({
      isProfessorSearchOpen: state.isProfessorSearchOpen,
      closeProfessorSearch: state.closeProfessorSearch,
      setPathname: state.setPathname,
    }))
  );
  const interviewList = useDateStore(state => state.interviewList);
  const setInterviewList = useDateStore(state => state.setInterviewList);

  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [searchWord, setSearchWord] = useState<string>("");

  // 학부 목록 조회
  const { data: collegesData, isLoading: isCollegesLoading } = useQuery({
    queryKey: ["colleges"],
    queryFn: async () => {
      const res = await userApi.getDepartmentColleges();
      if (!res) return [];
      const uniqueColleges = Array.from(new Set(res.data.map(item => item.college)));
      return [{ value: "all", label: "전체" }].concat(
        uniqueColleges.map(college => ({
          value: college,
          label: college,
        }))
      );
    },
    enabled: isProfessorSearchOpen,
  });

  // 즐겨찾기 토글
  const toggleFavoriteMutation = useMutation({
    mutationFn: (professorId: string) => professorApi.postBookmark(professorId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favoriteProfessors"] });
    },
  });

  // 전체 교수 목록 조회
  const { data: professorsData, isLoading: isProfessorsLoading } = useQuery({
    queryKey: ["professors"],
    queryFn: async () => {
      const res = await professorApi.getProfessors();
      return res?.professors ?? [];
    },
    enabled: isProfessorSearchOpen,
  });

  // 즐겨찾기 교수 목록 조회
  const { data: favoriteProfessorsData, isLoading: isFavoriteProfessorsLoading } = useQuery({
    queryKey: ["favoriteProfessors"],
    queryFn: async () => {
      const res = await professorApi.getFavoriteProfessors();
      return res?.professors ?? [];
    },
    enabled: isProfessorSearchOpen,
  });

  // 검색 모달이 열려있는 상태에서 페이지 변경 시 모달 닫음
  useEffect(() => {
    setPathname(pathname);
  }, [pathname, setPathname]);

  const handleProfessorClick = (professorId: string) => {
    const targetPath = `/student/professor/${professorId}`;
    // 이미 해당 교수 페이지에 있을 경우 모달 닫기
    if (pathname === targetPath) {
      closeProfessorSearch();
    } else {
      // 해당 교수 페이지로 이동
      // 면담 목록 중 해당 교수의 면담 데이터만 필터링하여 저장
      setInterviewList(interviewList.filter(interview => interview.professor_id === professorId));
      router.push(targetPath);
    }
  };

  const toggleFavorite = (professorId: string) => {
    toggleFavoriteMutation.mutate(professorId);
  };

  // 즐겨찾기 교수 목록
  const favoriteProfessors = (favoriteProfessorsData ?? [])
    .filter(professor => selectedDepartment === "all" || professor.college === selectedDepartment)
    .filter(professor => searchWord === "" || professor.name.includes(searchWord));

  // 전체 교수 목록
  const allProfessors = (professorsData ?? [])
    .filter(professor => selectedDepartment === "all" || professor.college === selectedDepartment)
    .filter(professor => searchWord === "" || professor.name.includes(searchWord));

  const renderProfessorCard = (professor: Professor) => {
    const isFavorite = (favoriteProfessorsData ?? []).some(p => p.id === professor.id);

    return (
      <div
        key={professor.id}
        onClick={() => handleProfessorClick(professor.id)}
        className="group relative cursor-pointer rounded-lg border p-4 hover:bg-gray-100"
      >
        <div className="font-semibold">{professor.name}</div>
        <div className="text-sm text-gray-500">{professor.college}</div>

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

  const isLoading = isCollegesLoading || isProfessorsLoading || isFavoriteProfessorsLoading;

  return (
    <Dialog open={isProfessorSearchOpen} onOpenChange={closeProfessorSearch}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>교수 검색창</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        {isLoading && <LoadingUI />}
        <div className="space-y-4">
          <Input
            placeholder="교수님을 검색하세요."
            onChange={e => setSearchWord(e.target.value)}
            value={searchWord}
            className="mb-3"
          />
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="학과를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {collegesData?.map(dept => (
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
                {favoriteProfessors.length > 0 ? (
                  favoriteProfessors.map(renderProfessorCard)
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    {searchWord ? "검색 결과가 없습니다." : "즐겨찾기한 교수가 없습니다."}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="all">
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                {allProfessors.length > 0 ? (
                  allProfessors.map(renderProfessorCard)
                ) : (
                  <div className="py-4 text-center text-gray-500">
                    {searchWord ? "검색 결과가 없습니다." : "등록된 교수가 없습니다."}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default memo(ProfessorSearchModal);
