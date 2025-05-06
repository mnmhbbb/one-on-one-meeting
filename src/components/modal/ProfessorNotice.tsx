import { memo } from "react";

interface ProfessorNoticeProps {
  notice: string;
  checklist: string;
}

/**
 * 교수님 공지사항 및 확인사항 view 컴포넌트
 * @param notice 교수님 공지사항
 * @param checklist 확인사항
 * @returns
 */
const ProfessorNotice = ({ notice, checklist }: ProfessorNoticeProps) => {
  return (
    <>
      <div className="mb-4 flex flex-col space-y-1">
        <h3 className="text-base font-semibold">교수님 공지사항</h3>
        <div className="bg-primary w-full p-3 text-sm whitespace-pre-line text-white">{notice}</div>
      </div>
      <div className="flex flex-col space-y-1">
        <h3 className="text-base font-semibold">확인사항</h3>
        <div className="bg-primary w-full p-3 text-sm whitespace-pre-line text-white">
          {checklist}
        </div>
      </div>
    </>
  );
};

export default memo(ProfessorNotice);
