"use client";

import Link from "next/link";
import { useState } from "react";

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
  { icon: "⭐", title: "Sell Products", desc: "Create and sell physical goods, fashion, accessories, and digital downloadables." },
  { icon: "🎨", title: "Sell Services", desc: "Offer creative, technical, commercial, and stability services to platform users." },
  { icon: "🎃", title: "Monetize Content", desc: "Sell premium content, memberships, media access, and digital experiences." },
  { icon: "💎", title: "Real Utility", desc: "SPUMP is designed for platform commerce and participation — not speculation." },
];

const FLOW_BENEFITS = [
  { icon: "⚡", title: "Lower Fees", desc: "Reduced platform costs" },
  { icon: "🏦", title: "Capital Stability", desc: "Supports long-term sustainability through structured capital preservation." },
  { icon: "🛡️", title: "Platform Reserves", desc: "Maintains operational continuity and ecosystem resilience." },
  { icon: "⚙️", title: "Infrastructure & Security", desc: "Covers hosting, systems, Bints security, and platform operations." },
  { icon: "🌟", title: "Community Growth", desc: "Supports creators, onboarding, and ecosystem adoption." },
  { icon: "🚀", title: "Ecosystem Expansion", desc: "Drives partnerships, integrations and future platform growth." },
];

const FLOW_NODES = [
  { id: "creator2", icon: "🚀", title: "Creator Economy", sub: "Content · Media · Memberships", accent: "rgba(168,85,247,0.8)", border: "rgba(168,85,247,0.4)", bg: "rgba(168,85,247,0.08)" },
  { id: "marketplace2", icon: "🛍️", title: "SPUMP Marketplace", sub: "Physical Goods · Digital Goods · Services · Creator Products", items: ["Physical Goods", "Digital Goods", "Services", "Creator Products"], accent: "rgba(99,102,241,0.8)", border: "rgba(99,102,241,0.4)", bg: "rgba(99,102,241,0.08)" },
  { id: "payments3", icon: "💳", title: "Payments Layer", sub: "SPUMP · USEF · Crypto · Flat", items: ["SPUMP", "USEF", "Crypto", "Flat"], checks: true, accent: "rgba(245,158,11,0.8)", border: "rgba(245,158,11,0.4)", bg: "rgba(245,158,11,0.07)" },
  { id: "shop2", icon: "🏪", title: "Shop Creator", sub: "Build Shops", items: ["Sell online"], accent: "rgba(59,130,246,0.8)", border: "rgba(59,130,246,0.4)", bg: "rgba(59,130,246,0.07)" },
  { id: "payments4", icon: "💰", title: "Payments Layer", sub: "Central distribution layer", accent: "rgba(236,72,153,0.8)", border: "rgba(236,72,153,0.4)", bg: "rgba(236,72,153,0.07)" },
];

