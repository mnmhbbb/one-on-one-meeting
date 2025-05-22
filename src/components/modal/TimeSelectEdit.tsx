import clsx from "clsx"; // tailwind-merge 또는 clsx 추천
import { memo, useCallback, useEffect, useState } from "react";

import { TIMES } from "@/common/const";
import { Button } from "@/components/ui/button";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { ProfessorAllowDate } from "@/types/user";

interface TimeSelectEditProps {
  timeList: ProfessorAllowDate[];
}

// 면담 변경 시 면담 시간 선택
const TimeSelectEdit = ({ timeList }: TimeSelectEditProps) => {
  const interviewInfo = useInterviewModalStore(state => state.interviewInfo);
  const setSelectedTimeWhenEdit = useInterviewModalStore(state => state.setSelectedTimeWhenEdit);
  const [selected, setSelected] = useState<string[]>(() => interviewInfo?.interview_time || []);

  // interviewInfo의 날짜와 일치하는 시간 목록 찾기
  const filteredTimeList = timeList.find(time => time.allow_date === interviewInfo?.interview_date);

  // selected 상태가 변경될 때 setSelectedTimeWhenEdit 호출
  useEffect(() => {
    setSelectedTimeWhenEdit(selected);
  }, [selected, setSelectedTimeWhenEdit]);

  const toggleTime = useCallback((time: string) => {
    setSelected(prev => (prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]));
  }, []);

  if (!filteredTimeList) return null;

  return (
    <div className="grid grid-cols-2 gap-2">
      {TIMES.map(time => {
        // 면담 변경일 경우, 이미 신청된 면담 시간 중, 내가 신청한 면담 시간은 비활성화하지 않음
        const isApplied = filteredTimeList.already_apply_time?.some(
          appliedTime => !interviewInfo?.interview_time?.includes(appliedTime)
        );
        const isAvailable = filteredTimeList.allow_time.includes(time);
        const isSelected = selected.includes(time);

        return (
          <Button
            key={time}
            type="button"
            variant="ghost"
            disabled={!isAvailable || isApplied}
            onClick={() => toggleTime(time)}
            className={clsx(
              "h-10 rounded-md border border-gray-300 text-sm font-semibold",
              // 면담 신청 불가능한 시간 (허용되지 않거나 이미 신청됨)
              (!isAvailable || isApplied) &&
                "cursor-not-allowed border-gray-50 bg-gray-200 text-gray-400",

              // 면담 신청 가능한 시간
              isAvailable && !isApplied && !isSelected && "bg-white",

              // 현재 선택된 시간
              isSelected && "bg-primary text-white hover:bg-[#84644f] hover:text-white"
            )}
          >
            {time}
          </Button>
        );
      })}
    </div>
  );
};

export default memo(TimeSelectEdit);
