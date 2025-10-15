import { NextResponse } from "next/server";

import { mockDepartments } from "@/mocks/data/departments";

/**
 * GET /api/department-college - 학과/단과대학 목록 조회
 * MSW 목업 데이터 사용
 */
export async function GET() {
  try {
    return NextResponse.json(
      {
        data: mockDepartments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("학과/단과대학 조회 에러:", error);
    return NextResponse.json(
      { message: "학과/단과대학 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
