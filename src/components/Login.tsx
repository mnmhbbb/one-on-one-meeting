"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
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
    <div className="flex min-h-screen flex-col items-center bg-white p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-100 p-6">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-[#6b5545] focus:outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={userPw}
              onChange={(e) => setUserPw(e.target.value)}
              required
              className="w-full rounded-full border border-gray-300 bg-white px-4 py-3 text-sm focus:border-[#6b5545] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[#6b5545] py-3 text-center text-white hover:bg-[#5a4638]">
            로그인
          </button>

          <button
            type="button"
            className="w-full rounded-md bg-[#6b5545] py-3 text-center text-white hover:bg-[#5a4638]">
            회원가입
          </button>

          <div className="text-center">
            <Link href="#" className="text-sm text-[#6b5545] hover:underline">
              비밀번호 찾기
            </Link>
          </div>
        </form>

        {loginResult !== null && (
          <div
            className={`mt-4 rounded-md p-3 text-center ${
              loginResult ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
            {loginResult ? "로그인 성공!" : "로그인 실패 😢"}
          </div>
        )}
      </div>
    </div>
  );
}
