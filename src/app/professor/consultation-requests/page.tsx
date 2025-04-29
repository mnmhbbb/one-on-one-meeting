import ScheduleFrame from "@/components/ScheduleFrame";
import StudentsHeader from "@/components/StudentsHeader";
import ConsultationRequestTabs from "@/components/ConsultationRequestTabs";

const ConsultationRequestsPage = () => {
  return (
    <ScheduleFrame>
      <StudentsHeader />
      <ConsultationRequestTabs />
    </ScheduleFrame>
  );
};

export default ConsultationRequestsPage;
