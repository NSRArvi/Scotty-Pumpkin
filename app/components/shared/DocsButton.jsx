import Link from "next/link";

/**
 * Small pill button that links to a page's documentation.
 *
 * Usage on any page's header:
 *   import DocsButton from "@/app/components/shared/DocsButton";
 *   <DocsButton href="/docs/<slug>" />
 *
 * `href` should point at that page's own doc route under /docs/<slug>,
 * matching the slug used in docs/registry.js.
 */
export default function DocsButton({ href = "/docs" }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/5 text-orange-500 text-[11px] font-semibold tracking-wide hover:bg-orange-500/10 hover:border-orange-500/50 transition-colors shrink-0"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Docs
    </Link>
  );
}
