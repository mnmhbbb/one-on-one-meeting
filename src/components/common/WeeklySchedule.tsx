"use client";

import { memo } from "react";
import { format, startOfWeek, addDays } from "date-fns";
import { DAYS, TIMES } from "@/common/const";
import useDateStore from "@/store/dateStore";
import { cn } from "@/lib/utils";
import { InterviewInfo } from "@/utils/data/mockData";
import StatusBadge from "@/components/common/StatusBadge";

const WeeklySchedule = ({ events }: { events: InterviewInfo[] }) => {
  const { currentDate } = useDateStore();

  // 현재 주의 월요일부터 금요일까지의 날짜 배열 생성
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1은 월요일
  const weekDates = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  // 특정 날짜와 시간에 해당하는 이벤트 찾기
  const findEvent = (date: Date, time: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const [startTime] = time.split(" - ");
    return events.find((event) => event.date === `${dateStr} ${startTime}`);
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-[100px_1fr] border-b pb-2">
        <div className="text-sm font-semibold text-gray-400">시간</div>
        <div className="grid grid-cols-5 gap-2 text-center text-sm font-semibold text-gray-600">
          {weekDates.map((date, i) => (
            <div key={i}>
              <div>{DAYS[i]}</div>
              <div className="text-xs text-gray-400">{format(date, "MM.dd")}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[100px_1fr]">
        {/* 시간대 컬럼 */}
        <div className="space-y-2">
          {TIMES.map((time, i) => (
            <div key={i} className="h-5 text-xs text-gray-400 pt-2">
              {time.split(" - ")[0]}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {weekDates.map((date, dayIndex) => (
            <div key={dayIndex} className="space-y-2">
              {TIMES.map((time, timeIndex) => {
                const event = findEvent(date, time);
                return (
                  <div
                    key={`${dayIndex}-${timeIndex}`}
                    className={cn(
                      "h-5 rounded-md flex justify-center items-center mt-2",
                      event ? "" : "bg-gray-50",
                    )}
                  >
                    {event && <StatusBadge status={event.status} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(WeeklySchedule);
