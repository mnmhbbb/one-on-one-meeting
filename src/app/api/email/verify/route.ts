import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req: Request) {
  const { email, code: inputCode } = await req.json();
  const supabase = await createClient();

  // 1. 인증 코드 조회
  const { data: codeEntry, error: codeError } = await supabase
    .from("email_verification_codes")
    .select("*")
    .eq("email", email)
    .single();

  if (codeError || !codeEntry) {
    return NextResponse.json({ message: "인증 정보 없음" }, { status: 404 });
  }

  if (codeEntry.code !== inputCode) {
    return NextResponse.json({ message: "코드 불일치" }, { status: 400 });
  }

  if (codeEntry.expires_at < new Date()) {
    return NextResponse.json({ message: "코드 만료됨" }, { status: 400 });
  }

  // 2. 이미 회원가입한 유저인지 확인
  const { data: userData } = await supabase
    .from("professors")
    .select("*")
    .eq("email", email)
    .single();

  if (userData) {
    return NextResponse.json({ message: "이미 회원가입된 이메일입니다." }, { status: 400 });
  }

  // 3. 인증 코드 사용 처리
  const { error: updateError } = await supabase
    .from("email_verification_codes")
    .update({ used: true })
    .eq("email", email);

  if (updateError) {
    return NextResponse.json({ message: "인증 상태 갱신 실패" }, { status: 500 });
  }

  return NextResponse.json({ message: "이메일 인증 완료" });
}
