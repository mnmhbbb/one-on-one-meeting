"use client";

import { memo, useState } from "react";

import { RoleViewType } from "@/common/const";
import DateSelector from "@/components/DateSelector";
import MonthlySchedule from "@/components/MonthlySchdeule";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WeeklySchedule from "@/components/WeeklySchedule";
import { EVENTS } from "@/utils/data/mockData";

const TABS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
];

const ScheduleView = () => {
  const [viewType, setViewType] = useState<"month" | "week">("month");

  return (
    <Tabs defaultValue="month" onValueChange={value => setViewType(value as "month" | "week")}>
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
              <DateSelector viewType={viewType} />
              <div></div>
            </div>
            <MonthlySchedule events={EVENTS} roleViewType={RoleViewType.STUDENT_ON_STUDENT} />
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
              <DateSelector viewType={viewType} />
              <div></div>
            </div>
            <WeeklySchedule events={EVENTS} roleViewType={RoleViewType.STUDENT_ON_STUDENT} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default memo(ScheduleView);
