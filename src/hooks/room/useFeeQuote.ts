"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFeeSettings, quoteFee } from "@/services/room.service";
import type { FeeQuoteRequest } from "@/types/api/main/room";

export const FEE_SETTINGS_QUERY_KEY = ["feeSettings"] as const;

/** Current admin-editable rate / minimum — feeds the instant local preview (src/lib/fee.ts). */
export const useFeeSettings = () =>
  useQuery({ queryKey: FEE_SETTINGS_QUERY_KEY, queryFn: getFeeSettings, staleTime: 60_000 });

const useDebounced = <T,>(value: T, ms: number) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
};

/**
 * POST /fee/quote — the BE's authoritative numbers, fetched once the inputs settle
 * (debounced, not per keystroke). `null` input disables the query.
 */
export const useFeeQuote = (input: FeeQuoteRequest | null) => {
  const key = input ? `${input.priceMode}|${input.feePayer}|${input.enteredPrice}` : null;
  const settledKey = useDebounced(key, 400);
  const settled = settledKey === key ? input : null;
  // Key = the CURRENT input, so a stale quote for the previous input never shows;
  // the fetch itself waits until the input has settled.
  return useQuery({
    queryKey: ["feeQuote", key] as const,
    queryFn: () => quoteFee(input as FeeQuoteRequest),
    enabled: input !== null && settled !== null,
    staleTime: 30_000,
  });
};
