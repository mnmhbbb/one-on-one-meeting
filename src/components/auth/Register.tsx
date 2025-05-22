"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { LockKeyhole, Mail, User, Phone, BookOpen, GraduationCap, MapPin } from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

import { emailApi } from "@/utils/api/email";
import { userApi } from "@/utils/api/user";
import { useToastStore } from "@/store/toastStore";

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
  const [signNum, setSignNum] = useState("");
  const [department, setDepartment] = useState("");
  const [college, setCollege] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [interviewLocation, setInterviewLocation] = useState("");
  const setToast = useToastStore(state => state.setToast);

  // 학과, 학부 목록 조회
  const { data: departmenCollegeData } = useQuery({
    queryKey: ["departmentColleges"],
    queryFn: async () => {
      const res = await userApi.getDepartmentColleges();
      if (!res) return { colleges: [], departments: [] };

      const uniqueColleges = Array.from(new Set(res.data.map(item => item.college)));
      const uniqueDepartments = Array.from(new Set(res.data.map(item => item.department)));

      return {
        colleges: uniqueColleges.map(college => ({ value: college, label: college })),
        departments: uniqueDepartments.map(dep => ({ value: dep, label: dep })),
      };
    },
  });

  // 인증코드 전송
  const { mutate: sendCode } = useMutation({
    mutationFn: (email: string) => emailApi.sendVerificationCode(email),
    onSuccess: data => {
      if (data) {
        setToast("이메일이 전송되었습니다.", "success");
      }
    },
  });

  // 인증코드 검증
  const { mutate: verifyCode } = useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) =>
      emailApi.verifyCode(email, code),
    onSuccess: data => {
      if (data) {
        setToast("인증이 완료되었습니다.", "success");
      }
      setIsVerified(true);
    },
  });

  useEffect(() => {
    console.log("isVerified 상태:", isVerified);
  }, [isVerified]);

  const handleSendCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    sendCode(userId);
  };

  const handleVerifyCode = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    verifyCode({ email: userId, code: verificationCode });
  };

  useEffect(() => {
    // 영문자 1개 이상, 숫자 1개 이상 포함 (대소문자 구분 없음), 특수문자 허용, 8자 이상
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d\S]{8,}$/;

    if (password && !pwRegex.test(password)) {
      setPasswordError("비밀번호는 8자 이상, 영문자와 숫자를 포함해야 합니다.");
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
    <div className="space-y-5">
      <div className="relative">
        <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
          <Mail size={20} />
        </div>
        <div className="flex gap-2">
          <input
            type="email"
            name="user_id"
            placeholder="아이디(이메일)"
            value={userId}
            onChange={e => setUserId(e.target.value)}
            required
            className="flex-1 rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
            readOnly={isVerified}
          />
          <button
            onClick={handleSendCode}
            disabled={isVerified}
            className="w-28 rounded-full bg-[#6b5545] px-4 py-2 text-center text-base font-medium text-white shadow-md transition-all duration-300 hover:bg-[#5a4638] hover:shadow-lg disabled:bg-gray-400"
          >
            인증하기
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
          <Mail size={20} />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="인증번호"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value)}
            readOnly={isVerified}
            className="flex-1 rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none disabled:bg-gray-200"
          />
          <button
            onClick={handleVerifyCode}
            disabled={isVerified}
            className="w-28 rounded-full bg-[#6b5545] px-4 py-2 text-center text-base font-medium text-white shadow-md transition-all duration-300 hover:bg-[#5a4638] hover:shadow-lg disabled:bg-gray-400"
          >
            확인
          </button>
        </div>
      </div>

      <div>
        <div className="relative">
          <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
            <LockKeyhole size={20} />
          </div>
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
          />
        </div>
        {passwordError && <p className="mt-1 text-center text-sm text-red-500">{passwordError}</p>}
      </div>

      <div>
        <div className="relative">
          <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
            <LockKeyhole size={20} />
          </div>
          <input
            type="password"
            name="confirm_password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            className="w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
          />
        </div>
        {confirmError && <p className="mt-1 text-center text-sm text-red-500">{confirmError}</p>}
      </div>

      <div className="relative">
        <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
          <User size={20} />
        </div>
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className="w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
        />
      </div>

      <div className="relative">
        <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
          <GraduationCap size={20} />
        </div>
        <input
          type="text"
          name="sign_num"
          placeholder={role === "student" ? "학번" : "교번"}
          value={signNum}
          onChange={e => setSignNum(e.target.value)}
          required
          className="w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
        />
      </div>

      {role === "student" && (
        <div className="relative">
          <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
            <BookOpen size={20} />
          </div>
          <select
            name="department"
            value={department}
            onChange={e => setDepartment(e.target.value)}
            required
            className="w-full appearance-none rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
          >
            {departmenCollegeData?.departments.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute top-1/2 right-5 translate-y-[-50%] font-bold text-[#6b5545]">
            ▼
          </div>
        </div>
      )}

      {role === "professor" && (
        <div className="relative">
          <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
            <BookOpen size={20} />
          </div>
          <select
            name="college"
            value={college}
            onChange={e => setCollege(e.target.value)}
            required
            className="w-full appearance-none rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
          >
            {departmenCollegeData?.colleges.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute top-1/2 right-5 translate-y-[-50%] font-bold text-[#6b5545]">
            ▼
          </div>
        </div>
      )}

      <div className="relative">
        <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
          <Phone size={20} />
        </div>
        <input
          type="text"
          name="phone_num"
          placeholder="전화번호"
          value={phoneNum}
          onChange={e => setPhoneNum(e.target.value)}
          className="w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
        />
      </div>

      {role === "professor" && (
        <div className="relative">
          <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
            <MapPin size={20} />
          </div>
          <input
            type="text"
            name="interview_location"
            placeholder="면담 장소"
            value={interviewLocation}
            onChange={e => setInterviewLocation(e.target.value)}
            required
            className="w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
          />
        </div>
      )}
      <input type="hidden" name="role" value={role} />
    </div>
  );
}
