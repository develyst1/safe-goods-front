import type { Metadata } from "next";
import { RoomContent } from "@/components/partials/RoomJoin";
import { SITE_NAME } from "@/constant/text/th";

export const metadata: Metadata = { title: SITE_NAME };

export default async function RoomPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <RoomContent code={code} />;
}
