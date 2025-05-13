import InterviewRequestTabs from "@/components/InterviewRequestTabs";
import ScheduleFrame from "@/components/ScheduleFrame";
import StudentsHeader from "@/components/StudentsHeader";

const InterviewRequestsPage = () => {
  return (
    <ScheduleFrame>
      <StudentsHeader />
      <InterviewRequestTabs isStudent />
    </ScheduleFrame>
  );
};

export default InterviewRequestsPage;
