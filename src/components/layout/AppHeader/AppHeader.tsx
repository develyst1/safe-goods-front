"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "antd";
import Wordmark from "@/components/common/Wordmark";

interface AppHeaderProps {
  displayName: string;
}

export default function AppHeader({ displayName }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-[var(--z-sticky)] border-b border-line bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Wordmark />
        <div className="flex items-center gap-1.5">
          <span className="hidden max-w-[14rem] truncate text-[14px] font-medium text-ink sm:inline">
            {displayName}
          </span>
          {/* REQ-001 has no logout label yet (TASK-006 §Questions) — icon only until Porter's string arrives. */}
          <Button
            type="text"
            shape="circle"
            aria-label="logout"
            icon={<LogOut className="size-[18px]" aria-hidden />}
            onClick={() => signOut({ callbackUrl: "/login" })}
          />
        </div>
      </div>
    </header>
  );
}
