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

import { InterviewStatus } from "@/common/const";
import DateSelector from "@/components/DateSelector";
import StatusFilterGroup from "@/components/StatusFilterGroup";
import StudentsInterviewTable from "@/components/StudentsInterviewTable";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDateStore } from "@/store/dateStore";
import { EVENTS } from "@/utils/data/mockData";

const TABS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
];

const InterviewRequestTabs = () => {
  const currentDate = useDateStore(state => state.currentDate);
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

  // 쿼리스트링에 tab이 있으면 해당 탭으로 선택
  useEffect(() => {
    if (tab) {
      setSelectedTab(tab as "month" | "week" | "day");
    }
  }, [tab]);

  // 상태 필터링이 적용된 이벤트 목록
  const filteredEvents = useMemo(
    () => EVENTS.filter(event => selectedStatuses.includes(event.status as InterviewStatus)),
    [selectedStatuses]
  );

  // 각 탭에 해당하는 이벤트 필터링
  const monthEvents = useMemo(
    () =>
      filteredEvents.filter(event => {
        const eventDate = new Date(event.date);
        return isSameMonth(eventDate, currentDate);
      }),
    [filteredEvents, currentDate]
  );

  const weekEvents = useMemo(
    () =>
      filteredEvents.filter(event => {
        const eventDate = new Date(event.date);
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
      }),
    [filteredEvents, currentDate]
  );

  const dayEvents = useMemo(
    () =>
      filteredEvents.filter(event => {
        const eventDate = new Date(event.date);
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
              <div></div>
            </div>
            <StatusFilterGroup onFilterChange={setSelectedStatuses} />
            <StudentsInterviewTable events={monthEvents} />
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
            <StudentsInterviewTable events={weekEvents} />
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
            <StudentsInterviewTable events={dayEvents} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default memo(InterviewRequestTabs);
