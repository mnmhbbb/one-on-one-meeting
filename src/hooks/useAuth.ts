"use client";

import { UserRole } from "@/common/const";

import { useUser } from "./useUser";

/**
 * 인증 및 권한 관리를 위한 커스텀 훅
 * useUser 훅을 기반으로 권한 체크 로직 제공
 * TODO: 추가 보완 필요
 */
export function useAuth() {
  const { user, role, isLoading } = useUser();

  // 기본 인증 상태
  const isAuthenticated = !!user;
  const isStudent = role === UserRole.STUDENT;
  const isProfessor = role === UserRole.PROFESSOR;

  // 권한 체크 함수들
  const canAccessStudentPages = isAuthenticated && isStudent;
  const canAccessProfessorPages = isAuthenticated && isProfessor;
  const canAccessAdminPages = isAuthenticated && role === UserRole.ADMIN;

  // 특정 교수 페이지 접근 권한 (학생이 특정 교수 페이지에 접근)
  const canAccessProfessorPage = (professorId: string) => {
    return isAuthenticated && (isStudent || (isProfessor && user?.id === professorId));
  };

  return {
    // 기본 상태
    user,
    role,
    isLoading,
    isAuthenticated,

    // 역할별 상태
    isStudent,
    isProfessor,

    // 권한 체크
    canAccessStudentPages,
    canAccessProfessorPages,
    canAccessAdminPages,
    canAccessProfessorPage,
  };
}
