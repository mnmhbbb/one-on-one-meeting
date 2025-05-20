"use client";

import { useState, useCallback, memo } from "react";

import { InterviewStatus, STATUS_COLORS } from "@/common/const";
import { cn } from "@/lib/utils";

interface StatusFilterGroupProps {
  onFilterChange: (statuses: InterviewStatus[]) => void;
}

const ALL_STATUSES: InterviewStatus[] = [
  InterviewStatus.REQUESTED,
  InterviewStatus.REJECTED,
  InterviewStatus.CONFIRMED,
  InterviewStatus.CANCELLED,
  InterviewStatus.RECORDED,
];

const StatusFilterGroup = ({ onFilterChange }: StatusFilterGroupProps) => {
  const [selectedStatuses, setSelectedStatuses] = useState<InterviewStatus[]>(ALL_STATUSES);

  const handleToggleAll = useCallback(() => {
    if (selectedStatuses.length === ALL_STATUSES.length) {
      setSelectedStatuses([]);
      onFilterChange([]);
    } else {
      setSelectedStatuses(ALL_STATUSES);
      onFilterChange(ALL_STATUSES);
    }
  }, [selectedStatuses, onFilterChange]);

  const handleToggleStatus = useCallback(
    (status: InterviewStatus) => {
      const newSelectedStatuses = selectedStatuses.includes(status)
        ? selectedStatuses.filter(s => s !== status)
        : [...selectedStatuses, status];
      setSelectedStatuses(newSelectedStatuses);
      onFilterChange(newSelectedStatuses);
    },
    [selectedStatuses, onFilterChange]
  );

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      <button
        onClick={handleToggleAll}
        className={cn(
          "rounded-full border px-4 py-1 text-sm transition-colors",
          selectedStatuses.length === ALL_STATUSES.length
            ? "border-gray-900 bg-gray-900 text-white"
            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
        )}
      >
        전체
      </button>
      {ALL_STATUSES.map(status => (
        <button
          key={status}
          onClick={() => handleToggleStatus(status)}
          className={cn(
            "rounded-full border px-4 py-1 text-sm transition-colors",
            selectedStatuses.includes(status)
              ? cn(STATUS_COLORS[status], "border-transparent text-gray-900")
              : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
          )}
        >
          {status}
        </button>
      ))}
    </div>
  );
};

export default memo(StatusFilterGroup);
