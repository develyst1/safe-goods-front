"use client";

import dayjs from "dayjs";
import "dayjs/locale/th";
import { EVENT_TH } from "@/constant/text/th";
import type { RoomEvent } from "@/types/api/main/room";

dayjs.locale("th");

interface TimelineProps {
  events: RoomEvent[];
}

/** REQ-001 §13 — who did what and when, ascending. SYSTEM rows have no actor name. */
export default function Timeline({ events }: TimelineProps) {
  if (events.length === 0) return null;
  return (
    <ol className="relative ml-1.5 border-l border-line pl-5">
      {events.map((ev) => (
        <li key={ev.id} className="relative pb-5 last:pb-0">
          <span
            aria-hidden
            className={`absolute -left-[25px] top-1.5 size-2.5 rounded-full ring-4 ring-bg ${
              ev.actorRole === "SYSTEM" ? "bg-accent" : "bg-primary"
            }`}
          />
          <p className="text-[15px] leading-snug text-ink">
            {ev.actorDisplayName && <span className="font-semibold">{ev.actorDisplayName} </span>}
            <span>{EVENT_TH[ev.type] ?? ev.type}</span>
          </p>
          {ev.note && <p className="mt-0.5 text-[14px] text-ink/80">{ev.note}</p>}
          <time dateTime={ev.createdAt} className="mt-0.5 block text-[12.5px] tabular-nums text-muted">
            {dayjs(ev.createdAt).format("D MMM YYYY HH:mm")}
          </time>
        </li>
      ))}
    </ol>
  );
}
