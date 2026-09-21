"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "antd";
import Wordmark from "@/components/common/Wordmark";
import { ADMIN_TH, NAV_TH } from "@/constant/text/th";

interface AppHeaderProps {
  displayName: string;
  /** ADMIN gets the queue link (REQ-001 admin page title) */
  isAdmin?: boolean;
}

export default function AppHeader({ displayName, isAdmin = false }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-line bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Wordmark />
        <div className="flex items-center gap-1.5">
          {isAdmin && (
            <Link href="/admin" className="mr-3 hidden text-[14px] font-medium text-primary sm:inline">
              {ADMIN_TH.SLIP_PAGE}
            </Link>
          )}
          <span className="hidden max-w-[14rem] truncate text-[14px] font-medium text-ink sm:inline">
            {displayName}
          </span>
          <Button
            type="text"
            aria-label={NAV_TH.LOGOUT}
            icon={<LogOut className="size-[18px]" aria-hidden />}
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            {NAV_TH.LOGOUT}
          </Button>
        </div>
      </div>
    </header>
  );
}
