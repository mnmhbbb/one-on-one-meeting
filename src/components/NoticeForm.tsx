"use client";

import Link from "next/link";
import { memo, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToastStore } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { professorApi } from "@/utils/api/professor";
import { useUserStore } from "@/store/userStore";

const NoticeForm = () => {
  const [notice, setNotice] = useState("");
  const setToast = useToastStore(state => state.setToast);
  const queryClient = useQueryClient();
  const userInfo = useUserStore(state => state.userInfo);

  // 교수 본인 공지 조회
  const { data } = useQuery({
    queryKey: ["ProfessorNotice"],
    queryFn: async () => {
      const result = await professorApi.getProfessorNotice();
      return result;
    },
    select: res => res?.data || null,
  });
  useEffect(() => {
    if (data) {
      setNotice(data.notice_content || "");
    }
  }, [data]);

  // 저장 버튼 핸들러
  const useSaveProfessorNoticeMutation = ({
    setToast,
  }: {
    setToast: (message: string, type: "success" | "error") => void;
  }) => {
    return useMutation({
      mutationFn: async (notice: string) => {
        const response = await professorApi.putProfessorNotice(notice);
        return response;
      },
      onSuccess: () => {
        setToast("공지사항이 저장되었습니다.", "success");
        queryClient.invalidateQueries({ queryKey: ["ProfessorNotice"] });
      },
      onError: () => {
        setToast("공지 저장 중 오류가 발생했습니다.", "error");
      },
    });
  };
  const { mutate: saveNotice, isPending } = useSaveProfessorNoticeMutation({ setToast });

  const handleSave = () => {
    if (!notice || isPending) return;
    saveNotice(notice);
  };

  const formatProfessorInfo = () => {
    return `- 이메일: ${userInfo?.notification_email}\n- 면담 위치: ${userInfo?.interview_location}`;
  };
  return (
    <Card className="rounded-l-none">
      <CardContent>
        <h3 className="text-primary text-xl font-bold">공지 등록(500자 이내)</h3>
        <div className="mt-2 grid grid-cols-2 gap-12">
          <div className="flex flex-col gap-3 rounded-xl bg-[#F7F7F7] p-6 shadow-xl">
            <Textarea
              className="h-[20rem] overflow-y-auto border-none p-0 !text-base shadow-none outline-none focus-visible:ring-0"
              placeholder="공지 내용을 입력하세요."
              value={notice}
              onChange={e => setNotice(e.target.value)}
              maxLength={500}
            />
            <Button onClick={handleSave} disabled={isPending}>
              {isPending ? "저장 중..." : "저장"}
            </Button>
          </div>

          <div className="rounded-xl bg-[#F7F7F7] p-6 shadow-xl">
            <h4 className="text-primary text-xl font-bold">{userInfo?.name} 교수님 면담 신청</h4>
            <p className="text-sm text-gray-500">
              <b className="text-primary text-lg">학생에게 보이는 화면 예시 입니다.</b>
              <br /> ※ 공지 외 정보는{" "}
              <Link href="/mypage" className="underline">
                내 정보
              </Link>{" "}
              에서 수정해주세요.
            </p>
            <Separator className="mt-2 mb-1.5" />
            <b className="text-primary mb-1.5 inline-block text-lg">교수님 공지사항</b>

            <div className="bg-primary h-[15rem] w-full overflow-y-auto p-3 text-left text-base font-semibold whitespace-pre-line text-white">
              {formatProfessorInfo()}
              <br />
              <br />
              {notice}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(NoticeForm);
