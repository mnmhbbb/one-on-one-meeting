"use client";

import ScheduleFrame from "@/components/ScheduleFrame";
import StudentsHeader from "@/components/StudentsHeader";
import ScheduleView from "@/components/ScheduleView";

const MyPage = () => {
  return (
    <ScheduleFrame>
      <StudentsHeader />
      <ScheduleView />
    </ScheduleFrame>
  );
};

export default MyPage;
