import { memo } from "react";

import { InterviewStatus, STATUS_COLORS } from "@/common/const";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: InterviewStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex w-full items-center justify-center rounded-md px-2 py-1 text-xs",
        STATUS_COLORS[status],
        className
      )}
    >
      {status}
    </div>
  );
};

export default memo(StatusBadge);
