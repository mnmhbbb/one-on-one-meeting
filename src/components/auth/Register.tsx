"use client";

import type React from "react";
import { useEffect, useState } from "react";

type Props = {
  role: "student" | "professor";
};

export default function Register({ role }: Props) {
  const [userId, setUserId] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [department, setDepartment] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [interviewLocation, setInterviewLocation] = useState("");

  // const handleVerify = (e: React.MouseEvent) => {
  //   e.preventDefault();

  //   setIsVerified(true);
  //   alert("인증번호가 발송되었습니다.");
  // };

  // const handleVerifyCode = (e: React.MouseEvent) => {
  //   e.preventDefault();

  //   setIsCodeVerified(true);
  //   alert("인증이 완료되었습니다.");
  // };

  // if (!isCodeVerified) {
  //   alert("이메일 인증이 필요합니다.");
  //   return;
  // }

  useEffect(() => {
    const pwRegex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (password && !pwRegex.test(password)) {
      setPasswordError("비밀번호는 8자 이상, 소문자 + 숫자를 포함해야 합니다.");
    } else {
      setPasswordError("");
    }

    if (confirmPassword && password !== confirmPassword) {
      setConfirmError("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmError("");
    }
  }, [password, confirmPassword]);

  return (
    <>
      <div className="flex gap-2">
        <input
          type="email"
          name="user_id"
          placeholder="아이디(이메일)"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          required
          className="flex-1 rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
        />
      </div>
      {/* <button
              onClick={handleVerify}
              className="rounded-md bg-[#6b5545] px-4 py-2 text-center text-base font-medium text-white hover:bg-[#5a4638]"
            >
              인증하기
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="인증번호"
              value={verificationCode}
              onChange={e => setVerificationCode(e.target.value)}
              disabled={!isVerified}
              className="flex-1 rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none disabled:bg-gray-200"
            />
            <button
              onClick={handleVerifyCode}
              disabled={!isVerified}
              className="rounded-md bg-[#6b5545] px-4 py-2 text-center text-base font-medium text-white hover:bg-[#5a4638] disabled:bg-gray-400"
            >
              확인
            </button>
          </div> */}

      <div>
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
        />
        {passwordError && <p className="mt-1 text-sm text-red-500">{passwordError}</p>}
      </div>

      <div>
        <input
          type="password"
          name="confirm_password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
        />
        {confirmError && <p className="mt-1 text-sm text-red-500">{confirmError}</p>}
      </div>

      <div>
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
        />
      </div>

      <div>
        <input
          type="text"
          name="sign_num"
          placeholder="학번"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
          required
          className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
        />
      </div>

      <div>
        <input
          type="text"
          name="department"
          placeholder="학과"
          value={department}
          onChange={e => setDepartment(e.target.value)}
          required
          className="w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base focus:border-[#6b5545] focus:outline-none"
        />
      </div>

      <div>
        {role === "professor" && (
          <input
            type="text"
            name="interview_location"
            placeholder="면담 장소"
            value={interviewLocation}
            onChange={e => setInterviewLocation(e.target.value)}
            required
            className="mb-2 w-full rounded-full border border-gray-300 bg-white px-5 py-4 text-base"
          />
        )}
        <input type="hidden" name="role" value={role} />
      </div>
    </>
  );
}
