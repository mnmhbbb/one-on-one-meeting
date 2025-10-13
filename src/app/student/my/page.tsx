import ScheduleFrame from "@/components/ScheduleFrame";
import ScheduleView from "@/components/ScheduleView";
import StudentHeader from "@/components/StudentHeader";

const MyPage = () => {
  return (
    <ScheduleFrame>
      <StudentHeader />
      <ScheduleView />
    </ScheduleFrame>
  );
};

export default MyPage;
