interface EscrowMotifProps {
  className?: string;
}

/**
 * Decorative, wordless: buyer (left) → held money at the centre shield → seller (right),
 * goods coming back the other way. Draws the product in one glance; no text, so nothing
 * here can drift from REQ-001 copy.
 */
export default function EscrowMotif({ className }: EscrowMotifProps) {
  return (
    <svg
      viewBox="0 0 400 260"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* dotted flow lines */}
      <g opacity={0.45} strokeDasharray="2 7">
        <path d="M90 120 C 130 80, 170 80, 200 100" />
        <path d="M310 120 C 270 80, 230 80, 200 100" />
        <path d="M200 160 C 170 180, 130 180, 90 140" />
        <path d="M200 160 C 230 180, 270 180, 310 140" />
      </g>

      {/* buyer */}
      <g transform="translate(60 130)">
        <circle r="26" opacity={0.25} />
        <circle cx="0" cy="-5" r="7" />
        <path d="M-12 12 c0 -9 24 -9 24 0" />
      </g>

      {/* seller */}
      <g transform="translate(340 130)">
        <circle r="26" opacity={0.25} />
        <path d="M-10 -8 h20 l3 6 v14 h-26 v-14 z" />
        <path d="M-7 -8 c0 -6 14 -6 14 0" />
      </g>

      {/* centre shield with a held coin */}
      <g transform="translate(200 130)">
        <path
          d="M-40 -34 L0 -50 L40 -34 v34 c0 26 -18 42 -40 52 c-22 -10 -40 -26 -40 -52 z"
          fill="oklch(1 0 0 / 0.08)"
          strokeWidth={2.4}
        />
        <circle r="13" cy="2" strokeWidth={2.4} />
        <circle r="5" cy="2" strokeWidth={2.4} />
      </g>

      {/* travelling coin + parcel on the lines */}
      <circle cx="148" cy="86" r="5" fill="currentColor" stroke="none" opacity={0.9} />
      <rect x="246" y="163" width="12" height="12" rx="2" fill="currentColor" stroke="none" opacity={0.9} />
    </svg>
  );
}
