import { Suspense } from "react";

import InterviewDataLoader from "@/components/InterviewDataLoader";
import InterviewRequestTabs from "@/components/InterviewRequestTabs";
import LoadingUI from "@/components/LoadingUI";
import ProfessorHeader from "@/components/ProfessorHeader";
import ScheduleFrame from "@/components/ScheduleFrame";
import ChatbotWidget from "@/components/ai/ChatbotWidget";

const InterviewRequestsPage = () => {
  return (
    <ScheduleFrame>
      <ProfessorHeader />
      <InterviewDataLoader />
      <Suspense fallback={<LoadingUI />}>
        <InterviewRequestTabs />
        <ChatbotWidget />
      </Suspense>
    </ScheduleFrame>
  );
};

export default InterviewRequestsPage;
