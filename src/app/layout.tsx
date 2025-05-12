import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "./globals.css";
import { InterviewModal } from "@/components/modal/InterviewModal";
import ProfessorSearchModal from "@/components/modal/ProfessorSearchModal";
import NavigationBar from "@/components/header-navigation/NavigationBar";

const sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "/logo.png",
  },
  title: "KNOCK KNOCK 면담 예약 시스템",
  description: "학생과 교수님의 면담 일정을 효율적으로 예약하고 관리하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${sans.className} bg-gray-100 antialiased`}>
        <NavigationBar />
        <main className="overflow-hidden">{children}</main>
        <InterviewModal />
        <ProfessorSearchModal />
      </body>
    </html>
  );
}
