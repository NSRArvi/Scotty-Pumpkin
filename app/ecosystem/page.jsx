import Link from "next/link";

export default function page() {
  return (
    <section className="relative z-10 px-4 py-12 md:py-16 lg:py-24 lg:px-16">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="sp-hero-card rounded-2xl p-8 md:p-10 text-center space-y-4">
          <p className="text-purple-300/70 text-xs font-bold uppercase tracking-widest">Scotty Pumpkin Ecosystem</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black sp-shimmer-heading">Ecosystem Overview</h1>
          <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Explore the two core ecosystem documents: the SPUMP economic engine and the real utility ecosystem model.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Link
            href="/ecosystem/spump-economic-engine"
            className="ui-card ui-card-hover rounded-2xl p-6 space-y-3"
          >
            <p className="text-amber-300 text-xs font-bold uppercase tracking-widest">Section 1</p>
            <h2 className="text-2xl font-black text-white">SPUMP Economic Engine</h2>
            <p className="text-white/65 text-sm leading-relaxed">
              Revenue flow structure, allocation model, and sustainability framework.
            </p>
            <span className="inline-flex items-center gap-2 text-purple-300 font-semibold text-sm">Open page <span>→</span></span>
          </Link>

          <Link
            href="/ecosystem/a-real-utility-ecosystem"
            className="ui-card ui-card-hover rounded-2xl p-6 space-y-3"
          >
            <p className="text-amber-300 text-xs font-bold uppercase tracking-widest">Section 2</p>
            <h2 className="text-2xl font-black text-white">A Real Utility Ecosystem</h2>
            <p className="text-white/65 text-sm leading-relaxed">
              Practical creator, marketplace, and payment utility across the ecosystem.
            </p>
            <span className="inline-flex items-center gap-2 text-purple-300 font-semibold text-sm">Open page <span>→</span></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
