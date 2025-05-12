import InterviewRequestTabs from "@/components/InterviewRequestTabs";
import ProfessorHeader from "@/components/ProfessorHeader";
import ScheduleFrame from "@/components/ScheduleFrame";

const InterviewRequestsPage = () => {
  return (
    <ScheduleFrame>
      <ProfessorHeader />
      <InterviewRequestTabs />
    </ScheduleFrame>
  );
};

export default InterviewRequestsPage;
