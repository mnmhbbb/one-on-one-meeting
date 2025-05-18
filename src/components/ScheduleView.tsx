"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { memo, useEffect, useState } from "react";

import { RoleViewType, UserRole } from "@/common/const";
import DateSelector from "@/components/DateSelector";
import MonthlySchedule from "@/components/MonthlySchdeule";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WeeklySchedule from "@/components/WeeklySchedule";
import { useDateStore } from "@/store/dateStore";
import { useUserStore } from "@/store/userStore";
import { InterviewInfo } from "@/types/interview";
import { interviewApi } from "@/utils/api/interview";
import { EVENTS } from "@/utils/data/mockData";

const TABS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
];

const ScheduleView = (props: { professorId?: string }) => {
  const userRole = useUserStore(state => state.role);
  const currentDate = useDateStore(state => state.currentDate);
  const setMonthlyInterviews = useDateStore(state => state.setMonthlyInterviews);

  const startDate = format(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    "yyyy-MM-dd"
  );
  const endDate = format(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
    "yyyy-MM-dd"
  );

  const [viewType, setViewType] = useState<"month" | "week">("month");
  const [roleViewType, setRoleViewType] = useState<RoleViewType>(RoleViewType.STUDENT_ON_STUDENT);

  // TODO: roleViewType에 따라 api 데이터 호출 필요
  useEffect(() => {
    if (userRole === UserRole.PROFESSOR) {
      setRoleViewType(RoleViewType.PROFESSOR_ON_PROFESSOR);
    } else if (props.professorId) {
      setRoleViewType(RoleViewType.STUDENT_ON_PROFESSOR);
    } else {
      setRoleViewType(RoleViewType.STUDENT_ON_STUDENT);
    }
  }, [props.professorId, userRole]);

  const { data: interviewList } = useQuery<{ data: InterviewInfo[] } | null, Error>({
    queryKey: ["interviewList", startDate, endDate],
    queryFn: () => interviewApi.getProfessorInterviewList(startDate, endDate),
  });

  useEffect(() => {
    if (interviewList?.data) {
      setMonthlyInterviews(interviewList.data);
    }
  }, [interviewList]);

  console.log(interviewList);

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
            <MonthlySchedule events={EVENTS} roleViewType={roleViewType} />
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
            <WeeklySchedule events={EVENTS} roleViewType={roleViewType} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default memo(ScheduleView);
