"use client";

// One function per SPEC-001 endpoint used by the FE. The interceptor has already
// unwrapped the envelope, so `res.data` IS the payload.
import type { AuthResponse, Me, RegisterRequest } from "@/types/api/main/auth";
import type {
  Category,
  FeeQuote,
  FeeQuoteRequest,
  FeeSettings,
  DeliverRequest,
  OpenRoomRequest,
  RoomStatus,
  Room,
} from "@/types/api/main/room";
import { mainClient } from "./client";

// 2 — POST /api/v1/auth/register (no auth)
export const registerApi = (body: RegisterRequest) =>
  mainClient.post<AuthResponse>("/api/v1/auth/register", body);

// 4 — GET /api/v1/auth/me
export const getMeApi = () => mainClient.get<Me>("/api/v1/auth/me");

// 5 — GET /api/v1/categories
export const getCategoriesApi = () => mainClient.get<Category[]>("/api/v1/categories");

// 6 — GET /api/v1/fee/settings
export const getFeeSettingsApi = () => mainClient.get<FeeSettings>("/api/v1/fee/settings");

// 7 — POST /api/v1/fee/quote (no auth; current settings)
export const quoteFeeApi = (body: FeeQuoteRequest) =>
  mainClient.post<FeeQuote>("/api/v1/fee/quote", body);

// 8 — POST /api/v1/rooms
export const openRoomApi = (body: OpenRoomRequest) => mainClient.post<Room>("/api/v1/rooms", body);

// 9 — GET /api/v1/rooms/mine
export const getMyRoomsApi = () => mainClient.get<Room[]>("/api/v1/rooms/mine");

// 10 — GET /api/v1/rooms/{code}
export const getRoomApi = (code: string) => mainClient.get<Room>(`/api/v1/rooms/${code}`);

// 11 — POST /api/v1/rooms/{code}/join
export const joinRoomApi = (code: string) => mainClient.post<Room>(`/api/v1/rooms/${code}/join`);

// 12 — POST /api/v1/rooms/{code}/cancel (member)
export const cancelRoomApi = (code: string) => mainClient.post<Room>(`/api/v1/rooms/${code}/cancel`);

// 13 — POST /api/v1/rooms/{code}/slip (buyer, multipart `file`)
export const uploadSlipApi = (code: string, file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  return mainClient.post<Room>(`/api/v1/rooms/${code}/slip`, fd);
};

// 14 — POST /api/v1/rooms/{code}/evidence (seller, multipart `file`)
export const uploadEvidenceApi = (code: string, file: File) => {
  const fd = new FormData();
  fd.append("file", file);
  return mainClient.post<Room>(`/api/v1/rooms/${code}/evidence`, fd);
};

// 15 — POST /api/v1/rooms/{code}/deliver (seller)
export const deliverApi = (code: string, body: DeliverRequest) =>
  mainClient.post<Room>(`/api/v1/rooms/${code}/deliver`, body);

// 16 — POST /api/v1/rooms/{code}/parcel-arrived (buyer or admin)
export const parcelArrivedApi = (code: string) =>
  mainClient.post<Room>(`/api/v1/rooms/${code}/parcel-arrived`);

// 17 — POST /api/v1/rooms/{code}/received (buyer)
export const receivedApi = (code: string) => mainClient.post<Room>(`/api/v1/rooms/${code}/received`);

// 18 — GET /api/v1/files/{id} — the binary, not the envelope; `url` is FileRef.url
export const getFileBlobApi = (url: string) => mainClient.get<Blob>(url, { responseType: "blob" });

// 19 — GET /api/v1/admin/rooms?status= (admin)
export const getAdminRoomsApi = (status?: RoomStatus) =>
  mainClient.get<Room[]>("/api/v1/admin/rooms", { params: status ? { status } : undefined });

// 20 — POST /api/v1/admin/rooms/{code}/payment/confirm
export const adminConfirmPaymentApi = (code: string) =>
  mainClient.post<Room>(`/api/v1/admin/rooms/${code}/payment/confirm`);

// 21 — POST /api/v1/admin/rooms/{code}/payment/reject
export const adminRejectPaymentApi = (code: string, reason: string) =>
  mainClient.post<Room>(`/api/v1/admin/rooms/${code}/payment/reject`, { reason });

// 22 — POST /api/v1/admin/rooms/{code}/payout
export const adminPayoutApi = (code: string) => mainClient.post<Room>(`/api/v1/admin/rooms/${code}/payout`);

// 23 — PUT /api/v1/admin/fee-settings
export const adminUpdateFeeSettingsApi = (body: FeeSettings) =>
  mainClient.put<FeeSettings>("/api/v1/admin/fee-settings", body);

// 24 — POST /api/v1/admin/jobs/auto-release
export const adminAutoReleaseApi = () =>
  mainClient.post<{ released: number }>("/api/v1/admin/jobs/auto-release");
