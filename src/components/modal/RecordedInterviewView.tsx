"use client";

import dayjs from "dayjs";
import { memo, useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { InterviewStatus, STATUS_COLORS, STATUS_LABELS, UserRole } from "@/common/const";
import InterviewInfoForm from "@/components/modal/InterviewInfoForm";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useInterviewModalStore } from "@/store/interviewModalStore";

import { Textarea } from "../ui/textarea";
import ProfessorNotice from "./ProfessorNotice";
import { interviewApi } from "@/utils/api/interview";
import { useMutation } from "@tanstack/react-query";
import { useUserStore } from "@/store/userStore";
import { InterviewRecordBody } from "@/types/interview";
import { useToastStore } from "@/store/toastStore";
import { useDateStore } from "@/store/dateStore";

const RecordedInterviewView = () => {
  const { interviewInfo, setInterviewInfo, close } = useInterviewModalStore(
    useShallow(state => ({
      interviewInfo: state.interviewInfo,
      setInterviewInfo: state.setInterviewInfo,
      close: state.close,
    }))
  );
  const setUpdateTarget = useDateStore(state => state.setUpdateTarget);
  const userInfo = useUserStore(state => state.userInfo);
  const setToast = useToastStore(state => state.setToast);
  const [step, setStep] = useState(1);

  // 기록 저장 (POST)
  const { mutate: postRecord } = useMutation({
    mutationFn: async (body: InterviewRecordBody) => {
      return await interviewApi.postInterviewRecord(body);
    },
    onSuccess: () => {
      setToast("면담 기록이 저장되었습니다.", "success");
      if (interviewInfo) {
        setInterviewInfo({
          ...interviewInfo,
          interview_state: InterviewStatus.RECORDED,
        });
      }
      close();
      if (userInfo?.role === UserRole.STUDENT) {
        setUpdateTarget("studentInterviewList");
      } else {
        setUpdateTarget("professorInterviewList");
      }
    },
    onError: () => {
      setToast("기록 저장 중 오류가 발생했습니다.", "error");
    },
  });

  // 기록 수정 (PUT)
  const { mutate: putRecord } = useMutation({
    mutationFn: async (body: InterviewRecordBody) => {
      return await interviewApi.putInterviewRecord(body);
    },
    onSuccess: () => {
      setToast("면담 기록이 수정되었습니다.", "success");
      if (interviewInfo) {
        setInterviewInfo({
          ...interviewInfo,
          interview_state: InterviewStatus.RECORDED,
        });
      }
      close();
      if (userInfo?.role === UserRole.STUDENT) {
        setUpdateTarget("studentInterviewList");
      } else {
        setUpdateTarget("professorInterviewList");
      }
    },
    onError: () => {
      setToast("기록 수정 중 오류가 발생했습니다.", "error");
    },
  });

  const handleSave = () => {
    if (!userInfo?.id || !interviewInfo?.id || !userInfo?.role) {
      setToast("기록 저장에 필요한 정보가 없습니다.", "error");
      return;
    }

    const interview_record =
      userInfo.role === UserRole.STUDENT
        ? interviewInfo?.interview_record_student
        : interviewInfo?.interview_record_professor;

    const recordBody: InterviewRecordBody = {
      writer_id: userInfo.id,
      interview_id: interviewInfo.id,
      interview_record,
      role: userInfo.role,
    };

    // 기록이 이미 존재하면 PUT, 아니면 POST
    if (
      (userInfo.role === UserRole.STUDENT && interviewInfo?.interview_record_student) ||
      (userInfo.role === UserRole.PROFESSOR && interviewInfo?.interview_record_professor)
    ) {
      putRecord(recordBody);
    } else {
      postRecord(recordBody);
    }
  };

  const handleStepChange = useCallback((step: number) => {
    setStep(step);
  }, []);

  const headerText = useMemo(() => {
    return step === 1
      ? `${interviewInfo?.professor_name} 교수님 면담 완료`
      : `${interviewInfo?.professor_name} 교수님 면담 기록내용`;
  }, [interviewInfo?.professor_name, step]);

  const formattedInterviewDatetimeList = useMemo(() => {
    if (!interviewInfo?.interview_date) return [];

    const baseDate = dayjs(interviewInfo?.interview_date).format("YYYY년 MM월 DD일 dddd");
    return interviewInfo?.interview_time.map(time => `${baseDate} ${time}`);
  }, [interviewInfo?.interview_date, interviewInfo?.interview_time]);

  const isInterviewStatus = (value: any): value is InterviewStatus => {
    return Object.values(InterviewStatus).includes(value);
  };

  const formatProfessorInfo = () => {
    return `- 이메일: ${interviewInfo?.professor_notification_email}\n- 면담 위치: ${interviewInfo?.professor_interview_location}`;
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-left text-2xl font-bold">{headerText}</DialogTitle>
      </DialogHeader>

      {step === 1 && (
        <div className="mt-4 max-h-[50vh] overflow-y-auto p-1">
          <InterviewInfoForm interviewDatetimeList={formattedInterviewDatetimeList} />
          <div className="mt-2 mb-8">
            <ProfessorNotice
              professorInfo={formatProfessorInfo()}
              notice={interviewInfo?.notice_content || ""}
              guide={interviewInfo?.guide_content || ""}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => handleStepChange(2)}>다음</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="mt-4 max-h-[50vh] overflow-y-auto p-1">
          <div>
            {formattedInterviewDatetimeList.map(time => (
              <div key={time} className="text-left text-sm font-bold">
                {time}
              </div>
            ))}
          </div>
          <Separator className="!my-4" />
          <div
            className={`text-primary mb-2 w-fit rounded-lg px-3 py-1 text-sm ${(() => {
              const fallbackStatus = InterviewStatus.CONFIRMED;

              let derivedStatus: string | null | undefined;

              if (interviewInfo?.interview_state === InterviewStatus.RECORDED) {
                if (userInfo?.role === UserRole.STUDENT) {
                  derivedStatus = interviewInfo.interview_record_state_student;
                } else if (userInfo?.role === UserRole.PROFESSOR) {
                  derivedStatus = interviewInfo.interview_record_state_professor;
                }
              } else {
                derivedStatus = interviewInfo?.interview_state;
              }

              return STATUS_COLORS[
                isInterviewStatus(derivedStatus) ? derivedStatus : fallbackStatus
              ];
            })()}`}
          >
            {(() => {
              const fallbackStatus = InterviewStatus.CONFIRMED;

              let derivedStatus: string | null | undefined;

              if (interviewInfo?.interview_state === InterviewStatus.RECORDED) {
                if (userInfo?.role === UserRole.STUDENT) {
                  derivedStatus = interviewInfo.interview_record_state_student;
                } else if (userInfo?.role === UserRole.PROFESSOR) {
                  derivedStatus = interviewInfo.interview_record_state_professor;
                }
              } else {
                derivedStatus = interviewInfo?.interview_state;
              }

              return STATUS_LABELS[
                isInterviewStatus(derivedStatus) ? derivedStatus : fallbackStatus
              ];
            })()}
          </div>

          <Textarea
            placeholder="면담 기록 내용을 입력해 주세요."
            className="!placeholder:text-white bg-primary mb-8 w-full p-3 text-left text-sm whitespace-pre-line text-white"
            value={
              userInfo?.role === UserRole.STUDENT
                ? interviewInfo?.interview_record_student || ""
                : interviewInfo?.interview_record_professor || ""
            }
            onChange={e => {
              const newValue = e.target.value;
              const field =
                userInfo?.role === UserRole.STUDENT
                  ? "interview_record_student"
                  : "interview_record_professor";

              if (!interviewInfo) return;

              setInterviewInfo({
                ...interviewInfo,
                [field]: newValue,
              });
            }}
          />

          <div className="flex justify-between gap-4">
            <Button variant="outline" onClick={() => handleStepChange(1)}>
              이전
            </Button>
            <Button onClick={handleSave}>저장</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(RecordedInterviewView);
