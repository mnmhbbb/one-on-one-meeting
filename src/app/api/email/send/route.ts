import { NextResponse } from "next/server";

import { VerificationEmail } from "@/utils/email/VerificationEmail";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
  const { email } = await req.json();
  const supabase = await createClient();

  // 1. 코드 전송
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  const { error } = await supabase.from("email_verification_codes").upsert({
    email,
    code,
    expires_at: expiresAt,
  });

  // 2. 이미 회원가입한 유저인지 확인
  const { data: professorData } = await supabase
    .from("professors")
    .select("*")
    .eq("email", email)
    .single();

  if (professorData) {
    return NextResponse.json({ message: "이미 회원가입된 이메일입니다." }, { status: 400 });
  }

  const { data: studentData } = await supabase
    .from("students")
    .select("*")
    .eq("email", email)
    .single();

  if (studentData) {
    return NextResponse.json({ message: "이미 회원가입된 이메일입니다." }, { status: 400 });
  }

  if (error) {
    return NextResponse.json({ message: "DB 저장 실패" }, { status: 500 });
  }

  try {
    await VerificationEmail(email, code);
    return NextResponse.json({ message: "이메일로 인증 코드가 전송되었습니다." });
  } catch {
    return NextResponse.json({ message: "이메일 전송 실패" }, { status: 500 });
  }
}
