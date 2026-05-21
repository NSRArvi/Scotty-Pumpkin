"use client";

import { useState } from "react";
import Container from "../components/shared/Container";

const ALLOCATION = [
  {
    label: "Ecosystem sustainability investments",
    value: "60%",
    pct: 60,
    color: "rgba(245,158,11,0.9)",
    glow: "rgba(245,158,11,0.25)",
  },
  {
    label: "Operational reserves",
    value: "10%",
    pct: 10,
    color: "rgba(168,85,247,0.9)",
    glow: "rgba(168,85,247,0.2)",
  },
  {
    label: "Liquidity support",
    value: "10%",
    pct: 10,
    color: "rgba(99,102,241,0.9)",
    glow: "rgba(99,102,241,0.2)",
  },
  {
    label: "Operating expenses",
    value: "10%",
    pct: 10,
    color: "rgba(59,130,246,0.9)",
    glow: "rgba(59,130,246,0.2)",
  },
  {
    label: "Social & community welfare",
    value: "10%",
    pct: 10,
    color: "rgba(74,222,128,0.9)",
    glow: "rgba(74,222,128,0.2)",
  },
];

const NO_RIGHTS = [
  "Do not create ownership rights",
  "Do not create profit rights",
  "Do not create dividend rights",
  "Do not create financial claims",
  "Do not represent a hedge, reserve backing, or guarantee of token value",
];

const MARKET_CARDS = [
  {
    id: "dex",
    icon: "🔄",
    label: "DEX",
    title: "Decentralized Exchange",
    accent: "rgba(168,85,247,0.8)",
    border: "rgba(168,85,247,0.3)",
    glow: "rgba(168,85,247,0.12)",
    bg: "rgba(168,85,247,0.07)",
    body: "SPUMP liquidity is paired with USDC or SOL in accordance with the SPL Solana liquidity model.",
    note: "Standard market-making structure — does not constitute a value guarantee or hedge.",
    tags: ["USDC Pair", "SOL Pair", "SPL Standard"],
  },
  {
    id: "cex",
    icon: "🏛️",
    label: "CEX",
    title: "Centralized Exchange",
    accent: "rgba(245,158,11,0.8)",
    border: "rgba(245,158,11,0.3)",
    glow: "rgba(245,158,11,0.12)",
    bg: "rgba(245,158,11,0.07)",
    body: "SPUMP trades freely based on open market supply and demand dynamics.",
    note: "No guarantee of value, appreciation, stability, or financial return is provided.",
    tags: ["Open Market", "Supply & Demand", "Free Float"],
  },
];

