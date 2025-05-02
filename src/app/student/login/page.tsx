import Link from "next/link";
import { Button } from "@/components/ui/button";
import { login } from "./actions";

export default function StudentLoginPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 pt-8 sm:pt-8 md:pt-12 lg:pt-16">
      <div className="w-full max-w-md rounded-lg bg-gray-100 py-16 px-8">
        <form className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              placeholder="이메일"
              required
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              required
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
            />
          </div>

          {/* api 생성할 필요없이 서버 액션으로 바로 요청 */}
          <Button
            formAction={login}
            className="w-full rounded-md bg-[#6b5545] py-4 h-auto text-center text-lg font-medium text-white hover:bg-[#5a4638]"
          >
            로그인
          </Button>

          <Link
            href="/student/register"
            className="block mt-2 w-full rounded-md bg-[#6b5545] py-4 text-center text-lg font-medium text-white hover:bg-[#5a4638]"
          >
            회원가입
          </Link>

          <div className="text-right">
            <Link href="#" className="text-base text-[#6b5545] hover:underline">
              비밀번호 찾기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
