import ProfessorScheduleHeaderForStudent from "@/components/ProfessorScheduleHeaderForStudent";
import ScheduleFrame from "@/components/ScheduleFrame";
import ScheduleView from "@/components/ScheduleView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * 학생이 교수 페이지에 들어갔을 때 보여주는 페이지
 * @param params 교수 아이디
 */
export default async function ProfessorPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <ScheduleFrame>
      <ProfessorScheduleHeaderForStudent professorId={slug} />
      <ScheduleView professorId={slug} />
    </ScheduleFrame>
  );
}
