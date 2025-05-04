"use client";

import { memo } from "react";

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

const ProfessorSearchModal = () => {
  const { isProfessorSearchOpen, closeProfessorSearch } = useInterviewModalStore();

  return (
    <Dialog open={isProfessorSearchOpen} onOpenChange={closeProfessorSearch}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>교수 검색창</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="교수님을 검색하세요." className="mb-3" />
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="학과를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="콘텐츠IT">콘텐츠IT</SelectItem>
              <SelectItem value="빅데이터">빅데이터</SelectItem>
              <SelectItem value="스마트IoT">스마트IoT</SelectItem>
            </SelectContent>
          </Select>
          {/* 이 부분에 Tabs로 즐겨찾기 / 전체보기 */}
          <Tabs defaultValue="favorite">
            <TabsList className="w-full">
              <TabsTrigger value="favorite">즐겨찾기</TabsTrigger>
              <TabsTrigger value="all">전체보기</TabsTrigger>
            </TabsList>
            <TabsContent value="favorite">
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                <div className="cursor-pointer rounded-lg border p-4 hover:bg-gray-100">
                  <div className="font-semibold">OOO 교수님</div>
                  <div className="text-sm text-gray-500">OOOO학과</div>
                </div>
                <div className="cursor-pointer rounded-lg border p-4 hover:bg-gray-100">
                  <div className="font-semibold">OOO 교수님</div>
                  <div className="text-sm text-gray-500">OOOO학과</div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="all">
              <div className="max-h-[300px] space-y-2 overflow-y-auto">
                <div className="cursor-pointer rounded-lg border p-4 hover:bg-gray-100">
                  <div className="font-semibold">OOO 교수님</div>
                  <div className="text-sm text-gray-500">OOOO학과</div>
                </div>
                <div className="cursor-pointer rounded-lg border p-4 hover:bg-gray-100">
                  <div className="font-semibold">OOO 교수님</div>
                  <div className="text-sm text-gray-500">OOOO학과</div>
                </div>
                <div className="cursor-pointer rounded-lg border p-4 hover:bg-gray-100">
                  <div className="font-semibold">OOO 교수님</div>
                  <div className="text-sm text-gray-500">OOOO학과</div>
                </div>
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
