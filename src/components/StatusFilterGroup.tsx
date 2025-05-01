"use client";

import { useState, useCallback, memo } from "react";
import { InterviewStatus, STATUS_COLORS, STATUS_LABELS } from "@/common/const";
import { cn } from "@/lib/utils";

interface StatusFilterGroupProps {
  onFilterChange: (statuses: InterviewStatus[]) => void;
}

const ALL_STATUSES: InterviewStatus[] = [
  "REQUESTED",
  "REJECTED",
  "CONFIRMED",
  "CANCELLED",
  "RECORDED",
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
        ? selectedStatuses.filter((s) => s !== status)
        : [...selectedStatuses, status];
      setSelectedStatuses(newSelectedStatuses);
      onFilterChange(newSelectedStatuses);
    },
    [selectedStatuses, onFilterChange],
  );

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <button
        onClick={handleToggleAll}
        className={cn(
          "px-4 py-1 rounded-full text-sm border transition-colors",
          selectedStatuses.length === ALL_STATUSES.length
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50",
        )}
      >
        전체
      </button>
      {ALL_STATUSES.map((status) => (
        <button
          key={status}
          onClick={() => handleToggleStatus(status)}
          className={cn(
            "px-4 py-1 rounded-full text-sm border transition-colors",
            selectedStatuses.includes(status)
              ? cn(STATUS_COLORS[status], "text-gray-900 border-transparent")
              : "bg-white text-gray-500 border-gray-300 hover:bg-gray-50",
          )}
        >
          {STATUS_LABELS[status]}
        </button>
      ))}
    </div>
  );
};

export default memo(StatusFilterGroup);
