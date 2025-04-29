"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EmailLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginResult, setLoginResult] = useState<boolean | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 제출 막기

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoginResult(false);
    } else {
      setLoginResult(true);
      router.push("/"); // 로그인 성공 시 메인 페이지 이동
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 pt-8 sm:pt-8 md:pt-12 lg:pt-16">
      <div className="w-full max-w-md rounded-lg bg-gray-100 py-16 px-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[#6b5545] py-4 text-center text-lg font-medium text-white hover:bg-[#5a4638]">
            로그인
          </button>

          <Link href="/register" className="block">
            <button
              type="button"
              className="mt-2 w-full rounded-md bg-[#6b5545] py-4 text-center text-lg font-medium text-white hover:bg-[#5a4638]">
              회원가입
            </button>
          </Link>

          <div className="text-right">
            <Link href="#" className="text-base text-[#6b5545] hover:underline">
              비밀번호 찾기
            </Link>
          </div>
        </form>

        {loginResult !== null && (
          <div
            className={`mt-6 rounded-md p-4 text-center text-base ${
              loginResult ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
            {loginResult ? "로그인 성공!" : "로그인 실패 😢"}
          </div>
        )}
      </div>
    </div>
  );
}
