import FetchUser from "@/components/auth/FetchUser";
import CloseModalsOnRouteChange from "@/components/CloseModalsOnRouteChange";
import InterviewModal from "@/components/modal/InterviewModal";

/**
 * 로그인 이후 페이지의 레이아웃
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <FetchUser />
      <InterviewModal />
      <CloseModalsOnRouteChange />
    </>
  );
}
