import ChatbotWidget from "@/components/ai/ChatbotWidget";
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
      <ChatbotWidget />
    </ScheduleFrame>
  );
};

export default SchedulePage;
