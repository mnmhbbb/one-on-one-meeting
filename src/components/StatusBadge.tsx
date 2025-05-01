import { memo } from "react";
import { InterviewStatus, STATUS_COLORS, STATUS_LABELS } from "@/common/const";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: InterviewStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs w-full",
        STATUS_COLORS[status],
        className,
      )}
    >
      {STATUS_LABELS[status]}
    </div>
  );
};

export default memo(StatusBadge);
