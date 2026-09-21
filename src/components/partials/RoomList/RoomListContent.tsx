"use client";

import Link from "next/link";
import { Button, Skeleton } from "antd";
import { ChevronRight } from "lucide-react";
import { PageShell } from "@/components/common";
import { StatusPill } from "@/components/partials/Room";
import { ERROR_TH, ROOM_TH } from "@/constant/text/th";
import { useMyRooms } from "@/hooks/room";
import type { Room } from "@/types/api/main/room";

const THB = (n: number) => `${n.toLocaleString("th-TH")} บาท`;

/** /rooms — ห้องดีลของฉัน. Rows, not cards: code · category · status · the money · the other party. */
export default function RoomListContent() {
  const rooms = useMyRooms();

  return (
    <PageShell>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-[2rem]">
          {ROOM_TH.MY_ROOMS}
        </h1>
        <Link href="/rooms/new">
          <Button type="primary" size="large">
            {ROOM_TH.OPEN_ROOM}
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        {rooms.isPending ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : rooms.isError ? (
          <p role="alert" className="rounded-[var(--radius-lg)] bg-error-soft px-5 py-4 text-[15px] text-error">
            {ERROR_TH.GENERIC}
          </p>
        ) : rooms.data.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-dashed border-line-strong px-6 py-14 text-center text-[15px] text-muted">
            {ROOM_TH.EMPTY_ROOMS}
          </p>
        ) : (
          <ul className="rise-in divide-y divide-line border-y border-line">
            {rooms.data.map((room) => (
              <li key={room.id}>
                <RoomRow room={room} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

function RoomRow({ room }: { room: Room }) {
  const me = room.myRole;
  const other = me === "BUYER" ? room.seller : me === "SELLER" ? room.buyer : null;
  const myRoleText = me === "BUYER" ? ROOM_TH.ROLE_BUYER : me === "SELLER" ? ROOM_TH.ROLE_SELLER : "";
  const myMoney = me === "BUYER" ? room.amounts.buyerPays : room.amounts.sellerReceives;

  return (
    <Link
      href={`/room/${room.code}`}
      className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 py-4 no-underline transition-colors duration-200 ease-out hover:bg-surface-2 sm:grid-cols-[7rem_minmax(0,1fr)_auto_auto] sm:gap-x-6 sm:px-2"
    >
      <span className="font-semibold tabular-nums tracking-[0.12em] text-ink">{room.code}</span>

      <span className="col-span-2 min-w-0 sm:col-span-1">
        <span className="block truncate text-[15px] font-medium text-ink">{room.description}</span>
        <span className="mt-0.5 block truncate text-[13px] text-muted">
          {room.category.nameTh} · {myRoleText}
          {other ? ` · ${other.displayName}` : ""}
        </span>
      </span>

      <span className="col-start-2 row-start-1 justify-self-end sm:col-start-3 sm:row-start-auto">
        <StatusPill status={room.status} size="sm" />
      </span>

      <span className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1 sm:justify-end">
        <span className="text-[15px] font-semibold tabular-nums text-ink">{THB(myMoney)}</span>
        <ChevronRight
          className="size-4 text-muted transition-transform duration-200 ease-out group-hover:translate-x-0.5"
          aria-hidden
        />
      </span>
    </Link>
  );
}
