"use client";

import { usePathname } from "next/navigation";
import { FooterTabs } from "./FooterTabs";

export function FooterTabsWrapper() {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return null;
  }

  return (
    <>
      <div className="pb-24"></div>
      <FooterTabs />
    </>
  );
} 