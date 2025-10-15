/**
 * 이메일 인증 코드 저장소 (메모리)
 * 개발용 임시 저장소
 */
export const verificationCodes = new Map<string, string>();

/**
 * 인증 완료된 이메일 저장소
 */
export const verifiedEmails = new Set<string>();

/**
 * 인증 코드 생성
 */
export function generateVerificationCode(): string {
  // 개발 편의를 위해 고정 코드 사용 (프로덕션에서는 랜덤)
  if (process.env.NODE_ENV === "development") {
    return "123456";
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * 인증 코드 저장 (유효기간 5분)
 */
export function storeVerificationCode(email: string, code: string): void {
  verificationCodes.set(email, code);

  // 5분 후 자동 삭제
  setTimeout(
    () => {
      verificationCodes.delete(email);
    },
    5 * 60 * 1000
  );
}

/**
 * 인증 코드 검증
 */
export function verifyCode(email: string, code: string): boolean {
  const storedCode = verificationCodes.get(email);
  if (!storedCode || storedCode !== code) {
    return false;
  }

  // 인증 성공 - 인증된 이메일 목록에 추가
  verifiedEmails.add(email);
  verificationCodes.delete(email);
  return true;
}

/**
 * 이메일이 인증되었는지 확인
 */
export function isEmailVerified(email: string): boolean {
  return verifiedEmails.has(email);
}
