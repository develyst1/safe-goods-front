import { BadgeCheck } from "lucide-react";
import { ROOM_TH } from "@/constant/text/th";

interface CreditPillProps {
  count: number;
  size?: "sm" | "md";
}

/** "ปิดดีลดี {n} ครั้ง" — the one credit signal in REQ-001 (§12), teal = good close. */
export default function CreditPill({ count, size = "md" }: CreditPillProps) {
  const dims = size === "sm" ? "py-0.5 pl-1.5 pr-2.5 text-[12.5px]" : "py-1.5 pl-2.5 pr-3.5 text-[14px]";
  const icon = size === "sm" ? "size-3.5" : "size-4";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-accent-soft font-medium text-accent-ink ${dims}`}>
      <BadgeCheck className={icon} aria-hidden />
      {ROOM_TH.CREDIT(count)}
    </span>
  );
}
