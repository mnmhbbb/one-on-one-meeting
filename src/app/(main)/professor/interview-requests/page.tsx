import { Suspense } from "react";

import InterviewRequestTabs from "@/components/InterviewRequestTabs";
import LoadingUI from "@/components/LoadingUI";
import ProfessorHeader from "@/components/ProfessorHeader";
import ScheduleFrame from "@/components/ScheduleFrame";

const InterviewRequestsPage = () => {
  return (
    <ScheduleFrame>
      <ProfessorHeader />
      <Suspense fallback={<LoadingUI />}>
        <InterviewRequestTabs />
      </Suspense>
    </ScheduleFrame>
  );
};

export default InterviewRequestsPage;
