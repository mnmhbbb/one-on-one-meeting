"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { UserRole } from "@/common/const";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserStore } from "@/store/userStore";
import { MyPageUserInfo } from "@/types/user";
import { userApi } from "@/utils/api/user";

import LoadingUI from "../LoadingUI";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToastStore } from "@/store/toastStore";

const MyPage = () => {
  const router = useRouter();

  const { userInfo, setUserInfo } = useUserStore(
    useShallow(state => ({
      userInfo: state.userInfo,
      setUserInfo: state.setUserInfo,
    }))
  );

  const role = userInfo?.role;
  const [phoneNum, setPhoneNum] = useState("");
  const [notificationEmail, setNotificationEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [college, setCollege] = useState("");
  const [location, setLocation] = useState("");
  const setToast = useToastStore(state => state.setToast);

  const handleGoToMain = () => {
    if (role === UserRole.STUDENT) {
      router.push("/student/my");
    } else if (role === UserRole.PROFESSOR) {
      router.push("/professor/my");
    }
  };

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

  const { mutate } = useMutation({
    mutationFn: userApi.updateUserInfo,
    onSuccess: data => {
      if (data) {
        // 전역 상태 업데이트
        setUserInfo({ ...data });

        // 로컬 상태 업데이트
        setPhoneNum(data.phone_num || "");
        setNotificationEmail(data.notification_email || "");
        setDepartment(data.department || "");
        setCollege(data.college || "");
        setLocation(data.interview_location || "");
        setToast("정보가 업데이트되었습니다.", "success");
      }
    },
    onError: () => {
      alert("정보 저장 실패");
    },
  });

  const handleSave = () => {
    if (!userInfo) return;
    const payload: MyPageUserInfo = {
      id: userInfo.id,
      role: role!,
      name: userInfo.name,
      email: userInfo.email,
      sign_num: userInfo.sign_num,
      phone_num: phoneNum,
      notification_email: notificationEmail,
      department: role === UserRole.STUDENT ? department : "",
      college: role === UserRole.PROFESSOR ? college : "",
      interview_location: role === UserRole.PROFESSOR ? location : "",
    };

    mutate(payload);
  };

  useEffect(() => {
    if (!userInfo || !userInfo.role) return;
    setPhoneNum(userInfo.phone_num || "");
    setNotificationEmail(userInfo.notification_email || "");
    setDepartment(userInfo.department || "");
    setCollege(userInfo.college || "");
    setLocation(userInfo.interview_location || "");
  }, [userInfo]);

  if (!userInfo || !userInfo.role) {
    return <LoadingUI />;
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-5 text-center text-2xl font-bold">내 정보</h1>

      <div className="overflow-hidden rounded-lg bg-white p-8 shadow-md">
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block font-[600] text-[#6b5545]">
              아이디
            </label>
            <Input
              type="email"
              id="email"
              defaultValue={userInfo.email}
              disabled
              className="disabled:pointer-events-auto"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="name" className="block text-base font-[600] text-[#6b5545]">
              이름
            </label>
            <Input
              type="text"
              id="name"
              defaultValue={userInfo.name}
              disabled
              className="disabled:pointer-events-auto"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="signNum" className="block font-[600] text-[#6b5545]">
              {role === UserRole.STUDENT ? "학번" : "교번"}
            </label>
            <Input
              type="text"
              value={userInfo.sign_num}
              disabled
              className="disabled:pointer-events-auto"
            />
          </div>

          {role === "student" && (
            <div className="space-y-2">
              <label htmlFor="department" className="block font-[600] text-[#6b5545]">
                학과
              </label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="학과를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {departmenCollegeData?.departments.map(dept => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {role === "professor" && (
            <div className="space-y-2">
              <label htmlFor="college" className="block font-[600] text-[#6b5545]">
                학부
              </label>
              <Select value={college} onValueChange={setCollege}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="학부를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {departmenCollegeData?.colleges.map(
                    (college: { value: string; label: string }) => (
                      <SelectItem key={college.value} value={college.value}>
                        {college.label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="phoneNum" className="block font-[600] text-[#6b5545]">
              전화번호
            </label>
            <Input type="text" value={phoneNum || ""} onChange={e => setPhoneNum(e.target.value)} />
          </div>

          {role === "professor" && (
            <div className="space-y-2">
              <label htmlFor="interviewLocation" className="block font-[600] text-[#6b5545]">
                면담 장소
              </label>
              <Input
                type="text"
                value={location || ""}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="notificationEmail" className="block font-[600] text-[#6b5545]">
              알림 이메일
            </label>
            <Input
              type="text"
              value={notificationEmail || ""}
              onChange={e => setNotificationEmail(e.target.value)}
            />
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button variant="outline" onClick={handleGoToMain}>
              메인으로
            </Button>
            <Button onClick={handleSave}>저장</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
