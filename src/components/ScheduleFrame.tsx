"use client";

import { memo } from "react";

const ScheduleFrame = ({ children }: { children: React.ReactNode }) => {
  return <div className="mx-auto max-w-[80%] p-6">{children}</div>;
};

export default memo(ScheduleFrame);
