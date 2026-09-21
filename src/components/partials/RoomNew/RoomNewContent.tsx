"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Form, Input, InputNumber, Radio, Segmented, Select } from "antd";
import { FormError, PageShell } from "@/components/common";
import { AmountsReceipt } from "@/components/partials/Room";
import { ERROR_TH, FORM_TH, PRICE_ERROR_TH, ROOM_TH } from "@/constant/text/th";
import { useCategories, useFeeQuote, useFeeSettings, useOpenRoom } from "@/hooks/room";
import { computeFee, minIncludedTotal } from "@/lib/fee";
import { isApiError } from "@/types/api/main/common";
import type { FeeQuoteRequest } from "@/types/api/main/room";
import type { OpenRoomFormValues } from "@/types/app/room";

const INITIAL: Partial<OpenRoomFormValues> = {
  myRole: "SELLER",
  priceMode: "FEE_ADDED",
  feePayer: "BUYER",
};

const isWholeBaht = (n: unknown): n is number => typeof n === "number" && Number.isInteger(n) && n >= 1;

export default function RoomNewContent() {
  const router = useRouter();
  const [form] = Form.useForm<OpenRoomFormValues>();
  const values = Form.useWatch([], form);
  const categories = useCategories();
  const settings = useFeeSettings();
  const openRoom = useOpenRoom();
  const [error, setError] = useState<string | null>(null);

  // React Compiler memoizes these derivations; no manual useMemo.
  const quoteInput: FeeQuoteRequest | null =
    values?.priceMode && values.feePayer && isWholeBaht(values.enteredPrice)
        ? { priceMode: values.priceMode, feePayer: values.feePayer, enteredPrice: values.enteredPrice }
        : null;

  // Instant local preview (src/lib/fee.ts) while typing; the BE quote replaces it once settled.
  const local =
    quoteInput && settings.data
        ? computeFee({
            mode: quoteInput.priceMode,
            feePayer: quoteInput.feePayer,
            enteredPrice: quoteInput.enteredPrice,
            ratePercent: settings.data.feeRatePercent,
            minimum: settings.data.feeMinimum,
          })
        : null;
  const quote = useFeeQuote(local ? quoteInput : null);
  const preview = quote.data ?? local;

  const tooLow = quoteInput !== null && settings.data !== undefined && local === null;
  // R-8 — a typed non-integer (10.5) or < 1: Porter's message under the field, no receipt, no submit.
  const priceTyped = values?.enteredPrice !== undefined && values?.enteredPrice !== null;
  const priceNotWhole = priceTyped && !isWholeBaht(values?.enteredPrice);
  const minTotal = settings.data
    ? minIncludedTotal(values?.feePayer ?? "BUYER", settings.data.feeRatePercent, settings.data.feeMinimum)
    : 0;

  const canSubmit =
    !!values?.myRole && !!values?.categoryId && !!values?.description?.trim() && preview !== null && !tooLow;

  const onFinish = async (v: OpenRoomFormValues) => {
    setError(null);
    try {
      const room = await openRoom.mutateAsync({
        myRole: v.myRole,
        categoryId: v.categoryId,
        description: v.description.trim(),
        priceMode: v.priceMode,
        feePayer: v.feePayer,
        enteredPrice: v.enteredPrice,
      });
      router.push(`/room/${room.code}`);
    } catch (e) {
      if (isApiError(e) && e.code === "VALIDATION_ERROR") {
        setError(v.priceMode === "FEE_INCLUDED" && tooLow ? PRICE_ERROR_TH.TOO_LOW(minTotal) : PRICE_ERROR_TH.NOT_WHOLE_BAHT);
      } else {
        setError(ERROR_TH.GENERIC);
      }
    }
  };

  return (
    <PageShell>
      <h1 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-[2rem]">
        {ROOM_TH.OPEN_ROOM}
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14">
        <Form<OpenRoomFormValues>
          form={form}
          layout="vertical"
          size="large"
          requiredMark={false}
          initialValues={INITIAL}
          onFinish={onFinish}
          className="rise-in max-w-[34rem]"
        >
          {/* who am I in this deal — REQ-001 "ฉันเป็นผู้ซื้อ / ฉันเป็นผู้ขาย" */}
          <Form.Item name="myRole" className="mb-7!">
            <Segmented
              block
              size="large"
              options={[
                { label: ROOM_TH.ROLE_SELLER, value: "SELLER" },
                { label: ROOM_TH.ROLE_BUYER, value: "BUYER" },
              ]}
            />
          </Form.Item>

          <Form.Item name="categoryId" label={ROOM_TH.CATEGORY}>
            <Select
              loading={categories.isPending}
              options={categories.data?.map((c) => ({ label: c.nameTh, value: c.id }))}
              placeholder={ROOM_TH.CATEGORY}
            />
          </Form.Item>

          <Form.Item name="description" label={FORM_TH.DESCRIPTION}>
            <Input.TextArea rows={3} maxLength={500} showCount />
          </Form.Item>

          <Form.Item
            name="enteredPrice"
            label={FORM_TH.PRICE}
            className="mb-4!"
            validateStatus={priceNotWhole ? "error" : undefined}
            help={priceNotWhole ? PRICE_ERROR_TH.NOT_WHOLE_BAHT : undefined}
          >
            <InputNumber
              min={0}
              controls={false}
              inputMode="decimal"
              suffix="บาท"
              style={{ width: "100%", maxWidth: "16rem" }}
            />
          </Form.Item>
          <Form.Item name="priceMode" className="mb-7!">
            <Radio.Group
              orientation="vertical"
              className="gap-1.5!"
              options={[
                { label: ROOM_TH.PRICE_MODE_FEE_ADDED, value: "FEE_ADDED" },
                { label: ROOM_TH.PRICE_MODE_FEE_INCLUDED, value: "FEE_INCLUDED" },
              ]}
            />
          </Form.Item>

          <Form.Item name="feePayer" className="mb-8!">
            <Radio.Group
              orientation="vertical"
              className="gap-1.5!"
              options={[
                { label: ROOM_TH.FEE_PAYER_SELLER, value: "SELLER" },
                { label: ROOM_TH.FEE_PAYER_BUYER, value: "BUYER" },
                { label: ROOM_TH.FEE_PAYER_SPLIT, value: "SPLIT" },
              ]}
            />
          </Form.Item>

          {/* phone: the receipt sits right above the button */}
          <div className="mb-6 lg:hidden">
            <PreviewPanel preview={preview} tooLow={tooLow} minTotal={minTotal} variant="inline" />
          </div>

          <FormError message={error} />

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={openRoom.isPending}
            disabled={!canSubmit}
            className="h-12! px-8! text-[16px]!"
          >
            {ROOM_TH.OPEN_ROOM}
          </Button>
        </Form>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <PreviewPanel preview={preview} tooLow={tooLow} minTotal={minTotal} variant="hero" />
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

interface PreviewPanelProps {
  preview: { buyerPays: number; sellerReceives: number; fee: number } | null;
  tooLow: boolean;
  minTotal: number;
  variant: "hero" | "inline";
}

function PreviewPanel({ preview, tooLow, minTotal, variant }: PreviewPanelProps) {
  if (tooLow) {
    return (
      <p role="alert" className="rounded-[var(--radius-lg)] bg-error-soft px-5 py-4 text-[14px] leading-snug text-error">
        {PRICE_ERROR_TH.TOO_LOW(minTotal)}
      </p>
    );
  }
  if (!preview) {
    // nothing typed yet — the receipt's silhouette, so the page doesn't jump when numbers arrive
    return (
      <div
        aria-hidden
        className={`rounded-[var(--radius-lg)] border border-dashed border-line-strong ${variant === "hero" ? "h-44" : "h-32"}`}
      />
    );
  }
  return <AmountsReceipt {...preview} variant={variant} />;
}
