"use client";

import { LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

import { UserRole } from "@/common/const";
import { loginAction, type LoginFormState } from "@/app/actions/login";
import { Button } from "@/components/ui/button";

interface LoginFormProps {
  role: UserRole;
}

/**
 * Submit 버튼 컴포넌트 (pending 상태를 위해 분리)
 */
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="bg-primary h-auto w-full rounded-full py-4 text-center text-lg font-medium text-white shadow-md transition-all duration-300 hover:bg-[#5a4638] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "로그인 중..." : "로그인"}
    </Button>
  );
}

export default function LoginForm({ role }: LoginFormProps) {
  const initialState: LoginFormState = { success: false };
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form className="relative z-10 space-y-5" action={formAction}>
      {/* 에러 메시지 표시 */}
      {state?.message && !state.success && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {state.message}
        </div>
      )}
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
          aria-invalid={state?.errors?.email ? "true" : "false"}
          className={`focus:border-primary w-full rounded-full border bg-white py-4 pr-5 pl-12 text-base transition-all focus:ring-1 focus:ring-[#6b5545] focus:outline-none ${
            state?.errors?.email ? "border-red-400" : "border-gray-400"
          }`}
        />
        {state?.errors?.email && <p className="mt-1 text-sm text-red-600">{state.errors.email}</p>}
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
          aria-invalid={state?.errors?.password ? "true" : "false"}
          className={`focus:border-primary w-full rounded-full border bg-white py-4 pr-5 pl-12 text-base transition-all focus:ring-1 focus:ring-[#6b5545] focus:outline-none ${
            state?.errors?.password ? "border-red-400" : "border-gray-400"
          }`}
        />
        {state?.errors?.password && (
          <p className="mt-1 text-sm text-red-600">{state.errors.password}</p>
        )}
      </div>

      <SubmitButton />

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
