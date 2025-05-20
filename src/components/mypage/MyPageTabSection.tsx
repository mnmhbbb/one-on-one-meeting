"use client";

import { useState } from "react";

import ChangePassword from "@/components/mypage/ChangePassword";
import MyPage from "@/components/mypage/MyPage";

export const MyPageTabSection = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const tabList = [
    { id: "profile", label: "내 정보" },
    { id: "password", label: "비밀번호 변경" },
  ];

  return (
    <>
      <div className="mb-6 flex overflow-x-auto">
        <div className="mx-auto flex space-x-1 border-b border-[#6b5545]/10 pb-px">
          {tabList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-[#6b5545] text-[#6b5545]"
                  : "text-[#6b5545]/70 hover:text-[#6b5545]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[calc(100vh-200px)]">
        {activeTab === "profile" && <MyPage />}
        {activeTab === "password" && <ChangePassword />}
      </div>
    </>
  );
};
export default MyPageTabSection;
