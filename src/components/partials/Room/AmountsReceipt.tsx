import { ROOM_TH } from "@/constant/text/th";

interface AmountsReceiptProps {
  buyerPays: number;
  sellerReceives: number;
  fee: number;
  /** "hero" = the live preview on /rooms/new; "inline" = inside a room / join gate */
  variant?: "hero" | "inline";
}

const THB = (n: number) => `${n.toLocaleString("th-TH")} บาท`;

/**
 * The three figures of a deal, in REQ-001 order and words:
 * ผู้ซื้อจ่าย {x} บาท · ผู้ขายได้รับ {y} บาท · ค่ากลาง {f} บาท.
 * Laid out like a till receipt — the buyer's line is the one they act on, so it leads.
 */
export default function AmountsReceipt({ buyerPays, sellerReceives, fee, variant = "inline" }: AmountsReceiptProps) {
  const hero = variant === "hero";
  const [lblBuyer, lblSeller, lblFee] = ["ผู้ซื้อจ่าย", "ผู้ขายได้รับ", "ค่ากลาง"];
  return (
    <dl
      className={`rounded-[var(--radius-lg)] bg-surface ${hero ? "px-6 py-5 sm:px-7 sm:py-6" : "px-5 py-4"}`}
      aria-label={ROOM_TH.PREVIEW(buyerPays, sellerReceives, fee)}
    >
      <div className="flex items-baseline justify-between gap-4">
        <dt className={`${hero ? "text-[15px]" : "text-[14px]"} font-medium text-ink`}>{lblBuyer}</dt>
        <dd className={`${hero ? "text-[2rem]" : "text-[1.35rem]"} font-semibold tabular-nums tracking-[-0.01em] text-primary`}>
          {THB(buyerPays)}
        </dd>
      </div>
      <div className="my-3 h-px bg-line-strong/70" role="presentation" />
      <div className="flex items-baseline justify-between gap-4">
        <dt className="text-[14px] text-ink">{lblSeller}</dt>
        <dd className="text-[1.05rem] font-semibold tabular-nums text-ink">{THB(sellerReceives)}</dd>
      </div>
      <div className="mt-1.5 flex items-baseline justify-between gap-4">
        <dt className="text-[14px] text-muted">{lblFee}</dt>
        <dd className="text-[1.05rem] font-medium tabular-nums text-muted">{THB(fee)}</dd>
      </div>
    </dl>
  );
}
