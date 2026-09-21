"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getFileBlob } from "@/services/room.service";

/**
 * SPEC endpoint 18 needs the bearer token, so images never go in a bare <img src>:
 * fetch the blob through the axios client and hand back an object URL.
 */
export const useAuthedImage = (url: string | null) => {
  const blob = useQuery({
    queryKey: ["file", url] as const,
    queryFn: () => getFileBlob(url as string),
    enabled: url !== null,
    staleTime: Infinity,
    gcTime: 5 * 60_000,
  });
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob.data) return;
    const next = URL.createObjectURL(blob.data);
    const id = requestAnimationFrame(() => setObjectUrl(next));
    return () => {
      cancelAnimationFrame(id);
      URL.revokeObjectURL(next);
    };
  }, [blob.data]);

  return { src: objectUrl, isPending: blob.isPending && url !== null, isError: blob.isError };
};
