"use client";

import { useState } from "react";

const SECTIONS = [
  {
    number: 1,
    title: "Legal Ownership & Structure",
    icon: "🏢",
    content: "Scotty Pumpkin Eco Market System is owned by SAS Association Familiale Fin (Affin), Registration Number: 803965227, registered at 8 rue Dublin, 34200 Sète, France.",
    entities: [
      { label: "Parent Entity", value: "SAS Association Familiale Fin (Affin)" },
      { label: "Registration Number", value: "803965227" },
      { label: "Registered Address", value: "8 rue Dublin, 34200 Sète, France" },
      { label: "Affiliated Entities", value: "USFRANC LTD & USFRANC SASU" },
    ],
    footer: "The ecosystem operates within the Affin group structure and in coordination with affiliated entities including USFRANC LTD and USFRANC SASU.",
  },
  {
    number: 2,
    title: "Regulatory Positioning",
    icon: "📡",
    items: [
      "Operates as Web3 commerce infrastructure integrating ecommerce, marketplace, and social commerce",
      "SPUMP functions exclusively as a utility payment token within the ecosystem",
      "Does not constitute a security, share, or debt instrument",
      "Does not constitute an investment contract or regulated financial product",
    ],
  },
  {
    number: 3,
    title: "No Financial Representation",
    icon: "🚫",
    isWarning: true,
    items: [
      "SPUMP does not grant ownership rights",
      "No dividend rights, governance rights, or profit-sharing rights",
      "No financial claims against the operating entity",
      "No guarantee of value, return, appreciation, or financial performance",
    ],
  },
  {
    number: 4,
    title: "Revenue & Allocation Governance",
    icon: "📊",
    intro: "After-tax financial inflows generated from first sales and administrative transaction fees remain the exclusive property of the operating entity.",
    allocation: [
      { label: "Ecosystem sustainability investments (government securities)", value: "60%", color: "rgba(245,158,11,0.9)" },
      { label: "Operational reserves", value: "10%", color: "rgba(168,85,247,0.9)" },
      { label: "Liquidity support", value: "10%", color: "rgba(99,102,241,0.9)" },
      { label: "Operating expenses", value: "10%", color: "rgba(59,130,246,0.9)" },
      { label: "Social & community welfare initiatives", value: "10%", color: "rgba(74,222,128,0.9)" },
    ],
  },
  {
    number: 5,
    title: "Compliance & Monitoring",
    icon: "🔍",
    items: [
      "Transaction monitoring to detect suspicious activity",
      "Escrow protections for marketplace transactions",
      "Fraud detection systems and dispute resolution procedures",
      "KYC/AML obligations may apply on centralized exchanges under exchange policies",
    ],
  },
  {
    number: 6,
    title: "Risk Disclosure",
    icon: "⚠️",
    isRisk: true,
    items: [
      "Digital assets may be volatile in value",
      "Blockchain transactions are irreversible once confirmed",
      "Users are responsible for securing their own wallets and private keys",
    ],
  },
  {
    number: 7,
    title: "Governing Law",
    icon: "⚖️",
    content: "This framework shall be governed by the laws of France unless otherwise stated.",
    highlight: "Jurisdiction: France",
  },
];

