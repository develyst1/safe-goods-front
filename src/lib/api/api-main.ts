"use client";

// One function per SPEC-001 endpoint used by the FE. The interceptor has already
// unwrapped the envelope, so `res.data` IS the payload.
import type { AuthResponse, Me, RegisterRequest } from "@/types/api/main/auth";
import { mainClient } from "./client";

// 2 — POST /api/v1/auth/register (no auth)
export const registerApi = (body: RegisterRequest) =>
  mainClient.post<AuthResponse>("/api/v1/auth/register", body);

// 4 — GET /api/v1/auth/me
export const getMeApi = () => mainClient.get<Me>("/api/v1/auth/me");
