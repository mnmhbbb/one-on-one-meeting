import { Suspense } from "react";

import InterviewDataLoader from "@/components/InterviewDataLoader";
import InterviewRequestTabs from "@/components/InterviewRequestTabs";
import LoadingUI from "@/components/LoadingUI";
import ProfessorHeader from "@/components/ProfessorHeader";
import ScheduleFrame from "@/components/ScheduleFrame";

const InterviewRequestsPage = () => {
  return (
    <ScheduleFrame>
      <ProfessorHeader />
      <InterviewDataLoader />
      <Suspense fallback={<LoadingUI />}>
        <InterviewRequestTabs />
      </Suspense>
    </ScheduleFrame>
  );
};

export default InterviewRequestsPage;
