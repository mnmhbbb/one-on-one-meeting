import ScheduleFrame from "@/components/ScheduleFrame";
import StudentsHeader from "@/components/StudentsHeader";
import InterviewRequestTabs from "@/components/InterviewRequestTabs";

const InterviewRequestsPage = () => {
  return (
    <ScheduleFrame>
      <StudentsHeader />
      <InterviewRequestTabs />
    </ScheduleFrame>
  );
};

export default InterviewRequestsPage;
