// SPEC-001 §Fee computation — the FE twin of the BE's src/domain/fee.ts, for the live
// preview while typing. The BE (POST /fee/quote, POST /rooms) is authoritative.
import type { FeePayer, PriceMode } from "@/types/api/main/room";

export interface FeeInput {
  mode: PriceMode;
  feePayer: FeePayer;
  enteredPrice: number; // int ≥ 1
  ratePercent: number; // 0..100
  minimum: number; // int ≥ 0
}

export interface FeeResult {
  basePrice: number;
  fee: number;
  buyerPays: number;
  sellerReceives: number;
}

export const feeOf = (base: number, ratePercent: number, minimum: number) =>
  Math.max(Math.ceil((ratePercent * base) / 100), minimum);

export const buyerShare = (fee: number, feePayer: FeePayer) =>
  feePayer === "SELLER" ? 0 : feePayer === "BUYER" ? fee : Math.ceil(fee / 2);

/** Smallest total a FEE_INCLUDED price may be (B = 1) — for "ราคานี้ต่ำเกินไป — ต้องไม่น้อยกว่า {min} บาท". */
export const minIncludedTotal = (feePayer: FeePayer, ratePercent: number, minimum: number) =>
  1 + buyerShare(feeOf(1, ratePercent, minimum), feePayer);

/** Returns null when FEE_INCLUDED has no base price ≥ 1 that fits (VALIDATION_ERROR on the BE). */
export function computeFee(input: FeeInput): FeeResult | null {
  const { mode, feePayer, enteredPrice, ratePercent, minimum } = input;
  if (!Number.isInteger(enteredPrice) || enteredPrice < 1) return null;

  const build = (base: number, extraFee = 0): FeeResult => {
    const fee = feeOf(base, ratePercent, minimum) + extraFee;
    const bs = buyerShare(fee, feePayer);
    return { basePrice: base, fee, buyerPays: base + bs, sellerReceives: base - (fee - bs) };
  };

  if (mode === "FEE_ADDED") return build(enteredPrice);

  // FEE_INCLUDED: T = enteredPrice; largest B ≥ 1 with B + buyerShare(feeOf(B)) ≤ T.
  // B + buyerShare is monotonic in B, so walk down from T (B ≤ T always).
  const total = enteredPrice;
  for (let base = total; base >= 1; base--) {
    const r = build(base);
    if (r.buyerPays <= total) {
      // Q-D (REQ-001 §Fee model): the remainder goes to the fee so buyerPays === T exactly.
      const remainder = total - r.buyerPays;
      return remainder === 0 ? r : { ...r, fee: r.fee + remainder, buyerPays: total };
    }
  }
  return null;
}

// verified (SPEC-001 §Fee computation reference rows, rate 20 %, min 20) — see TASK-007 notes:
//   FEE_ADDED   100 SELLER → 100 / 80 / 20   BUYER → 120 / 100 / 20   SPLIT → 110 / 90 / 20
//   FEE_ADDED    50 BUYER  → fee 20, buyer 70
//   FEE_INCLUDED 120 BUYER → B 100, 120 / 100 / 20
//   rate 10 %, min 30, FEE_ADDED 100 → fee 30
