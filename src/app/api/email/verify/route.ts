import { NextResponse } from "next/server";

import { verifyCode } from "@/mocks/data/verification";

/**
 * POST /api/email/verify - 이메일 인증 코드 검증
 */
export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ message: "이메일과 인증 코드를 입력해주세요." }, { status: 400 });
    }

    // 인증 코드 검증
    const isValid = verifyCode(email, code);

    if (!isValid) {
      return NextResponse.json(
        { message: "인증 코드가 일치하지 않거나 만료되었습니다." },
        { status: 400 }
      );
    }

    // TODO: 인증 코드 사용 처리

    return NextResponse.json(
      {
        message: "이메일 인증이 완료되었습니다.",
        verified: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("이메일 인증 에러:", error);
    return NextResponse.json({ message: "이메일 인증 중 오류가 발생했습니다." }, { status: 500 });
  }
}
