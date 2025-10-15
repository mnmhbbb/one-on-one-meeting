import Link from "next/link";

import { UserRole } from "@/common/const";
import RegisterForm from "@/components/auth/RegisterForm";
import { uniqueDepartments } from "@/mocks/data/departments";

/**
 * 학생 회원가입 페이지
 */
export default function StudentRegisterPage() {
  const departments = uniqueDepartments.map(dept => ({
    value: dept,
    label: dept,
  }));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-200 to-white p-20">
      <div className="relative w-full max-w-md rounded-xl border border-gray-100 bg-white px-8 py-12 shadow-[0_20px_60px_-15px_rgba(107,85,69,0.3)]">
        <div className="to-primary absolute -top-1 -left-0.5 h-4 w-[100.5%] rounded-t-xl bg-gradient-to-r from-gray-300"></div>
        <div className="absolute -top-16 -right-16 hidden h-32 w-32 rounded-full bg-gray-50 opacity-50 lg:block"></div>
        <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gray-50 opacity-50"></div>
        <h1 className="mb-7 text-center text-2xl font-bold text-[#493a2e] sm:text-3xl md:text-4xl">
          학생 회원가입
        </h1>

        <RegisterForm role={UserRole.STUDENT} departments={departments} />

        <div className="mt-6 space-y-4">
          <div className="relative py-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-slate-500">또는</span>
            </div>
          </div>

          <Link
            href="/student/login"
            className="bg-primary block w-full rounded-full py-4 text-center text-lg font-medium text-white shadow-md transition-all duration-300 hover:bg-[#5a4638] hover:shadow-lg"
          >
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
