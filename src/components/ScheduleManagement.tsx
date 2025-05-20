"use client";

import { memo, useEffect, useState } from "react";

import { TIMES } from "@/common/const";
import DateSelector from "@/components/DateSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// TODO: API 연동 후 삭제
const weekData = [
  {
    day: "월",
    date: "03.31",
    availableTimes: ["09:00 - 09:30", "09:30 - 10:00"],
  },
  {
    day: "화",
    date: "04.01",
    availableTimes: ["09:00 - 09:30", "09:30 - 10:00"],
  },
  {
    day: "수",
    date: "04.02",
    availableTimes: ["09:00 - 09:30", "09:30 - 10:00"],
  },
  {
    day: "목",
    date: "04.03",
    availableTimes: ["09:00 - 09:30", "09:30 - 10:00"],
  },
  {
    day: "금",
    date: "04.04",
    availableTimes: ["09:00 - 09:30", "09:30 - 10:00"],
  },
];

const ScheduleManagement = () => {
  const [selected, setSelected] = useState(
    weekData.map(day => TIMES.map(time => day.availableTimes.includes(time)))
  );
  const [checkedCols, setCheckedCols] = useState<boolean[]>(weekData.map(() => false));

  // 현재 선택된 슬롯만 담는 상태
  const [selectedSlots, setSelectedSlots] = useState<{ day: string; date: string; time: string }[]>(
    []
  );

  // TODO: 선택된 슬롯이 있는 상태에서 페이지 이동 or 날짜 변경 시 경고 띄우기

  // selected 배열이 바뀔 때마다 selectedSlots 갱신
  useEffect(() => {
    const result: { day: string; date: string; time: string }[] = [];

    selected.forEach((daySlots, dayIdx) => {
      daySlots.forEach((isChecked, timeIdx) => {
        if (isChecked) {
          result.push({
            day: weekData[dayIdx].day,
            date: weekData[dayIdx].date,
            time: TIMES[timeIdx],
          });
        }
      });
    });

    setSelectedSlots(result);
  }, [selected]);

  // 저장 버튼 클릭 시 처리
  const handleSave = () => {
    console.log("선택된 시간 슬롯:", selectedSlots);
    // TODO: 여기에서 API 연동
  };

  const toggleSlot = (dayIdx: number, timeIdx: number) => {
    const updated = [...selected];
    updated[dayIdx][timeIdx] = !updated[dayIdx][timeIdx];
    setSelected(updated);
  };

  const toggleDay = (dayIdx: number) => {
    const nextCheck = !checkedCols[dayIdx];
    const updated = [...selected];
    for (let i = 0; i < TIMES.length; i++) {
      updated[dayIdx][i] = nextCheck;
    }
    const colChecks = [...checkedCols];
    colChecks[dayIdx] = nextCheck;
    setCheckedCols(colChecks);
    setSelected(updated);
  };

  return (
    <Card className="rounded-l-none">
      <CardContent>
        <div className="mb-4 grid grid-cols-3 items-center px-5">
          <h3>면담 일정을 선택해 주세요</h3>
          <DateSelector viewType="week" />
          <div className="flex justify-end gap-5">
            <Button variant="outline">이전주 불러오기</Button>
            <Button onClick={handleSave}>저장</Button>
          </div>
        </div>

        {/* UI 시작 */}
        <div className="overflow-x-auto px-5">
          <table className="w-full table-fixed border-separate border-spacing-1 text-center">
            <thead>
              <tr>
                {weekData.map((day, i) => (
                  <th key={i} className="pb-2">
                    <div className="flex flex-col items-center gap-1">
                      <span>{day.day}</span>
                      <span className="text-muted-foreground text-sm">{day.date}</span>
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
                  {weekData.map((_, dayIdx) => {
                    const isSelected = selected[dayIdx][timeIdx];

                    return (
                      <td key={dayIdx} className="p-1">
                        <Button
                          onClick={() => toggleSlot(dayIdx, timeIdx)}
                          className={
                            isSelected
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
        {/* UI 끝 */}
      </CardContent>
    </Card>
  );
};

export default memo(ScheduleManagement);
