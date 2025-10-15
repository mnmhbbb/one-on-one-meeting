import { NextResponse } from "next/server";

/**
 * POST /api/logout - 로그아웃 API
 * MSW 목업 데이터 사용 (Supabase 전환 전 임시)
 */
export async function POST() {
  // MSW 임시 구현: 세션 클리어는 클라이언트에서 처리

  return NextResponse.json(
    { message: "로그아웃 성공" },
    {
      status: 200,
      headers: {
        "Set-Cookie": "session=; Path=/; HttpOnly; Max-Age=0",
      },
    }
  );
}
