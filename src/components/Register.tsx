"use client";

import type React from "react";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Register() {
  const [userId, setUserId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const handleVerify = (e: React.MouseEvent) => {
    e.preventDefault();
    // Here you would typically send a verification code to the email
    setIsVerified(true);
    alert("인증번호가 발송되었습니다.");
  };

  const handleVerifyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    // Here you would typically verify the code
    setIsCodeVerified(true);
    alert("인증이 완료되었습니다.");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!isCodeVerified) {
      alert("이메일 인증이 필요합니다.");
      return;
    }

    // Here you would typically submit the registration data
    alert("회원가입이 완료되었습니다.");
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-white p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-100 py-16 px-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="아이디(이메일)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              className="flex-1 rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
            />
            <button
              onClick={handleVerify}
              className="rounded-md bg-[#6b5545] px-4 py-2 text-center text-base font-medium text-white hover:bg-[#5a4638]">
              인증하기
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="인증번호"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              disabled={!isVerified}
              className="flex-1 rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none disabled:bg-gray-200"
            />
            <button
              onClick={handleVerifyCode}
              disabled={!isVerified}
              className="rounded-md bg-[#6b5545] px-4 py-2 text-center text-base font-medium text-white hover:bg-[#5a4638] disabled:bg-gray-400">
              확인
            </button>
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

          <div>
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="학번"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="학과"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
              className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[#6b5545] py-4 text-center text-lg font-medium text-white hover:bg-[#5a4638]">
            가입하기
          </button>

          <Link href="/login">
            <button
              type="button"
              className="w-full rounded-md bg-[#6b5545] py-4 text-center text-lg font-medium text-white hover:bg-[#5a4638]">
              로그인
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
