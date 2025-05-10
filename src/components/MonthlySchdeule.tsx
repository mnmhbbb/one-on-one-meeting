import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  subDays,
  addDays,
} from "date-fns";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";

import { InterviewStatus, RoleViewType, STATUS_COLORS, STATUS_LABELS } from "@/common/const";
import { cn } from "@/lib/utils";
import { useDateStore } from "@/store/dateStore";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { InterviewInfo } from "@/utils/data/mockData";

const WEEKDAYS = Array.from({ length: 7 }, (_, i) => dayjs().day(i).format("ddd"));

interface MonthlyScheduleProps {
  events: InterviewInfo[];
  roleViewType: RoleViewType;
}

const MonthlySchedule = (props: MonthlyScheduleProps) => {
  const router = useRouter();
  const { currentDate, setCurrentDate } = useDateStore(
    useShallow(state => ({
      currentDate: state.currentDate,
      setCurrentDate: state.setCurrentDate,
    }))
  );
  const openProfessorSearch = useInterviewModalStore(state => state.openProfessorSearch);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const handleClick = (date: Date, events: InterviewInfo[]) => {
    if (events.length === 0) {
      if (props.roleViewType === RoleViewType.STUDENT_ON_STUDENT) openProfessorSearch();
      // TODO: 면담신청모달 if (props.roleViewType === RoleViewType.STUDENT_ON_PROFESSOR)
    } else {
      if (props.roleViewType === RoleViewType.STUDENT_ON_STUDENT) {
        router.push("/student/interview-requests?tab=day");
        setCurrentDate(date);
      }
    }
  };

  // 이전 달의 날짜들 계산
  // startDay: 현재 월의 1일이 무슨 요일인지 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  const startDay = monthStart.getDay();
  // 1일이 일요일이 아니라면, 이전 달의 날짜들로 첫 주를 채움
  const prevMonthDays =
    startDay > 0
      ? Array.from({ length: startDay }, (_, i) => subDays(monthStart, startDay - i))
      : [];

  // 다음 달의 날짜들 계산
  // endDay: 현재 월의 마지막 날이 무슨 요일인지 (0: 일요일, 1: 월요일, ..., 6: 토요일)
  const endDay = monthEnd.getDay();
  // 마지막 날이 토요일이 아니라면, 다음 달의 날짜들로 마지막 주를 채움
  const nextMonthDays =
    endDay < 6 ? Array.from({ length: 6 - endDay }, (_, i) => addDays(monthEnd, i + 1)) : [];

  // 현재 달의 모든 날짜를 배열로 생성 (1일부터 마지막날까지)
  const currentMonthDays = eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  });

  // 이전 달, 현재 달, 다음 달의 날짜들을 하나의 배열로 합침
  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

  return (
    <>
      <div className="grid grid-cols-7 gap-2 border-b pb-2 text-center text-sm font-semibold text-gray-600">
        {WEEKDAYS.map((day, i) => (
          <div key={i}>{day}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2 text-sm">
        {allDays.map((date, i) => {
          // 각 날짜에 해당하는 이벤트들을 찾음 (최대 3개까지)
          const dateStr = format(date, "yyyy-MM-dd");
          const dayEvents = props.events.filter(e => e.date.startsWith(dateStr)).slice(0, 3);

          return (
            <div
              key={i}
              className={cn(
                "relative min-h-[60px] rounded border p-1",
                !isSameMonth(date, currentDate) && "text-gray-400" // 현재 달의 날짜가 아닌 경우 회색으로 표시
              )}
              role="button"
              onClick={() => handleClick(date, dayEvents)}
            >
              {/* 날짜 숫자 표시 */}
              <div className="mb-1 text-xs font-semibold">{format(date, "d")}</div>
              {/* 면담 상태 표시 */}
              <div className="flex flex-col gap-0.5">
                {dayEvents.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={cn(
                      "rounded px-1 py-0.5 text-center text-xs",
                      STATUS_COLORS[event.status as InterviewStatus]
                    )}
                  >
                    {STATUS_LABELS[event.status as InterviewStatus]}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default memo(MonthlySchedule);
