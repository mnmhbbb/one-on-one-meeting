import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import NavigationBar from "@/components/common/NavigationBar";

const sans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
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
      <body className={`${sans.className} antialiased`}>
        <NavigationBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
