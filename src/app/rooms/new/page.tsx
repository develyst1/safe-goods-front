import type { Metadata } from "next";
import { RoomNewContent } from "@/components/partials/RoomNew";
import { ROOM_TH, SITE_NAME } from "@/constant/text/th";

export const metadata: Metadata = { title: `${ROOM_TH.OPEN_ROOM} — ${SITE_NAME}` };

export default function RoomNewPage() {
  return <RoomNewContent />;
}
