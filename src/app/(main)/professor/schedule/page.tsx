import ProfessorHeader from "@/components/ProfessorHeader";
import ScheduleFrame from "@/components/ScheduleFrame";
import ScheduleManagement from "@/components/ScheduleManagement";

/**
 * 교수 면담 일정 관리 페이지
 */
const SchedulePage = () => {
  return (
    <ScheduleFrame>
      <ProfessorHeader />
      <ScheduleManagement />
    </ScheduleFrame>
  );
};

export default SchedulePage;
