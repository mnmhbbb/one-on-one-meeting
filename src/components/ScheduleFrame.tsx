"use client";

import { memo } from "react";

const ScheduleFrame = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-6 max-w-screen-lg mx-auto">{children}</div>;
};

export default memo(ScheduleFrame);
