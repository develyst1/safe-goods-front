"use client";

import axios, { AxiosError, type AxiosResponse } from "axios";
import { getSession, signOut } from "next-auth/react";
import { ApiError, type ApiResponse } from "@/types/api/main/common";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * Browser-side axios client for the BE (SPEC-001 §Auth from the FE side).
 * - request: `Authorization: Bearer <session.accessToken>` when a session exists
 * - response: unwraps `{ success, data }` so callers get the payload as `res.data`;
 *   a failure envelope rejects with `ApiError` (SPEC code) — never the English message
 * - 401 from the BE: sign out and go to /login
 */
export const mainClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
});

mainClient.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return config;
});

const isEnvelope = (body: unknown): body is ApiResponse<unknown> =>
  typeof body === "object" && body !== null && "success" in body;

mainClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (isEnvelope(response.data)) {
      if (response.data.success) {
        response.data = response.data.data;
        return response;
      }
      const { code, message, details } = response.data.error;
      throw new ApiError(code, message, response.status, details);
    }
    return response; // e.g. endpoint 18 (file binary)
  },
  async (error: AxiosError) => {
    const status = error.response?.status ?? 0;
    const body = error.response?.data;
    const apiError =
      isEnvelope(body) && !body.success
        ? new ApiError(body.error.code, body.error.message, status, body.error.details)
        : new ApiError("INTERNAL", error.message, status);

    if (status === 401) {
      await signOut({ callbackUrl: "/login" });
    }
    throw apiError;
  },
);
