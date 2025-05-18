import dayjs from "dayjs";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "dayjs/locale/ko";

import "./globals.css";
import ClientLocaleSetter from "@/components/ClientLocaleSetter";
import NavigationBar from "@/components/header-navigation/NavigationBar";
import QueryProvider from "@/components/providers/QueryProvider";
import Toast from "@/components/Toast";

// 전역 locale 설정
dayjs.locale("ko");

const sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
  },
  title: "KNOCK KNOCK 면담 예약 시스템",
  description: "학생과 교수님의 면담 일정을 효율적으로 예약하고 관리하세요.",
};

/**
 * 모든 페이지 공통 레이아웃
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${sans.className} bg-gray-100 antialiased`}>
        <QueryProvider>
          <NavigationBar />
          <main>{children}</main>
        </QueryProvider>
        <ClientLocaleSetter />
        <Toast />
      </body>
    </html>
  );
}
