"use client";

import { useState, useMemo, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EVENTS } from "@/utils/data/mockData";
import {
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  isSameMonth,
  isWithinInterval,
} from "date-fns";
import useDateStore from "@/store/dateStore";
import StudentsConsultationTable from "@/components/StudentsConsultationTable";
import DateSelector from "@/components/DateSelector";
import StatusFilterGroup from "@/components/StatusFilterGroup";
import { ConsultationStatus } from "@/common/const";

const TABS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
];

const ConsultationRequestTabs = () => {
  const { currentDate } = useDateStore();
  const [selectedStatuses, setSelectedStatuses] = useState<ConsultationStatus[]>([
    "REQUESTED",
    "REJECTED",
    "CONFIRMED",
    "CANCELLED",
    "RECORDED",
  ]);

  // 상태 필터링이 적용된 이벤트 목록
  const filteredEvents = useMemo(
    () => EVENTS.filter((event) => selectedStatuses.includes(event.status)),
    [selectedStatuses],
  );

  // 각 탭에 해당하는 이벤트 필터링
  const monthEvents = useMemo(
    () =>
      filteredEvents.filter((event) => {
        const eventDate = new Date(event.date);
        return isSameMonth(eventDate, currentDate);
      }),
    [filteredEvents, currentDate],
  );

  const weekEvents = useMemo(
    () =>
      filteredEvents.filter((event) => {
        const eventDate = new Date(event.date);
        const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
      }),
    [filteredEvents, currentDate],
  );

  const dayEvents = useMemo(
    () =>
      filteredEvents.filter((event) => {
        const eventDate = new Date(event.date);
        const dayStart = startOfDay(currentDate);
        const dayEnd = endOfDay(currentDate);
        return isWithinInterval(eventDate, { start: dayStart, end: dayEnd });
      }),
    [filteredEvents, currentDate],
  );

  return (
    <Tabs defaultValue="month">
      <TabsContent value="month">
        <Card className="rounded-l-none">
          <CardContent>
            <div className="grid grid-cols-3 items-center mb-4">
              <TabsList>
                {TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <DateSelector viewType="month" />
              <div></div>
            </div>
            <StatusFilterGroup onFilterChange={setSelectedStatuses} />
            <StudentsConsultationTable events={monthEvents} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="week">
        <Card className="rounded-l-none">
          <CardContent>
            <div className="grid grid-cols-3 items-center mb-4">
              <TabsList>
                {TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <DateSelector viewType="week" />
              <div></div>
            </div>
            <StatusFilterGroup onFilterChange={setSelectedStatuses} />
            <StudentsConsultationTable events={weekEvents} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="day">
        <Card className="rounded-l-none">
          <CardContent>
            <div className="grid grid-cols-3 items-center mb-4">
              <TabsList>
                {TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <DateSelector viewType="day" />
              <div></div>
            </div>
            <StatusFilterGroup onFilterChange={setSelectedStatuses} />
            <StudentsConsultationTable events={dayEvents} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default memo(ConsultationRequestTabs);
