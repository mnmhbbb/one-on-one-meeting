import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  subDays,
  addDays,
} from "date-fns";
import { useRouter } from "next/navigation";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";

import {
  InterviewStatus,
  RoleViewType,
  STATUS_COLORS,
  INTERVIEW_MODAL_TYPE,
  TIMES,
  UserRole,
} from "@/common/const";
import { cn } from "@/lib/utils";
import { useDateStore } from "@/store/dateStore";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { InterviewInfo, DEFAULT_INTERVIEW_INFO } from "@/types/interview";
import { ProfessorAllowDate } from "@/types/user";
import { useUserStore } from "@/store/userStore";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface MonthlyScheduleProps {
  events: InterviewInfo[];
  allowDateList?: ProfessorAllowDate[];
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
  const userInfo = useUserStore(state => state.userInfo);
  const openProfessorSearch = useInterviewModalStore(state => state.openProfessorSearch);
  const openInterviewModal = useInterviewModalStore(state => state.open);
  const setInterviewInfo = useInterviewModalStore(state => state.setInterviewInfo);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);

  const handleClick = (date: Date, events: InterviewInfo[]) => {
    // 주말 체크 (0: 일요일, 6: 토요일)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend) return;

    const handlers: Partial<Record<RoleViewType, () => void>> = {
      [RoleViewType.STUDENT_ON_STUDENT]: () => {
        // 면담 일정이 없으면 교수 검색 모달
        if (events.length === 0) {
          openProfessorSearch();
          return;
        }
        // 면담 일정이 있으면 신청현황으로 이동
        router.push(`/student/interview-requests?tab=day&date=${format(date, "yyyy-MM-dd")}`);
        setCurrentDate(date);
      },
      [RoleViewType.STUDENT_ON_PROFESSOR]: () => {
        if (events.length > 0) {
          // 등록된 면담일정이 있으면 면담 조회 모달
          openInterviewModal(events[0], INTERVIEW_MODAL_TYPE.LIST);
          setInterviewInfo(events[0]);
        } else {
          // 등록된 면담일정이 없으면 새 면담 신청
          openInterviewModal(null, INTERVIEW_MODAL_TYPE.CREATE);
          setInterviewInfo({
            ...DEFAULT_INTERVIEW_INFO,
            interview_date: format(date, "yyyy-MM-dd"), // 클릭된 날짜 전달
            interview_state: InterviewStatus.REQUESTED,
          });
        }
      },
      [RoleViewType.PROFESSOR_ON_PROFESSOR]: () => {
        openInterviewModal(events[0] || null, INTERVIEW_MODAL_TYPE.LIST);
        setInterviewInfo({
          ...DEFAULT_INTERVIEW_INFO,
          interview_date: format(date, "yyyy-MM-dd"), // 클릭된 날짜 전달
        });
      },
    };

    const handler = handlers[props.roleViewType];
    if (handler) {
      handler();
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

  // 주말 체크 함수
  const isWeekend = (date: Date) => date.getDay() === 0 || date.getDay() === 6;

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
          const dayEvents = props.events
            .filter(e => e.interview_date.startsWith(dateStr))
            .slice(0, 3);

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
                dayEvents.length > 0 // 학생 유저 본인이 이미 신청한 면담 일정이 있는 경우도 클릭 가능
              : true;

          // 교수 유저: 해당 날짜의 모든 시간을 비활성화 해놓았다면 클릭도 비활성화
          const isProfessorDateAvailable = props.allowDateList?.some(allowDate => {
            const isMatchingDate = allowDate.allow_date === dateStr;
            const isMatchingTime = allowDate.allow_time.every(time =>
              TIMES.some(event => event === time)
            );
            return isMatchingDate && isMatchingTime;
          });

          return (
            // TODO: 현재 달이 아닌 경우는 날짜 이동만(교수 검색창, 신청 현황 이동 동작 X)
            <div
              key={i}
              className={cn(
                "relative min-h-[100px] rounded border p-1",
                !isSameMonth(date, currentDate) && "text-gray-400", // 현재 달의 날짜가 아닌 경우 회색으로 표시
                ((props.roleViewType === RoleViewType.STUDENT_ON_PROFESSOR &&
                  !isStudentDateAvailable) ||
                  (props.roleViewType === RoleViewType.PROFESSOR_ON_PROFESSOR &&
                    !isProfessorDateAvailable) ||
                  isWeekend(date)) &&
                  "cursor-not-allowed bg-gray-200 opacity-50"
              )}
              role="button"
              onClick={() =>
                !isWeekend(date) &&
                isStudentDateAvailable &&
                isProfessorDateAvailable &&
                handleClick(date, dayEvents)
              }
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
                      STATUS_COLORS[
                        (event.interview_state === "면담 기록 완료"
                          ? userInfo?.role === UserRole.STUDENT
                            ? (event.interview_record_state_student ?? "면담 확정")
                            : (event.interview_record_state_professor ?? "면담 확정")
                          : event.interview_state) as InterviewStatus
                      ]
                    )}
                  >
                    <span className="text-sm text-gray-800">
                      {(() => {
                        if (event.interview_state === "면담 기록 완료") {
                          if (userInfo?.role === UserRole.STUDENT) {
                            return event.interview_record_state_student ?? "면담 확정";
                          } else if (userInfo?.role === UserRole.PROFESSOR) {
                            return event.interview_record_state_professor ?? "면담 확정";
                          }
                        }
                        return event.interview_state;
                      })()}
                    </span>
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
