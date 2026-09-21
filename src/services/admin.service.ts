import type { FeeSettings, Room, RoomStatus } from "@/types/api/main/room";
import {
  adminAutoReleaseApi,
  adminConfirmPaymentApi,
  adminPayoutApi,
  adminRejectPaymentApi,
  adminUpdateFeeSettingsApi,
  getAdminRoomsApi,
} from "@/lib/api/api-main";

export const getAdminRooms = async (status?: RoomStatus): Promise<Room[]> => (await getAdminRoomsApi(status)).data;
export const confirmPayment = async (code: string): Promise<Room> => (await adminConfirmPaymentApi(code)).data;
export const rejectPayment = async (code: string, reason: string): Promise<Room> =>
  (await adminRejectPaymentApi(code, reason)).data;
export const recordPayout = async (code: string): Promise<Room> => (await adminPayoutApi(code)).data;
export const updateFeeSettings = async (body: FeeSettings): Promise<FeeSettings> =>
  (await adminUpdateFeeSettingsApi(body)).data;
export const runAutoRelease = async (): Promise<{ released: number }> => (await adminAutoReleaseApi()).data;
