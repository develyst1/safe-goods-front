import axios from "axios";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { ApiResponse, AuthResponse } from "@/types/api/main";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * NextAuth 4 Credentials provider (SPEC-001 §Auth from the FE side):
 * `authorize()` calls endpoint 3 (POST /auth/login) and the BE JWT rides in the
 * NextAuth session as `accessToken`. Wrong email/password → null → the login page
 * shows AUTH_TH.LOGIN_FAILED.
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        try {
          const res = await axios.post<ApiResponse<AuthResponse>>(
            `${API_BASE_URL}/api/v1/auth/login`,
            { email: credentials.email, password: credentials.password },
            { timeout: 15_000 },
          );
          if (!res.data.success) return null;
          const { token, user } = res.data.data;
          return {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            role: user.role,
            accessToken: token,
          };
        } catch {
          return null; // 401 UNAUTHENTICATED or network — both are "login failed" to the user
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.displayName = user.displayName;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = {
        ...session.user,
        id: token.id,
        displayName: token.displayName,
        role: token.role,
      };
      return session;
    },
  },
};
