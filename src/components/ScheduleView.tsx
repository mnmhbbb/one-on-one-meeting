"use client";

import { memo, useEffect, useRef, useState } from "react";

import { RoleViewType, UserRole } from "@/common/const";
import DateSelector from "@/components/DateSelector";
import MonthlySchedule from "@/components/MonthlySchdeule";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WeeklySchedule from "@/components/WeeklySchedule";
import { useUserStore } from "@/store/userStore";
import { EVENTS } from "@/utils/data/mockData";

const TABS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
];

const ScheduleView = (props: { professorId?: string }) => {
  const userRole = useUserStore(state => state.role);

  const [viewType, setViewType] = useState<"month" | "week">("month");

  const roleViewType = useRef<RoleViewType>(RoleViewType.STUDENT_ON_STUDENT);

  // TODO: roleViewType에 따라 api 데이터 호출 필요
  useEffect(() => {
    if (userRole === UserRole.PROFESSOR) {
      roleViewType.current = RoleViewType.PROFESSOR_ON_PROFESSOR;
    } else if (props.professorId) {
      roleViewType.current = RoleViewType.STUDENT_ON_PROFESSOR;
    } else {
      roleViewType.current = RoleViewType.STUDENT_ON_STUDENT;
    }
  }, [props.professorId, userRole]);

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
            <MonthlySchedule events={EVENTS} roleViewType={roleViewType.current} />
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
            <WeeklySchedule events={EVENTS} roleViewType={roleViewType.current} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default memo(ScheduleView);
