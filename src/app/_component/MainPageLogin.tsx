"use client";

import { GraduationCap, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MainPageLogin() {
  const router = useRouter();

  const handleStudentClick = () => {
    router.push("/student/login");
  };

  const handleProfessorClick = () => {
    router.push("/professor/login");
  };

  return (
    <div className="w-full flex-1 flex-col bg-gray-100">
      <div className="flex w-full flex-col items-center justify-center px-10 py-10 md:px-6 lg:py-15">
        <div className="mb-10 flex flex-col items-center justify-center text-center">
          <h1 className="mb-6 text-3xl leading-relaxed font-bold tracking-tight text-[#493a2e] sm:text-3xl md:text-5xl md:leading-[4rem]">
            교수 - 학생 간에 면담 <br />
            불필요한 절차 없이 실시간으로 예약하세요.
          </h1>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:gap-10">
          <UserTypeCard
            title="학생"
            description={
              <>
                교수님과의 면담을 예약하고 <br />
                약속을 관리하세요.
              </>
            }
            icon={<GraduationCap className="text-primary h-12 w-12" />}
            onClick={handleStudentClick}
            gradient="from-[#927966] to-primary"
            index={0}
          />
          <UserTypeCard
            title="교수"
            description={
              <>
                면담 가능한 시간을 설정하고 <br />
                학생 면담 요청을 관리하세요.
              </>
            }
            icon={<Users className="text-primary h-12 w-12" />}
            onClick={handleProfessorClick}
            gradient="from-primary to-primary"
            index={1}
          />
          {/* <UserTypeCard
            title="관리자"
            description="서비스 버전은 안 보이게 가리셈"
            icon={<ShieldCheck className="text-primary h-12 w-12" />}
            onClick={handleAdminClick}
            gradient="from-primary to-[#403329]"
            index={2}
          /> */}
        </div>
      </div>
    </div>
  );
}

interface UserTypeCardProps {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  onClick: () => void;
  gradient: string;
  index: number;
}

function UserTypeCard({ title, description, icon, onClick, gradient }: UserTypeCardProps) {
  return (
    <div className="flex justify-center">
      <Card
        className="relative flex h-full w-[500px] flex-col items-center justify-between gap-0 rounded-xl border-0 bg-white p-6 text-center shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:transform-gpu hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)]"
        style={{ borderRight: "none", borderLeft: "none" }}
      >
        {/* 상단 그라데이션 라인 */}
        <div className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${gradient}`} />

        <div className="flex w-full flex-col items-center p-5">
          <div className="mb-5 flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 transition-colors duration-300 group-hover:bg-blue-100">
              {icon}
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
          <p className="mt-2 text-center text-lg leading-relaxed break-words whitespace-normal text-slate-600 lg:text-xl">
            {description}
          </p>
        </div>

        <div className="mt-auto w-full">
          <Button
            className={`w-full bg-gradient-to-r py-8 ${gradient} text-xl text-white shadow-md transition-all duration-300 hover:shadow-lg`}
            onClick={onClick}
          >
            {title} 로그인
          </Button>
        </div>
      </Card>
    </div>
  );
}
