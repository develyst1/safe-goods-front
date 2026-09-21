"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button, Form, Input } from "antd";
import { AUTH_TH, ERROR_TH } from "@/constant/text/th";
import { register } from "@/services/auth.service";
import { isApiError } from "@/types/api/main/common";
import type { RegisterRequest } from "@/types/api/main/auth";
import FormError from "./FormError";

export default function RegisterForm() {
  const router = useRouter();
  const [form] = Form.useForm<RegisterRequest>();
  const values = Form.useWatch([], form);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // No client-side rule messages: REQ-001 has no copy for them (see TASK-006 §Questions).
  // The button stays disabled until every field has something; the BE validates the rest.
  const canSubmit =
    !!values?.displayName?.trim() && !!values?.email?.trim() && !!values?.password;

  const onFinish = async (body: RegisterRequest) => {
    setError(null);
    setSubmitting(true);
    try {
      const payload = { ...body, displayName: body.displayName.trim(), email: body.email.trim() };
      await register(payload); // endpoint 2 — 201 { token, user }
      // Establish the NextAuth session with the same credentials (endpoint 3 via authorize()).
      const res = await signIn("credentials", {
        redirect: false,
        email: payload.email,
        password: payload.password,
      });
      if (res?.error) {
        setError(ERROR_TH.GENERIC);
        return;
      }
      router.push("/");
      router.refresh();
    } catch (e) {
      // AC-26: the code EMAIL_TAKEN → Porter's Thai; the English `message` is never shown.
      setError(isApiError(e) && e.code === "EMAIL_TAKEN" ? ERROR_TH.EMAIL_TAKEN : ERROR_TH.GENERIC);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form<RegisterRequest>
      form={form}
      layout="vertical"
      size="large"
      requiredMark={false}
      onFinish={onFinish}
      autoComplete="on"
    >
      <Form.Item name="displayName" label={AUTH_TH.DISPLAY_NAME}>
        <Input autoComplete="nickname" maxLength={50} autoFocus />
      </Form.Item>
      <Form.Item name="email" label={AUTH_TH.EMAIL}>
        <Input inputMode="email" autoComplete="email" />
      </Form.Item>
      <Form.Item name="password" label={AUTH_TH.PASSWORD}>
        <Input.Password autoComplete="new-password" maxLength={72} />
      </Form.Item>

      <FormError message={error} />

      <Button
        type="primary"
        htmlType="submit"
        block
        size="large"
        loading={submitting}
        disabled={!canSubmit}
        className="mt-1"
      >
        {AUTH_TH.REGISTER}
      </Button>

      <p className="mt-6 text-center text-[14px] text-muted">
        <Link href="/login" className="font-medium text-primary hover:underline">
          {AUTH_TH.HAVE_ACCOUNT_LOGIN}
        </Link>
      </p>
    </Form>
  );
}
