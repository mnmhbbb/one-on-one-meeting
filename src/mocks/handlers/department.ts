import { http, HttpResponse } from "msw";

import { mockDepartments } from "@/mocks/data/departments";

/**
 * 학과/단과대학 관련 MSW 핸들러
 */
export const departmentHandlers = [
  /**
   * GET /api/department-college - 학과/단과대학 목록 조회
   */
  http.get("/api/department-college", () => {
    return HttpResponse.json(
      {
        data: mockDepartments,
      },
      { status: 200 }
    );
  }),
];
