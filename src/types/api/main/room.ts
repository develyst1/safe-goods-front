// SPEC-001 §Shared shapes — FileRef / RoomEvent / Room and the room enums.
import type { UserPublic } from "./auth";

export type RoomStatus =
  | "WAITING_BUYER_JOIN"
  | "WAITING_SELLER_JOIN"
  | "WAITING_PAYMENT"
  | "SLIP_REVIEW"
  | "PAID_WAITING_DELIVERY"
  | "DELIVERED_WAITING_CONFIRM"
  | "SHIPPED_WAITING_PARCEL"
  | "PARCEL_ARRIVED_WAITING_CONFIRM"
  | "WAITING_PAYOUT"
  | "COMPLETED"
  | "CANCELLED";

export type PartyRole = "BUYER" | "SELLER";
export type CategoryKind = "IN_GAME" | "PHYSICAL";
export type PriceMode = "FEE_ADDED" | "FEE_INCLUDED";
export type FeePayer = "SELLER" | "BUYER" | "SPLIT";
export type FileKind = "SLIP" | "EVIDENCE";
export type ActorRole = "BUYER" | "SELLER" | "ADMIN" | "SYSTEM";

/** REQ-002 will append to this list — never treat it as closed. */
export type EventType =
  | "ROOM_OPENED"
  | "ROOM_JOINED"
  | "SLIP_UPLOADED"
  | "PAYMENT_CONFIRMED"
  | "PAYMENT_REJECTED"
  | "DELIVERED"
  | "PARCEL_ARRIVED"
  | "RECEIVED_CONFIRMED"
  | "AUTO_RELEASED"
  | "PAID_OUT"
  | "ROOM_CANCELLED"
  | (string & {});

export interface Category {
  id: number;
  kind: CategoryKind;
  nameTh: string;
}

export interface FeeSettings {
  feeRatePercent: number;
  feeMinimum: number;
}

export interface FeeQuoteRequest {
  priceMode: PriceMode;
  feePayer: FeePayer;
  enteredPrice: number;
}

export interface FeeQuote extends FeeSettings {
  basePrice: number;
  fee: number;
  buyerPays: number;
  sellerReceives: number;
}

export interface FileRef {
  id: string;
  kind: FileKind;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  /** always "/api/v1/files/{id}" — fetched with the bearer token, never a bare <img src> */
  url: string;
}

export interface RoomEvent {
  id: number;
  type: EventType;
  actorRole: ActorRole;
  actorDisplayName: string | null;
  note: string | null;
  createdAt: string;
}

export interface RoomAmounts extends FeeSettings {
  enteredPrice: number;
  basePrice: number;
  fee: number;
  buyerPays: number;
  sellerReceives: number;
}

export interface RoomPayment {
  slip: FileRef | null;
  rejectReason: string | null;
  confirmedAt: string | null;
}

export interface RoomDelivery {
  evidence: FileRef[];
  courier: string | null;
  trackingNumber: string | null;
  deliveredAt: string | null;
  parcelArrivedAt: string | null;
}

export interface Room {
  id: string;
  code: string;
  status: RoomStatus;
  category: Category;
  description: string;
  priceMode: PriceMode;
  feePayer: FeePayer;
  amounts: RoomAmounts;
  buyer: UserPublic | null;
  seller: UserPublic | null;
  openedByRole: PartyRole;
  myRole: PartyRole | "ADMIN" | null;
  payment: RoomPayment;
  delivery: RoomDelivery;
  autoReleaseAt: string | null;
  releasedAt: string | null;
  releasedBy: "BUYER" | "SYSTEM" | null;
  paidOutAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  canCancel: boolean;
  events: RoomEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface OpenRoomRequest {
  myRole: PartyRole;
  categoryId: number;
  description: string;
  priceMode: PriceMode;
  feePayer: FeePayer;
  enteredPrice: number;
}

export interface DeliverRequest {
  courier?: string;
  trackingNumber?: string;
}
