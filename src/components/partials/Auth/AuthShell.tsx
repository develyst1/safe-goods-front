import Wordmark from "@/components/common/Wordmark";
import EscrowMotif from "./EscrowMotif";

interface AuthShellProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Register / login frame. Desktop: a cobalt brand panel (the one "committed" surface
 * in the product) beside a white form column. Phone: wordmark on top, form below.
 * No copy beyond REQ-001 — the panel speaks through the escrow motif, not words.
 */
export default function AuthShell({ title, children }: AuthShellProps) {
  return (
    <main className="min-h-dvh grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-primary-deep px-12 py-10 text-white">
        <Wordmark tone="light" size="lg" />
        <EscrowMotif className="w-full max-w-md self-center" />
        <div className="h-9" aria-hidden />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -bottom-40 size-[28rem] rounded-full opacity-40"
          style={{ background: "radial-gradient(closest-side, oklch(0.5 0.16 262), transparent 70%)" }}
        />
      </aside>

      <section className="flex flex-col px-4 py-6 sm:px-10 sm:py-10">
        <div className="lg:hidden">
          <Wordmark />
        </div>
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="rise-in w-full max-w-[26rem]">
            <h1 className="mb-7 text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] text-ink">
              {title}
            </h1>
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
