"use client";

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
import StudentsInterviewTable from "@/components/StudentsInterviewTable";
import DateSelector from "@/components/DateSelector";

const TABS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "day", label: "Day" },
];

const InterviewRequestTabs = () => {
  const { currentDate } = useDateStore();

  // 각 탭에 해당하는 이벤트 필터링
  const monthEvents = EVENTS.filter((event) => {
    const eventDate = new Date(event.date);
    return isSameMonth(eventDate, currentDate);
  });

  const weekEvents = EVENTS.filter((event) => {
    const eventDate = new Date(event.date);
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    return isWithinInterval(eventDate, { start: weekStart, end: weekEnd });
  });

  const dayEvents = EVENTS.filter((event) => {
    const eventDate = new Date(event.date);
    const dayStart = startOfDay(currentDate);
    const dayEnd = endOfDay(currentDate);
    return isWithinInterval(eventDate, { start: dayStart, end: dayEnd });
  });

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
            <StudentsInterviewTable events={monthEvents} />
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
            <StudentsInterviewTable events={weekEvents} />
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
            <StudentsInterviewTable events={dayEvents} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default InterviewRequestTabs;
