import ProfessorHeader from "@/components/ProfessorHeader";
import ScheduleFrame from "@/components/ScheduleFrame";
import ScheduleView from "@/components/ScheduleView";

const MyPage = () => {
  return (
    <ScheduleFrame>
      <ProfessorHeader />
      <ScheduleView />
    </ScheduleFrame>
  );
};

export default MyPage;
