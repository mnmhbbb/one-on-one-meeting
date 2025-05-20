import { createBrowserClient } from "@supabase/ssr";
// @supabase/ssr 패키지의 createBrowserClient는 브라우저에서 Supabase와 통신하기 위한 클라이언트를 생성함
// 데이터 조회, 로그인/로그아웃, 실시간 구독 등 클라이언트 측 작업에 사용
// 쿠키 관리는 브라우저의 기본 메커니즘에 의존, 명시적 쿠키 관리는 서버 측 로직에서 관리
// 당장 안 써도 만들어두면 쓸 일 있을 듯
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
