"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelRoom, deliver, parcelArrived, received, uploadEvidence, uploadSlip } from "@/services/room.service";
import { isApiError } from "@/types/api/main/common";
import type { DeliverRequest, Room } from "@/types/api/main/room";
import { roomQueryKey } from "./useRoom";

/**
 * Every state-changing room endpoint (SPEC 12–17). Each returns the full Room, which
 * replaces ["room", code]; INVALID_STATE (the other side moved first) just refetches.
 */
export const useRoomActions = (code: string) => {
  const qc = useQueryClient();
  const key = roomQueryKey(code);
  const onSuccess = (room: Room) => qc.setQueryData(key, room);
  const onError = (e: unknown) => {
    if (isApiError(e) && e.code === "INVALID_STATE") void qc.invalidateQueries({ queryKey: key });
  };
  const opts = { onSuccess, onError };

  return {
    cancel: useMutation({ mutationFn: () => cancelRoom(code), ...opts }),
    slip: useMutation({ mutationFn: (file: File) => uploadSlip(code, file), ...opts }),
    evidence: useMutation({ mutationFn: (file: File) => uploadEvidence(code, file), ...opts }),
    deliver: useMutation({ mutationFn: (body: DeliverRequest) => deliver(code, body), ...opts }),
    parcelArrived: useMutation({ mutationFn: () => parcelArrived(code), ...opts }),
    received: useMutation({ mutationFn: () => received(code), ...opts }),
  };
};
