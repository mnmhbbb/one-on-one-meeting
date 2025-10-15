import { http, HttpResponse } from "msw";

import { UserRole } from "@/common/const";
import { mockProfessors, mockSessions, mockStudents } from "@/mocks/data/users";

/**
 * 유저 정보 관련 MSW 핸들러
 */
export const userHandlers = [
  /**
   * GET /api/user - 현재 로그인한 사용자 정보 조회
   */
  http.get("/api/user", async ({ request }) => {
    // 1. 세션 확인
    const cookies = request.headers.get("cookie");
    const sessionToken = cookies?.match(/session=([^;]+)/)?.[1];

    if (!sessionToken) {
      return HttpResponse.json({ message: "인증되지 않은 사용자입니다." }, { status: 401 });
    }

    const session = mockSessions.get(sessionToken);
    if (!session) {
      return HttpResponse.json({ message: "세션이 만료되었습니다." }, { status: 401 });
    }

    // 2. 역할에 따라 사용자 데이터 조회
    const { userId, role } = session;

    const userData =
      role === UserRole.STUDENT
        ? mockStudents.find(s => s.id === userId)
        : mockProfessors.find(p => p.id === userId);

    if (!userData) {
      return HttpResponse.json({ message: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    // 3. 응답
    return HttpResponse.json(
      {
        role,
        user: userData,
      },
      { status: 200 }
    );
  }),

  /**
   * PUT /api/user - 사용자 정보 업데이트
   */
  http.put("/api/user", async ({ request }) => {
    // 1. 세션 확인
    const cookies = request.headers.get("cookie");
    const sessionToken = cookies?.match(/session=([^;]+)/)?.[1];

    if (!sessionToken) {
      return HttpResponse.json({ message: "인증되지 않은 사용자입니다." }, { status: 401 });
    }

    const session = mockSessions.get(sessionToken);
    if (!session) {
      return HttpResponse.json({ message: "세션이 만료되었습니다." }, { status: 401 });
    }

    // 2. 업데이트할 데이터 파싱
    const body = (await request.json()) as {
      role: UserRole;
      id: string;
      [key: string]: string;
    };

    const { role, id } = body;

    // 3. 역할에 따라 업데이트 가능한 필드 확인
    if (role === UserRole.STUDENT) {
      const studentIndex = mockStudents.findIndex(s => s.id === id);
      if (studentIndex === -1) {
        return HttpResponse.json({ message: "학생을 찾을 수 없습니다." }, { status: 404 });
      }

      // 업데이트 가능한 필드만 적용
      if ("department" in body) mockStudents[studentIndex].department = body.department;
      if ("phone_num" in body) mockStudents[studentIndex].phone_num = body.phone_num;
      if ("notification_email" in body)
        mockStudents[studentIndex].notification_email = body.notification_email;

      return HttpResponse.json(
        {
          message: "유저 정보 업데이트 완료",
          ...mockStudents[studentIndex],
          role,
        },
        { status: 201 }
      );
    } else if (role === UserRole.PROFESSOR) {
      const professorIndex = mockProfessors.findIndex(p => p.id === id);
      if (professorIndex === -1) {
        return HttpResponse.json({ message: "교수를 찾을 수 없습니다." }, { status: 404 });
      }

      // 업데이트 가능한 필드만 적용
      if ("college" in body) mockProfessors[professorIndex].college = body.college;
      if ("phone_num" in body) mockProfessors[professorIndex].phone_num = body.phone_num;
      if ("notification_email" in body)
        mockProfessors[professorIndex].notification_email = body.notification_email;
      if ("interview_location" in body)
        mockProfessors[professorIndex].interview_location = body.interview_location;

      return HttpResponse.json(
        {
          message: "유저 정보 업데이트 완료",
          ...mockProfessors[professorIndex],
          role,
        },
        { status: 201 }
      );
    }

    return HttpResponse.json({ message: "잘못된 역할(role)" }, { status: 400 });
  }),
];
