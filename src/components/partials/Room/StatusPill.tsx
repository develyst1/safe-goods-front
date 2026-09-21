import { STATUS_TH } from "@/constant/text/th";
import type { RoomStatus } from "@/types/api/main/room";

interface StatusPillProps {
  status: RoomStatus;
  size?: "sm" | "md";
}

/** One colour per phase, not per status: open (cobalt) · closed-good (teal) · cancelled (grey). */
const tone: Record<RoomStatus, string> = {
  WAITING_BUYER_JOIN: "bg-primary-soft text-primary",
  WAITING_SELLER_JOIN: "bg-primary-soft text-primary",
  WAITING_PAYMENT: "bg-primary-soft text-primary",
  SLIP_REVIEW: "bg-primary-soft text-primary",
  PAID_WAITING_DELIVERY: "bg-primary-soft text-primary",
  DELIVERED_WAITING_CONFIRM: "bg-primary-soft text-primary",
  SHIPPED_WAITING_PARCEL: "bg-primary-soft text-primary",
  PARCEL_ARRIVED_WAITING_CONFIRM: "bg-primary-soft text-primary",
  WAITING_PAYOUT: "bg-accent-soft text-accent-ink",
  COMPLETED: "bg-accent-soft text-accent-ink",
  CANCELLED: "bg-surface text-muted",
};

export default function StatusPill({ status, size = "md" }: StatusPillProps) {
  const dims = size === "sm" ? "px-2.5 py-0.5 text-[12.5px]" : "px-3 py-1 text-[13.5px]";
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${dims} ${tone[status]}`}>
      <span className="mr-1.5 size-1.5 rounded-full bg-current" aria-hidden />
      {STATUS_TH[status]}
    </span>
  );
}
