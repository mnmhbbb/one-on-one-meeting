import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { memo, useCallback } from "react";

import { InterviewModalType, InterviewStatus, UserRole } from "@/common/const";
import StatusBadgeSmall from "@/components/StatusBadgeSmall";
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
import { useUserStore } from "@/store/userStore";

interface InterviewTableProps {
  events: InterviewInfo[];
}

/**
 * 학생의 면담 신청현황 테이블
 */
const StudentInterviewTable = ({ events }: InterviewTableProps) => {
  const open = useInterviewModalStore(state => state.open);
  const userInfo = useUserStore(state => state.userInfo);

  const handleClick = useCallback(
    (event: InterviewInfo) => {
      let modalState: InterviewModalType;

      if (event.interview_state === "면담 기록 완료") {
        if (userInfo?.role === UserRole.STUDENT) {
          modalState = (event.interview_record_state_student ?? "면담 확정") as InterviewModalType;
        } else if (userInfo?.role === UserRole.PROFESSOR) {
          modalState = (event.interview_record_state_professor ??
            "면담 확정") as InterviewModalType;
        } else {
          modalState = event.interview_state as InterviewModalType;
        }
      } else {
        modalState = event.interview_state as InterviewModalType;
      }

      open(event, modalState);
    },
    [open, userInfo?.role]
  );

  const isInterviewStatus = (value: any): value is InterviewStatus => {
    return Object.values(InterviewStatus).includes(value);
  };
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
          .sort(
            (a, b) => new Date(a.interview_date).getTime() - new Date(b.interview_date).getTime()
          )
          .map((event, index) => (
            <TableRow key={index} role="button" onClick={() => handleClick(event)}>
              <TableCell className="w-[20%] px-6 font-medium">
                <StatusBadgeSmall
                  status={(() => {
                    const fallbackStatus = InterviewStatus.CONFIRMED;

                    let derivedStatus: string | null | undefined;

                    if (event.interview_state === InterviewStatus.RECORDED) {
                      if (userInfo?.role === UserRole.STUDENT) {
                        derivedStatus = event.interview_record_state_student;
                      } else if (userInfo?.role === UserRole.PROFESSOR) {
                        derivedStatus = event.interview_record_state_professor;
                      }
                    } else {
                      derivedStatus = event.interview_state;
                    }

                    return isInterviewStatus(derivedStatus) ? derivedStatus : fallbackStatus;
                  })()}
                />
                <br />
                <div className="mt-1 w-full text-center text-sm">
                  {`${format(new Date(event.interview_date), "yyyy.MM.dd")} (${format(
                    new Date(event.interview_date),
                    "EEE",
                    { locale: ko }
                  )})`}
                </div>
              </TableCell>
              <TableCell className="w-[40%] px-6">
                <div>
                  {event.professor_name} 교수님
                  <div className="line-clamp-2 text-sm break-words text-ellipsis whitespace-normal">
                    [면담 일정] {event.interview_time.join(", ")}
                  </div>
                  <div className="line-clamp-2 text-sm break-words text-ellipsis whitespace-normal">
                    [면담 사유] {event.interview_content}
                  </div>
                </div>
              </TableCell>
              <TableCell className="w-[30%] px-6">
                {event.interview_record_state_student === InterviewStatus.RECORDED && (
                  <div className="line-clamp-2 max-w-[250px] px-2 text-sm break-words text-ellipsis whitespace-normal text-gray-600">
                    {userInfo?.role === UserRole.STUDENT
                      ? event.interview_record_student
                      : event.interview_record_professor}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default memo(StudentInterviewTable);
