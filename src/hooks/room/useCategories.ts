"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/services/room.service";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export const useCategories = () =>
  useQuery({ queryKey: CATEGORIES_QUERY_KEY, queryFn: getCategories, staleTime: 60_000 });
