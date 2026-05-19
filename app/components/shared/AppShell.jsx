"use client";

import { usePathname } from "next/navigation";
import Background from "./Background";
import Footer from "./Footer";
import HighRiskWarning from "./HighRiskWarning";
import Navbar from "./Navbar";

export default function AppShell({ children }) {
  const pathname = usePathname();
  const isDashboardRoute = pathname?.startsWith("/dashboard");

  if (isDashboardRoute) {
    return <div className="relative z-10">{children}</div>;
  }

  return (
    <>
      {/* <Background /> */}
      <Navbar />
      <div className="relative z-10">{children}</div>
      <HighRiskWarning />
      <Footer />
    </>
  );
}
