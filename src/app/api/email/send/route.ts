import { NextResponse } from "next/server";

import { generateVerificationCode, storeVerificationCode } from "@/mocks/data/verification";

/**
 * POST /api/email/send - 이메일 인증 코드 전송
 * MSW 목업: 실제 이메일은 전송하지 않고 콘솔에 출력
 */
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // TODO: 이미 가입된 이메일인지 확인

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "올바른 이메일 주소를 입력해주세요." }, { status: 400 });
    }

    // 인증 코드 생성 및 저장
    const code = generateVerificationCode();
    storeVerificationCode(email, code);

    // 개발 환경: 콘솔에 인증 코드 출력
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 이메일 인증 코드 발송
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
받는 사람: ${email}
인증 코드: ${code}
유효 시간: 5분
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);

    return NextResponse.json(
      {
        message: "인증 코드가 발송되었습니다.",
        // 개발 환경에서만 코드 반환
        ...(process.env.NODE_ENV === "development" && { code }),
      },
      { status: 200 }
    );

    // TODO: 실제 node-mailer 구현 (프로덕션)
    // import { sendVerificationEmail } from "@/utils/email/VerificationEmail";

    // await sendVerificationEmail(email, code);

    // return NextResponse.json(
    //   { message: "인증 코드가 이메일로 발송되었습니다." },
    //   { status: 200 }
    // );
  } catch (error) {
    console.error("이메일 전송 에러:", error);
    return NextResponse.json({ message: "이메일 전송 중 오류가 발생했습니다." }, { status: 500 });
  }
}
