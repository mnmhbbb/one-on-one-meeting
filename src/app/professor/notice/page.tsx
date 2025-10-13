import ChatbotWidget from "@/components/ai/ChatbotWidget";
import NoticeForm from "@/components/NoticeForm";
import ProfessorHeader from "@/components/ProfessorHeader";
import ScheduleFrame from "@/components/ScheduleFrame";

const NoticePage = () => {
  return (
    <ScheduleFrame>
      <ProfessorHeader />
      <NoticeForm />
      <ChatbotWidget />
    </ScheduleFrame>
  );
};

export default NoticePage;
