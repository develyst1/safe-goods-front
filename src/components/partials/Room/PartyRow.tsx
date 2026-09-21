import { CreditPill } from "@/components/common";
import { ROOM_SECTION_TH } from "@/constant/text/th";
import type { UserPublic } from "@/types/api/main/auth";

interface PartyRowProps {
  /** ผู้ซื้อ / ผู้ขาย — REQ-001 vocabulary */
  label: string;
  party: UserPublic | null;
  /** what to show in an empty seat — the room's Thai status label */
  emptyText: string;
  isMe?: boolean;
}

export default function PartyRow({ label, party, emptyText, isMe }: PartyRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[12.5px] font-medium text-muted">{label}</p>
        {party ? (
          <p className={`truncate text-[16px] font-semibold ${isMe ? "text-primary" : "text-ink"}`}>
            {party.displayName}
            {isMe && <span className="ml-1.5 text-[13px] font-medium">{ROOM_SECTION_TH.ME_MARKER}</span>}
          </p>
        ) : (
          <p className="text-[15px] text-muted">{emptyText}</p>
        )}
      </div>
      {party && <CreditPill count={party.credit.goodCloseCount} size="sm" />}
    </div>
  );
}
