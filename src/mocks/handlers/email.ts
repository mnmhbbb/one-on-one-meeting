import { http, HttpResponse } from "msw";

import {
  generateVerificationCode,
  storeVerificationCode,
  verifyCode,
} from "@/mocks/data/verification";

/**
 * 이메일 인증 관련 MSW 핸들러
 */
export const emailHandlers = [
  /**
   * POST /api/email/send - 인증 코드 전송
   */
  http.post("/api/email/send", async ({ request }) => {
    const body = (await request.json()) as { email: string };
    const { email } = body;

    if (!email || !email.includes("@")) {
      return HttpResponse.json({ message: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
    }

    // 인증 코드 생성 및 저장
    const code = generateVerificationCode();
    storeVerificationCode(email, code);

    // 개발 환경: 콘솔에 인증 코드 출력
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 [MSW] 이메일 인증 코드 발송
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
받는 사람: ${email}
인증 코드: ${code}
유효 시간: 5분
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);

    return HttpResponse.json(
      {
        message: "인증 코드가 발송되었습니다.",
        // 개발 환경에서만 코드 반환
        code,
      },
      { status: 200 }
    );
  }),

  /**
   * POST /api/email/verify - 인증 코드 검증
   */
  http.post("/api/email/verify", async ({ request }) => {
    const body = (await request.json()) as { email: string; code: string };
    const { email, code } = body;

    if (!email || !code) {
      return HttpResponse.json({ message: "이메일과 인증 코드를 입력해주세요." }, { status: 400 });
    }

    // 인증 코드 검증
    const isValid = verifyCode(email, code);

    if (!isValid) {
      return HttpResponse.json(
        { message: "인증 코드가 일치하지 않거나 만료되었습니다." },
        { status: 400 }
      );
    }

    return HttpResponse.json(
      {
        message: "이메일 인증이 완료되었습니다.",
        verified: true,
      },
      { status: 200 }
    );
  }),
];
