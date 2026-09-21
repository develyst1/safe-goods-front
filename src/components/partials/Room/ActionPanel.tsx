"use client";

import { useState } from "react";
import { App, Button, Input, Upload } from "antd";
import { ImagePlus, Paperclip } from "lucide-react";
import { FormError } from "@/components/common";
import { ADMIN_TH, ATTACH_EVIDENCE_TH, CANCEL_CONFIRM_TH, ERROR_TH, FILE_ERROR_TH, ROOM_SECTION_TH, ROOM_TH } from "@/constant/text/th";
import { useRoomActions } from "@/hooks/room";
import { IMAGE_MIME, MAX_IMAGE_BYTES } from "@/services/room.service";
import { isApiError } from "@/types/api/main/common";
import type { Room } from "@/types/api/main/room";
import AuthedImage from "./AuthedImage";
import Countdown from "./Countdown";
import ShareBlock from "./ShareBlock";

interface ActionPanelProps {
  room: Room;
}

const ACCEPT = IMAGE_MIME.join(",");

/** Maps a rejected mutation to Porter's string; null = nothing to show (INVALID_STATE refetches). */
const describe = (e: unknown, ctx: "file" | "action"): string | null => {
  if (!isApiError(e)) return ERROR_TH.GENERIC;
  switch (e.code) {
    case "EVIDENCE_REQUIRED":
      return ERROR_TH.EVIDENCE_REQUIRED;
    case "TRACKING_REQUIRED":
      return ERROR_TH.TRACKING_REQUIRED;
    case "INVALID_STATE":
      return null;
    case "VALIDATION_ERROR":
      return ctx === "file" ? FILE_ERROR_TH.NOT_IMAGE : ERROR_TH.GENERIC;
    default:
      return ERROR_TH.GENERIC;
  }
};

/** Client-side mirror of the file limits so the Thai message is instant. */
const fileProblem = (file: File): string | null => {
  if (!IMAGE_MIME.includes(file.type)) return FILE_ERROR_TH.NOT_IMAGE;
  if (file.size > MAX_IMAGE_BYTES) return FILE_ERROR_TH.TOO_LARGE;
  return null;
};

/**
 * The buttons a party can press *now* (TASK-008 table). Nothing renders for a status the
 * BE would refuse — never a disabled button hinting at REQ-002 features.
 */
