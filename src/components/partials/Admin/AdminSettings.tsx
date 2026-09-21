"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Form, InputNumber, Skeleton } from "antd";
import { ArrowLeft, Check } from "lucide-react";
import { FormError, PageShell } from "@/components/common";
import { ADMIN_TH, ADMIN_TH2, ERROR_TH } from "@/constant/text/th";
import { useAdminActions, useUpdateFeeSettings } from "@/hooks/admin";
import { useFeeSettings } from "@/hooks/room";
import type { FeeSettings } from "@/types/api/main/room";

/** /admin/settings — ตั้งค่าค่ากลาง (new rooms only, AC-5) + รันปล่อยเงินอัตโนมัติตอนนี้ (Tanya's AC-20 lever). */
export default function AdminSettings() {
  const settings = useFeeSettings();
  const update = useUpdateFeeSettings();
  const actions = useAdminActions();
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [released, setReleased] = useState<number | null>(null);

  const onFinish = async (v: FeeSettings) => {
    setError(null);
    try {
      await update.mutateAsync({ feeRatePercent: v.feeRatePercent, feeMinimum: v.feeMinimum });
      setSavedAt(Date.now());
    } catch {
      setError(ERROR_TH.GENERIC);
    }
  };

  return (
    <PageShell width="narrow">
      <Link href="/admin" className="inline-flex items-center gap-1 text-[14px] font-medium text-primary">
        <ArrowLeft className="size-4" aria-hidden />
        {ADMIN_TH.SLIP_PAGE}
      </Link>
      <h1 className="mt-4 text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] text-ink sm:text-[2rem]">
        {ADMIN_TH.FEE_SETTINGS_PAGE}
      </h1>

      <section className="mt-8 max-w-[26rem]">
        {settings.isPending ? (
          <Skeleton active paragraph={{ rows: 3 }} />
        ) : (
          <Form<FeeSettings>
            layout="vertical"
            size="large"
            requiredMark={false}
            initialValues={settings.data}
            onFinish={onFinish}
            className="rise-in"
          >
            <Form.Item name="feeRatePercent" label={ADMIN_TH.FEE_RATE}>
              <InputNumber min={0} max={100} precision={0} controls={false} inputMode="numeric" suffix="%" style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="feeMinimum" label={ADMIN_TH.FEE_MINIMUM}>
              <InputNumber min={0} precision={0} controls={false} inputMode="numeric" suffix="บาท" style={{ width: "100%" }} />
            </Form.Item>
            <FormError message={error} />
            <div className="flex items-center gap-3">
              <Button type="primary" htmlType="submit" size="large" loading={update.isPending}>
                {ADMIN_TH.SAVE_SETTINGS}
              </Button>
              {savedAt && !update.isPending && (
                <span key={savedAt} className="rise-in inline-flex items-center gap-1 text-[14px] font-medium text-accent-ink">
                  <Check className="size-4" aria-hidden />
                  {settings.data?.feeRatePercent}% · {settings.data?.feeMinimum} บาท
                </span>
              )}
            </div>
          </Form>
        )}
      </section>

      <section className="mt-14 border-t border-line pt-8">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            size="large"
            loading={actions.autoRelease.isPending}
            onClick={async () => {
              setReleased(null);
              try {
                const r = await actions.autoRelease.mutateAsync();
                setReleased(r.released);
              } catch {
                setError(ERROR_TH.GENERIC);
              }
            }}
          >
            {ADMIN_TH.RUN_AUTO_RELEASE}
          </Button>
          {released !== null && (
            <span className="rise-in rounded-full bg-accent-soft px-3 py-1 text-[14px] font-medium tabular-nums text-accent-ink">
              {released === 0 ? ADMIN_TH2.AUTO_RELEASED_NONE : ADMIN_TH2.AUTO_RELEASED(released)}
            </span>
          )}
        </div>
      </section>
    </PageShell>
  );
}
