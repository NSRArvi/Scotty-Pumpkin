"use client";

import Container from "@/app/components/shared/Container";
import Link from "next/link";

const CORE_NODES = [
  {
    id: "creator",
    pos: "top",
    icon: "🚀",
    title: "Creator Economy",
    sub: "Content · Media · Memberships",
    items: [],
    accent: "rgba(168,85,247,0.8)",
    border: "rgba(168,85,247,0.4)",
    bg: "rgba(168,85,247,0.08)",
  },
  {
    id: "marketplace",
    pos: "left-top",
    icon: "🛍️",
    title: "SPUMP Marketplace",
    sub: "Physical Goods · Digital Goods · Services · Creator Products",
    items: ["Physical Goods", "Digital Goods", "Services", "Creator Products"],
    accent: "rgba(99,102,241,0.8)",
    border: "rgba(99,102,241,0.4)",
    bg: "rgba(99,102,241,0.08)",
  },
  {
    id: "payments1",
    pos: "right-top",
    icon: "💳",
    title: "Payments Layer",
    sub: "",
    items: ["SPUMP", "USFF", "Crypto", "Fiat"],
    accent: "rgba(245,158,11,0.8)",
    border: "rgba(245,158,11,0.4)",
    bg: "rgba(245,158,11,0.07)",
    checks: true,
  },
  {
    id: "shop",
    pos: "left-bottom",
    icon: "🏪",
    title: "Shop Creator",
    sub: "Build Shops",
    items: ["Build shops", "Sell online", "Manage products and services"],
    accent: "rgba(59,130,246,0.8)",
    border: "rgba(59,130,246,0.4)",
    bg: "rgba(59,130,246,0.07)",
  },
  {
    id: "payments2",
    pos: "right-bottom",
    icon: "💰",
    title: "Payments Layer",
    sub: "Central distribution layer",
    items: ["SPUMP", "USFF", "Other cryptocurrency", "Fiat"],
    accent: "rgba(236,72,153,0.8)",
    border: "rgba(236,72,153,0.4)",
    bg: "rgba(236,72,153,0.07)",
  },
];

const WHAT_YOU_CAN = [
  {
    icon: "⭐",
    title: "Sell Products",
    desc: "Create and sell physical goods, fashion, accessories, and digital downloadables.",
  },
  {
    icon: "🎨",
    title: "Sell Services",
    desc: "Offer creative, technical, commercial, and stability services to platform users.",
  },
  {
    icon: "🎃",
    title: "Monetize Content",
    desc: "Sell premium content, memberships, media access, and digital experiences.",
  },
  {
    icon: "💎",
    title: "Real Utility",
    desc: "SPUMP is designed for platform commerce and participation — not speculation.",
  },
];

const FLOW_BENEFITS = [
  { icon: "⚡", title: "Lower Fees", desc: "Reduced platform costs" },
  {
    icon: "🏦",
    title: "Capital Stability",
    desc: "Supports long-term sustainability through structured capital preservation.",
  },
  {
    icon: "🛡️",
    title: "Platform Reserves",
    desc: "Maintains operational continuity and ecosystem resilience.",
  },
  {
    icon: "⚙️",
    title: "Infrastructure & Security",
    desc: "Covers hosting, systems, Bints security, and platform operations.",
  },
  {
    icon: "🌟",
    title: "Community Growth",
    desc: "Supports creators, onboarding, and ecosystem adoption.",
  },
  {
    icon: "🚀",
    title: "Ecosystem Expansion",
    desc: "Drives partnerships, integrations and future platform growth.",
  },
];

