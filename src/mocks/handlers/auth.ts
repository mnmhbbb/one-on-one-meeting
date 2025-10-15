import { http, HttpResponse } from "msw";

import { UserRole } from "@/common/const";
import { mockCredentials, mockProfessors, mockSessions, mockStudents } from "@/mocks/data/users";

/**
 * 인증 관련 MSW 핸들러
 */
export const authHandlers = [
  /**
   * POST /api/login - 로그인
   */
  http.post("/api/login", async ({ request }) => {
    console.log("[MSW] /api/login");

    const body = (await request.json()) as {
      email: string;
      password: string;
      role: UserRole;
    };

    const { email, password, role } = body;

    // 1. 역할에 따라 자격증명 확인
    const credentials =
      role === UserRole.STUDENT ? mockCredentials.students : mockCredentials.professors;

    const userCredential = credentials.find(cred => cred.email === email);

    if (!userCredential) {
      return HttpResponse.json({ message: "사용자 정보를 불러올 수 없습니다." }, { status: 500 });
    }

    // 2. 비밀번호 확인
    if (userCredential.password !== password) {
      return HttpResponse.json(
        { message: "이메일 또는 비밀번호가 잘못되었습니다." },
        { status: 400 }
      );
    }

    // 3. 사용자 데이터 조회
    const userData =
      role === UserRole.STUDENT
        ? mockStudents.find(s => s.id === userCredential.userId)
        : mockProfessors.find(p => p.id === userCredential.userId);

    if (!userData) {
      return HttpResponse.json({ message: "사용자 정보를 찾을 수 없습니다." }, { status: 404 });
    }

    // 4. 세션 생성 (간단한 토큰으로 처리)
    const sessionToken = `session-${userCredential.userId}-${Date.now()}`;
    mockSessions.set(sessionToken, {
      userId: userCredential.userId,
      role,
    });

    // 5. 로그인 성공 응답
    return HttpResponse.json(
      {
        message: "로그인 성공",
        user: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          role,
        },
        sessionToken, // 실제로는 쿠키로 전달
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict`,
        },
      }
    );
  }),

  /**
   * POST /api/logout - 로그아웃
   */
  http.post("/api/logout", async ({ request }) => {
    const cookies = request.headers.get("cookie");
    const sessionToken = cookies?.match(/session=([^;]+)/)?.[1];

    if (sessionToken) {
      mockSessions.delete(sessionToken);
    }

    return HttpResponse.json(
      { message: "로그아웃 성공" },
      {
        status: 200,
        headers: {
          "Set-Cookie": "session=; Path=/; HttpOnly; Max-Age=0",
        },
      }
    );
  }),
];
