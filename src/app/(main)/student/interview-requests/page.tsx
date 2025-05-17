import { Suspense } from "react";

import InterviewRequestTabs from "@/components/InterviewRequestTabs";
import LoadingUI from "@/components/LoadingUI";
import ScheduleFrame from "@/components/ScheduleFrame";
import StudentHeader from "@/components/StudentHeader";

const InterviewRequestsPage = () => {
  return (
    <ScheduleFrame>
      <StudentHeader />
      <Suspense fallback={<LoadingUI />}>
        <InterviewRequestTabs isStudent />
      </Suspense>
    </ScheduleFrame>
  );
};

export default InterviewRequestsPage;
