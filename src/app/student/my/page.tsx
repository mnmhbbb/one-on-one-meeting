"use client";

import ScheduleFrame from "@/components/ScheduleFrame";
import ScheduleView from "@/components/ScheduleView";
import StudentsHeader from "@/components/StudentsHeader";

const MyPage = () => {
  return (
    <ScheduleFrame>
      <StudentsHeader />
      <ScheduleView />
    </ScheduleFrame>
  );
};

export default MyPage;
