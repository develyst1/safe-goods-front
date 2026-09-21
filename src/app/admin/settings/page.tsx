import type { Metadata } from "next";
import { AdminSettings } from "@/components/partials/Admin";
import { ADMIN_TH, SITE_NAME } from "@/constant/text/th";

export const metadata: Metadata = { title: `${ADMIN_TH.FEE_SETTINGS_PAGE} — ${SITE_NAME}` };

export default function AdminSettingsPage() {
  return <AdminSettings />;
}
