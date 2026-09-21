"use client";

import { useState } from "react";
import Link from "next/link";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { Button, Input, Modal, Segmented, Skeleton } from "antd";
import { ArrowUpRight } from "lucide-react";
import { FormError, PageShell } from "@/components/common";
import { AuthedImage } from "@/components/partials/Room";
import { ADMIN_TH, ADMIN_TH2, ERROR_TH, ROOM_TH, STATUS_TH } from "@/constant/text/th";
import { useAdminActions, useAdminRooms } from "@/hooks/admin";
import { isApiError } from "@/types/api/main/common";
import type { Room, RoomStatus } from "@/types/api/main/room";

dayjs.locale("th");

type Queue = "SLIP_REVIEW" | "SHIPPED_WAITING_PARCEL" | "WAITING_PAYOUT";

/** Section title per queue — REQ-001 strings only (the parcel queue borrows its status label). */
const QUEUE_TITLE: Record<Queue, string> = {
  SLIP_REVIEW: ADMIN_TH.SLIP_PAGE,
  SHIPPED_WAITING_PARCEL: STATUS_TH.SHIPPED_WAITING_PARCEL,
  WAITING_PAYOUT: ADMIN_TH.PAYOUT_PAGE,
};

/** R-2 — empty state per queue (REQ-001 §Additional wording 2). */
const EMPTY_TEXT: Record<Queue, string> = {
  SLIP_REVIEW: ADMIN_TH.EMPTY_SLIPS,
  SHIPPED_WAITING_PARCEL: ADMIN_TH2.EMPTY_PARCELS,
  WAITING_PAYOUT: ADMIN_TH2.EMPTY_PAYOUTS,
};

const THB = (n: number) => `${n.toLocaleString("th-TH")} บาท`;
const when = (iso: string | null) => (iso ? dayjs(iso).format("D MMM YYYY HH:mm") : "");

const describe = (e: unknown) =>
  isApiError(e) && e.code === "INVALID_STATE" ? null : ERROR_TH.GENERIC;

/**
 * /admin — the three work queues REQ-001 needs (slips · parcels · payouts), one at a time.
 * Rows, not a data table: the admin scans code → who → how much → act.
 */
