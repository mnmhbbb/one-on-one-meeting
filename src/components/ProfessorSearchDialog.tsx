import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ProfessorSearchDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-neutral-400 max-w-auto mb-4 max-w-fit">
          <Search className="mr-2 h-4 w-4" />
          교수님을 검색하세요.
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>교수 검색창</DialogTitle>
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
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
                  <div className="font-semibold">OOO 교수님</div>
                  <div className="text-sm text-gray-500">OOOO학과</div>
                </div>
                <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
                  <div className="font-semibold">OOO 교수님</div>
                  <div className="text-sm text-gray-500">OOOO학과</div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="all">
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
                  <div className="font-semibold">OOO 교수님</div>
                  <div className="text-sm text-gray-500">OOOO학과</div>
                </div>
                <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
                  <div className="font-semibold">OOO 교수님</div>
                  <div className="text-sm text-gray-500">OOOO학과</div>
                </div>
                <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
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
}
