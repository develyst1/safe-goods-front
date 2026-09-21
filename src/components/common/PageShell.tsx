"use client";

import { useSession } from "next-auth/react";
import { AppHeader } from "@/components/layout/AppHeader";

interface PageShellProps {
  children: React.ReactNode;
  width?: "narrow" | "wide";
}

/** Header + centred main column for every logged-in page. */
export default function PageShell({ children, width = "wide" }: PageShellProps) {
  const { data: session } = useSession();
  const max = width === "narrow" ? "max-w-2xl" : "max-w-5xl";
  return (
    <>
      <AppHeader displayName={session?.user.displayName ?? ""} isAdmin={session?.user.role === "ADMIN"} />
      <main className={`mx-auto w-full ${max} flex-1 px-4 pb-20 pt-8 sm:px-6 sm:pt-12`}>{children}</main>
    </>
  );
}