export default function RegulatoryFrameworkPage() {
  const [activeSection, setActiveSection] = useState(1);

  return (
    <>
      <style>{`
        @keyframes sp-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sp-glow-pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes sp-bar-grow {
          from { width: 0%; }
          to   { width: var(--bar-w); }
        }

        /* Two-column layout */
        .sp-layout {
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .sp-layout {
            grid-template-columns: 1fr;
          }
        }

        /* Sidebar nav */
        .sp-sidebar {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 18px;
          overflow: hidden;
          position: sticky;
          top: 24px;
        }
        .sp-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 13px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
        }
        .sp-nav-item:hover {
          background: rgba(255,255,255,0.04);
        }
        .sp-nav-item.active {
          background: rgba(168,85,247,0.1);
          border-left-color: rgba(168,85,247,0.7);
        }
        .sp-nav-sep {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 0 12px;
        }
        .sp-nav-number {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 900;
          flex-shrink: 0;
          background: rgba(168,85,247,0.15);
          border: 1px solid rgba(168,85,247,0.3);
          color: rgba(168,85,247,0.9);
          animation: sp-glow-pulse 3s ease-in-out infinite;
        }
        .sp-nav-item.active .sp-nav-number {
          background: rgba(168,85,247,0.3);
          border-color: rgba(168,85,247,0.6);
          color: #c084fc;
        }

        /* Mobile nav scroll */
        .sp-mobile-nav {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }
        .sp-mobile-nav::-webkit-scrollbar { display: none; }
        .sp-mobile-btn {
          flex-shrink: 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 8px 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .sp-mobile-btn.active {
          background: rgba(168,85,247,0.12);
          border-color: rgba(168,85,247,0.4);
        }

        /* Content panel */
        .sp-panel {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          animation: sp-fade-in 0.3s ease forwards;
        }

        /* Entity grid cards */
        .sp-entity-item {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          padding: 14px 16px;
        }

        /* Sub-cards */
        .sp-item-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
        }
        .sp-item-row.warn {
          background: rgba(239,68,68,0.05);
          border-color: rgba(239,68,68,0.15);
        }
        .sp-item-row.risk {
          background: rgba(245,158,11,0.04);
          border-color: rgba(245,158,11,0.15);
        }

        /* Checks */
        .sp-check    { color: #4ade80; filter: drop-shadow(0 0 4px rgba(74,222,128,0.6)); flex-shrink: 0; margin-top: 2px; }
        .sp-warn-icon{ color: #f87171; filter: drop-shadow(0 0 4px rgba(248,113,113,0.5)); flex-shrink: 0; margin-top: 2px; }
        .sp-risk-icon{ color: #fbbf24; filter: drop-shadow(0 0 4px rgba(251,191,36,0.6)); flex-shrink: 0; margin-top: 2px; }

        /* Bars */
        .sp-bar-track { background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden; height: 7px; }
        .sp-bar-fill  { height: 100%; border-radius: 999px; animation: sp-bar-grow 0.9s ease forwards; }

        /* Highlight box */
        .sp-highlight {
          background: rgba(245,158,11,0.08);
          border: 1px solid rgba(245,158,11,0.25);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sp-jurisdiction {
          background: rgba(99,102,241,0.1);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Badges */
        .sp-badge-amber  { background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3);  color: #fbbf24; }
        .sp-badge-indigo { background: rgba(99,102,241,0.15); border: 1px solid rgba(99,102,241,0.3);  color: #a5b4fc; }
        .sp-badge-green  { background: rgba(74,222,128,0.10); border: 1px solid rgba(74,222,128,0.25); color: #4ade80; }
        .sp-badge-red    { background: rgba(239,68,68,0.10);  border: 1px solid rgba(239,68,68,0.25);  color: #f87171; }

        .sp-footer-note {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>

      <section className="relative z-10 px-4 py-12 md:py-16 lg:py-24 lg:px-16">
        <div className="max-w-5xl mx-auto space-y-10 md:space-y-12">

          {/* ── Hero ── */}
          <div className="sp-hero-card rounded-2xl p-8 md:p-10 text-center space-y-5">
            <div style={{ animation: "sp-float 4s ease-in-out infinite" }} className="text-5xl md:text-6xl">🏛️</div>
            <div className="space-y-2">
              <p className="text-purple-300/70 text-xs font-bold uppercase tracking-widest">Scotty Pumpkin Eco Market System</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black sp-shimmer-heading">
                Regulatory &amp; Governance Framework
              </h1>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <span className="sp-badge-amber text-xs font-semibold px-3 py-1 rounded-full">Effective: February 26, 2026</span>
              <span className="sp-badge-indigo text-xs font-semibold px-3 py-1 rounded-full">Governed by French Law</span>
              <span className="sp-badge-green text-xs font-semibold px-3 py-1 rounded-full">AML / KYC Compliant</span>
              <span className="sp-badge-red text-xs font-semibold px-3 py-1 rounded-full">Non-Security Token</span>
            </div>
          </div>

          <div className="sp-divider" />

          {/* ── Mobile nav (hidden on desktop) ── */}
          <div className="md:hidden sp-mobile-nav">
            {SECTIONS.map((s) => (
              <button
                key={s.number}
                onClick={() => setActiveSection(s.number)}
                className={`sp-mobile-btn ${activeSection === s.number ? "active" : ""}`}
              >
                <span>{s.icon}</span>
                <span className={`text-xs font-semibold ${activeSection === s.number ? "text-white" : "text-white/50"}`}>
                  {s.number}. {s.title}
                </span>
              </button>
            ))}
          </div>

          {/* ── Desktop two-column layout ── */}
          <div className="sp-layout">

            {/* Sidebar (desktop only) */}
            <div className="sp-sidebar hidden md:block">
              <div className="px-4 py-3 border-b border-white/[0.05]">
                <p className="text-white/35 text-xs font-bold uppercase tracking-widest">Sections</p>
              </div>
              {SECTIONS.map((s, i) => (
                <div key={s.number}>
                  <div
                    className={`sp-nav-item ${activeSection === s.number ? "active" : ""}`}
                    onClick={() => setActiveSection(s.number)}
                  >
                    <div className="sp-nav-number">{s.number}</div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold leading-tight ${activeSection === s.number ? "text-white" : "text-white/55"}`}>
                        {s.title}
                      </p>
                    </div>
                    <span className="ml-auto text-sm flex-shrink-0">{s.icon}</span>
                  </div>
                  {i < SECTIONS.length - 1 && <div className="sp-nav-sep" />}
                </div>
              ))}
            </div>

            {/* Content panel */}
            {(() => {
              const s = SECTIONS.find((x) => x.number === activeSection);
              if (!s) return null;
              return (
                <div key={s.number} className="sp-panel">
                  {/* Panel header */}
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-3xl">{s.icon}</span>
                    <div>
                      <p className="text-purple-400 text-xs font-bold uppercase tracking-widest">Section {s.number}</p>
                      <h2 className="text-xl md:text-2xl font-black text-white">{s.title}</h2>
                    </div>
                  </div>

                  <div className="sp-divider mb-5" />

                  <div className="space-y-4">

                    {/* Paragraph */}
                    {s.content && (
                      <p className="text-white/75 text-sm md:text-base leading-relaxed">{s.content}</p>
                    )}

                    {/* Entity grid */}
                    {s.entities && (
                      <div className="grid sm:grid-cols-2 gap-3">
                        {s.entities.map((e, i) => (
                          <div key={i} className="sp-entity-item">
                            <p className="text-white/35 text-xs font-bold uppercase tracking-wider mb-1">{e.label}</p>
                            <p className="text-white/85 text-sm font-semibold">{e.value}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Intro text */}
                    {s.intro && (
                      <p className="text-white/55 text-sm italic border-l-2 border-purple-500/40 pl-3">{s.intro}</p>
                    )}

                    {/* Item list */}
                    {s.items && (
                      <div className="space-y-2">
                        {s.items.map((item, i) => (
                          <div key={i} className={`sp-item-row ${s.isWarning ? "warn" : s.isRisk ? "risk" : ""}`}>
                            {s.isWarning
                              ? <span className="sp-warn-icon">✕</span>
                              : s.isRisk
                              ? <span className="sp-risk-icon">⚠</span>
                              : <span className="sp-check">✓</span>
                            }
                            <span className={`text-sm md:text-base ${s.isWarning ? "text-red-300/80" : "text-white/75"}`}>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Allocation bars */}
                    {s.allocation && (
                      <div className="space-y-3">
                        {s.allocation.map((row, i) => (
                          <div key={i} className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-white/65 text-xs md:text-sm">{row.label}</span>
                              <span className="font-black text-sm" style={{ color: row.color }}>{row.value}</span>
                            </div>
                            <div className="sp-bar-track">
                              <div
                                className="sp-bar-fill"
                                style={{ "--bar-w": row.value, width: row.value, background: row.color }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Jurisdiction highlight */}
                    {s.highlight && (
                      <div className="sp-jurisdiction">
                        <span className="text-indigo-300 text-xl">🇫🇷</span>
                        <p className="text-indigo-200 text-sm font-semibold">{s.highlight}</p>
                      </div>
                    )}

                    {/* Footer note */}
                    {s.footer && (
                      <p className="text-white/35 text-xs italic mt-1 border-t border-white/[0.05] pt-3">{s.footer}</p>
                    )}

                  </div>

                  {/* Navigation arrows */}
                  <div className="flex justify-between items-center mt-8 pt-5 border-t border-white/[0.05]">
                    <button
                      onClick={() => setActiveSection((p) => Math.max(1, p - 1))}
                      disabled={activeSection === 1}
                      className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 disabled:opacity-20 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    <span className="text-white/25 text-xs font-mono">{activeSection} / {SECTIONS.length}</span>
                    <button
                      onClick={() => setActiveSection((p) => Math.min(SECTIONS.length, p + 1))}
                      disabled={activeSection === SECTIONS.length}
                      className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 disabled:opacity-20 transition-colors"
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="sp-divider" />

          {/* ── Footer ── */}
          <div className="sp-footer-note rounded-2xl p-6 text-center space-y-2">
            <p className="text-white/50 text-sm">
              Legal enquiries:{" "}
              <span className="text-purple-300 font-medium">legal@scottypumpkin.com</span>
            </p>
            <p className="text-white/30 text-xs">
              SAS Association Familiale Fin (Affin) · Reg. 803965227 · 8 rue Dublin, 34200 Sète, France · Governing Law: France
            </p>
          </div>

        </div>
      </section>
    </>
  );
}