"use client";
import Link from "next/link";
import type React from "react";
import { useState } from "react";

export default function SmartleadLogin() {
  const [userId, setUserId] = useState("");
  const [userPw, setUserPw] = useState("");
  const [loginResult, setLoginResult] = useState<null | boolean>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/smartlead-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, userPw }),
    });
    const data = await res.json();
    setLoginResult(data.success);
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 pt-8 sm:pt-8 md:pt-12 lg:pt-16">
      <div className="w-full max-w-md rounded-lg bg-gray-100 px-8 py-16">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={e => setUserId(e.target.value)}
              required
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={userPw}
              onChange={e => setUserPw(e.target.value)}
              required
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[#6b5545] py-4 text-center text-lg font-medium text-white hover:bg-[#5a4638]"
          >
            로그인
          </button>

          <button
            type="button"
            className="w-full rounded-md bg-[#6b5545] py-4 text-center text-lg font-medium text-white hover:bg-[#5a4638]"
          >
            <Link href="/register" className="block h-full w-full">
              회원가입
            </Link>
          </button>

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
            }`}
          >
            {loginResult ? "로그인 성공!" : "로그인 실패 😢"}
          </div>
        )}
      </div>
    </div>
  );
}
