export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      {/* <FetchUser />
      <InterviewModal />
      <CloseModalsOnRouteChange /> */}
    </>
  );
}
