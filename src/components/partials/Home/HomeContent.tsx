"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import { Button, Skeleton } from "antd";
import { AppHeader } from "@/components/layout/AppHeader";
import { ROOM_TH } from "@/constant/text/th";
import { useMe } from "@/hooks/auth";

interface HomeContentProps {
  /** from the NextAuth session — paints the header before GET /auth/me resolves */
  sessionDisplayName: string;
}

export default function HomeContent({ sessionDisplayName }: HomeContentProps) {
  const { data: me, isPending } = useMe();

  return (
    <>
      <AppHeader displayName={me?.displayName ?? sessionDisplayName} />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-16 pt-12 sm:px-6 sm:pt-20">
        <section className="rise-in max-w-xl">
          {isPending ? (
            <Skeleton active title={{ width: "55%" }} paragraph={{ rows: 1, width: "35%" }} />
          ) : (
            <>
              <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.015em] text-ink sm:text-[2.5rem]">
                {me?.displayName ?? sessionDisplayName}
              </h1>
              <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent-soft py-1.5 pl-2.5 pr-3.5 text-[14px] font-medium text-accent-ink">
                <BadgeCheck className="size-4" aria-hidden />
                {ROOM_TH.CREDIT(me?.credit.goodCloseCount ?? 0)}
              </p>
            </>
          )}
        </section>

        <section className="mt-14 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
          <Link href="/rooms/new">
            <Button type="primary" size="large" className="h-12! px-7! text-[16px]!">
              {ROOM_TH.OPEN_ROOM}
            </Button>
          </Link>
          <Link
            href="/rooms"
            className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-primary"
          >
            {ROOM_TH.MY_ROOMS}
            <ArrowRight
              className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        </section>
      </main>
    </>
  );
}
