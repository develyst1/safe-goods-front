// SPEC-001 §Shared shapes — Me / UserPublic, endpoints 2–4.

export type UserRole = "USER" | "ADMIN";

export interface Credit {
  goodCloseCount: number;
}

export interface UserPublic {
  id: string;
  displayName: string;
  credit: Credit;
}

export interface Me {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  credit: Credit;
}

export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: Me;
}
