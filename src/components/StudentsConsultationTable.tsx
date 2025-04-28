import { memo } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import StatusBadge from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConsultationInfo } from "@/utils/data/mockData";

interface ConsultationTableProps {
  events: ConsultationInfo[];
}

const StudentsConsultationTable = ({ events }: ConsultationTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[20%] px-6 font-semibold text-base text-center">날짜</TableHead>
          <TableHead className="w-[40%] px-6 font-semibold text-base text-center">
            면담 신청내용
          </TableHead>
          <TableHead className="w-[30%] px-6 font-semibold text-base text-center">
            면담 기록내용
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .map((event, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium w-[20%] px-6">
                <StatusBadge status={event.status} />
                <br />
                <div className="w-full text-center text-sm mt-1">
                  {`${format(new Date(event.date), "yyyy.MM.dd")} (${format(
                    new Date(event.date),
                    "EEE",
                    { locale: ko },
                  )})`}
                </div>
              </TableCell>
              <TableCell className="w-[40%] px-6">
                <div>
                  {event.professor} 교수님
                  <br />
                  [면담 일정] {event.date.split(" ")[1]} ~
                  {format(new Date(event.date), "HH:mm", { locale: ko })}
                  <br />
                  <div className="line-clamp-2 text-ellipsis text-sm break-words whitespace-normal">
                    [면담 사유] {event.reason}
                  </div>
                </div>
              </TableCell>
              <TableCell className="w-[30%] px-6">
                <div className="line-clamp-2 text-ellipsis text-sm text-gray-600 max-w-[250px] break-words whitespace-normal">
                  {event.status === "RECORDED" && event.memo}
                </div>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default memo(StudentsConsultationTable);
