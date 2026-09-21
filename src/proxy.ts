// Next.js 16 renamed the `middleware` file convention to `proxy` (see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md).
// Same job as SPEC-001 "NextAuth middleware":
//   AC-8  — /room/**, /rooms/** need a session  → /login?callbackUrl=…
//   AC-27 — /admin/** additionally needs ADMIN   → /
// The BE enforces both again; this is UX, the BE check is security.
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    if (isAdminRoute && req.nextauth.token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  },
  {
    pages: { signIn: "/login" },
    callbacks: { authorized: ({ token }) => !!token },
  },
);

export const config = {
  matcher: ["/room/:path*", "/rooms", "/rooms/:path*", "/admin", "/admin/:path*"],
};
