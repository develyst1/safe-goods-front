import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell, LoginForm } from "@/components/partials/Auth";
import { AUTH_TH, SITE_NAME } from "@/constant/text/th";

export const metadata: Metadata = { title: `${AUTH_TH.LOGIN} — ${SITE_NAME}` };

export default function LoginPage() {
  return (
    <AuthShell title={AUTH_TH.LOGIN}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
