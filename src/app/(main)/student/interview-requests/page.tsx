import InterviewRequestTabs from "@/components/InterviewRequestTabs";
import ScheduleFrame from "@/components/ScheduleFrame";
import StudentHeader from "@/components/StudentHeader";

const InterviewRequestsPage = () => {
  return (
    <ScheduleFrame>
      <StudentHeader />
      <InterviewRequestTabs isStudent />
    </ScheduleFrame>
  );
};

export default InterviewRequestsPage;
