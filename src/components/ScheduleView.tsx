"use client";

import { memo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MonthlySchedule from "@/components/MonthlySchdeule";
import WeeklySchedule from "@/components/WeeklySchedule";
import DateSelector from "@/components/DateSelector";
import { EVENTS } from "@/utils/data/mockData";

const TABS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
];

const ScheduleView = () => {
  const [viewType, setViewType] = useState<"month" | "week">("month");

  return (
    <Tabs defaultValue="month" onValueChange={(value) => setViewType(value as "month" | "week")}>
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
              <DateSelector viewType={viewType} />
              <div></div>
            </div>
            <MonthlySchedule events={EVENTS} />
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
              <DateSelector viewType={viewType} />
              <div></div>
            </div>
            <WeeklySchedule events={EVENTS} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default memo(ScheduleView);
