import { Suspense } from "react";

import { UserRole } from "@/common/const";
import LoginForm from "@/components/auth/LoginForm";
import LoadingUI from "@/components/LoadingUI";

export default function ProfessorLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-white pb-[5%]">
      <div className="relative w-full max-w-md rounded-xl border border-gray-100 bg-white px-8 py-12 shadow-[0_20px_60px_-15px_rgba(107,85,69,0.3)]">
        <div className="to-primary absolute -top-1 -left-0.5 h-4 w-[100.5%] rounded-t-xl bg-gradient-to-r from-gray-300"></div>
        <div className="absolute -top-16 -right-16 hidden h-32 w-32 rounded-full bg-gray-50 opacity-50 lg:block"></div>
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gray-50 opacity-50"></div>
        <h1 className="mb-7 text-center text-2xl font-bold text-[#493a2e] sm:text-3xl md:text-4xl">
          로그인 하기
        </h1>
        <Suspense fallback={<LoadingUI />}>
          <LoginForm role={UserRole.PROFESSOR} />
        </Suspense>
      </div>
    </div>
  );
}
