"use client";

import { useState } from "react";
import { Button, Skeleton } from "antd";
import { FormError, PageShell } from "@/components/common";
import { ActionPanel, AmountsReceipt, GuidanceBlocks, PartyRow, StatusPill, Timeline } from "@/components/partials/Room";
import { ERROR_TH, ROOM_SECTION_TH, ROOM_TH, STATUS_TH } from "@/constant/text/th";
import { useJoinRoom, useRoom } from "@/hooks/room";
import { isApiError } from "@/types/api/main/common";
import type { Room } from "@/types/api/main/room";

interface RoomContentProps {
  code: string;
}

const PARTY_LABEL = { BUYER: "ผู้ซื้อ", SELLER: "ผู้ขาย" } as const;

/**
 * /room/[code]. Non-members get the **join gate** (TASK-007); members get the room proper
 * (TASK-008): heading, actions by role × status, receipt, parties, guidance, timeline.
 */
export default function RoomContent({ code }: RoomContentProps) {
  const room = useRoom(code);

  if (room.isPending) {
    return (
      <PageShell width="narrow">
        <Skeleton active title={{ width: "40%" }} paragraph={{ rows: 4 }} />
      </PageShell>
    );
  }

  if (room.isError) {
    const notFound = isApiError(room.error) && room.error.code === "NOT_FOUND";
    return (
      <PageShell width="narrow">
        <p role="alert" className="rounded-[var(--radius-lg)] bg-error-soft px-5 py-4 text-[15px] text-error">
          {notFound ? ERROR_TH.NOT_FOUND : ERROR_TH.GENERIC}
        </p>
      </PageShell>
    );
  }

  return (
    <PageShell width="narrow">
      {room.data.myRole === null ? <JoinGate room={room.data} /> : <MemberView room={room.data} />}
    </PageShell>
  );
}

function RoomHeading({ room }: { room: Room }) {
  const cancelled = room.status === "CANCELLED";
  return (
    <header className="rise-in">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-semibold tabular-nums tracking-[0.14em] text-muted">{room.code}</span>
        {!cancelled && <StatusPill status={room.status} />}
      </div>
      <p className="mt-4 text-[13px] font-medium text-muted">{room.category.nameTh}</p>
      {cancelled ? (
        <>
          {/* AC-12: the cancelled room leads with its status, the goods become the subline */}
          <h1 className="mt-1 text-[1.6rem] font-semibold leading-snug tracking-[-0.01em] text-muted sm:text-[1.9rem]">
            {STATUS_TH.CANCELLED}
          </h1>
          <p className="mt-1 text-[15px] text-ink">{room.description}</p>
        </>
      ) : (
        <h1 className="mt-1 text-[1.6rem] font-semibold leading-snug tracking-[-0.01em] text-ink sm:text-[1.9rem]">
          {room.description}
        </h1>
      )}
    </header>
  );
}

function Parties({ room }: { room: Room }) {
  const emptyBuyer = STATUS_TH.WAITING_BUYER_JOIN;
  const emptySeller = STATUS_TH.WAITING_SELLER_JOIN;
  return (
    <div className="divide-y divide-line">
      <PartyRow label={PARTY_LABEL.BUYER} party={room.buyer} emptyText={emptyBuyer} isMe={room.myRole === "BUYER"} />
      <PartyRow label={PARTY_LABEL.SELLER} party={room.seller} emptyText={emptySeller} isMe={room.myRole === "SELLER"} />
    </div>
  );
}

/** A logged-in non-member: see the deal, then เข้าร่วมห้อง (AC-6) — or ห้องนี้เต็มแล้ว (AC-7). */
function JoinGate({ room }: { room: Room }) {
  const join = useJoinRoom(room.code);
  const [error, setError] = useState<string | null>(null);
  const full = room.buyer !== null && room.seller !== null;
  const closed = room.status === "COMPLETED" || room.status === "CANCELLED";

  const onJoin = async () => {
    setError(null);
    try {
      await join.mutateAsync();
    } catch (e) {
      if (isApiError(e) && e.code === "ROOM_FULL") setError(ERROR_TH.ROOM_FULL);
      else if (isApiError(e) && e.code === "INVALID_STATE") await join.reset();
      else setError(ERROR_TH.GENERIC);
    }
  };

  return (
    <>
      <RoomHeading room={room} />
      <section className="mt-8 grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-8">
        <AmountsReceipt {...room.amounts} />
        <Parties room={room} />
      </section>

      <section className="mt-10">
        {full || closed ? (
          <p role="status" className="rounded-[var(--radius-lg)] bg-surface px-5 py-4 text-[15px] font-medium text-ink">
            {closed ? STATUS_TH[room.status] : ERROR_TH.ROOM_FULL}
          </p>
        ) : (
          <>
            <FormError message={error} />
            <Button type="primary" size="large" loading={join.isPending} onClick={onJoin} className="h-12! px-8! text-[16px]!">
              {ROOM_TH.JOIN}
            </Button>
          </>
        )}
      </section>
    </>
  );
}

/** R-5 — REQ-001 §Additional wording 2 section headings. */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 text-[13px] font-semibold text-muted">{children}</h2>;
}

/** The room proper for buyer / seller (TASK-008). Everything below renders from one Room. */
function MemberView({ room }: { room: Room }) {
  return (
    <>
      <RoomHeading room={room} />

      <div className="mt-8">
        <ActionPanel room={room} />
      </div>

      <section className="mt-8 grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:gap-8">
        <AmountsReceipt {...room.amounts} />
        <Parties room={room} />
      </section>

      <section className="mt-10">
        <SectionHeading>{ROOM_SECTION_TH.GUIDANCE}</SectionHeading>
        <GuidanceBlocks />
      </section>

      {room.events.length > 0 && (
        <section className="mt-10">
          <SectionHeading>{ROOM_SECTION_TH.TIMELINE}</SectionHeading>
          <Timeline events={room.events} />
        </section>
      )}
    </>
  );
}