function NodeCard({ node, size = "md" }) {
  const p = size === "sm" ? "p-3" : "p-4";
  return (
    <div
      className={`rounded-xl ${p} space-y-2`}
      style={{ background: node.bg, border: `1px solid ${node.border}`, backdropFilter: "blur(16px)" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{node.icon}</span>
        <div>
          <p className="font-black text-white text-sm leading-tight">{node.title}</p>
          {node.sub && <p className="text-white/40 text-xs leading-tight">{node.sub}</p>}
        </div>
      </div>
      {node.items && node.items.length > 0 && (
        <div className="space-y-0.5 pl-1">
          {node.items.map((item) => (
            <p key={item} className="text-white/65 text-xs flex items-center gap-1.5">
              {node.checks
                ? <span style={{ color: node.accent }}>✓</span>
                : <span style={{ color: node.accent }}>•</span>
              }
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
    <>
      <style>{`
        @keyframes sp-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sp-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        @keyframes sp-orbit-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes sp-orbit-spin-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes sp-glow-pulse {
          0%, 100% { box-shadow: 0 0 30px rgba(245,158,11,0.3), 0 0 60px rgba(168,85,247,0.15); }
          50%       { box-shadow: 0 0 60px rgba(245,158,11,0.6), 0 0 100px rgba(168,85,247,0.3); }
        }
        @keyframes sp-arrow-flow {
          0%   { opacity: 0.2; }
          50%  { opacity: 1; }
          100% { opacity: 0.2; }
        }

        .eco-shimmer-gold {
          background: linear-gradient(90deg, #f59e0b 0%, #fcd34d 35%, #f59e0b 65%, #d97706 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: sp-shimmer 4s linear infinite;
        }
        .eco-shimmer-white {
          background: linear-gradient(90deg, rgba(255,255,255,0.7) 0%, #fff 35%, rgba(255,255,255,0.7) 65%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: sp-shimmer 5s linear infinite;
        }

        .eco-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(168,85,247,0.4) 30%, rgba(245,158,11,0.4) 70%, transparent);
        }

        /* Glass panel */
        .eco-panel {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.09);
          box-shadow: 0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06);
        }

        /* Core circle */
        .eco-core-ring-outer {
          width: 170px; height: 170px;
          border-radius: 50%;
          border: 2px solid rgba(245,158,11,0.5);
          display: flex; align-items: center; justify-content: center;
          position: relative;
          animation: sp-glow-pulse 3s ease-in-out infinite;
        }
        .eco-core-ring-inner {
          width: 130px; height: 130px;
          border-radius: 50%;
          border: 1px dashed rgba(168,85,247,0.4);
          display: flex; align-items: center; justify-content: center;
          background: radial-gradient(circle, rgba(245,158,11,0.12) 0%, rgba(168,85,247,0.08) 100%);
          animation: sp-orbit-spin-rev 20s linear infinite;
        }
        .eco-core-content {
          position: absolute;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center;
        }

        /* Connector lines */
        .eco-connector {
          position: absolute;
          background: linear-gradient(90deg, rgba(168,85,247,0.6), rgba(245,158,11,0.6));
          height: 1px;
          animation: sp-arrow-flow 2s ease-in-out infinite;
        }

        /* What you can do card */
        .eco-feature-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          border-radius: 16px;
          padding: 20px;
          transition: all 0.25s ease;
        }
        .eco-feature-card:hover {
          border-color: rgba(168,85,247,0.35);
          background: rgba(168,85,247,0.06);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3), 0 0 30px rgba(168,85,247,0.1);
        }

        /* Benefit card */
        .eco-benefit-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          border-radius: 14px;
          padding: 16px;
          transition: all 0.25s ease;
        }
        .eco-benefit-card:hover {
          border-color: rgba(245,158,11,0.3);
          background: rgba(245,158,11,0.05);
          transform: translateY(-2px);
        }

        /* Discount highlight */
        .eco-discount-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(245,158,11,0.25);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 24px 28px;
        }

        /* Pool card */
        .eco-pool-card {
          background: rgba(168,85,247,0.07);
          border: 1px solid rgba(168,85,247,0.3);
          backdrop-filter: blur(20px);
          border-radius: 14px;
          padding: 18px 24px;
          text-align: center;
        }

        /* CTA buttons */
        .eco-btn-primary {
          background: rgba(168,85,247,0.15);
          border: 1px solid rgba(168,85,247,0.45);
          transition: all 0.22s ease;
          border-radius: 10px;
          padding: 12px 28px;
          font-weight: 700;
          font-size: 0.9rem;
          color: white;
          cursor: pointer;
        }
        .eco-btn-primary:hover {
          background: rgba(168,85,247,0.28);
          border-color: rgba(168,85,247,0.7);
          transform: scale(1.04);
          box-shadow: 0 6px 24px rgba(168,85,247,0.3);
        }
        .eco-btn-secondary {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          transition: all 0.22s ease;
          border-radius: 10px;
          padding: 12px 28px;
          font-weight: 700;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.75);
          cursor: pointer;
        }
        .eco-btn-secondary:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.3);
          transform: scale(1.04);
        }
        .eco-btn-green {
          background: linear-gradient(135deg, #15803d, #166534);
          border: 1px solid rgba(74,222,128,0.3);
          box-shadow: 0 4px 20px rgba(21,128,61,0.4);
          transition: all 0.22s ease;
          border-radius: 10px;
          padding: 12px 28px;
          font-weight: 700;
          font-size: 0.9rem;
          color: white;
          cursor: pointer;
        }
        .eco-btn-green:hover {
          background: linear-gradient(135deg, #16a34a, #15803d);
          transform: scale(1.04);
          box-shadow: 0 6px 28px rgba(21,128,61,0.55);
        }

        /* Section heading decoration */
        .eco-section-deco {
          display: flex; align-items: center; gap: 12px;
          justify-content: center;
        }
        .eco-section-deco::before,
        .eco-section-deco::after {
          content: "";
          flex: 1;
          max-width: 60px;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(245,158,11,0.5));
        }
        .eco-section-deco::after {
          background: linear-gradient(to left, transparent, rgba(245,158,11,0.5));
        }

        .eco-hero-head {
          background: rgba(99,102,241,0.08);
          border: 1px solid rgba(99,102,241,0.24);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 22px;
        }
        .eco-hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.35);
          color: #fbbf24;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .eco-hero-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 10px;
        }

        /* Arrow SVG pulse */
        .eco-arrow { animation: sp-arrow-flow 2s ease-in-out infinite; }
        .eco-arrow-delay { animation: sp-arrow-flow 2s ease-in-out 0.5s infinite; }
        .eco-arrow-delay2 { animation: sp-arrow-flow 2s ease-in-out 1s infinite; }
      `}</style>

      <div className="relative z-10 px-4 py-12 md:py-16 lg:px-12">
        <div className="max-w-5xl mx-auto space-y-20">

          {/* ── Section 1: Hero intro ── */}
          <div className="eco-hero-head text-center space-y-6" style={{ animation: "sp-fade-up 0.4s ease both" }}>
            <div className="eco-hero-kicker mx-auto">
              <span>🎃</span>
              <span>Scotty Pumpkin Ecosystem</span>
            </div>
            <div className="eco-hero-title">
              <span className="text-3xl md:text-4xl" style={{ animation: "sp-float 4s ease-in-out infinite" }}>🌐</span>
              <h2 className="eco-shimmer-white text-2xl md:text-4xl font-black leading-tight">
                A Real Utility Ecosystem
              </h2>
            </div>
            <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              SPUMP powers a complete ecosystem where users can create shops, sell products and services,
              monetize content, and accept crypto or fiat payments through one connected digital economy.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/buy" className="eco-btn-primary ui-btn ui-btn-primary">
                Buy SPUMP
              </Link>
              <Link href="https://sosay.org/spump-market" className="eco-btn-secondary ui-btn ui-btn-secondary">
                Explore Marketplace
              </Link>
              <Link href="https://bfinit.com/bfinit-ecomerce-platform" className="eco-btn-green ui-btn ui-btn-success">
                Create Your Shop
              </Link>
            </div>
          </div>

          <div className="eco-divider" />

          {/* ── Section 2: Real Utility Ecosystem ── */}
          <div className="space-y-10" style={{ animation: "sp-fade-up 0.4s ease 0.1s both" }}>
            <div className="text-center space-y-3">
              <h2 className="eco-shimmer-white text-3xl md:text-4xl font-black">A Real Utility Ecosystem</h2>
              <p className="text-amber-400 font-semibold text-base">SPUMP is not limited to NFTs.</p>
              <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                It is the utility currency of a broader commerce ecosystem connecting online shops, marketplace sales,
                creator monetization, digital products, physical goods, services, and hybrid payment systems.
              </p>
            </div>

            {/* Ecosystem diagram */}
            <div className="eco-panel rounded-2xl p-6 md:p-10">
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
                    <div className="eco-core-ring-outer mx-auto">
                      <div className="eco-core-ring-inner" />
                      <div className="eco-core-content">
                        <span className="text-4xl" style={{ animation: "sp-float 3s ease-in-out infinite" }}>💰</span>
                        <p className="text-amber-400 font-black text-lg leading-tight mt-1">SPUMP</p>
                        <p className="text-amber-300 font-bold text-sm">Core</p>
                        <p className="text-white/35 text-xs">Ecosystem Core</p>
                      </div>
                    </div>

                    {/* Bottom node */}
                    <NodeCard node={CORE_NODES[4]} size="sm" />
                  </div>

                  {/* Right column */}
                  <div className="space-y-4">
                    <NodeCard node={CORE_NODES[2]} />
                    {/* Empty spacer to match left column height */}
                    <div className="rounded-xl p-4 opacity-0 pointer-events-none" style={{ border: "1px solid transparent" }}>
                      <p className="text-sm">placeholder</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="eco-divider" />

          {/* ── Section 3: What You Can Do ── */}
          <div className="space-y-8" style={{ animation: "sp-fade-up 0.4s ease 0.15s both" }}>
            <div className="text-center">
              <h2 className="eco-shimmer-white text-3xl md:text-4xl font-black">What You Can Do With SPUMP</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {WHAT_YOU_CAN.map((item, i) => (
                <div key={i} className="eco-feature-card" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="font-black text-white text-sm">{item.title}</p>
                  </div>
                  <p className="text-white/55 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="eco-divider" />

          {/* ── Section 4: How Ecosystem Value Flows ── */}
          <div className="space-y-8" style={{ animation: "sp-fade-up 0.4s ease 0.2s both" }}>
            <div className="text-center">
              <h2 className="eco-shimmer-white text-3xl md:text-4xl font-black">How Ecosystem Value Flows</h2>
            </div>

            {/* Discount highlight */}
            <div className="eco-discount-card flex flex-col md:flex-row items-center gap-5">
              <div className="shrink-0 flex flex-col items-center gap-1">
                <span className="text-4xl" style={{ animation: "sp-float 3s ease-in-out infinite" }}>⚡</span>
                <p className="text-white/60 text-xs font-bold text-center">Lower Fees</p>
                <p className="text-white/35 text-xs text-center">Reduced platform costs</p>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-2xl font-black">
                  Up to <span className="eco-shimmer-gold">30% Discount</span>
                </p>
                <p className="text-white/60 text-sm leading-relaxed">
                  Users paying with SPUMP or USFF may receive up to 30% discount on service platform services,
                  subscriptions, marketplace sizes and eligible products or services.
                </p>
              </div>
            </div>
          </div>

          <div className="eco-divider" />

          {/* ── Section 5: From First Sales to Ecosystem Growth ── */}
          <div className="space-y-10" style={{ animation: "sp-fade-up 0.4s ease 0.25s both" }}>
            <div className="text-center space-y-3">
              <h2 className="eco-shimmer-white text-3xl md:text-4xl font-black">From First Sales to Ecosystem Growth</h2>
              <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                Every transaction contributes to the expansion, stability, and operation of the SPUMP ecosystem.
              </p>
            </div>

            {/* Flow diagram */}
            <div className="eco-panel rounded-2xl p-6 md:p-10 space-y-6">
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
                  <div className="eco-core-ring-outer mx-auto">
                    <div className="eco-core-ring-inner" />
                    <div className="eco-core-content">
                      <span className="text-4xl" style={{ animation: "sp-float 3s ease-in-out infinite" }}>💰</span>
                      <p className="text-amber-400 font-black text-lg leading-tight mt-1">SPUMP</p>
                      <p className="text-amber-300 font-bold text-sm">Core</p>
                      <p className="text-white/35 text-xs">Ecosystem Core</p>
                    </div>
                  </div>

                  {/* Flow arrows down */}
                  <div className="flex items-center justify-center gap-3">
                    {["rgba(74,222,128,0.8)", "rgba(245,158,11,0.8)", "rgba(168,85,247,0.8)"].map((c, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <div className="w-0.5 h-6 rounded-full eco-arrow" style={{ background: c, animationDelay: `${i * 0.3}s` }} />
                        <div style={{ color: c, fontSize: "0.7rem" }} className="eco-arrow">▼</div>
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
              <div className="eco-pool-card flex items-center justify-center gap-3 mt-4">
                <span className="text-3xl">💸</span>
                <div>
                  <p className="text-white font-black text-base">SPUMP Ecosystem Pool</p>
                  <p className="text-white/45 text-xs">Central Distribution Layer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="eco-divider" />

          {/* ── Section 6: Built-In Benefits ── */}
          <div className="space-y-8" style={{ animation: "sp-fade-up 0.4s ease 0.3s both" }}>
            <div className="text-center">
              <h2 className="eco-shimmer-white text-3xl md:text-4xl font-black">Built-In Benefits</h2>
            </div>

            <div className="eco-panel rounded-2xl p-6 md:p-8 space-y-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {FLOW_BENEFITS.slice(1).map((b, i) => (
                  <div key={i} className="eco-benefit-card">
                    <span className="text-2xl mb-2 block">{b.icon}</span>
                    <p className="text-white font-black text-sm mb-1">{b.title}</p>
                    <p className="text-white/50 text-xs leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>

              <div className="eco-divider" />

              <p className="text-center text-white/35 text-xs leading-relaxed">
                Funds are used exclusively for ecosystem operation, development, and growth.<br />
                SPUMP does not represent ownership, dividends, or financial entitlement.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}