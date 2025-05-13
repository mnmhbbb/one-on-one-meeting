import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { memo, useCallback } from "react";

import { InterviewModalType, InterviewStatus } from "@/common/const";
import StatusBadge from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { InterviewInfo } from "@/utils/data/mockData";

interface InterviewTableProps {
  events: InterviewInfo[];
}

/**
 * 학생의 면담 신청현황 테이블
 */
const StudentInterviewTable = ({ events }: InterviewTableProps) => {
  const open = useInterviewModalStore(state => state.open);

  const handleClick = useCallback(
    (event: InterviewInfo) => {
      open(event.id, event.status as InterviewModalType);
    },
    [open]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20%] px-6 text-center text-base font-semibold">날짜</TableHead>
          <TableHead className="w-[40%] px-6 text-center text-base font-semibold">
            면담 신청내용
          </TableHead>
          <TableHead className="w-[30%] px-6 text-center text-base font-semibold">
            면담 기록내용
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((event, index) => (
            <TableRow key={index} role="button" onClick={() => handleClick(event)}>
              <TableCell className="w-[20%] px-6 font-medium">
                <StatusBadge status={event.status as InterviewStatus} />
                <br />
                <div className="mt-1 w-full text-center text-sm">
                  {`${format(new Date(event.date), "yyyy.MM.dd")} (${format(
                    new Date(event.date),
                    "EEE",
                    { locale: ko }
                  )})`}
                </div>
              </TableCell>
              <TableCell className="w-[40%] px-6">
                <div>
                  {event.professor} 교수님
                  <br />
                  [면담 일정] {event.time.join(", ")}
                  <br />
                  <div className="line-clamp-2 text-sm break-words text-ellipsis whitespace-normal">
                    [면담 사유] {event.reason}
                  </div>
                </div>
              </TableCell>
              <TableCell className="w-[30%] px-6">
                <div className="line-clamp-2 max-w-[250px] text-sm break-words text-ellipsis whitespace-normal text-gray-600">
                  {event.status === InterviewStatus.RECORDED && event.memo}
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default memo(StudentInterviewTable);
