import type {
  Category,
  DeliverRequest,
  FeeQuote,
  FeeQuoteRequest,
  FeeSettings,
  OpenRoomRequest,
  Room,
} from "@/types/api/main/room";
import {
  cancelRoomApi,
  deliverApi,
  getFileBlobApi,
  parcelArrivedApi,
  receivedApi,
  uploadEvidenceApi,
  uploadSlipApi,
  getCategoriesApi,
  getFeeSettingsApi,
  getMyRoomsApi,
  getRoomApi,
  joinRoomApi,
  openRoomApi,
  quoteFeeApi,
} from "@/lib/api/api-main";

export const getCategories = async (): Promise<Category[]> => (await getCategoriesApi()).data;
export const getFeeSettings = async (): Promise<FeeSettings> => (await getFeeSettingsApi()).data;
export const quoteFee = async (body: FeeQuoteRequest): Promise<FeeQuote> => (await quoteFeeApi(body)).data;
export const openRoom = async (body: OpenRoomRequest): Promise<Room> => (await openRoomApi(body)).data;
export const getMyRooms = async (): Promise<Room[]> => (await getMyRoomsApi()).data;
export const getRoom = async (code: string): Promise<Room> => (await getRoomApi(code)).data;
export const joinRoom = async (code: string): Promise<Room> => (await joinRoomApi(code)).data;

/** The share link for a room — the FE's own origin (SPEC-001: http://localhost:3000/room/{code}). */
export const roomShareUrl = (code: string) =>
  `${typeof window === "undefined" ? "" : window.location.origin}/room/${code}`;

export const cancelRoom = async (code: string): Promise<Room> => (await cancelRoomApi(code)).data;
export const uploadSlip = async (code: string, file: File): Promise<Room> => (await uploadSlipApi(code, file)).data;
export const uploadEvidence = async (code: string, file: File): Promise<Room> =>
  (await uploadEvidenceApi(code, file)).data;
export const deliver = async (code: string, body: DeliverRequest): Promise<Room> =>
  (await deliverApi(code, body)).data;
export const parcelArrived = async (code: string): Promise<Room> => (await parcelArrivedApi(code)).data;
export const received = async (code: string): Promise<Room> => (await receivedApi(code)).data;
export const getFileBlob = async (url: string): Promise<Blob> => (await getFileBlobApi(url)).data;

/** Client-side mirror of SPEC endpoint 13/14 limits so the Thai message is instant. */
export const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
