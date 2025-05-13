import { LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";

import RedirectInput from "@/components/auth/RedirectInput";
import { Button } from "@/components/ui/button";

import { login } from "../../actions/login";

export default function StudentLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-white pb-[5%]">
      <div className="relative w-full max-w-md rounded-xl border border-gray-100 bg-white px-8 py-12 shadow-[0_20px_60px_-15px_rgba(107,85,69,0.3)]">
        <div className="to-primary absolute -top-1 -left-0.5 h-4 w-[100.5%] rounded-t-xl bg-gradient-to-r from-gray-300"></div>
        <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-gray-50 opacity-50"></div>
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gray-50 opacity-50"></div>
        <h1 className="mb-7 text-center text-2xl font-bold text-[#493a2e] sm:text-3xl md:text-4xl">
          로그인 하기
        </h1>
        <form className="relative z-10 space-y-5">
          <RedirectInput />
          <div className="relative">
            <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
              <Mail size={20} />
            </div>
            <input
              type="email"
              name="email"
              placeholder="이메일"
              required
              className="focus:border-primary w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
            />
          </div>

          <div className="relative">
            <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
              <LockKeyhole size={20} />
            </div>
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              required
              className="focus:border-primary w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
            />
          </div>

          <Button
            formAction={login}
            className="bg-primary h-auto w-full rounded-full py-4 text-center text-lg font-medium text-white shadow-md transition-all duration-300 hover:bg-[#5a4638] hover:shadow-lg"
          >
            로그인
          </Button>

          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-slate-500">또는</span>
            </div>
          </div>

          <Link
            href="/student/register"
            className="border-primary text-primary block w-full rounded-full border-2 bg-white py-4 text-center text-lg font-medium transition-all duration-300 hover:bg-[#80746b2a]"
          >
            회원가입
          </Link>

          <div className="mt-6 text-right">
            <Link
              href="/find-password"
              className="text-primary inline-flex items-center text-base hover:underline"
            >
              비밀번호 찾기
              <svg
                className="ml-1 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
