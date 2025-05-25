import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Check, CirclePlus, X } from "lucide-react";
import { memo, useCallback } from "react";

import {
  INTERVIEW_MODAL_TYPE,
  InterviewModalType,
  InterviewStatus,
  UserRole,
} from "@/common/const";
import LoadingUI from "@/components/LoadingUI";
import StatusBadgeSmall from "@/components/StatusBadgeSmall";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDateStore } from "@/store/dateStore";
import { useInterviewModalStore } from "@/store/interviewModalStore";
import { useToastStore } from "@/store/toastStore";
import { InterviewAcceptBody, InterviewInfo } from "@/types/interview";
import { interviewApi } from "@/utils/api/interview";
import { useUserStore } from "@/store/userStore";

interface InterviewTableProps {
  events: InterviewInfo[];
}

/**
 * 교수 면담 신청현황 테이블
 */
const ProfessorInterviewTable = ({ events }: InterviewTableProps) => {
  const open = useInterviewModalStore(state => state.open);
  const setToast = useToastStore(state => state.setToast);
  const setUpdateTarget = useDateStore(state => state.setUpdateTarget);
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

  const updateInterviewStateMutation = useMutation({
    mutationFn: async (data: InterviewAcceptBody) => {
      const result = await interviewApi.putInterviewState(data);
      if (result) {
        setToast("면담 상태가 업데이트되었습니다.", "success");
        setUpdateTarget("professorInterviewList");
      }
      return result;
    },
  });

  // 면담 수락
  const handleApprove = useCallback(
    (event: InterviewInfo, e: React.MouseEvent) => {
      e.stopPropagation();

      if (window.confirm("면담을 수락하시겠습니까?")) {
        updateInterviewStateMutation.mutate({
          id: event.id,
          student_id: event.student_id,
          professor_id: event.professor_id,
          interview_date: event.interview_date,
          interview_time: event.interview_time,
          interview_accept: true,
        });
        close();
      }
    },
    [updateInterviewStateMutation]
  );

  const handleReject = useCallback(
    (event: InterviewInfo, e: React.MouseEvent) => {
      e.stopPropagation();
      open(event, INTERVIEW_MODAL_TYPE.REJECTION_REASON);
    },
    [open]
  );
  const isInterviewStatus = (value: any): value is InterviewStatus => {
    return Object.values(InterviewStatus).includes(value);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px] text-center text-base font-semibold">날짜</TableHead>
            <TableHead className="w-[50px] text-center text-base font-semibold">
              면담 신청내용
            </TableHead>
            <TableHead className="w-[50px] text-center text-base font-semibold">
              면담 기록내용
            </TableHead>
            <TableHead className="w-[50px] text-center text-base font-semibold">
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
                <TableCell className="w-[30%] px-6">
                  <div>
                    [신청 학생] {event.student_name} ({event.student_department})
                    <div className="line-clamp-2 text-sm break-words text-ellipsis whitespace-normal">
                      [면담 일정] {event.interview_time.join(", ")}
                    </div>
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
                  {event.interview_record_state_professor === InterviewStatus.RECORDED && (
                    <div className="line-clamp-2 max-w-[250px] px-2 text-sm break-words text-ellipsis whitespace-normal text-gray-600">
                      {userInfo?.role === UserRole.STUDENT
                        ? event.interview_record_student
                        : event.interview_record_professor}
                    </div>
                  )}
                </TableCell>
                <TableCell className="w-[20%] px-6">
                  {event.interview_state === InterviewStatus.REQUESTED ? (
                    <div className="flex items-center justify-center space-x-3">
                      <Button
                        onClick={e => handleApprove(event, e)}
                        disabled={updateInterviewStateMutation.isPending}
                      >
                        수락
                      </Button>
                      <Button
                        onClick={e => handleReject(event, e)}
                        disabled={updateInterviewStateMutation.isPending}
                      >
                        거절
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {event.interview_record_state_professor === InterviewStatus.RECORDED ||
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
      {updateInterviewStateMutation.isPending && <LoadingUI />}
    </>
  );
};

export default memo(ProfessorInterviewTable);
