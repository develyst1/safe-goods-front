"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "antd";
import { Check, Copy } from "lucide-react";
import { ROOM_TH, SHARE_TH } from "@/constant/text/th";
import { roomShareUrl } from "@/services/room.service";

interface ShareBlockProps {
  code: string;
}

/**
 * Shown while a room waits for its second party (TASK-008 mounts it):
 * ส่งลิงก์นี้ให้อีกฝ่ายเข้าห้อง · the code in large type · the full URL + copy.
 * Copy control: icon + คัดลอกลิงก์ → คัดลอกแล้ว for 2 s after a successful copy (R-4).
 */
export default function ShareBlock({ code }: ShareBlockProps) {
  // window.origin only exists on the client; the server renders the path so hydration matches.
  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
  const url = origin ? roomShareUrl(code) : `/room/${code}`;
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      return;
    } catch {
      /* async clipboard blocked — fall back to a selection copy */
    }
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.select();
    if (document.execCommand("copy")) setCopied(true);
  };

  return (
    <section
      aria-label={ROOM_TH.SHARE}
      className="rounded-[var(--radius-lg)] border border-primary/25 bg-primary-soft/60 px-5 py-5 sm:px-6"
    >
      <p className="text-[14px] font-medium text-primary">{ROOM_TH.SHARE}</p>
      <p className="mt-2 font-semibold tabular-nums tracking-[0.18em] text-ink text-[2rem] sm:text-[2.4rem]">
        {code}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <input
          ref={inputRef}
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          className="h-11 min-w-0 flex-1 rounded-[10px] border border-line-strong bg-bg px-3.5 text-[14px] text-ink outline-none focus-visible:ring-[3px] focus-visible:ring-primary/25"
        />
        <Button
          type={copied ? "default" : "primary"}
          aria-label={copied ? SHARE_TH.COPIED : SHARE_TH.COPY_LINK}
          aria-live="polite"
          className="h-11! shrink-0"
          icon={copied ? <Check className="size-[18px]" aria-hidden /> : <Copy className="size-[18px]" aria-hidden />}
          onClick={copy}
        >
          {copied ? SHARE_TH.COPIED : SHARE_TH.COPY_LINK}
        </Button>
      </div>
    </section>
  );
}