const FLOW_NODES = [
  {
    id: "creator2",
    icon: "🚀",
    title: "Creator Economy",
    sub: "Content · Media · Memberships",
    accent: "rgba(168,85,247,0.8)",
    border: "rgba(168,85,247,0.4)",
    bg: "rgba(168,85,247,0.08)",
  },
  {
    id: "marketplace2",
    icon: "🛍️",
    title: "SPUMP Marketplace",
    sub: "Physical Goods · Digital Goods · Services · Creator Products",
    items: ["Physical Goods", "Digital Goods", "Services", "Creator Products"],
    accent: "rgba(99,102,241,0.8)",
    border: "rgba(99,102,241,0.4)",
    bg: "rgba(99,102,241,0.08)",
  },
  {
    id: "payments3",
    icon: "💳",
    title: "Payments Layer",
    sub: "SPUMP · USEF · Crypto · Flat",
    items: ["SPUMP", "USEF", "Crypto", "Flat"],
    checks: true,
    accent: "rgba(245,158,11,0.8)",
    border: "rgba(245,158,11,0.4)",
    bg: "rgba(245,158,11,0.07)",
  },
  {
    id: "shop2",
    icon: "🏪",
    title: "Shop Creator",
    sub: "Build Shops",
    items: ["Sell online"],
    accent: "rgba(59,130,246,0.8)",
    border: "rgba(59,130,246,0.4)",
    bg: "rgba(59,130,246,0.07)",
  },
  {
    id: "payments4",
    icon: "💰",
    title: "Payments Layer",
    sub: "Central distribution layer",
    accent: "rgba(236,72,153,0.8)",
    border: "rgba(236,72,153,0.4)",
    bg: "rgba(236,72,153,0.07)",
  },
];

