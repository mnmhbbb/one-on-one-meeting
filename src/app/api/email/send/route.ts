import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { sendVerificationEmail } from "@/utils/email/sendVerificationEmail";

export async function POST(req: Request) {
  const { email } = await req.json();
  const supabase = await createClient();

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const { error } = await supabase.from("email_verification_codes").upsert({
    email,
    code,
    expires_at: expiresAt,
  });

  if (error) {
    return NextResponse.json({ message: "DB 저장 실패" }, { status: 500 });
  }

  try {
    await sendVerificationEmail(email, code);
    return NextResponse.json({ message: "이메일로 인증 코드가 전송되었습니다." });
  } catch (e) {
    return NextResponse.json({ message: "이메일 전송 실패" }, { status: 500 });
  }
}
