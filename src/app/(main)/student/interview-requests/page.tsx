import { Suspense } from "react";

import InterviewDataLoader from "@/components/InterviewDataLoader";
import InterviewRequestTabs from "@/components/InterviewRequestTabs";
import LoadingUI from "@/components/LoadingUI";
import ScheduleFrame from "@/components/ScheduleFrame";
import StudentHeader from "@/components/StudentHeader";

const InterviewRequestsPage = () => {
  return (
    <ScheduleFrame>
      <StudentHeader />
      <InterviewDataLoader />
      <Suspense fallback={<LoadingUI />}>
        <InterviewRequestTabs isStudent />
      </Suspense>
    </ScheduleFrame>
  );
};

export default InterviewRequestsPage;
