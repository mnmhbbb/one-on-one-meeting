import clsx from "clsx"; // tailwind-merge 또는 clsx 추천
import { memo, useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useInterviewModalStore } from "@/store/interviewModalStore";

type TimeSlot = {
  time: string;
  type: "available" | "interview" | "impossible";
};

interface TimeSelectProps {
  timeList: TimeSlot[];
}

const TimeSelect = ({ timeList }: TimeSelectProps) => {
  const setSelectedTime = useInterviewModalStore(state => state.setSelectedTime);

  const [selected, setSelected] = useState<string[]>(
    timeList.filter(t => t.type === "interview").map(t => t.time)
  );

  useEffect(() => {
    // 선택된 시간을 스토어에 저장
    setSelectedTime(selected);
  }, [selected, setSelectedTime]);

  const toggleTime = useCallback((time: string, type: TimeSlot["type"]) => {
    if (type === "impossible") return;
    setSelected(prev => (prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2">
      {timeList.map(({ time, type }) => {
        const isSelected = selected.includes(time);
        const isDisabled = type === "impossible";

        return (
          <Button
            key={time}
            type="button"
            variant="ghost"
            disabled={isDisabled}
            onClick={() => toggleTime(time, type)}
            className={clsx(
              "h-10 rounded-md border border-gray-300 text-sm font-semibold",
              // 면담 신청 불가능한 시간
              isDisabled && "cursor-not-allowed border-gray-50 bg-gray-200 text-gray-400",

              // 면담 신청 가능한 시간
              type === "available" && !isSelected && "bg-white",

              // 현재 선택된 시간(기존에 신청한 면담 포함)
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
export default memo(TimeSelect);
