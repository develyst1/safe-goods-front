"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoom, joinRoom } from "@/services/room.service";
import type { Room } from "@/types/api/main/room";

export const roomQueryKey = (code: string) => ["room", code] as const;

/** One query for the whole page; polls so the other party's actions appear without a reload. */
export const useRoom = (code: string) =>
  useQuery({ queryKey: roomQueryKey(code), queryFn: () => getRoom(code), refetchInterval: 10_000 });

export const useJoinRoom = (code: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => joinRoom(code),
    onSuccess: (room: Room) => {
      qc.setQueryData(roomQueryKey(code), room);
      void qc.invalidateQueries({ queryKey: roomQueryKey(code) });
    },
  });
};
