"use client";

import {
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  isSameMonth,
  isWithinInterval,
} from "date-fns";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, memo, useEffect } from "react";

import { InterviewStatus, UserRole } from "@/common/const";
import DateSelector from "@/components/DateSelector";
import ProfessorInterviewTable from "@/components/ProfessorInterviewTable";
import StatusFilterGroup from "@/components/StatusFilterGroup";
import StudentInterviewTable from "@/components/StudentInterviewTable";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDateStore } from "@/store/dateStore";
import { useUserStore } from "@/store/userStore";

const TABS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
];

const InterviewRequestTabs = ({ isStudent = false }: { isStudent?: boolean }) => {
  const currentDate = useDateStore(state => state.currentDate);
  const interviewList = useDateStore(state => state.interviewList);
  const userInfo = useUserStore(state => state.userInfo);

  const [selectedTab, setSelectedTab] = useState<"month" | "week" | "day">("month");
  const [selectedStatuses, setSelectedStatuses] = useState<InterviewStatus[]>([
    InterviewStatus.REQUESTED,
    InterviewStatus.REJECTED,
    InterviewStatus.CONFIRMED,
    InterviewStatus.CANCELLED,
    InterviewStatus.RECORDED,
  ]);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const date = searchParams.get("date");

  // 쿼리스트링에 tab이 있으면 해당 탭으로 선택
  useEffect(() => {
    if (tab) {
      setSelectedTab(tab as "month" | "week" | "day");
    }
  }, [tab]);

  // date 쿼리 파라미터가 있으면 currentDate에 반영
  useEffect(() => {
    if (date) {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        useDateStore.getState().setCurrentDate(parsed);
      }
    }
  }, [date]);

  // 상태 필터링이 적용된 이벤트 목록
  const filteredEvents = useMemo(() => {
    return interviewList.filter(event => {
      let stateToCompare: string;

      if (event.interview_state === "면담 기록 완료") {
        if (userInfo?.role === UserRole.STUDENT) {
          stateToCompare = event.interview_record_state_student ?? "면담 확정";
        } else if (userInfo?.role === UserRole.PROFESSOR) {
          stateToCompare = event.interview_record_state_professor ?? "면담 확정";
        } else {
          stateToCompare = event.interview_state;
        }
      } else {
        stateToCompare = event.interview_state;
      }

      return selectedStatuses.includes(stateToCompare as InterviewStatus);
    });
  }, [interviewList, selectedStatuses, userInfo?.role]);

  // 각 탭에 해당하는 이벤트 필터링
  const monthEvents = useMemo(
    () =>
      filteredEvents.filter(event => {
        const eventDate = new Date(event.interview_date);
        return isSameMonth(eventDate, currentDate);
      }),
    [filteredEvents, currentDate]
  );

  const weekEvents = useMemo(
    () =>
      filteredEvents.filter(event => {
        const eventDate = new Date(event.interview_date);
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
      }),
    [filteredEvents, currentDate]
  );

  const dayEvents = useMemo(
    () =>
      filteredEvents.filter(event => {
        const eventDate = new Date(event.interview_date);
        const dayStart = startOfDay(currentDate);
        const dayEnd = endOfDay(currentDate);
        return isWithinInterval(eventDate, { start: dayStart, end: dayEnd });
      }),
    [filteredEvents, currentDate]
  );

  return (
    <Tabs
      value={selectedTab}
      onValueChange={value => setSelectedTab(value as "month" | "week" | "day")}
    >
      <TabsContent value="month">
        <Card className="rounded-l-none">
          <CardContent>
            <div className="mb-4 grid grid-cols-3 items-center">
              <TabsList>
                {TABS.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <DateSelector viewType="month" />
            </div>
            <StatusFilterGroup onFilterChange={setSelectedStatuses} />
            {isStudent ? (
              <StudentInterviewTable events={monthEvents} />
            ) : (
              <ProfessorInterviewTable events={monthEvents} />
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="week">
        <Card className="rounded-l-none">
          <CardContent>
            <div className="mb-4 grid grid-cols-3 items-center">
              <TabsList>
                {TABS.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <DateSelector viewType="week" />
              <div></div>
            </div>
            <StatusFilterGroup onFilterChange={setSelectedStatuses} />
            {isStudent ? (
              <StudentInterviewTable events={weekEvents} />
            ) : (
              <ProfessorInterviewTable events={weekEvents} />
            )}
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="day">
        <Card className="rounded-l-none">
          <CardContent>
            <div className="mb-4 grid grid-cols-3 items-center">
              <TabsList>
                {TABS.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <DateSelector viewType="day" />
              <div></div>
            </div>
            <StatusFilterGroup onFilterChange={setSelectedStatuses} />
            {isStudent ? (
              <StudentInterviewTable events={dayEvents} />
            ) : (
              <ProfessorInterviewTable events={dayEvents} />
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default memo(InterviewRequestTabs);
