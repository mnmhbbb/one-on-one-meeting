"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect } from "react";

import { UserRole } from "@/common/const";
import { useDateStore } from "@/store/dateStore";
import { useUserStore } from "@/store/userStore";
import { InterviewInfo } from "@/types/interview";
import { ProfessorAllowDate } from "@/types/user";
import { interviewApi } from "@/utils/api/interview";
import { professorApi } from "@/utils/api/professor";

interface InterviewDataLoaderProps {
  professorId?: string;
}

/**
 * 면담 데이터 불러오는 컴포넌트
 */
const InterviewDataLoader = ({ professorId }: InterviewDataLoaderProps) => {
  const queryClient = useQueryClient();
  const userRole = useUserStore(state => state.role);
  const userInfo = useUserStore(state => state.userInfo);
  const currentDate = useDateStore(state => state.currentDate);
  const setInterviewList = useDateStore(state => state.setInterviewList);
  const setProfessorAllowDateList = useDateStore(state => state.setProfessorAllowDateList);
  const updateTarget = useDateStore(state => state.updateTarget);
  const setUpdateTarget = useDateStore(state => state.setUpdateTarget);

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
  const { data: studentInterviewList } = useQuery<{ data: InterviewInfo[] } | null, Error>({
    queryKey: ["studentInterviewList", startDate, endDate],
    queryFn: () => interviewApi.getStudentInterviewList(startDate, endDate),
    // 교수 유저가 아닐 때는 항상 조회
    enabled: userRole === UserRole.STUDENT,
  });

  // 교수 면담 데이터 조회(교수 화면일 때)
  const { data: professorInterviewList } = useQuery<{ data: InterviewInfo[] } | null, Error>({
    queryKey: ["professorInterviewList", startDate, endDate],
    queryFn: () => interviewApi.getProfessorInterviewList(startDate, endDate),
    enabled: userRole === UserRole.PROFESSOR,
  });

  // 교수 면담 가능 날짜 조회(학생 화면일 때)
  useQuery<{ data: ProfessorAllowDate[] } | null, Error>({
    queryKey: ["professorAllowDateListForStudent", professorId, startDate, endDate],
    queryFn: async () => {
      const result = await interviewApi.getProfessorAllowDate(
        professorId || "",
        startDate,
        endDate
      );
      setProfessorAllowDateList(result?.data || []);
      return result;
    },
    enabled: userRole === UserRole.STUDENT && !!professorId,
  });

  // 교수가 면담 활성화한 날짜 조회(교수 본인)
  useQuery<{ data: ProfessorAllowDate[] } | null, Error>({
    queryKey: ["professorAllowDateList", startDate, endDate],
    queryFn: async () => {
      const result = await professorApi.getAllowDate(startDate, endDate);
      setProfessorAllowDateList(result?.data || []);
      return result;
    },
    enabled: userRole === UserRole.PROFESSOR,
  });

  useEffect(() => {
    if (userRole === UserRole.PROFESSOR) {
      // 교수 화면일 때는 교수 면담 목록 사용
      if (professorInterviewList?.data) {
        setInterviewList(professorInterviewList.data);
      }
    } else if (professorId) {
      // 학생이 교수 화면을 볼 때는 해당 교수의 면담만 필터링
      if (studentInterviewList?.data) {
        const filteredList = studentInterviewList.data.filter(
          interview => interview.professor_id === professorId
        );
        setInterviewList(filteredList);
      }
    } else {
      // 학생 화면일 때는 학생 면담 목록 사용
      if (studentInterviewList?.data) {
        setInterviewList(studentInterviewList.data);
      }
    }
  }, [
    userRole,
    professorId,
    professorInterviewList?.data,
    studentInterviewList?.data,
    setInterviewList,
  ]);

  // updateTarget에 따라 필요한 데이터만 갱신(데이터 추가, 수정 후 목록 갱신하기 위함)
  useEffect(() => {
    if (!updateTarget) return;

    switch (updateTarget) {
      case "studentInterviewList":
        queryClient.invalidateQueries({ queryKey: ["studentInterviewList"] });
        queryClient.invalidateQueries({ queryKey: ["professorAllowDateListForStudent"] });
        break;
      case "professorInterviewList":
        queryClient.invalidateQueries({ queryKey: ["professorInterviewList"] });
        queryClient.invalidateQueries({ queryKey: ["professorAllowDateList"] });
        break;
      case "professorAllowDateListForStudent":
        queryClient.invalidateQueries({ queryKey: ["professorAllowDateListForStudent"] });
        break;
      case "professorAllowDateList":
        queryClient.invalidateQueries({ queryKey: ["professorAllowDateList"] });
        break;
    }

    // 갱신 완료 후 타겟 초기화
    setUpdateTarget(null);
  }, [updateTarget, queryClient, setUpdateTarget]);

  return null;
};

export default InterviewDataLoader;
