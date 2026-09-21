import { GUIDANCE_TH } from "@/constant/text/th";

/**
 * REQ-001 §5 / AC-23: both blocks, verbatim, always, for both roles. The string is
 * rendered character-for-character; only the leading "คำแนะนำสำหรับ…" segment is bolded.
 */
function Guidance({ text, tone }: { text: string; tone: "buyer" | "seller" }) {
  const cut = text.indexOf(" — ");
  const head = cut === -1 ? "" : text.slice(0, cut);
  const rest = cut === -1 ? text : text.slice(cut);
  const bg = tone === "buyer" ? "bg-primary-soft/70" : "bg-surface";
  return (
    <p className={`rounded-[var(--radius-lg)] ${bg} px-5 py-4 text-[14px] leading-relaxed text-ink [text-wrap:pretty]`}>
      {head && <strong className="font-semibold">{head}</strong>}
      {rest}
    </p>
  );
}

export default function GuidanceBlocks() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Guidance text={GUIDANCE_TH.BUYER} tone="buyer" />
      <Guidance text={GUIDANCE_TH.SELLER} tone="seller" />
    </div>
  );
}
