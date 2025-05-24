import ChatbotWidget from "@/components/ai/ChatbotWidget";
import ProfessorHeader from "@/components/ProfessorHeader";
import ScheduleFrame from "@/components/ScheduleFrame";
import ScheduleView from "@/components/ScheduleView";

const MyPage = () => {
  return (
    <ScheduleFrame>
      <ProfessorHeader />
      <ScheduleView />
      <ChatbotWidget />
    </ScheduleFrame>
  );
};

export default MyPage;
