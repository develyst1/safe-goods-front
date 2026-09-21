"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyRooms } from "@/services/room.service";

export const MY_ROOMS_QUERY_KEY = ["rooms", "mine"] as const;

export const useMyRooms = () => useQuery({ queryKey: MY_ROOMS_QUERY_KEY, queryFn: getMyRooms });
