"use client";

import { format, startOfWeek, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";

import { DAYS, InterviewStatus, RoleViewType, TIMES } from "@/common/const";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { useDateStore } from "@/store/dateStore";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { InterviewInfo } from "@/utils/data/mockData";
interface WeeklyScheduleProps {
  events: InterviewInfo[];
  roleViewType: RoleViewType;
}

const WeeklySchedule = (props: WeeklyScheduleProps) => {
  const router = useRouter();
  const { currentDate, setCurrentDate } = useDateStore(
    useShallow(state => ({
      currentDate: state.currentDate,
      setCurrentDate: state.setCurrentDate,
    }))
  );
  const openProfessorSearch = useInterviewModalStore(state => state.openProfessorSearch);

  const handleClick = (date: Date, event: InterviewInfo | undefined) => {
    if (!event) {
      if (props.roleViewType === RoleViewType.STUDENT_ON_STUDENT) openProfessorSearch();
      // TODO: 면담신청모달 if (props.roleViewType === RoleViewType.STUDENT_ON_PROFESSOR)
    } else {
      if (props.roleViewType === RoleViewType.STUDENT_ON_STUDENT) {
        router.push("/student/interview-requests?tab=day");
        setCurrentDate(date);
      }
    }
  };
  // 현재 주의 월요일부터 금요일까지의 날짜 배열 생성
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // 1은 월요일
  const weekDates = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  // 특정 날짜와 시간에 해당하는 이벤트 찾기
  const findEvent = (date: Date, time: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const [startTime] = time.split(" - ");
    return props.events.find(event => {
      return (
        event.date === dateStr &&
        event.time.some(timeSlot => {
          const [slotStartTime] = timeSlot.split(" ~ ");
          return slotStartTime === startTime;
        })
      );
    });
  };

  return (
    <>
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
            <div key={i} className="h-5 pt-2 text-xs text-gray-400">
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
                      "mt-2 flex h-5 items-center justify-center rounded-md",
                      event ? "" : "bg-gray-50"
                    )}
                    role="button"
                    onClick={() => handleClick(date, event)}
                  >
                    {event && <StatusBadge status={event.status as InterviewStatus} />}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default memo(WeeklySchedule);
