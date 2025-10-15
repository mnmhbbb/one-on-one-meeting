"use client";

import { LockKeyhole, Mail, User, Phone, BookOpen, GraduationCap, MapPin } from "lucide-react";
import { useActionState, useState } from "react";

import { UserRole } from "@/common/const";
import { signupAction } from "@/actions/auth";
import type { SignupFormState } from "@/types/auth";
import { emailApi } from "@/utils/api/email";
import { Button } from "@/components/ui/button";

interface RegisterFormProps {
  role: UserRole.STUDENT | UserRole.PROFESSOR;
  departments?: Array<{ value: string; label: string }>;
  colleges?: Array<{ value: string; label: string }>;
}

/**
 * 회원가입 폼 컴포넌트
 * - Server Action 기반 (signupAction)
 * - 이메일 인증 포함
 */
export default function RegisterForm({ role, departments = [], colleges = [] }: RegisterFormProps) {
  const initialState: SignupFormState = { success: false };
  const [state, formAction, isPending] = useActionState(signupAction, initialState);

  // 이메일 인증 관련 상태
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  /**
   * 인증 코드 전송
   */
  const handleSendCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      alert("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    setIsSendingCode(true);

    try {
      const result = await emailApi.sendVerificationCode(email);

      if (result) {
        alert("인증 코드가 발송되었습니다. (개발 환경: 콘솔 확인)");
      } else {
        alert("인증 코드 전송 실패");
      }
    } catch (error) {
      console.error("인증 코드 전송 에러:", error);
      alert("인증 코드 전송 중 오류가 발생했습니다.");
    } finally {
      setIsSendingCode(false);
    }
  };

  /**
   * 인증 코드 검증
   */
  const handleVerifyCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!verificationCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }

    setIsVerifying(true);

    try {
      const result = await emailApi.verifyCode(email, verificationCode);

      if (result) {
        alert("이메일 인증이 완료되었습니다!");
        setIsVerified(true);
      } else {
        alert("인증 코드가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("인증 코드 검증 에러:", error);
      alert("인증 코드 검증 중 오류가 발생했습니다.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <form action={formAction} className="relative z-10 space-y-5">
      {/* 에러 메시지 표시 */}
      {state?.message && !state.success && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {state.message}
        </div>
      )}

      <input type="hidden" name="role" value={role} />

      {/* 이메일 (인증 포함) */}
      <div className="space-y-2">
        <div className="relative">
          <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
            <Mail size={20} />
          </div>
          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              placeholder="이메일"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              readOnly={isVerified}
              className="flex-1 rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none disabled:bg-gray-200"
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={isVerified || isSendingCode}
              className="w-28 rounded-full bg-[#6b5545] px-4 py-2 text-center text-base font-medium text-white shadow-md transition-all duration-300 hover:bg-[#5a4638] hover:shadow-lg disabled:bg-gray-400"
            >
              {isSendingCode ? "전송 중..." : "인증하기"}
            </button>
          </div>
        </div>
        {state?.errors?.email && <p className="text-sm text-red-600">{state.errors.email}</p>}

        {/* 인증번호 입력 */}
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
              type="button"
              onClick={handleVerifyCode}
              disabled={isVerified || isVerifying}
              className="w-28 rounded-full bg-[#6b5545] px-4 py-2 text-center text-base font-medium text-white shadow-md transition-all duration-300 hover:bg-[#5a4638] hover:shadow-lg disabled:bg-gray-400"
            >
              {isVerifying ? "확인 중..." : isVerified ? "완료" : "확인"}
            </button>
          </div>
        </div>
      </div>

      {/* 비밀번호 */}
      <div>
        <div className="relative">
          <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
            <LockKeyhole size={20} />
          </div>
          <input
            type="password"
            name="password"
            placeholder="비밀번호 (8자 이상, 영문+숫자)"
            required
            className="w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
          />
        </div>
        {state?.errors?.password && (
          <p className="mt-1 text-sm text-red-600">{state.errors.password}</p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div>
        <div className="relative">
          <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
            <LockKeyhole size={20} />
          </div>
          <input
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            required
            className="w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
          />
        </div>
        {state?.errors?.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{state.errors.confirmPassword}</p>
        )}
      </div>

      {/* 이름 */}
      <div>
        <div className="relative">
          <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
            <User size={20} />
          </div>
          <input
            type="text"
            name="name"
            placeholder="이름"
            required
            className="w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
          />
        </div>
        {state?.errors?.name && <p className="mt-1 text-sm text-red-600">{state.errors.name}</p>}
      </div>

      {/* 학번/교번 */}
      <div className="relative">
        <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
          <GraduationCap size={20} />
        </div>
        <input
          type="text"
          name={role === UserRole.STUDENT ? "studentId" : "professorId"}
          placeholder={role === UserRole.STUDENT ? "학번" : "교번"}
          required
          className="w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
        />
      </div>

      {/* 학생: 학과 */}
      {role === UserRole.STUDENT && (
        <div>
          <div className="relative">
            <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
              <BookOpen size={20} />
            </div>
            <select
              name="department"
              required
              defaultValue=""
              className="w-full appearance-none rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
            >
              <option value="" disabled>
                학과 선택
              </option>
              {departments.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-1/2 right-5 translate-y-[-50%] font-bold text-[#6b5545]">
              ▼
            </div>
          </div>
          {state?.errors?.department && (
            <p className="mt-1 text-sm text-red-600">{state.errors.department}</p>
          )}
        </div>
      )}

      {/* 교수: 단과대학 */}
      {role === UserRole.PROFESSOR && (
        <div>
          <div className="relative">
            <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
              <BookOpen size={20} />
            </div>
            <select
              name="college"
              required
              defaultValue=""
              className="w-full appearance-none rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
            >
              <option value="" disabled>
                단과대학 선택
              </option>
              {colleges.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute top-1/2 right-5 translate-y-[-50%] font-bold text-[#6b5545]">
              ▼
            </div>
          </div>
          {state?.errors?.college && (
            <p className="mt-1 text-sm text-red-600">{state.errors.college}</p>
          )}
        </div>
      )}

      {/* 전화번호 (선택) */}
      <div className="relative">
        <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
          <Phone size={20} />
        </div>
        <input
          type="text"
          name="phoneNum"
          placeholder="전화번호 (선택)"
          className="w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
        />
      </div>

      {/* 교수: 면담 장소 */}
      {role === UserRole.PROFESSOR && (
        <div>
          <div className="relative">
            <div className="text-primary absolute top-1/2 left-5 -translate-y-1/2">
              <MapPin size={20} />
            </div>
            <input
              type="text"
              name="interviewLocation"
              placeholder="면담 장소"
              required
              className="w-full rounded-full border border-gray-400 bg-white py-4 pr-5 pl-12 text-base transition-all focus:border-[#6b5545] focus:ring-1 focus:ring-[#6b5545] focus:outline-none"
            />
          </div>
          {state?.errors?.interviewLocation && (
            <p className="mt-1 text-sm text-red-600">{state.errors.interviewLocation}</p>
          )}
        </div>
      )}

      {/* 제출 버튼 */}
      <Button
        type="submit"
        disabled={isPending || !isVerified}
        className="border-primary text-primary h-auto w-full rounded-full border-2 bg-white py-4 text-center text-lg font-medium transition-all duration-300 hover:bg-[#80746b2a] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "가입 중..." : !isVerified ? "이메일 인증을 완료해주세요" : "가입하기"}
      </Button>
    </form>
  );
}
