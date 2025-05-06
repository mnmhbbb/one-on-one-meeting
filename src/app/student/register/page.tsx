import Register from "@/components/auth/Register";
import { Button } from "@/components/ui/button";

import { signup } from "../../actions/signup";
import Link from "next/link";

export default function StudentRegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-white p-4">
      <div className="w-full max-w-md rounded-lg bg-gray-100 px-8 py-16">
        <form className="space-y-6" action={signup}>
          <Register role="student" />
          <Button
            type="submit"
            className="h-auto w-full rounded-md bg-[#6b5545] py-4 text-center text-lg font-medium text-white hover:bg-[#5a4638]"
          >
            가입하기
          </Button>
          <Link href="/student/login">
            <button
              type="button"
              className="w-full rounded-md bg-[#6b5545] py-4 text-center text-lg font-medium text-white hover:bg-[#5a4638]"
            >
              로그인
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
