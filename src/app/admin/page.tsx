import type { Metadata } from "next";
import { AdminQueues } from "@/components/partials/Admin";
import { ADMIN_TH, SITE_NAME } from "@/constant/text/th";

export const metadata: Metadata = { title: `${ADMIN_TH.SLIP_PAGE} — ${SITE_NAME}` };

// Guarded by src/proxy.ts (role ADMIN) — the BE guards every endpoint again.
export default function AdminPage() {
  return <AdminQueues />;
}
