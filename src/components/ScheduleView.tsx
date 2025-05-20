"use client";

import Link from "next/link";
import { useEffect, useState, memo } from "react";

import { RoleViewType, UserRole } from "@/common/const";
import DateSelector from "@/components/DateSelector";
import InterviewDataLoader from "@/components/InterviewDataLoader";
import MonthlySchedule from "@/components/MonthlySchedule";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WeeklySchedule from "@/components/WeeklySchedule";
import { useDateStore } from "@/store/dateStore";
import { useUserStore } from "@/store/userStore";

const TABS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
];

const ScheduleView = (props: { professorId?: string }) => {
  const userRole = useUserStore(state => state.role);
  const interviewList = useDateStore(state => state.interviewList);
  const professorAllowDateList = useDateStore(state => state.professorAllowDateList);
  const [viewType, setViewType] = useState<"month" | "week">("month");
  const [roleViewType, setRoleViewType] = useState<RoleViewType>(RoleViewType.STUDENT_ON_STUDENT);

  useEffect(() => {
    // 교수 권한일 경우 교수 화면 설정
    if (userRole === UserRole.PROFESSOR) {
      setRoleViewType(RoleViewType.PROFESSOR_ON_PROFESSOR);
    } else if (props.professorId) {
      // 교수 권한이 아니고 교수 id가 있을 경우 학생 권한에서 교수 스케줄 화면 설정
      setRoleViewType(RoleViewType.STUDENT_ON_PROFESSOR);
    } else {
      // 교수 권한이 아니고 교수 id가 없을 경우 학생 화면 설정
      setRoleViewType(RoleViewType.STUDENT_ON_STUDENT);
    }
  }, [props.professorId, userRole]);

  return (
    <>
      <InterviewDataLoader professorId={props.professorId} />
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
                {userRole === UserRole.PROFESSOR && (
                  <div className="flex items-center justify-end">
                    <Button variant="outline" className="w-[60%]">
                      <Link href="/professor/schedule">일정 활성화</Link>
                    </Button>
                  </div>
                )}
              </div>
              <MonthlySchedule
                events={interviewList}
                roleViewType={roleViewType}
                allowDateList={professorAllowDateList}
              />
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
                {userRole === UserRole.PROFESSOR && (
                  <div className="flex items-center justify-end">
                    <Button variant="outline" className="w-[60%]">
                      <Link href="/professor/schedule">일정 활성화</Link>
                    </Button>
                  </div>
                )}
              </div>
              <WeeklySchedule
                events={interviewList}
                roleViewType={roleViewType}
                allowDateList={professorAllowDateList}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default memo(ScheduleView);
