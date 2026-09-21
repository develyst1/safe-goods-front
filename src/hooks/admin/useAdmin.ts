"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FEE_SETTINGS_QUERY_KEY } from "@/hooks/room";
import { parcelArrived } from "@/services/room.service";
import {
  confirmPayment,
  getAdminRooms,
  recordPayout,
  rejectPayment,
  runAutoRelease,
  updateFeeSettings,
} from "@/services/admin.service";
import type { RoomStatus } from "@/types/api/main/room";

export const adminRoomsKey = (status: RoomStatus) => ["admin", "rooms", status] as const;

/** SPEC endpoint 19 — one list per admin section; polls so a new slip shows up on its own. */
export const useAdminRooms = (status: RoomStatus) =>
  useQuery({ queryKey: adminRoomsKey(status), queryFn: () => getAdminRooms(status), refetchInterval: 15_000 });

/** Admin mutations (SPEC 16, 20–22, 24). Every one invalidates all admin lists and the room. */
export const useAdminActions = () => {
  const qc = useQueryClient();
  const settle = (code?: string) => {
    void qc.invalidateQueries({ queryKey: ["admin", "rooms"] });
    if (code) void qc.invalidateQueries({ queryKey: ["room", code] });
  };
  return {
    confirm: useMutation({ mutationFn: confirmPayment, onSettled: (_r, _e, code) => settle(code) }),
    reject: useMutation({
      mutationFn: ({ code, reason }: { code: string; reason: string }) => rejectPayment(code, reason),
      onSettled: (_r, _e, v) => settle(v.code),
    }),
    parcelArrived: useMutation({ mutationFn: parcelArrived, onSettled: (_r, _e, code) => settle(code) }),
    payout: useMutation({ mutationFn: recordPayout, onSettled: (_r, _e, code) => settle(code) }),
    autoRelease: useMutation({ mutationFn: runAutoRelease, onSettled: () => settle() }),
  };
};

/** SPEC endpoint 23 — affects new rooms only (AC-5). */
export const useUpdateFeeSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateFeeSettings,
    onSuccess: (data) => qc.setQueryData(FEE_SETTINGS_QUERY_KEY, data),
  });
};
