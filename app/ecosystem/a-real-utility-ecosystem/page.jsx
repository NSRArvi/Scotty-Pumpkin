"use client";

import Container from "@/app/components/shared/Container";
import Link from "next/link";

const CORE_NODES = [
  {
    id: "creator",
    icon: "🚀",
    title: "Creator Economy",
    sub: "Content · Media · Memberships",
    items: [],
    accent: "text-purple-500",
    border: "border-purple-400/40",
    bg: "bg-purple-500/8",
  },
  {
    id: "marketplace",
    icon: "🛍️",
    title: "SPUMP Marketplace",
    sub: "Physical Goods · Digital Goods · Services · Creator Products",
    items: ["Physical Goods", "Digital Goods", "Services", "Creator Products"],
    accent: "text-indigo-500",
    border: "border-indigo-400/40",
    bg: "bg-indigo-500/8",
    dot: "bg-indigo-500",
  },
  {
    id: "payments1",
    icon: "💳",
    title: "Payments Layer",
    sub: "",
    items: ["SPUMP", "USFF", "Crypto", "Fiat"],
    accent: "text-amber-500",
    border: "border-amber-400/40",
    bg: "bg-amber-500/7",
    check: true,
  },
  {
    id: "shop",
    icon: "🏪",
    title: "Shop Creator",
    sub: "Build Shops",
    items: ["Build shops", "Sell online", "Manage products and services"],
    accent: "text-blue-500",
    border: "border-blue-400/40",
    bg: "bg-blue-500/7",
    dot: "bg-blue-500",
  },
  {
    id: "payments2",
    icon: "💰",
    title: "Payments Layer",
    sub: "Central distribution layer",
    items: ["SPUMP", "USFF", "Other cryptocurrency", "Fiat"],
    accent: "text-pink-500",
    border: "border-pink-400/40",
    bg: "bg-pink-500/7",
    dot: "bg-pink-500",
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
    accent: "text-purple-500",
    border: "border-purple-400/40",
    bg: "bg-purple-500/8",
  },
  {
    id: "marketplace2",
    icon: "🛍️",
    title: "SPUMP Marketplace",
    sub: "Physical Goods · Digital Goods · Services · Creator Products",
    items: ["Physical Goods", "Digital Goods", "Services", "Creator Products"],
    accent: "text-indigo-500",
    border: "border-indigo-400/40",
    bg: "bg-indigo-500/8",
    dot: "bg-indigo-500",
  },
  {
    id: "payments3",
    icon: "💳",
    title: "Payments Layer",
    sub: "SPUMP · USEF · Crypto · Flat",
    items: ["SPUMP", "USEF", "Crypto", "Flat"],
    check: true,
    accent: "text-amber-500",
    border: "border-amber-400/40",
    bg: "bg-amber-500/7",
  },
  {
    id: "shop2",
    icon: "🏪",
    title: "Shop Creator",
    sub: "Build Shops",
    items: ["Sell online"],
    accent: "text-blue-500",
    border: "border-blue-400/40",
    bg: "bg-blue-500/7",
    dot: "bg-blue-500",
  },
  {
    id: "payments4",
    icon: "💰",
    title: "Payments Layer",
    sub: "Central distribution layer",
    accent: "text-pink-500",
    border: "border-pink-400/40",
    bg: "bg-pink-500/7",
  },
];

