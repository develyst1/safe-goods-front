"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button, Form, Input } from "antd";
import { AUTH_TH, FORM_TH } from "@/constant/text/th";
import type { LoginRequest } from "@/types/api/main/auth";
import { FormError } from "@/components/common";

/** Only same-origin paths may be a callback (AC-8 sends `/room/{code}`); anything else → "/". */
const safeCallback = (raw: string | null) =>
  raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : "/";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallback(searchParams.get("callbackUrl"));
  const [form] = Form.useForm<LoginRequest>();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);


  const onFinish = async (body: LoginRequest) => {
    setError(null);
    setSubmitting(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: body.email.trim(),
      password: body.password,
    });
    setSubmitting(false);
    if (!res || res.error) {
      setError(AUTH_TH.LOGIN_FAILED); // 401 UNAUTHENTICATED from endpoint 3
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <Form<LoginRequest>
      form={form}
      layout="vertical"
      size="large"
      requiredMark={false}
      onFinish={onFinish}
      autoComplete="on"
      validateTrigger={["onBlur", "onSubmit"]}
    >
      <Form.Item
        name="email"
        label={AUTH_TH.EMAIL}
        rules={[
          { required: true, whitespace: true, message: FORM_TH.REQUIRED },
          { type: "email", message: FORM_TH.EMAIL_INVALID },
        ]}
      >
        <Input inputMode="email" autoComplete="email" autoFocus />
      </Form.Item>
      <Form.Item name="password" label={AUTH_TH.PASSWORD} rules={[{ required: true, message: FORM_TH.REQUIRED }]}>
        <Input.Password autoComplete="current-password" />
      </Form.Item>

      <FormError message={error} />

      <Button
        type="primary"
        htmlType="submit"
        block
        size="large"
        loading={submitting}
        className="mt-1"
      >
        {AUTH_TH.LOGIN}
      </Button>

      <p className="mt-6 text-center text-[14px] text-muted">
        <Link href="/register" className="font-medium text-primary hover:underline">
          {AUTH_TH.NO_ACCOUNT_REGISTER}
        </Link>
      </p>
    </Form>
  );
}
