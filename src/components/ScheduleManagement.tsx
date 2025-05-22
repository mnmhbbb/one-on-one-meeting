"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addDays, format, startOfWeek, subWeeks } from "date-fns";
import { memo, useEffect, useState, useMemo } from "react";

import { DAYS, TIMES } from "@/common/const";
import DateSelector from "@/components/DateSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDateStore } from "@/store/dateStore";
import { useToastStore } from "@/store/toastStore";
import { useUserStore } from "@/store/userStore";
import { ProfessorAllowDate, ProfessorAllowDateRequest } from "@/types/user";
import { professorApi } from "@/utils/api/professor";

const ScheduleManagement = () => {
  const userInfo = useUserStore(state => state.userInfo);
  const currentDate = useDateStore(state => state.currentDate);
  const queryClient = useQueryClient();
  const setToast = useToastStore(state => state.setToast);

  // 현재 주의 월요일부터 금요일까지의 날짜 배열 생성
  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 1 }), [currentDate]);
  const weekDates = useMemo(
    () => Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const startDate = format(weekDates[0], "yyyy-MM-dd");
  const endDate = format(weekDates[4], "yyyy-MM-dd");

  const [allowDateList, setAllowDateList] = useState<ProfessorAllowDate[]>([]);
  const [selected, setSelected] = useState<boolean[][]>(
    Array(5)
      .fill(null)
      .map(() => Array(TIMES.length).fill(false))
  );
  const [checkedCols, setCheckedCols] = useState<boolean[]>(Array(5).fill(false)); // 컬럼 체크 상태

  // 현재 선택된 날짜의 주간 면담 가능 일정 조회
  useQuery({
    queryKey: ["professorAllowDateList", startDate, endDate],
    queryFn: async () => {
      const result = await professorApi.getAllowDate(startDate, endDate);
      setAllowDateList(result?.data || []);
      return result?.data || [];
    },
  });

  // allowDateList 기준으로 allow_date 화면 세팅
  useEffect(() => {
    if (!allowDateList) return;

    const newSelected = Array(5)
      .fill(null)
      .map(() => Array(TIMES.length).fill(false));
    const newCheckedCols = Array(5).fill(false);

    allowDateList.forEach(date => {
      const dayIndex = weekDates.findIndex(
        weekDate => format(weekDate, "yyyy-MM-dd") === date.allow_date
      );

      if (dayIndex !== -1) {
        date.allow_time.forEach(time => {
          // already_apply_time에 포함된 시간은 미체크 처리
          if (date.already_apply_time?.includes(time)) return;

          const timeIndex = TIMES.findIndex(t => t === time);
          if (timeIndex !== -1) {
            newSelected[dayIndex][timeIndex] = true;
          }
        });
        // 모든 시간이 선택된 경우에만 체크박스를 체크
        newCheckedCols[dayIndex] = newSelected[dayIndex].every(slot => slot);
      }
    });

    setSelected(newSelected);
    setCheckedCols(newCheckedCols);
  }, [allowDateList, weekDates]);

  // 유저가 선택한 시간 post 호출
  const saveMutation = useMutation({
    mutationFn: async (data: ProfessorAllowDateRequest[]) => {
      const response = await professorApi.postAllowDate(data, startDate, endDate);
      if (response) {
        setToast("일정 활성화가 완료되었습니다.", "success");
        close();
      }
      return response?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professorAllowDateList", startDate, endDate] });
    },
  });

  // 저장 버튼 클릭 시 처리
  const handleSave = () => {
    const requestData: ProfessorAllowDateRequest[] = [];

    // 선택된 시간을 저장하기 위해 api 요청 데이터 가공
    selected.forEach((daySlots, dayIdx) => {
      const selectedTimes = daySlots
        .map((isSelected, timeIdx) => (isSelected ? TIMES[timeIdx] : null))
        .filter((time): time is string => time !== null);

      if (selectedTimes.length > 0) {
        requestData.push({
          professor_id: userInfo?.id || "",
          allow_date: format(weekDates[dayIdx], "yyyy-MM-dd"),
          allow_time: selectedTimes,
        });
      }
    });

    saveMutation.mutate(requestData);
  };

  // 컬럼(요일) 체크박스 클릭
  const toggleDay = (dayIdx: number) => {
    const nextCheck = !checkedCols[dayIdx];
    const updated = [...selected];

    // 이미 신청된 시간을 제외한 모든 시간을 토글
    for (let i = 0; i < TIMES.length; i++) {
      const currentDate = format(weekDates[dayIdx], "yyyy-MM-dd");
      const time = TIMES[i];
      const isAlreadyApplied = allowDateList?.some(
        date => date.allow_date === currentDate && date.already_apply_time?.includes(time)
      );

      if (!isAlreadyApplied) {
        updated[dayIdx][i] = nextCheck;
      }
    }

    const colChecks = [...checkedCols];
    colChecks[dayIdx] = nextCheck;
    setCheckedCols(colChecks);
    setSelected(updated);
  };

  // 각 시간 클릭
  const toggleSlot = (dayIdx: number, timeIdx: number) => {
    // 이미 신청된 시간인지 확인
    const currentDate = format(weekDates[dayIdx], "yyyy-MM-dd");
    const time = TIMES[timeIdx];
    const isAlreadyApplied = allowDateList?.some(
      date => date.allow_date === currentDate && date.already_apply_time?.includes(time)
    );
    if (isAlreadyApplied) return; // 이미 면담이 신청된 시간이면 클릭 차단

    const updated = [...selected];
    updated[dayIdx][timeIdx] = !updated[dayIdx][timeIdx];
    setSelected(updated);

    // 체크박스 상태 업데이트 - 모든 시간이 선택된 경우에만 체크
    const updatedCheckedCols = [...checkedCols];
    updatedCheckedCols[dayIdx] = updated[dayIdx].every(slot => slot);
    setCheckedCols(updatedCheckedCols);
  };

  // 지난주 데이터 가져와서 화면에 적용
  const handleLoadPreviousWeek = async () => {
    const previousWeek = subWeeks(currentDate, 1);
    const weekStart = startOfWeek(previousWeek, { weekStartsOn: 1 });
    const startDate = format(weekStart, "yyyy-MM-dd");
    const endDate = format(addDays(weekStart, 4), "yyyy-MM-dd");

    // 지난주 데이터 호출
    const previousAllowDateList = await professorApi.getAllowDate(startDate, endDate);

    if (previousAllowDateList?.data) {
      // 지난주 데이터를 이번주 날짜에 매핑
      const mappedData = previousAllowDateList.data.map(date => {
        // 요일 비교
        const dayIndex = weekDates.findIndex(
          weekDate => format(weekDate, "EEEE") === format(new Date(date.allow_date), "EEEE")
        );

        if (dayIndex !== -1) {
          return {
            ...date,
            allow_date: format(weekDates[dayIndex], "yyyy-MM-dd"),
          };
        }
        return date;
      });

      setAllowDateList(mappedData);
    }
  };

  return (
    <Card className="rounded-l-none">
      <CardContent>
        <div className="mb-4 grid grid-cols-3 items-center px-5">
          <h3>※ 면담 가능한 일정을 활성화 해주세요.</h3>
          <DateSelector viewType="week" />
          <div className="flex justify-end gap-5">
            <Button variant="outline" onClick={handleLoadPreviousWeek}>
              이전주 불러오기
            </Button>
            <Button onClick={handleSave}>저장</Button>
          </div>
        </div>

        <div className="overflow-x-auto px-5">
          <table className="w-full table-fixed border-separate border-spacing-1 text-center">
            <thead>
              <tr>
                {weekDates.map((date, i) => (
                  <th key={i} className="pb-2">
                    <div className="flex flex-col items-center gap-1">
                      <span>{DAYS[i]}</span>
                      <span className="text-muted-foreground text-sm">{format(date, "MM.dd")}</span>
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        checked={checkedCols[i]}
                        onChange={() => toggleDay(i)}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIMES.map((timeLabel, timeIdx) => (
                <tr key={timeIdx}>
                  {weekDates.map((date, dayIdx) => {
                    const isSelected = selected[dayIdx][timeIdx];
                    const currentDate = format(date, "yyyy-MM-dd");
                    const isAlreadyApplied = allowDateList?.some(
                      d => d.allow_date === currentDate && d.already_apply_time?.includes(timeLabel)
                    );

                    return (
                      <td key={dayIdx} className="p-1">
                        <Button
                          onClick={() => toggleSlot(dayIdx, timeIdx)}
                          disabled={isAlreadyApplied}
                          className={
                            isAlreadyApplied
                              ? "cursor-not-allowed bg-gray-100 text-gray-400"
                              : isSelected
                                ? "bg-white text-stone-800 shadow-md hover:bg-gray-100 active:bg-gray-100"
                                : "bg-white text-gray-300 shadow-md hover:bg-gray-100 active:bg-gray-100"
                          }
                        >
                          {timeLabel}
                        </Button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(ScheduleManagement);
