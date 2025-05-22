import { memo } from "react";

interface ProfessorNoticeProps {
  professorInfo: string;
  notice: string;
  guide: string;
}

/**
 * 교수님 공지사항 및 확인사항 view 컴포넌트
 * @param professorInfo 교수님 기본사항
 * @param notice 교수님 공지사항
 * @param guide 확인사항
 * @returns
 */
const ProfessorNotice = ({ notice, guide, professorInfo }: ProfessorNoticeProps) => {
  return (
    <>
      {notice && (
        <div className="mb-4 flex flex-col space-y-1 text-left">
          <h3 className="text-base font-semibold">교수님 공지사항</h3>
          <div className="bg-primary w-full p-3 text-left text-sm whitespace-pre-line text-white">
            {professorInfo} <br />
            <br />
            {notice}
          </div>
        </div>
      )}
      {guide && (
        <div className="flex flex-col space-y-1 text-left">
          <h3 className="text-base font-semibold">확인사항</h3>
          <div className="bg-primary w-full p-3 text-left text-sm whitespace-pre-line text-white">
            {guide}
          </div>
        </div>
      )}
    </>
  );
};

export default memo(ProfessorNotice);
