import type { Metadata } from "next";
import { AuthShell, RegisterForm } from "@/components/partials/Auth";
import { AUTH_TH, SITE_NAME } from "@/constant/text/th";

export const metadata: Metadata = { title: `${AUTH_TH.REGISTER} — ${SITE_NAME}` };

export default function RegisterPage() {
  return (
    <AuthShell title={AUTH_TH.REGISTER}>
      <RegisterForm />
    </AuthShell>
  );
}