export default function ActionPanel({ room }: ActionPanelProps) {
  const actions = useRoomActions(room.code);
  const { modal } = App.useApp();
  const [error, setError] = useState<string | null>(null);
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const me = room.myRole;
  if (me !== "BUYER" && me !== "SELLER") return null;

  const run = async (p: Promise<unknown>, ctx: "file" | "action" = "action") => {
    setError(null);
    try {
      await p;
    } catch (e) {
      setError(describe(e, ctx));
    }
  };

  const pick = (mutate: (f: File) => Promise<unknown>) => (file: File) => {
    const problem = fileProblem(file);
    if (problem) setError(problem);
    else void run(mutate(file), "file");
    return false; // never let AntD upload it itself
  };

  const busy =
    actions.cancel.isPending ||
    actions.slip.isPending ||
    actions.evidence.isPending ||
    actions.deliver.isPending ||
    actions.parcelArrived.isPending ||
    actions.received.isPending;

  // R-7 / AC-12b — confirm first; only ยืนยันยกเลิก calls POST /cancel, กลับ changes nothing.
  const confirmCancel = () =>
    modal.confirm({
      content: CANCEL_CONFIRM_TH.BODY,
      okText: CANCEL_CONFIRM_TH.OK,
      okButtonProps: { danger: true },
      cancelText: CANCEL_CONFIRM_TH.BACK,
      icon: null,
      centered: true,
      onOk: () => run(actions.cancel.mutateAsync()),
    });

  const cancelButton = room.canCancel && (
    <Button size="large" loading={actions.cancel.isPending} disabled={busy} onClick={confirmCancel}>
      {ROOM_TH.CANCEL}
    </Button>
  );

  let body: React.ReactNode = null;

  switch (room.status) {
    case "WAITING_BUYER_JOIN":
    case "WAITING_SELLER_JOIN":
      body = (
        <>
          <ShareBlock code={room.code} />
          <div>{cancelButton}</div>
        </>
      );
      break;

    case "WAITING_PAYMENT":
      body = (
        <>
          {me === "BUYER" && room.payment.rejectReason && (
            <p className="rounded-[var(--radius-lg)] bg-error-soft px-5 py-4 text-[14px] leading-snug text-error">
              <span className="font-semibold">{ADMIN_TH.REJECT_REASON}</span> — {room.payment.rejectReason}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {me === "BUYER" && (
              <Upload accept={ACCEPT} showUploadList={false} beforeUpload={pick(actions.slip.mutateAsync)} disabled={busy}>
                <Button type="primary" size="large" loading={actions.slip.isPending} disabled={busy} icon={<Paperclip className="size-4" aria-hidden />}>
                  {ROOM_TH.UPLOAD_SLIP(room.amounts.buyerPays)}
                </Button>
              </Upload>
            )}
            {cancelButton}
          </div>
        </>
      );
      break;

    case "SLIP_REVIEW":
      body = (
        <>
          {me === "BUYER" && room.payment.slip && <AuthedImage file={room.payment.slip} />}
          <div>{cancelButton}</div>
        </>
      );
      break;

    case "PAID_WAITING_DELIVERY":
      if (me === "SELLER") {
        const physical = room.category.kind === "PHYSICAL";
        body = (
          <>
            <Gallery room={room} />
            <div className="flex flex-wrap items-center gap-3">
              <Upload accept={ACCEPT} showUploadList={false} beforeUpload={pick(actions.evidence.mutateAsync)} disabled={busy} multiple>
                <Button size="large" loading={actions.evidence.isPending} disabled={busy} icon={<ImagePlus className="size-4" aria-hidden />}>
                  {ATTACH_EVIDENCE_TH}
                </Button>
              </Upload>
            </div>
            {physical && (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-[14px] text-ink">
                  <span className="mb-1.5 block">{ROOM_TH.COURIER}</span>
                  <Input size="large" maxLength={50} value={courier} onChange={(e) => setCourier(e.target.value)} />
                </label>
                <label className="block text-[14px] text-ink">
                  <span className="mb-1.5 block">{ROOM_TH.TRACKING_NUMBER}</span>
                  <Input size="large" maxLength={50} value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
                </label>
              </div>
            )}
            <div>
              <Button
                type="primary"
                size="large"
                loading={actions.deliver.isPending}
                disabled={busy}
                className="h-12! px-7! text-[16px]!"
                onClick={() =>
                  run(
                    actions.deliver.mutateAsync(
                      physical
                        ? { courier: courier.trim() || undefined, trackingNumber: trackingNumber.trim() || undefined }
                        : {},
                    ),
                  )
                }
              >
                {ROOM_TH.DELIVER}
              </Button>
            </div>
          </>
        );
      }
      break;

    case "DELIVERED_WAITING_CONFIRM":
    case "PARCEL_ARRIVED_WAITING_CONFIRM":
      body = (
        <>
          <Gallery room={room} />
          <TrackingLine room={room} />
          <Countdown autoReleaseAt={room.autoReleaseAt} />
          {me === "BUYER" && (
            <div>
              <Button type="primary" size="large" loading={actions.received.isPending} disabled={busy} className="h-12! px-7! text-[16px]!" onClick={() => run(actions.received.mutateAsync())}>
                {ROOM_TH.RECEIVED}
              </Button>
            </div>
          )}
        </>
      );
      break;

    case "SHIPPED_WAITING_PARCEL":
      body = (
        <>
          <Gallery room={room} />
          <TrackingLine room={room} />
          {me === "BUYER" && (
            <div>
              <Button type="primary" size="large" loading={actions.parcelArrived.isPending} disabled={busy} className="h-12! px-7! text-[16px]!" onClick={() => run(actions.parcelArrived.mutateAsync())}>
                {ROOM_TH.PARCEL_ARRIVED}
              </Button>
            </div>
          )}
        </>
      );
      break;

    default:
      // WAITING_PAYOUT · COMPLETED · CANCELLED — read-only (AC-22); the gallery stays for the record
      body = room.delivery.evidence.length > 0 ? (
        <>
          <Gallery room={room} />
          <TrackingLine room={room} />
        </>
      ) : null;
  }

  if (!body && !error) return null;

  return (
    <section className="flex flex-col gap-5">
      {body}
      <FormError message={error} />
    </section>
  );
}

/** Evidence thumbnails (seller's uploads) — both parties see them once they exist. */
function Gallery({ room }: { room: Room }) {
  if (room.delivery.evidence.length === 0) return null;
  return (
    <div>
      <h2 className="mb-2 text-[13px] font-semibold text-muted">{ROOM_SECTION_TH.EVIDENCE}</h2>
      <ul className="flex flex-wrap gap-2.5">
        {room.delivery.evidence.map((f) => (
          <li key={f.id}>
            <AuthedImage file={f} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** ขนส่ง / เลขพัสดุ once the seller has entered them (physical rooms). */
function TrackingLine({ room }: { room: Room }) {
  const { courier, trackingNumber } = room.delivery;
  if (!courier && !trackingNumber) return null;
  return (
    <dl className="flex flex-wrap gap-x-8 gap-y-1 rounded-[var(--radius-lg)] bg-surface px-5 py-3.5 text-[14px]">
      {courier && (
        <div>
          <dt className="text-muted">{ROOM_TH.COURIER}</dt>
          <dd className="font-medium text-ink">{courier}</dd>
        </div>
      )}
      {trackingNumber && (
        <div>
          <dt className="text-muted">{ROOM_TH.TRACKING_NUMBER}</dt>
          <dd className="font-medium tabular-nums tracking-wide text-ink">{trackingNumber}</dd>
        </div>
      )}
    </dl>
  );
}
