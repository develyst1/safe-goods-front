"use client";

import { CircleAlert } from "lucide-react";

interface FormErrorProps {
  message: string | null;
}

/** Inline, above the submit button. Announced to screen readers; no side-stripe, no card. */
export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rise-in mb-4 flex items-start gap-2 rounded-[10px] bg-error-soft px-3.5 py-2.5 text-[14px] leading-snug text-error"
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </p>
  );
}