export default function AdminQueues() {
  const [queue, setQueue] = useState<Queue>("SLIP_REVIEW");
  const slips = useAdminRooms("SLIP_REVIEW");
  const parcels = useAdminRooms("SHIPPED_WAITING_PARCEL");
  const payouts = useAdminRooms("WAITING_PAYOUT");
  const lists: Record<Queue, typeof slips> = { SLIP_REVIEW: slips, SHIPPED_WAITING_PARCEL: parcels, WAITING_PAYOUT: payouts };
  const current = lists[queue];

  const count = (q: ReturnType<typeof useAdminRooms>) => (q.data ? ` ${q.data.length}` : "");

  return (
    <PageShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-[2rem]">
          {QUEUE_TITLE[queue]}
        </h1>
        <Link href="/admin/settings" className="inline-flex items-center gap-1 text-[15px] font-medium text-primary">
          {ADMIN_TH.FEE_SETTINGS_PAGE}
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>

      <div className="mt-6">
        <Segmented<Queue>
          value={queue}
          onChange={setQueue}
          size="large"
          options={[
            { label: `${ADMIN_TH.SLIP_PAGE}${count(slips)}`, value: "SLIP_REVIEW" },
            { label: `${STATUS_TH.SHIPPED_WAITING_PARCEL}${count(parcels)}`, value: "SHIPPED_WAITING_PARCEL" },
            { label: `${ADMIN_TH.PAYOUT_PAGE}${count(payouts)}`, value: "WAITING_PAYOUT" },
          ]}
        />
      </div>

      <div className="mt-8">
        {current.isPending ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : current.isError ? (
          <p role="alert" className="rounded-[var(--radius-lg)] bg-error-soft px-5 py-4 text-[15px] text-error">
            {ERROR_TH.GENERIC}
          </p>
        ) : current.data.length === 0 ? (
          <p className="rounded-[var(--radius-lg)] border border-dashed border-line-strong px-6 py-14 text-center text-[15px] text-muted">
            {EMPTY_TEXT[queue]}
          </p>
        ) : (
          <ul className="rise-in divide-y divide-line border-y border-line">
            {current.data.map((room) => (
              <li key={room.id} className="py-5">
                {queue === "SLIP_REVIEW" && <SlipRow room={room} />}
                {queue === "SHIPPED_WAITING_PARCEL" && <ParcelRow room={room} />}
                {queue === "WAITING_PAYOUT" && <PayoutRow room={room} />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageShell>
  );
}

/** code · goods · ผู้ซื้อ / ผู้ขาย — the left half of every row. */
function RoomCell({ room, sub }: { room: Room; sub?: string }) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <Link href={`/room/${room.code}`} className="font-semibold tabular-nums tracking-[0.12em] text-primary">
          {room.code}
        </Link>
        <span className="truncate text-[15px] font-medium text-ink">{room.description}</span>
      </div>
      <p className="mt-1 text-[13.5px] text-muted">
        ผู้ซื้อ <span className="text-ink">{room.buyer?.displayName ?? "—"}</span>
        <span className="mx-2">·</span>
        ผู้ขาย <span className="text-ink">{room.seller?.displayName ?? "—"}</span>
        {sub && (
          <>
            <span className="mx-2">·</span>
            {sub}
          </>
        )}
      </p>
    </div>
  );
}

function SlipRow({ room }: { room: Room }) {
  const actions = useAdminActions();
  const [error, setError] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const busy = actions.confirm.isPending || actions.reject.isPending;

  const run = async (p: Promise<unknown>) => {
    setError(null);
    try {
      await p;
    } catch (e) {
      setError(describe(e));
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:items-center sm:gap-6">
      {room.payment.slip ? <AuthedImage file={room.payment.slip} size={112} /> : <div className="size-28" aria-hidden />}
      <div className="min-w-0">
        <RoomCell room={room} sub={when(room.payment.slip?.uploadedAt ?? null)} />
        <p className="mt-2 text-[1.35rem] font-semibold tabular-nums text-ink">
          <span className="mr-2 text-[13px] font-medium text-muted">ผู้ซื้อจ่าย</span>
          {THB(room.amounts.buyerPays)}
        </p>
        <FormError message={error} />
      </div>
      <div className="flex flex-wrap gap-2 sm:flex-col sm:items-stretch">
        <Button type="primary" size="large" loading={actions.confirm.isPending} disabled={busy} onClick={() => run(actions.confirm.mutateAsync(room.code))}>
          {ADMIN_TH.CONFIRM_SLIP}
        </Button>
        <Button size="large" danger disabled={busy} onClick={() => setRejecting(true)}>
          {ADMIN_TH.REJECT_SLIP}
        </Button>
      </div>

      <Modal
        open={rejecting}
        title={ADMIN_TH.REJECT_REASON}
        onCancel={() => setRejecting(false)}
        destroyOnHidden
        footer={
          <Button
            type="primary"
            danger
            size="large"
            disabled={!reason.trim()}
            loading={actions.reject.isPending}
            onClick={async () => {
              await run(actions.reject.mutateAsync({ code: room.code, reason: reason.trim() }));
              setRejecting(false);
              setReason("");
            }}
          >
            {ADMIN_TH.REJECT_SLIP}
          </Button>
        }
      >
        <Input.TextArea
          rows={3}
          maxLength={200}
          showCount
          autoFocus
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          aria-label={ADMIN_TH.REJECT_REASON}
        />
      </Modal>
    </div>
  );
}

function ParcelRow({ room }: { room: Room }) {
  const actions = useAdminActions();
  const [error, setError] = useState<string | null>(null);
  const { courier, trackingNumber } = room.delivery;
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
      <div className="min-w-0">
        <RoomCell room={room} />
        <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[14px]">
          <div>
            <dt className="inline text-muted">{ROOM_TH.COURIER} </dt>
            <dd className="inline font-medium text-ink">{courier ?? "—"}</dd>
          </div>
          <div>
            <dt className="inline text-muted">{ROOM_TH.TRACKING_NUMBER} </dt>
            <dd className="inline font-medium tabular-nums tracking-wide text-ink">{trackingNumber ?? "—"}</dd>
          </div>
        </dl>
        <FormError message={error} />
      </div>
      <Button
        type="primary"
        size="large"
        loading={actions.parcelArrived.isPending}
        onClick={async () => {
          setError(null);
          try {
            await actions.parcelArrived.mutateAsync(room.code);
          } catch (e) {
            setError(describe(e));
          }
        }}
      >
        {ROOM_TH.PARCEL_ARRIVED}
      </Button>
    </div>
  );
}

function PayoutRow({ room }: { room: Room }) {
  const actions = useAdminActions();
  const [error, setError] = useState<string | null>(null);
  // how the money was released — REQ-001's own words for each path
  const releasedLabel = room.releasedBy === "SYSTEM" ? ROOM_TH.AUTO_RELEASED_EVENT : ROOM_TH.RECEIVED;
  return (
    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-8">
      <RoomCell room={room} sub={`${releasedLabel} ${when(room.releasedAt)}`} />
      <p className="text-right">
        <span className="block text-[13px] font-medium text-muted">ผู้ขายได้รับ</span>
        <span className="text-[1.5rem] font-semibold tabular-nums tracking-[-0.01em] text-accent-ink">
          {THB(room.amounts.sellerReceives)}
        </span>
        <FormError message={error} />
      </p>
      <Button
        type="primary"
        size="large"
        loading={actions.payout.isPending}
        onClick={async () => {
          setError(null);
          try {
            await actions.payout.mutateAsync(room.code);
          } catch (e) {
            setError(describe(e));
          }
        }}
      >
        {ADMIN_TH.RECORD_PAYOUT}
      </Button>
    </div>
  );
}

export type { RoomStatus as AdminQueueStatus };