function NodeCard({ node, size = "md" }) {
  const p = size === "sm" ? "p-3" : "p-4";
  return (
    <div
      className={`rounded-xl ${p} space-y-2 backdrop-blur-ca`}
      style={{
        background: node.bg,
        border: `1px solid ${node.border}`,
        backdropFilter: "blur(16px)",
      }}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{node.icon}</span>
        <div>
          <p className="font-black text-secondary text-sm leading-tight">
            {node.title}
          </p>
          {node.sub && (
            <p className="text-secondary/80 text-xs leading-tight">
              {node.sub}
            </p>
          )}
        </div>
      </div>
      {node.items && node.items.length > 0 && (
        <div className="space-y-0.5 pl-1">
          {node.items.map((item) => (
            <p
              key={item}
              className="text-secondary/70 text-xs flex items-center gap-1.5">
              {node.checks ? (
                <span style={{ color: node.accent }}>✓</span>
              ) : (
                <span style={{ color: node.accent }}>•</span>
              )}
              {item}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ARealUtilityEcosystemPage() {
  return (
    <div className="relative z-10 py-12 md:py-16 bg-primary-bg">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes sp-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sp-float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-8px); } }
        @keyframes sp-orbit-spin-rev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
        @keyframes sp-glow-pulse { 0%, 100% { box-shadow: 0 0 30px rgba(245,158,11,0.3), 0 0 60px rgba(168,85,247,0.15); } 50% { box-shadow: 0 0 60px rgba(245,158,11,0.6), 0 0 100px rgba(168,85,247,0.3); } }
        @keyframes sp-arrow-flow { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }
        @keyframes sp-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
      `,
        }}
      />

      <Container>
        <div className="space-y-20">
          {/* ── Section 1: Hero intro ── */}
          <div
            className="bg-white/80 backdrop-blur-2xl border border-indigo-500/24 rounded-2xl p-5 text-center space-y-6"
            style={{ animation: "sp-fade-up 0.4s ease both" }}>
            <div className="eco-hero-kicker mx-auto inline-flex items-center gap-2 edit-padding border border-amber-500/35 rounded-full bg-amber-500/12 px-3 py-1.5 text-amber-400 text-[0.72rem] font-bold tracking-wider uppercase">
              <span>🎃</span>
              <span className="text-primary">Scotty Pumpkin Ecosystem</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 mt-2.5">
              <span className="text-xl md:text-4xl">🌐</span>
              <h2 className="text-primary text-xl md:text-4xl font-black leading-tight bg-linear-to-r from-orange-500/60 via-orange-500 to-orange-500/60 bg-size-[200%_auto] bg-clip-text ">
                A Real Utility Ecosystem
              </h2>
            </div>
            <p className="text-secondary/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              SPUMP powers a complete ecosystem where users can create shops,
              sell products and services, monetize content, and accept crypto or
              fiat payments through one connected digital economy.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/buy"
                className="ui-btn ui-btn-primary rounded-xl px-7 py-3 font-bold text-sm text-white cursor-pointer transition-all duration-200 ease-out hover:scale-104"
                style={{
                  backgroundColor: "rgba(241, 112, 5, 0.8)",
                  borderColor: "rgba(241, 112, 5, 0.5)",
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}>
                Buy SPUMP
              </Link>
              <Link
                href="https://sosay.org/spump-market"
                className="ui-btn ui-btn-secondary rounded-xl px-7 py-3 font-bold text-sm text-white cursor-pointer transition-all duration-200 ease-out bg-secondary/90 border border-white/15 hover:bg-transparent hover:border-secondary/90 hover:text-secondary/90 hover:scale-104">
                Explore Marketplace
              </Link>
              <Link
                href="https://bfinit.com/bfinit-ecomerce-platform"
                className="ui-btn ui-btn-success rounded-xl px-7 py-3 font-bold text-sm text-white cursor-pointer transition-all duration-200 ease-out bg-linear-to-br from-green-700 to-green-800 border border-green-400/30 hover:from-green-600 hover:to-green-700 hover:scale-104">
                Create Your Shop
              </Link>
            </div>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

          {/* ── Section 2: Real Utility Ecosystem ── */}
          <div
            className="space-y-10"
            style={{ animation: "sp-fade-up 0.4s ease 0.1s both" }}>
            <div className="text-center space-y-3">
              <h2
                className="text-3xl md:text-4xl font-black bg-linear-to-r from-orange-500/60 via-orange-500 to-orange-500/60 bg-size-[200%_auto] bg-clip-text text-transparent"
                style={{ animation: "sp-shimmer 5s linear infinite" }}>
                A Real Utility Ecosystem
              </h2>
              <p className="text-primary font-semibold text-base">
                SPUMP is not limited to NFTs.
              </p>
              <p className="text-secondary/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                It is the utility currency of a broader commerce ecosystem
                connecting online shops, marketplace sales, creator
                monetization, digital products, physical goods, services, and
                hybrid payment systems.
              </p>
            </div>

            {/* Ecosystem diagram */}
            <div className="bg-white/80 backdrop-blur-2xl border border-white/9 rounded-2xl p-6 md:p-10">
              <div className="relative">
                {/* Top and bottom satellite nodes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Left column */}
                  <div className="space-y-4">
                    <NodeCard node={CORE_NODES[1]} />
                    <NodeCard node={CORE_NODES[3]} />
                  </div>

                  {/* Center — SPUMP Core */}
                  <div className="flex flex-col items-center gap-6">
                    {/* Top node */}
                    <NodeCard node={CORE_NODES[0]} size="sm" />

                    {/* Core ring */}
                    <div
                      className="w-42.5 h-42.5 rounded-full border-2 border-amber-500/50 flex items-center justify-center relative mx-auto"
                      style={{
                        animation: "sp-glow-pulse 3s ease-in-out infinite",
                      }}>
                      <div
                        className="w-32.5 h-32.5 rounded-full border border-dashed border-purple-500/40 flex items-center justify-center bg-linear-to-br from-amber-500/12 to-purple-500/8"
                        style={{
                          animation: "sp-orbit-spin-rev 20s linear infinite",
                        }}
                      />
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span
                          className="text-4xl"
                          style={{
                            animation: "sp-float 3s ease-in-out infinite",
                          }}>
                          💰
                        </span>
                        <p className="text-primary font-black text-lg leading-tight mt-1">
                          SPUMP
                        </p>
                        <p className="text-primary font-bold text-sm">Core</p>
                        <p className="text-secondary/80 text-[10px]">
                          Ecosystem Core
                        </p>
                      </div>
                    </div>

                    {/* Bottom node */}
                    <NodeCard node={CORE_NODES[4]} size="sm" />
                  </div>

                  {/* Right column */}
                  <div className="space-y-4">
                    <NodeCard node={CORE_NODES[2]} />
                    {/* Empty spacer to match left column height */}
                    <div className="rounded-xl p-4 opacity-0 pointer-events-none border border-transparent">
                      <p className="text-sm">placeholder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

          {/* ── Section 3: What You Can Do ── */}
          <div
            className="space-y-8"
            style={{ animation: "sp-fade-up 0.4s ease 0.15s both" }}>
            <div className="text-center">
              <h2
                className="text-3xl md:text-4xl font-black bg-linear-to-r from-orange-500/60 via-orange-500 to-orange-500/60 bg-size-[200%_auto] bg-clip-text text-transparent"
                style={{ animation: "sp-shimmer 5s linear infinite" }}>
                What You Can Do With SPUMP
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {WHAT_YOU_CAN.map((item, i) => (
                <div
                  key={i}
                  className="bg-white/80 border border-white/8 backdrop-blur-md rounded-2xl p-5 transition-all duration-250 ease-out hover:border-purple-500/35 hover:bg-orange-500/5 hover:-translate-y-0.5"
                  style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="font-black text-secondary text-sm">
                      {item.title}
                    </p>
                  </div>
                  <p className="text-secondary/80 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

          {/* ── Section 4: How Ecosystem Value Flows ── */}
          <div
            className="space-y-8"
            style={{ animation: "sp-fade-up 0.4s ease 0.2s both" }}>
            <div className="text-center">
              <h2
                className="text-3xl md:text-4xl font-black bg-linear-to-r from-orange-500/60 via-orange-500 to-orange-500/60 bg-size-[200%_auto] bg-clip-text text-transparent"
                style={{ animation: "sp-shimmer 5s linear infinite" }}>
                How Ecosystem Value Flows
              </h2>
            </div>

            {/* Discount highlight */}
            <div className="bg-white/80 border border-amber-500/25 backdrop-blur-2xl rounded-2xl px-7 py-6 flex flex-col md:flex-row items-center gap-5">
              <div className="shrink-0 flex flex-col items-center gap-1">
                <span
                  className="text-4xl"
                  style={{ animation: "sp-float 3s ease-in-out infinite" }}>
                  ⚡
                </span>
                <p className="text-secondary/80 text-xs font-bold text-center">
                  Lower Fees
                </p>
                <p className="text-secondary/70 text-xs text-center">
                  Reduced platform costs
                </p>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-2xl text-secondary/80 font-black">
                  Up to{" "}
                  <span
                    className="bg-linear-to-r from-amber-500 via-amber-300 to-amber-600 bg-size-[200%_auto] bg-clip-text text-transparent"
                    style={{ animation: "sp-shimmer 4s linear infinite" }}>
                    30% Discount
                  </span>
                </p>
                <p className="text-secondary/75 text-sm leading-relaxed">
                  Users paying with SPUMP or USFF may receive up to 30% discount
                  on service platform services, subscriptions, marketplace sizes
                  and eligible products or services.
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

          {/* ── Section 5: From First Sales to Ecosystem Growth ── */}
          <div
            className="space-y-10"
            style={{ animation: "sp-fade-up 0.4s ease 0.25s both" }}>
            <div className="text-center space-y-3">
              <h2
                className="text-3xl md:text-4xl font-black bg-linear-to-r from-orange-500/60 via-orange-500 to-orange-500/60 bg-size-[200%_auto] bg-clip-text text-transparent"
                style={{ animation: "sp-shimmer 5s linear infinite" }}>
                From First Sales to Ecosystem Growth
              </h2>
              <p className="text-secondary/80 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Every transaction contributes to the expansion, stability, and
                operation of the SPUMP ecosystem.
              </p>
            </div>

            {/* Flow diagram */}
            <div className="bg-white/80 backdrop-blur-2xl border border-white/9 rounded-2xl p-6 md:p-10 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Left */}
                <div className="space-y-4">
                  <NodeCard node={FLOW_NODES[1]} />
                  <NodeCard node={FLOW_NODES[3]} />
                </div>

                {/* Center */}
                <div className="flex flex-col items-center gap-6">
                  <NodeCard node={FLOW_NODES[0]} size="sm" />

                  {/* Core ring */}
                  <div
                    className="w-42.5 h-42.5 rounded-full border-2 border-amber-500/50 flex items-center justify-center relative mx-auto"
                    style={{
                      animation: "sp-glow-pulse 3s ease-in-out infinite",
                    }}>
                    <div
                      className="w-32.5 h-32.5 rounded-full border border-dashed border-purple-500/40 flex items-center justify-center bg-linear-to-br from-amber-500/12 to-purple-500/8"
                      style={{
                        animation: "sp-orbit-spin-rev 20s linear infinite",
                      }}
                    />
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span
                        className="text-4xl"
                        style={{
                          animation: "sp-float 3s ease-in-out infinite",
                        }}>
                        💰
                      </span>
                      <p className="text-primary font-black text-lg leading-tight mt-1">
                        SPUMP
                      </p>
                      <p className="text-primary font-bold text-sm">Core</p>
                      <p className="text-secondary/70 text-xs">
                        Ecosystem Core
                      </p>
                    </div>
                  </div>

                  {/* Flow arrows down */}
                  <div className="flex items-center justify-center gap-3">
                    {[
                      "rgba(74,222,128,0.8)",
                      "rgba(245,158,11,0.8)",
                      "rgba(168,85,247,0.8)",
                    ].map((c, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div
                          className="w-0.5 h-6 rounded-full"
                          style={{
                            background: c,
                            animation: "sp-arrow-flow 2s ease-in-out infinite",
                            animationDelay: `${i * 0.3}s`,
                          }}
                        />
                        <div
                          style={{
                            color: c,
                            fontSize: "0.7rem",
                            animation: "sp-arrow-flow 2s ease-in-out infinite",
                          }}>
                          ▼
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right */}
                <div className="space-y-4">
                  <NodeCard node={FLOW_NODES[2]} />
                  <NodeCard node={FLOW_NODES[4]} />
                </div>
              </div>

              {/* Pool at bottom */}
              <div className="bg-purple-500/7 border border-purple-500/30 backdrop-blur-2xl rounded-xl px-6 py-4.5 flex items-center justify-center gap-3 mt-4 text-center">
                <span className="text-3xl">💸</span>
                <div>
                  <p className="text-secondary font-black text-base">
                    SPUMP Ecosystem Pool
                  </p>
                  <p className="text-secondary/80 text-xs">
                    Central Distribution Layer
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

          {/* ── Section 6: Built-In Benefits ── */}
          <div
            className="space-y-8"
            style={{ animation: "sp-fade-up 0.4s ease 0.3s both" }}>
            <div className="text-center">
              <h2
                className="text-3xl md:text-4xl font-black bg-linear-to-r from-orange-500/60 via-orange-500 to-orange-500/60 bg-size-[200%_auto] bg-clip-text text-transparent"
                style={{ animation: "sp-shimmer 5s linear infinite" }}>
                Built-In Benefits
              </h2>
            </div>

            <div className="bg-white/80 backdrop-blur-2xl border border-white/9 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {FLOW_BENEFITS.slice(1).map((b, i) => (
                  <div
                    key={i}
                    className="bg-white/4 border border-white/8 backdrop-blur-md rounded-xl p-4 transition-all duration-250 ease-out hover:border-amber-500/35 hover:bg-amber-500/5 hover:-translate-y-0.5">
                    <span className="text-2xl mb-2 block">{b.icon}</span>
                    <p className="text-secondary font-black text-sm mb-1">
                      {b.title}
                    </p>
                    <p className="text-secondary/80 text-xs leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-px bg-linear-to-r from-transparent via-amber-500/40 to-transparent" />

              <p className="text-center text-secondary/80 text-xs leading-relaxed">
                Funds are used exclusively for ecosystem operation, development,
                and growth.
                <br />
                SPUMP does not represent ownership, dividends, or financial
                entitlement.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
