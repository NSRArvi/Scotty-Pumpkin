import Link from "next/link";
import Container from "../shared/Container";

/**
 * Shared frame for every page under /docs/<slug>. Handles the
 * background, eyebrow, title/subtitle, and the footer back-links —
 * so a new doc page only has to write its own <DocSection> content.
 */
export default function DocLayout({
  eyebrow = "Scotty Pumpkin Ecosystem",
  title,
  accent, // optional second part of the title, shown in the orange gradient
  kicker, // optional small label under the title, e.g. "User Guide"
  subtitle,
  backHref,
  backLabel,
  children,
}) {
  return (
    <div className="min-h-screen bg-[#F3EFE6] text-black">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-3xl" />
      </div>
      <div className="relative">
        <Container>
          <div className="pt-16 pb-24 max-w-3xl mx-auto">

            <div className="flex items-center gap-2 mb-4">
              <span className="h-px flex-1 max-w-[40px] bg-orange-500/40" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-500">
                {eyebrow}
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-4">
              {title}
              {accent && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600"> {accent}</span>
              )}
            </h1>
            {kicker && (
              <p className="text-black/40 text-sm font-semibold uppercase tracking-wide mb-6">{kicker}</p>
            )}
            {subtitle && (
              <p className="text-black/50 text-base font-light leading-relaxed mb-10">{subtitle}</p>
            )}

            {children}

            <div className="flex flex-wrap gap-3 mt-4">
              {backHref && (
                <Link
                  href={backHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/20"
                >
                  ← Back to {backLabel}
                </Link>
              )}
              {/* <Link
                href="/docs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-black/15 text-black/60 text-xs font-semibold hover:bg-black/5 hover:text-black transition-colors"
              >
                All Docs
              </Link> */}
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}

export function DocSection({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      {children}
    </div>
  );
}

export function DocStepBlock({ number, title, children }) {
  return (
    <div className="px-4 py-3.5 rounded-xl border border-black/8 bg-white mb-3">
      <p className="text-[10px] uppercase tracking-wider text-orange-500 font-bold mb-1">
        Step {number}
      </p>
      <p className="font-semibold mb-1">{title}</p>
      <div className="text-black/60 text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function DocNote({ tone = "info", children }) {
  const tones = {
    info: "bg-orange-500/10 border-orange-500/20 text-orange-600",
    warning: "bg-red-500/10 border-red-500/20 text-red-600",
  };
  return (
    <div className={`px-4 py-3.5 rounded-xl border text-sm ${tones[tone]}`}>
      {children}
    </div>
  );
}