export default function EcoFinancialPage() {
  const [barsAnimated, setBarsAnimated] = useState(false);

  return (
    <>
      <section className="bg-primary-bg relative z-10 py-12 md:py-16 lg:py-24">
        <Container>
          <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">
            {/* ── Hero ── */}
            <div className="sp-hero-card rounded-2xl p-8 md:p-10 text-center space-y-5">
              <div
                style={{ animation: "sp-float 4s ease-in-out infinite" }}
                className="text-5xl md:text-6xl">
                💎
              </div>
              <div className="space-y-2">
                <p className="text-primary text-xs font-bold uppercase tracking-widest">
                  Scotty Pumpkin Eco Market System
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary">
                  Eco Financial System
                </h1>
                <p className="text-secondary/70 text-sm md:text-base max-w-lg mx-auto leading-relaxed pt-1">
                  Financial Allocation &amp; Token Market Clarification Notice
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="bg-orange-100 border border-orange-200 text-orange-800 text-[11px] font-bold px-3 py-1 rounded-full">
                  Utility Token Only
                </span>
                <span className="bg-orange-100 border border-orange-200 text-orange-800 text-[11px] font-bold px-3 py-1 rounded-full">
                  SPL · Solana
                </span>
                <span className="bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full">
                  60/10/10/10/10 Model
                </span>
                <span className="bg-orange-600 text-white text-[11px] font-bold px-3 py-1 rounded-full ">
                  Non-Investment
                </span>
              </div>
            </div>

            {/* ── Red Disclaimer Banner ── */}
            <div className="sp-disclaimer rounded-2xl px-6 py-4 flex items-start gap-4">
              <span className="text-2xl shrink-0 mt-0.5">⚠️</span>
              <p className="text-red-400 text-sm md:text-base leading-relaxed">
                All proceeds generated from first sales and administrative
                transaction fees remain the{" "}
                <span className="font-bold text-red-500">
                  exclusive property
                </span>{" "}
                of the Scotty Pumpkin operating infrastructure and its holding
                company,{" "}
                <span className="font-bold text-primary/90">
                  SAS Association Familiale Fin (Affin)
                </span>
                . These allocations do not constitute a financial product,
                investment, or guarantee of any kind.
              </p>
            </div>

            <div className="sp-divider" />

            {/* ── Allocation Model ── */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">
                  Ecosystem Allocation Model
                </h2>
              </div>

              <div className="sp-alloc-card rounded-2xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                  {/* SVG Donut chart */}
                  <div className="sp-ring-wrap shrink-0">
                    <svg
                      viewBox="0 0 160 160"
                      className="w-full h-full -rotate-90">
                      {(() => {
                        let offset = 0;
                        const r = 58;
                        const circ = 2 * Math.PI * r;
                        return ALLOCATION.map((a, i) => {
                          const dash = (a.pct / 100) * circ;
                          const gap = circ - dash;
                          const el = (
                            <circle
                              key={i}
                              cx="80"
                              cy="80"
                              r={r}
                              fill="none"
                              stroke={a.color}
                              strokeWidth="18"
                              strokeDasharray={`${dash} ${gap}`}
                              strokeDashoffset={-offset}
                            />
                          );
                          offset += dash;
                          return el;
                        });
                      })()}
                    </svg>
                    <div className="sp-ring-center">
                      <p className="text-primary font-black text-xl leading-none">
                        SPUMP
                      </p>
                      <p className="text-primary/70 text-xs mt-1">Allocation</p>
                    </div>
                  </div>

                  {/* Bars */}
                  <div className="flex-1 w-full space-y-4">
                    {ALLOCATION.map((row, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <span className="text-secondary/80 text-sm">
                            {row.label}
                          </span>
                          <span
                            className="font-black text-sm"
                            style={{ color: row.color }}>
                            {row.value}
                          </span>
                        </div>
                        <div className="sp-bar-track">
                          <div
                            className="sp-bar-fill"
                            style={{
                              "--bar-w": row.value,
                              width: row.value,
                              background: row.color,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── No Rights ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚫</span>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">
                  These Allocations…
                </h2>
              </div>
              <div className="sp-no-rights-card rounded-2xl p-5 md:p-6 space-y-3">
                {NO_RIGHTS.map((item, i) => (
                  <div key={i} className="sp-no-rights-item">
                    <span className="text-red-500 text-lg shrink-0">✕</span>
                    <span className="text-red-400 text-sm md:text-base">
                      {item}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-red-500/10">
                  <p className="text-secondary/70 text-xs italic">
                    The ecosystem allocation model is an internal sustainability
                    structure only and has no direct influence on the market
                    value of SPUMP.
                  </p>
                </div>
              </div>

              {/* SPUMP utility callout */}
              <div
                className="rounded-2xl px-6 py-5 flex items-center gap-4"
                style={{
                  background: "rgba(241, 112, 5, 0.08)",
                  border: "1px solid rgba(241, 112, 5, 0.25)",
                }}>
                <span
                  className="text-3xl shrink-0"
                  style={{
                    animation: "sp-glow-pulse 3s ease-in-out infinite",
                  }}>
                  🎃
                </span>
                <p className="text-secondary/80 text-sm md:text-base leading-relaxed">
                  <span className="font-black text-primary">SPUMP</span> is a
                  utility payment token used exclusively within the{" "}
                  <span className="font-bold text-secondary">
                    Scotty Pumpkin Eco Market System
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="sp-divider" />

            {/* ── Market Structure ── */}
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📈</span>
                <h2 className="text-2xl md:text-3xl font-black text-secondary">
                  Market Structure Clarification
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {MARKET_CARDS.map((card) => (
                  <div
                    key={card.id}
                    className="sp-market-car"
                    style={{
                      background: card.bg,
                      border: `1px solid ${card.border}`,
                    }}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{card.icon}</span>
                      <div>
                        <p
                          className="text-xs font-bold uppercase tracking-widest"
                          style={{ color: card.accent }}>
                          {card.label}
                        </p>
                        <h3 className="text-lg font-black text-secondary">
                          {card.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-secondary/80 text-sm md:text-base leading-relaxed mb-4">
                      {card.body}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="sp-tag"
                          style={{
                            background: `${card.accent}18`,
                            border: `1px solid ${card.accent}40`,
                            color: card.accent,
                          }}>
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div
                      className="rounded-xl px-4 py-3 text-xs"
                      style={{
                        background: "rgba(239,68,68,0.06)",
                        border: "1px solid rgba(239,68,68,0.15)",
                      }}>
                      <span className="text-red-400">{card.note}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sp-divider" />

            {/* ── Final Notice ── */}
            <div className="sp-notice rounded-2xl p-6 md:p-8 text-center space-y-3">
              <span className="text-2xl">📋</span>
              <p className="text-secondary/70 text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
                No guarantee of value, appreciation, stability, hedge
                protection, or financial return is provided. SPUMP market price
                is determined solely by open market activity.
              </p>
              <div className="sp-divider" />
              <p className="text-secondary/60 text-xs">
                Scotty Pumpkin Ltd · SAS Association Familiale Fin (Affin) ·
                legal@scottypumpkin.com
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
