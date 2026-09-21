// SPEC-001 §Envelope & errors — the BE↔FE contract. Field names are the SPEC's, camelCase.

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "EMAIL_TAKEN"
  | "ROOM_FULL"
  | "INVALID_STATE"
  | "EVIDENCE_REQUIRED"
  | "TRACKING_REQUIRED"
  | "INTERNAL";

export interface ApiErrorBody {
  code: ApiErrorCode;
  message: string;
  details?: unknown;
}

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: ApiErrorBody };

/** What the axios client rejects with: the SPEC error, plus the HTTP status. */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly details?: unknown;

  constructor(code: ApiErrorCode, message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;
