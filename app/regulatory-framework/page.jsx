"use client";

import React, { useState } from "react";

const SECTIONS = [
  {
    number: 1,
    title: "Legal Ownership & Structure",
    icon: "🏢",
    content:
      "Scotty Pumpkin Eco Market System is owned by SAS Association Familiale Fin (Affin), Registration Number: 803965227, registered at 8 rue Dublin, 34200 Sète, France.",
    entities: [
      {
        label: "Parent Entity",
        value: "SAS Association Familiale Fin (Affin)",
      },
      { label: "Registration Number", value: "803965227" },
      {
        label: "Registered Address",
        value: "8 rue Dublin, 34200 Sète, France",
      },
      { label: "Affiliated Entities", value: "USFRANC LTD & USFRANC SASU" },
    ],
    footer:
      "The ecosystem operates within the Affin group structure and in coordination with affiliated entities including USFRANC LTD and USFRANC SASU.",
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
    intro:
      "After-tax financial inflows generated from first sales and administrative transaction fees remain the exclusive property of the operating entity.",
    allocation: [
      {
        label: "Ecosystem sustainability investments (government securities)",
        value: "60%",
        color: "#f17005", // Adjusted to match your precise core primary orange
      },
      {
        label: "Operational reserves",
        value: "10%",
        color: "#b45309", // Warm amber tone matching the earthy palette
      },
      {
        label: "Liquidity support",
        value: "10%",
        color: "#0f2027", // Accentuated via your robust secondary color
      },
      {
        label: "Operating expenses",
        value: "10%",
        color: "#475569", // Neutral slate element
      },
      {
        label: "Social & community welfare initiatives",
        value: "10%",
        color: "rgba(22, 163, 74, 0.9)", // Grounded green
      },
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
    content:
      "This framework shall be governed by the laws of France unless otherwise stated.",
    highlight: "Jurisdiction: France",
  },
];

export default function RegulatoryFrameworkPage() {
  const [activeSection, setActiveSection] = useState(1);

  return (
    <section className="bg-primary-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20 space-y-10">
        {/* ── Hero Card ── */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-8 md:p-10 text-center space-y-5">
          <div
            style={{ animation: "sp-float 4s ease-in-out infinite" }}
            className="text-5xl md:text-6xl">
            🏛️
          </div>
          <div className="space-y-2">
            <p className="text-secondary/70 text-xs font-black uppercase tracking-widest">
              Scotty Pumpkin Eco Market System
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-secondary">
              Regulatory &amp; Governance Framework
            </h1>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="bg-orange-100 border border-orange-200 text-orange-800 text-[11px] font-bold px-3 py-1 rounded-full">
              Effective: February 26, 2026
            </span>
            <span className="bg-orange-100 border border-orange-200 text-orange-800 text-[11px] font-bold px-3 py-1 rounded-full">
              Governed by French Law
            </span>
            <span className="bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold px-3 py-1 rounded-full">
              AML / KYC Compliant
            </span>
            <span className="bg-orange-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">
              Non-Security Token
            </span>
          </div>
        </div>

        <div className="sp-divider" />

        {/* ── Mobile Navigation (Hidden on Desktop) ── */}
        <div className="md:hidden sp-mobile-nav">
          {SECTIONS.map((s) => {
            const isCurrent = activeSection === s.number;
            return (
              <button
                key={s.number}
                onClick={() => setActiveSection(s.number)}
                className={`sp-mobile-btn ${isCurrent ? "active" : ""}`}>
                <span>{s.icon}</span>
                <span
                  className={`text-xs font-bold ${isCurrent ? "text-orange-700" : "text-secondary/60"}`}>
                  {s.number}. {s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Main Layout Split ── */}
        <div className="sp-layout">
          {/* Sidebar Left Column */}
          <div className="sp-sidebar hidden md:block">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
              <p className="text-secondary/40 text-[10px] font-black uppercase tracking-widest">
                Framework Index
              </p>
            </div>
            {SECTIONS.map((s, i) => {
              const isCurrent = activeSection === s.number;
              return (
                <div key={s.number}>
                  <div
                    className={`sp-nav-item ${isCurrent ? "active" : ""}`}
                    onClick={() => setActiveSection(s.number)}>
                    <div className="sp-nav-number">{s.number}</div>
                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold leading-tight ${isCurrent ? "text-orange-700" : "text-secondary/70"}`}>
                        {s.title}
                      </p>
                    </div>
                    <span className="ml-auto text-sm shrink-0 opacity-70">
                      {s.icon}
                    </span>
                  </div>
                  {i < SECTIONS.length - 1 && <div className="sp-nav-sep" />}
                </div>
              );
            })}
          </div>

          {/* Dynamic Content Panel Column */}
          {(() => {
            const s = SECTIONS.find((x) => x.number === activeSection);
            if (!s) return null;
            return (
              <div key={s.number} className="sp-panel">
                {/* Panel Title Unit */}
                <div className="flex items-center gap-3.5 mb-5">
                  <span className="text-3xl shrink-0">{s.icon}</span>
                  <div>
                    <p className="text-orange-600 text-[10px] font-black uppercase tracking-widest mb-0.5">
                      Section 0{s.number}
                    </p>
                    <h2 className="text-lg md:text-xl font-black text-secondary">
                      {s.title}
                    </h2>
                  </div>
                </div>

                <div className="sp-divider mb-5" />

                <div className="space-y-5">
                  {/* Content Descriptions */}
                  {s.content && (
                    <p className="text-secondary/85 text-sm leading-relaxed">
                      {s.content}
                    </p>
                  )}

                  {/* Entities Metadata Cards */}
                  {s.entities && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {s.entities.map((e, i) => (
                        <div key={i} className="sp-entity-item">
                          <p className="text-secondary/40 text-[10px] font-black uppercase tracking-wider mb-1">
                            {e.label}
                          </p>
                          <p className="text-secondary text-xs font-bold leading-snug">
                            {e.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Editorial Blockquote Intro */}
                  {s.intro && (
                    <p className="text-secondary/70 text-xs md:text-sm italic border-l-2 border-orange-500/50 pl-3 bg-slate-50/50 py-1.5 pr-2 rounded-r-md">
                      {s.intro}
                    </p>
                  )}

                  {/* Operational Bullet Points */}
                  {s.items && (
                    <div className="space-y-2.5">
                      {s.items.map((item, i) => (
                        <div
                          key={i}
                          className={`sp-item-row ${s.isWarning ? "warn" : s.isRisk ? "risk" : ""}`}>
                          {s.isWarning ? (
                            <span className="sp-warn-icon shrink-0">✕</span>
                          ) : s.isRisk ? (
                            <span className="sp-risk-icon shrink-0">⚠</span>
                          ) : (
                            <span className="sp-check shrink-0">✓</span>
                          )}
                          <span
                            className={`text-xs md:text-sm font-medium leading-relaxed ${s.isWarning ? "text-red-900" : s.isRisk ? "text-amber-900" : "text-secondary/80"}`}>
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Budget Allocation Percentage Track Bars */}
                  {s.allocation && (
                    <div className="space-y-3.5 pt-1.5">
                      {s.allocation.map((row, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-secondary/75 font-medium pr-4">
                              {row.label}
                            </span>
                            <span
                              className="font-black"
                              style={{ color: row.color }}>
                              {row.value}
                            </span>
                          </div>
                          <div className="sp-bar-track">
                            <div
                              className="sp-bar-fill h-full rounded-full"
                              style={{
                                width: row.value,
                                background: row.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Jurisdiction Flag Badges */}
                  {s.highlight && (
                    <div className="sp-jurisdiction">
                      <span className="text-xl">🇫🇷</span>
                      <p className="text-orange-950 text-xs font-bold">
                        {s.highlight}
                      </p>
                    </div>
                  )}

                  {/* Static footer references inside section */}
                  {s.footer && (
                    <p className="text-secondary/60 text-[11px] italic mt-2 border-t border-slate-100 pt-3">
                      {s.footer}
                    </p>
                  )}
                </div>

                {/* ── Horizontal Back / Forward Controls ── */}
                <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setActiveSection((p) => Math.max(1, p - 1))}
                    disabled={activeSection === 1}
                    className="flex items-center gap-1.5 text-xs font-bold text-secondary/80 hover:text-orange-600 disabled:opacity-70 transition-colors cursor-pointer bg-transparent border-none">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Previous
                  </button>
                  <span className="text-secondary/70 font-mono text-xs">
                    {activeSection} / {SECTIONS.length}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveSection((p) => Math.min(SECTIONS.length, p + 1))
                    }
                    disabled={activeSection === SECTIONS.length}
                    className="flex items-center gap-1.5 text-xs font-bold text-secondary/80 hover:text-primary disabled:opacity-70 transition-colors cursor-pointer bg-transparent border-none">
                    Next
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>

        <div className="sp-divider" />

        {/* ── Document Footer Note ── */}
        <div className="bg-slate-100/50 border border-slate-200/60 rounded-2xl p-6 text-center space-y-2">
          <p className="text-secondary/60 text-xs font-medium">
            Legal enquiries:{" "}
            <span className="text-orange-600 font-bold underline underline-offset-2 select-all">
              legal@scottypumpkin.com
            </span>
          </p>
          <p className="text-secondary/60 text-[10px] leading-relaxed max-w-2xl mx-auto">
            SAS Association Familiale Fin (Affin) · Reg. 803965227 · 8 rue
            Dublin, 34200 Sète, France · Governing Jurisdiction Framework:
            France
          </p>
        </div>
      </div>
    </section>
  );
}
