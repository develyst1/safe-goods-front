import Link from "next/link";
import { SITE_NAME } from "@/constant/text/th";

interface WordmarkProps {
  /** "ink" on white surfaces, "light" on the cobalt panel */
  tone?: "ink" | "light";
  size?: "md" | "lg";
  href?: string;
}

/** The เว็บกลาง mark: a held-coin glyph + the site name. Name only — never "safe-goods". */
export default function Wordmark({ tone = "ink", size = "md", href = "/" }: WordmarkProps) {
  const color = tone === "light" ? "text-white" : "text-ink";
  const glyph = tone === "light" ? "bg-white/15 text-white" : "bg-primary text-on-primary";
  const text = size === "lg" ? "text-2xl" : "text-lg";
  const box = size === "lg" ? "size-9" : "size-7";

  return (
    <Link href={href} className={`inline-flex items-center gap-2.5 ${color} no-underline`}>
      <span className={`${box} ${glyph} inline-grid place-items-center rounded-[10px]`} aria-hidden>
        <svg viewBox="0 0 24 24" className="size-[62%]" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 9.5 12 6l7 3.5v5c0 3.2-3 5.3-7 6.5-4-1.2-7-3.3-7-6.5v-5Z" />
          <circle cx="12" cy="13" r="2.4" />
        </svg>
      </span>
      <span className={`${text} font-semibold tracking-[-0.01em] leading-none`}>{SITE_NAME}</span>
    </Link>
  );
}
