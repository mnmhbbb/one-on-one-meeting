"use client";

import { LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { UserRole } from "@/common/const";
import LoadingUI from "@/components/LoadingUI";
import { Button } from "@/components/ui/button";
import { userApi } from "@/utils/api/user";

interface LoginFormProps {
  role: UserRole;
}

export default function LoginForm({ role }: LoginFormProps) {
  const redirectTo = role === UserRole.STUDENT ? "/student/my" : "/professor/my";
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (formData: FormData) => {
    setIsLoading(true);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    userApi
      .login({ email, password, role })
      .then(success => {
        if (success) {
          window.location.replace(redirectTo);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className="relative z-10 space-y-5" action={handleSubmit}>
      {isLoading && <LoadingUI />}
      <input type="hidden" name="role" value={role} />
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
        type="submit"
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
        href={role === "student" ? "/student/register" : "/professor/register"}
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
  );
}
