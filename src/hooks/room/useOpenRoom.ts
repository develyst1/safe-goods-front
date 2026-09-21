"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { openRoom } from "@/services/room.service";
import { roomQueryKey } from "./useRoom";
import { MY_ROOMS_QUERY_KEY } from "./useMyRooms";

export const useOpenRoom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: openRoom,
    onSuccess: (room) => {
      qc.setQueryData(roomQueryKey(room.code), room);
      void qc.invalidateQueries({ queryKey: MY_ROOMS_QUERY_KEY });
    },
  });
};
