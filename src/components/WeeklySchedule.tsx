"use client";

import { format, startOfWeek, addDays } from "date-fns";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";

import {
  DAYS,
  INTERVIEW_MODAL_TYPE,
  InterviewStatus,
  RoleViewType,
  TIMES,
  UserRole,
} from "@/common/const";
import StatusBadge from "@/components/StatusBadge";
import { cn } from "@/lib/utils";
import { useDateStore } from "@/store/dateStore";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { DEFAULT_INTERVIEW_INFO, InterviewInfo } from "@/types/interview";
import { ProfessorAllowDate } from "@/types/user";
import { useUserStore } from "@/store/userStore";

interface WeeklyScheduleProps {
  events: InterviewInfo[];
  roleViewType: RoleViewType;
  allowDateList?: ProfessorAllowDate[];
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
  const openInterviewModal = useInterviewModalStore(state => state.open);
  const setInterviewInfo = useInterviewModalStore(state => state.setInterviewInfo);
  const userInfo = useUserStore(state => state.userInfo);

  const handleClick = (date: Date, event: InterviewInfo | undefined, isDateAvailable: boolean) => {
    if (!isDateAvailable) return; // 면담 신청 가능한 날짜가 아닌 경우 바로 리턴

    const handlers: Partial<Record<RoleViewType, () => void>> = {
      [RoleViewType.STUDENT_ON_STUDENT]: () => {
        // 면담 일정이 없으면 교수 검색 모달
        if (!event) {
          openProfessorSearch();
          return;
        }
        // 면담 일정이 있으면 신청현황으로 이동
        router.push(`/student/interview-requests?tab=day&date=${format(date, "yyyy-MM-dd")}`);
        setCurrentDate(date);
      },
      [RoleViewType.STUDENT_ON_PROFESSOR]: () => {
        // 면담 일정이 있으면 면담 조회 모달
        if (event) {
          openInterviewModal(event, INTERVIEW_MODAL_TYPE.LIST);
          setInterviewInfo(event);
          return;
        }
        // 면담 일정이 없으면 새 면담 신청 모달
        openInterviewModal(null, INTERVIEW_MODAL_TYPE.CREATE);
        setInterviewInfo({
          ...DEFAULT_INTERVIEW_INFO,
          interview_date: format(date, "yyyy-MM-dd"), // 클릭된 날짜 전달
          interview_state: InterviewStatus.REQUESTED,
        });
      },
      [RoleViewType.PROFESSOR_ON_PROFESSOR]: () => {
        openInterviewModal(event || null, INTERVIEW_MODAL_TYPE.LIST);
        setInterviewInfo({
          ...DEFAULT_INTERVIEW_INFO,
          interview_date: format(date, "yyyy-MM-dd"),
        });
      },
    };

    const handler = handlers[props.roleViewType];
    if (handler) {
      handler();
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
        event.interview_date === dateStr &&
        event.interview_time.some(timeSlot => {
          const [slotStartTime] = timeSlot.split(" - ");
          return slotStartTime === startTime;
        })
      );
    });
  };

  const isInterviewStatus = (value: any): value is InterviewStatus => {
    return Object.values(InterviewStatus).includes(value);
  };

  return (
    <>
      <div className="grid grid-cols-[45px_1fr] border-b pb-2 md:grid-cols-[100px_1fr]">
        <div className="flex items-center justify-center text-sm font-semibold text-gray-600">
          시간
        </div>
        <div className="grid grid-cols-5 gap-2 text-center text-sm font-semibold text-gray-600">
          {weekDates.map((date, i) => (
            <div key={i}>
              <div>{DAYS[i]}</div>
              <div className="text-xs text-gray-600">{format(date, "MM.dd")}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[45px_1fr] text-center md:grid-cols-[100px_1fr]">
        {/* 시간대 컬럼 */}
        <div className="space-y-2">
          {TIMES.map((time, i) => {
            const [start] = time.split(" - ");
            return (
              <div
                key={i}
                className="mt-2 flex h-10 flex-col items-center justify-center text-xs leading-tight font-medium"
              >
                {start}
                <span className="text-[10px] text-gray-500">(30분)</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {weekDates.map((date, dayIndex) => (
            <div key={dayIndex} className="space-y-2">
              {TIMES.map((time, timeIndex) => {
                const event = findEvent(date, time);
                const dateStr = format(date, "yyyy-MM-dd");

                // 학생 유저가 교수 화면 조회할 경우, 해당 날짜의 면담 가능 여부 확인하여 버튼 활성화
                const isStudentDateAvailable =
                  props.roleViewType === RoleViewType.STUDENT_ON_PROFESSOR
                    ? (props.allowDateList?.some(allowDate => {
                        const isMatchingDate = allowDate.allow_date === dateStr;
                        const hasAvailableTime = allowDate.allow_time.length > 0;
                        // 허용된 시간과 이미 신청된 시간의 개수가 같으면 모두 신청된 것으로 판단
                        const isFullyBooked =
                          allowDate.allow_time.length === allowDate.already_apply_time?.length;

                        return isMatchingDate && hasAvailableTime && !isFullyBooked;
                      }) ??
                        false) ||
                      event?.interview_date === dateStr // 학생 유저 본인이 이미 신청한 면담 일정인 경우도 클릭 가능
                    : true;

                // 교수 유저: 해당 날짜의 모든 시간을 비활성화 해놓았다면 클릭도 비활성화
                const isProfessorDateAvailable =
                  props.allowDateList?.some(allowDate => {
                    const isMatchingDate = allowDate.allow_date === dateStr;
                    const isMatchingTime = allowDate.allow_time.every(time =>
                      TIMES.some(event => event === time)
                    );
                    return isMatchingDate && isMatchingTime;
                  }) ?? false;

                const isDateAvailable =
                  props.roleViewType === RoleViewType.PROFESSOR_ON_PROFESSOR
                    ? isProfessorDateAvailable
                    : isStudentDateAvailable;

                return (
                  <div
                    key={`${dayIndex}-${timeIndex}`}
                    className={cn(
                      "mt-2 flex h-10 items-center justify-center rounded-md",
                      event ? "" : "rounded-md border",
                      !isDateAvailable && "cursor-not-allowed bg-gray-200 opacity-50"
                    )}
                    role="button"
                    {...(isDateAvailable && {
                      onClick: () => handleClick(date, event, isDateAvailable),
                    })}
                  >
                    {event && (
                      <StatusBadge
                        status={(() => {
                          const fallbackStatus = InterviewStatus.CONFIRMED;

                          let derivedStatus: string | null | undefined;

                          if (event.interview_state === InterviewStatus.RECORDED) {
                            if (userInfo?.role === UserRole.STUDENT) {
                              derivedStatus = event.interview_record_state_student;
                            } else if (userInfo?.role === UserRole.PROFESSOR) {
                              derivedStatus = event.interview_record_state_professor;
                            }
                          } else {
                            derivedStatus = event.interview_state;
                          }

                          return isInterviewStatus(derivedStatus) ? derivedStatus : fallbackStatus;
                        })()}
                      />
                    )}
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
