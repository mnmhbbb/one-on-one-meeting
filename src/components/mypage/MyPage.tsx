"use client";

import { useUserStore } from "@/store/userStore";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { UserRole } from "@/common/const";
import { useMutation } from "@tanstack/react-query";
import { userApi } from "@/utils/api/user";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import LoadingUI from "../LoadingUI";

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

  const handleGoToMain = () => {
    if (role === UserRole.STUDENT) {
      router.push("/student/my");
    } else if (role === UserRole.PROFESSOR) {
      router.push("/professor/my");
    }
  };

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
        alert("정보가 저장되었습니다.");
      }
    },
    onError: () => {
      alert("정보 저장 실패");
    },
  });

  const handleSave = () => {
    if (!userInfo) return;
    const payload: any = {
      id: userInfo.id,
      role,
      phone_num: phoneNum,
      notification_email: notificationEmail,
    };

    if (role === UserRole.STUDENT) {
      payload.department = department;
    } else if (role === UserRole.PROFESSOR) {
      payload.college = college;
      payload.interview_location = location;
    }

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
    <div className="mx-auto max-w-xl py-5">
      <h1 className="mb-8 text-center text-3xl font-bold text-[#6b5545]">내 정보</h1>

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
              <Input
                type="text"
                value={department || ""}
                onChange={e => setDepartment(e.target.value)}
              />
            </div>
          )}

          {role === "professor" && (
            <div className="space-y-2">
              <label htmlFor="college" className="block font-[600] text-[#6b5545]">
                학부
              </label>
              <Input type="text" value={college || ""} onChange={e => setCollege(e.target.value)} />
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
