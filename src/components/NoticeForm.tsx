"use client";

import Link from "next/link";
import { memo, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const NoticeForm = () => {
  const [notice, setNotice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotice = async () => {
    try {
      const res = await fetch("/api/interview/notice");
      if (!res.ok) throw new Error("공지 조회 실패");
      const { data } = await res.json();
      if (data) {
        setNotice(data.notice_content || "");
      }
    } catch (error) {
      console.error("공지 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchNotice();
  }, []);

  // 저장 버튼 핸들러
  const handleSave = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/interview/notice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notice_content: notice,
          last_update_at: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error("공지 업데이트 실패");

      alert("공지사항이 저장되었습니다.");
      await fetchNotice(); // 저장 후 최신 상태로 재조회
    } catch (error) {
      console.error(error);
      alert("공지 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
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
            <Button className="ml-auto flex max-w-fit" onClick={handleSave} disabled={isSubmitting}>
              저장
            </Button>
          </div>

          <div className="rounded-xl bg-[#F7F7F7] p-6 shadow-xl">
            <h4 className="text-primary text-xl font-bold">OOO 교수님 면담 신청</h4>
            <p className="text-sm text-gray-500">
              <b className="text-primary text-lg">학생에게 보이는 화면 예시 입니다.</b>
              <br /> ※ 공지 외 정보는{" "}
              <Link href="/professor/my" className="underline">
                내 정보
              </Link>{" "}
              에서 수정해주세요.
            </p>
            <Separator className="mt-2 mb-1.5" />
            <b className="text-primary mb-1.5 inline-block text-lg">교수님 공지사항</b>
            <div className="bg-primary h-[15rem] w-full overflow-y-auto p-3 text-left text-base font-semibold whitespace-pre-line text-white">
              {notice}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(NoticeForm);
