"use client";

import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/auth.service";

export const ME_QUERY_KEY = ["me"] as const;

export const useMe = (enabled = true) =>
  useQuery({ queryKey: ME_QUERY_KEY, queryFn: getMe, enabled });
