"use client";

import { useRouter } from "next/navigation";

export default function MainPageLoginButton() {
  const router = useRouter();

  const handleStudentClick = () => {
    router.push("/student/login");
  };

  const handleProfessorClick = () => {
    router.push("/professor/login");
  };

  const handleAdminClick = () => {
    router.push("/admin/login");
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleStudentClick}
        className="rounded-md bg-blue-500 px-6 py-3 text-white hover:bg-blue-600">
        학생
      </button>
      <button
        onClick={handleProfessorClick}
        className="rounded-md bg-green-500 px-6 py-3 text-white hover:bg-green-600">
        교수
      </button>
      <button
        onClick={handleAdminClick}
        className="rounded-md bg-yellow-500 px-6 py-3 text-black hover:bg-yellow-600">
        어드민
      </button>
    </div>
  );
}
