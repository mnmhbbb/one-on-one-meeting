"use client";

import dayjs from "dayjs";
import { useEffect } from "react";
import "dayjs/locale/ko";

export default function ClientLocaleSetter() {
  useEffect(() => {
    dayjs.locale("ko");
  }, []);

  return null;
}
