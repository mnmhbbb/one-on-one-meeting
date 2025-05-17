/**
 * 비동기 API 함수를 실행하고 에러가 발생하면, Next.js 전역에 에러를 전파하지 않기 위해 null을 반환하는 함수
 * - axios 인터셉트 처리하기 때문(errorStore에 에러를 저장하고, ErrorToast 컴포넌트에서 에러를 띄움)
 *
 * @template T - 반환 타입
 * @param fn - 실행할 비동기 함수
 * @returns 함수 실행 결과 또는 null
 */
export async function tryApiWithToast<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}
