import type { Metadata } from "next";
import { RoomListContent } from "@/components/partials/RoomList";
import { ROOM_TH, SITE_NAME } from "@/constant/text/th";

export const metadata: Metadata = { title: `${ROOM_TH.MY_ROOMS} — ${SITE_NAME}` };

export default function RoomsPage() {
  return <RoomListContent />;
}
