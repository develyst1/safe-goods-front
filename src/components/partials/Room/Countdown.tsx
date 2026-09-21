"use client";

import { useEffect, useState } from "react";
import { Hourglass } from "lucide-react";
import { ROOM_TH } from "@/constant/text/th";

interface CountdownProps {
  /** Room.autoReleaseAt (ISO, UTC) — render nothing when null */
  autoReleaseAt: string | null;
}

/** R-6 (SPEC §Rework rulings): whole hours rounded UP — never below the true remaining time. */
const remaining = (iso: string) => {
  const ms = Math.max(0, Date.parse(iso) - Date.now());
  const hours = Math.ceil(ms / 3_600_000);
  return { d: Math.floor(hours / 24), h: hours % 24 };
};

/** ระบบจะโอนเงินให้ผู้ขายอัตโนมัติใน {d} วัน {h} ชั่วโมง — recomputed every minute. */
export default function Countdown({ autoReleaseAt }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!autoReleaseAt) return;
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, [autoReleaseAt]);

  if (!autoReleaseAt) return null;
  void now; // the interval re-renders; the value itself comes from Date.now() below
  const { d, h } = remaining(autoReleaseAt);

  return (
    <p className="inline-flex items-center gap-2 rounded-full bg-accent-soft py-1.5 pl-2.5 pr-3.5 text-[14px] font-medium text-accent-ink">
      <Hourglass className="size-4" aria-hidden />
      {ROOM_TH.COUNTDOWN(d, h)}
    </p>
  );
}
