import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Check, CirclePlus, X } from "lucide-react";
import { memo, useCallback } from "react";

import { INTERVIEW_MODAL_TYPE, InterviewModalType, InterviewStatus } from "@/common/const";
import StatusBadge from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { InterviewInfo } from "@/types/interview";
interface InterviewTableProps {
  events: InterviewInfo[];
}

/**
 * 교수 면담 신청현황 테이블
 */
const ProfessorInterviewTable = ({ events }: InterviewTableProps) => {
  const open = useInterviewModalStore(state => state.open);

  const handleClick = useCallback(
    (event: InterviewInfo) => {
      open(event, event.interview_state as InterviewModalType);
    },
    [open]
  );

  const handleApprove = useCallback((event: InterviewInfo, e: React.MouseEvent) => {
    e.stopPropagation();
    alert("수락 테스트");
  }, []);

  const handleReject = useCallback(
    (event: InterviewInfo, e: React.MouseEvent) => {
      e.stopPropagation();
      open(event, INTERVIEW_MODAL_TYPE.REJECTION_REASON);
    },
    [open]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20%] px-6 text-center text-base font-semibold">날짜</TableHead>
          <TableHead className="w-[30%] px-6 text-center text-base font-semibold">
            면담 신청내용
          </TableHead>
          <TableHead className="w-[30%] px-6 text-center text-base font-semibold">
            면담 기록내용
          </TableHead>
          <TableHead className="w-[20%] px-6 text-center text-base font-semibold">
            면담 요청
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events
          .sort(
            (a, b) => new Date(a.interview_date).getTime() - new Date(b.interview_date).getTime()
          )
          .map((event, index) => (
            <TableRow key={index} role="button" onClick={() => handleClick(event)}>
              <TableCell className="w-[20%] px-6 font-medium">
                <StatusBadge status={event.interview_state as InterviewStatus} />
                <br />
                <div className="mt-1 w-full text-center text-sm">
                  {`${format(new Date(event.interview_date), "yyyy.MM.dd")} (${format(
                    new Date(event.interview_date),
                    "EEE",
                    { locale: ko }
                  )})`}
                </div>
              </TableCell>
              <TableCell className="w-[30%] px-6">
                <div>
                  [신청 학생] {event.student_name} ({event.student_department}{" "}
                  {event.student_sign_num})
                  <br />
                  [면담 일정] {event.interview_time.join(", ")}
                  <br />
                  <div className="line-clamp-2 text-sm break-words text-ellipsis whitespace-normal">
                    [면담 사유] {event.interview_content}
                  </div>
                </div>
              </TableCell>
              <TableCell className="w-[30%] px-6">
                {event.interview_state === InterviewStatus.CONFIRMED &&
                  new Date(event.interview_date) < new Date() && (
                    <div className="text-primary flex h-full w-full items-center justify-center gap-1 rounded-md bg-[#FDFF9B] px-3 py-7 text-center font-semibold">
                      <CirclePlus className="h-4 w-4" />
                      면담 내용을 기록해보세요!
                    </div>
                  )}
                {event.interview_state === InterviewStatus.RECORDED && (
                  <div className="line-clamp-2 max-w-[250px] px-2 text-sm break-words text-ellipsis whitespace-normal text-gray-600">
                    {event.interview_record}
                  </div>
                )}
              </TableCell>
              <TableCell className="w-[20%] px-6">
                {event.interview_state === InterviewStatus.REQUESTED ? (
                  <div className="flex justify-between px-5">
                    <Button onClick={e => handleApprove(event, e)}>수락</Button>
                    <Button onClick={e => handleReject(event, e)}>거절</Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    {event.interview_state === InterviewStatus.RECORDED ||
                    event.interview_state === InterviewStatus.CONFIRMED ? (
                      <Check className="h-7 w-7 text-green-500" />
                    ) : (
                      <X className="h-7 w-7 text-red-500" />
                    )}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default memo(ProfessorInterviewTable);