function NodeCard({ node, size = "md" }) {
  const p = size === "sm" ? "p-3" : "p-4";
  return (
    <div
      className={`rounded-xl ${p} ${node.bg} border ${node.border} space-y-2`}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{node.icon}</span>
        <div>
          <p className="font-semibold text-secondary text-sm leading-tight">
            {node.title}
          </p>
          {node.sub && (
            <p className="text-secondary/60 text-xs leading-tight font-light">
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
              className={`text-secondary/60 text-xs flex items-center gap-1.5 font-light`}>
              <span className={node.check ? node.accent : node.accent}>
                {node.check ? "✓" : "•"}
              </span>
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
    <div className="relative z-10 py-20 bg-primary-bg">
      <Container>
        <div className="space-y-20">
          <div>
            <div className="flex items-start gap-5 mb-12 pb-8 border-b border-secondary/10">
              <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                🌐
              </div>
              <div className="flex-1">
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
                  Scotty Pumpkin Ecosystem
                </p>
                <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-4 text-secondary">
                  A Real Utility <br />
                  <span className="text-primary italic">Ecosystem</span>
                </h1>
              </div>
            </div>

            <div className="flex gap-5 pb-8 items-start border-b border-secondary/[0.07]">
              <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                01
              </span>
              <p className="flex-1 text-[15px] leading-[1.75] text-secondary/80 font-light m-0">
                SPUMP powers a complete ecosystem where users can create shops,
                sell products and services, monetize content, and accept crypto
                or fiat payments through one connected digital economy.
              </p>
            </div>

            <div className="flex gap-5 pt-8 items-start">
              <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                02
              </span>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/buy"
                  className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors">
                  Buy SPUMP
                </Link>
                <Link
                  href="https://sosay.org/spump-market"
                  className="px-6 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary/80 transition-colors">
                  Explore Marketplace
                </Link>
                <Link
                  href="https://bfinit.com/bfinit-ecomerce-platform"
                  className="px-6 py-2.5 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-600 transition-colors">
                  Create Your Shop
                </Link>
              </div>
            </div>
          </div>

          <div className="h-px bg-secondary/10" />

          <div className="space-y-10">
            {/* Section header */}
            <div className="flex items-start gap-5 pb-6 border-b border-secondary/10">
              <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                🌐
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
                  Overview
                </p>
                <h2 className="text-[22px] font-normal leading-tight text-secondary">
                  A Real Utility{" "}
                  <em className="italic text-secondary/80">Ecosystem</em>
                </h2>
              </div>
            </div>

            <div className="flex gap-5 items-start border-b border-secondary/[0.07] pb-8">
              <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                01
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-medium text-secondary/90 mb-1 uppercase tracking-wide">
                  SPUMP is not limited to NFTs.
                </p>
                <p className="text-[15px] leading-[1.75] text-secondary/70 font-light">
                  It is the utility currency of a broader commerce ecosystem
                  connecting online shops, marketplace sales, creator
                  monetization, digital products, physical goods, services, and
                  hybrid payment systems.
                </p>
              </div>
            </div>

            <div className="bg-white/60 border border-secondary/[0.07] rounded-2xl p-6 md:p-10">
              <p className="text-[11px] font-medium tracking-widest uppercase text-primary mb-6">
                Ecosystem Map
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="space-y-4">
                  <NodeCard node={CORE_NODES[1]} />
                  <NodeCard node={CORE_NODES[3]} />
                </div>
                <div className="flex flex-col items-center gap-6">
                  <NodeCard node={CORE_NODES[0]} size="sm" />
                  <div className="w-40 h-40 rounded-full border-2 border-primary/40 flex items-center justify-center relative mx-auto">
                    <div className="w-28 h-28 rounded-full border border-dashed border-secondary/20 flex items-center justify-center bg-primary/5" />
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-4xl">💰</span>
                      <p className="text-primary font-semibold text-lg leading-tight mt-1">
                        SPUMP
                      </p>
                      <p className="text-primary text-sm">Core</p>
                      <p className="text-secondary/50 text-[10px] font-light">
                        Ecosystem Core
                      </p>
                    </div>
                  </div>
                  <NodeCard node={CORE_NODES[4]} size="sm" />
                </div>
                <div className="space-y-4">
                  <NodeCard node={CORE_NODES[2]} />
                  <div className="rounded-xl p-4 opacity-0 pointer-events-none border border-transparent">
                    <p className="text-sm">placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-secondary/10" />

          <div className="space-y-8">
            <div className="flex items-start gap-5 pb-6 border-b border-secondary/10">
              <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
                  Capabilities
                </p>
                <h2 className="text-[22px] font-normal leading-tight text-secondary">
                  What You Can Do{" "}
                  <em className="italic text-secondary/80">With SPUMP</em>
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {WHAT_YOU_CAN.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-5 py-5 px-4 bg-white/60 border border-secondary/[0.07] rounded-xl hover:border-primary/20 hover:bg-primary/5 transition-colors">
                  <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                    0{i + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{item.icon}</span>
                      <p className="font-medium text-secondary text-sm">
                        {item.title}
                      </p>
                    </div>
                    <p className="text-secondary/55 text-xs leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-secondary/10" />

          <div className="space-y-8">
            <div className="flex items-start gap-5 pb-6 border-b border-secondary/10">
              <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                💸
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
                  Value Flow
                </p>
                <h2 className="text-[22px] font-normal leading-tight text-secondary">
                  How Ecosystem{" "}
                  <em className="italic text-secondary/80">Value Flows</em>
                </h2>
              </div>
            </div>

            <div className="flex gap-5 items-start py-6 border-b border-secondary/[0.07]">
              <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                01
              </span>
              <div className="flex-1 flex flex-col md:flex-row items-start gap-5 px-5 py-5 bg-primary/5 border border-primary/15 border-l-2 border-l-primary rounded-lg">
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <span className="text-3xl">⚡</span>
                  <p className="text-secondary/60 text-xs font-medium text-center">
                    Lower Fees
                  </p>
                  <p className="text-secondary/45 text-xs text-center font-light">
                    Reduced platform costs
                  </p>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xl text-secondary font-semibold">
                    Up to{" "}
                    <span className="text-primary font-semibold">
                      30% Discount
                    </span>
                  </p>
                  <p className="text-secondary/60 text-sm leading-relaxed font-light">
                    Users paying with SPUMP or USFF may receive up to 30%
                    discount on service platform services, subscriptions,
                    marketplace sizes and eligible products or services.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-secondary/10" />

          <div className="space-y-10">
            <div className="flex items-start gap-5 pb-6 border-b border-secondary/10">
              <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                🚀
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
                  Growth
                </p>
                <h2 className="text-[22px] font-normal leading-tight text-secondary">
                  From First Sales to{" "}
                  <em className="italic text-secondary/80">Ecosystem Growth</em>
                </h2>
              </div>
            </div>

            <div className="flex gap-5 items-start pb-8 border-b border-secondary/[0.07]">
              <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                01
              </span>
              <p className="flex-1 text-[15px] leading-[1.75] text-secondary/70 font-light">
                Every transaction contributes to the expansion, stability, and
                operation of the SPUMP ecosystem.
              </p>
            </div>

            <div className="bg-white/60 border border-secondary/[0.07] rounded-2xl p-6 md:p-10 space-y-6">
              <p className="text-[11px] font-medium tracking-widest uppercase text-primary mb-6">
                Flow Map
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="space-y-4">
                  <NodeCard node={FLOW_NODES[1]} />
                  <NodeCard node={FLOW_NODES[3]} />
                </div>
                <div className="flex flex-col items-center gap-6">
                  <NodeCard node={FLOW_NODES[0]} size="sm" />
                  <div className="w-40 h-40 rounded-full border-2 border-primary/40 flex items-center justify-center relative mx-auto">
                    <div className="w-28 h-28 rounded-full border border-dashed border-secondary/20 flex items-center justify-center bg-primary/5" />
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-4xl">💰</span>
                      <p className="text-primary font-semibold text-lg leading-tight mt-1">
                        SPUMP
                      </p>
                      <p className="text-primary text-sm">Core</p>
                      <p className="text-secondary/50 text-xs font-light">
                        Ecosystem Core
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-px h-6 rounded-full bg-green-400/70" />
                    <div className="w-px h-6 rounded-full bg-primary/60" />
                    <div className="w-px h-6 rounded-full bg-purple-400/70" />
                  </div>
                </div>
                <div className="space-y-4">
                  <NodeCard node={FLOW_NODES[2]} />
                  <NodeCard node={FLOW_NODES[4]} />
                </div>
              </div>

              <div className="bg-purple-500/5 border border-purple-400/25 rounded-xl px-6 py-4 flex items-center justify-center gap-3 mt-4 text-center">
                <span className="text-3xl">💸</span>
                <div>
                  <p className="text-secondary font-medium text-base">
                    SPUMP Ecosystem Pool
                  </p>
                  <p className="text-secondary/50 text-xs font-light">
                    Central Distribution Layer
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-secondary/10" />

          <div className="space-y-8">
            <div className="flex items-start gap-5 pb-6 border-b border-secondary/10">
              <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                🌟
              </div>
              <div>
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
                  Benefits
                </p>
                <h2 className="text-[22px] font-normal leading-tight text-secondary">
                  Built-In{" "}
                  <em className="italic text-secondary/80">Benefits</em>
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {FLOW_BENEFITS.slice(1).map((b, i) => (
                <div
                  key={i}
                  className="flex gap-5 flex-col py-5 px-4 bg-white/60 border border-secondary/[0.07] rounded-xl hover:border-primary/20 hover:bg-primary/5 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide w-6 text-right">
                      0{i + 1}
                    </span>
                    <span className="text-xl">{b.icon}</span>
                  </div>
                  <div>
                    <p className="text-secondary font-medium text-sm mb-1">
                      {b.title}
                    </p>
                    <p className="text-secondary/55 text-xs leading-relaxed font-light">
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3.5 items-start px-5 py-5 bg-primary/5 border border-primary/15 border-l-2 border-l-primary rounded-lg">
              <span className="shrink-0 text-base mt-0.5">ℹ️</span>
              <p className="m-0 text-[13px] text-secondary/50 leading-relaxed font-light">
                Funds are used exclusively for ecosystem operation, development,
                and growth. SPUMP does not represent ownership, dividends, or
                financial entitlement.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
