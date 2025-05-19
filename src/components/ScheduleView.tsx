"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { memo, useEffect, useMemo, useState } from "react";

import { RoleViewType, UserRole } from "@/common/const";
import DateSelector from "@/components/DateSelector";
import LoadingUI from "@/components/LoadingUI";
import MonthlySchedule from "@/components/MonthlySchdeule";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WeeklySchedule from "@/components/WeeklySchedule";
import { useDateStore } from "@/store/dateStore";
import { useUserStore } from "@/store/userStore";
import { InterviewInfo } from "@/types/interview";
import { ProfessorAllowDate } from "@/types/user";
import { interviewApi } from "@/utils/api/interview";

const TABS = [
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
];

const ScheduleView = (props: { professorId?: string }) => {
  const userRole = useUserStore(state => state.role);
  const currentDate = useDateStore(state => state.currentDate);
  const setInterviewList = useDateStore(state => state.setInterviewList);
  const setProfessorAllowDateList = useDateStore(state => state.setProfessorAllowDateList);
  const [viewType, setViewType] = useState<"month" | "week">("month");
  const [roleViewType, setRoleViewType] = useState<RoleViewType>(RoleViewType.STUDENT_ON_STUDENT);

  // currentDate가 포함된 월(1일 ~ 말일) 데이터 조회
  const startDate = format(
    new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    "yyyy-MM-dd"
  );
  const endDate = format(
    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),
    "yyyy-MM-dd"
  );

  // 학생 면담 데이터 조회(학생 화면일 때)
  const { data: studentInterviewList, isLoading: studentInterviewListLoading } = useQuery<
    { data: InterviewInfo[] } | null,
    Error
  >({
    queryKey: ["studentInterviewList", roleViewType, startDate, endDate],
    queryFn: () => interviewApi.getStudentInterviewList(startDate, endDate),
    // 교수 유저가 아닐 때는 항상 조회
    enabled: roleViewType !== RoleViewType.PROFESSOR_ON_PROFESSOR,
  });

  // 교수 면담 데이터 조회(교수 화면일 때)
  const { data: professorInterviewList, isLoading: professorInterviewListLoading } = useQuery<
    { data: InterviewInfo[] } | null,
    Error
  >({
    queryKey: ["professorInterviewList", roleViewType, startDate, endDate],
    queryFn: () => interviewApi.getProfessorInterviewList(startDate, endDate),
    enabled: roleViewType === RoleViewType.PROFESSOR_ON_PROFESSOR,
  });

  // 교수 면담 가능 날짜 조회(학생 화면일 때)
  const { data: professorAllowDateList, isLoading: professorAllowDateListLoading } = useQuery<
    { data: ProfessorAllowDate[] } | null,
    Error
  >({
    queryKey: ["professorAllowDateList", props.professorId, roleViewType, startDate, endDate],
    queryFn: async () => {
      const result = await interviewApi.getProfessorAllowDate(
        props.professorId || "",
        startDate,
        endDate
      );
      setProfessorAllowDateList(result?.data || []);
      return result;
    },
    enabled: roleViewType === RoleViewType.STUDENT_ON_PROFESSOR && !!props.professorId,
  });

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

  const interviewList = useMemo(() => {
    switch (roleViewType) {
      // 학생 유저가 교수 화면 접속 시, 학생의 면담 목록 중 해당 교수 면담 일정만 필터링
      case RoleViewType.STUDENT_ON_PROFESSOR:
        return {
          data: studentInterviewList?.data.filter(
            interview => interview.professor_id === props.professorId
          ),
        };
      case RoleViewType.STUDENT_ON_STUDENT:
        return studentInterviewList;
      case RoleViewType.PROFESSOR_ON_PROFESSOR:
        return professorInterviewList;
      default:
        return null;
    }
  }, [professorInterviewList, studentInterviewList, roleViewType, props.professorId]);

  const isLoading = useMemo(() => {
    return (
      professorInterviewListLoading || studentInterviewListLoading || professorAllowDateListLoading
    );
  }, [professorInterviewListLoading, studentInterviewListLoading, professorAllowDateListLoading]);

  useEffect(() => {
    if (interviewList?.data) {
      setInterviewList(interviewList.data);
    }
  }, [interviewList, setInterviewList]);

  return (
    <>
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
              <MonthlySchedule
                events={interviewList?.data || []}
                roleViewType={roleViewType}
                allowDateList={professorAllowDateList?.data}
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
                <div></div>
              </div>
              <WeeklySchedule
                events={interviewList?.data || []}
                roleViewType={roleViewType}
                allowDateList={professorAllowDateList?.data}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {isLoading && <LoadingUI />}
    </>
  );
};

export default memo(ScheduleView);
