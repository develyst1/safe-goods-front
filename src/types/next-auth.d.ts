import type { DefaultSession } from "next-auth";
import type { UserRole } from "@/types/api/main/auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: DefaultSession["user"] & {
      id: string;
      displayName: string;
      role: UserRole;
    };
  }
  interface User {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    displayName: string;
    role: UserRole;
    accessToken: string;
  }
}
