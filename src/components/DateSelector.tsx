"use client";

import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";

import { Button } from "@/components/ui/button";
import { useDateStore } from "@/store/dateStore";

interface DateSelectorProps {
  viewType: "month" | "week" | "day";
}

const DateSelector = ({ viewType }: DateSelectorProps) => {
  const { currentDate, setCurrentDate } = useDateStore(
    useShallow(state => ({
      currentDate: state.currentDate,
      setCurrentDate: state.setCurrentDate,
    }))
  );

  const handlePrevious = () => {
    const newDate = dayjs(currentDate).subtract(1, viewType).toDate();
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = dayjs(currentDate).add(1, viewType).toDate();
    setCurrentDate(newDate);
  };

  const formatDate = () => {
    switch (viewType) {
      case "month":
        return dayjs(currentDate).format("YYYY년 M월");
      case "week": {
        const startOfWeek = dayjs(currentDate).startOf("week").add(1, "day"); // 월요일
        const endOfWeek = startOfWeek.add(4, "day"); // 금요일
        return `${startOfWeek.format("M월 D일")} ~ ${endOfWeek.format("M월 D일")}`;
      }
      case "day":
        return dayjs(currentDate).format("YYYY년 M월 D일");
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button variant="ghost" className="rounded-full" size="icon" onClick={handlePrevious}>
        <ChevronLeft />
      </Button>
      <span className="text-sm font-medium">{formatDate()}</span>
      <Button variant="ghost" className="rounded-full" size="icon" onClick={handleNext}>
        <ChevronRight />
      </Button>
    </div>
  );
};

export default memo(DateSelector);
