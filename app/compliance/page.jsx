"use client";

import { useState } from "react";

const SECTIONS = [
  {
    number: 1,
    title: "Nature of the Platform",
    icon: "🏗️",
    content: `Scotty Pumpkin operates as a Web3 commerce infrastructure integrating ecommerce (E-Bfinit), marketplace activity, and social commerce (Sosay). SPUMP functions as a utility payment token within the ecosystem.`,
  },
  {
    number: 2,
    title: "No Investment Representation",
    icon: "🚫",
    content: `Scotty Pumpkin does not offer securities, financial returns, dividends, or profit-sharing rights. SPUMP provides no ownership or financial claim.`,
  },
  {
    number: 3,
    title: "Ecosystem Allocation Model",
    icon: "📊",
    allocation: [
      { label: "Ecosystem sustainability investments", value: "60%", color: "rgba(245,158,11,0.8)" },
      { label: "Reserves", value: "10%", color: "rgba(168,85,247,0.8)" },
      { label: "Liquidity support", value: "10%", color: "rgba(99,102,241,0.8)" },
      { label: "Operating costs", value: "10%", color: "rgba(59,130,246,0.8)" },
      { label: "Social & community welfare", value: "10%", color: "rgba(74,222,128,0.8)" },
    ],
    footer: "This allocation does not create rights for token holders.",
  },
  {
    number: 4,
    title: "AML / Anti-Fraud Measures",
    icon: "🔍",
    items: [
      "Transaction monitoring to detect suspicious activity",
      "Escrow dispute mechanisms for buyer & seller protection",
      "Suspicious activity review processes",
      "KYC may apply where centralized exchanges are used",
    ],
  },
  {
    number: 5,
    title: "Escrow & Delivery Compliance",
    icon: "📦",
    content: `For physical goods, funds are held in escrow and released 48 hours after confirmed delivery unless a dispute is raised.`,
    highlight: "48-hour escrow release window after confirmed delivery.",
  },
  {
    number: 6,
    title: "Regulatory Positioning",
    icon: "⚖️",
    content: `Scotty Pumpkin functions as a digital commerce infrastructure and not as a financial institution, bank, investment fund, or securities issuer.`,
    items: [
      "Not a financial institution",
      "Not a bank",
      "Not an investment fund",
      "Not a securities issuer",
    ],
  },
  {
    number: 7,
    title: "Risk Disclosure",
    icon: "⚠️",
    items: [
      "Digital assets may be volatile in value",
      "Blockchain transactions are irreversible once confirmed",
      "Users are solely responsible for wallet security and private key management",
    ],
  },
];

export default function CompliancePage() {
  const [activeSection, setActiveSection] = useState(1);

  return (
    <>
      <style>{`
        @keyframes sp-glow-pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @keyframes sp-fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sp-bar-grow {
          from { width: 0%; }
          to   { width: var(--bar-width); }
        }

        .sp-section-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          cursor: pointer;
        }
        .sp-section-card:hover {
          transform: translateX(6px);
          border-color: rgba(168,85,247,0.35);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(168,85,247,0.12);
        }
        .sp-section-card.active {
          border-color: rgba(168,85,247,0.5);
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 40px rgba(168,85,247,0.18);
        }
        .sp-section-body {
          animation: sp-fade-in 0.25s ease forwards;
        }
        .sp-number {
          background: linear-gradient(135deg, rgba(168,85,247,0.25), rgba(139,92,246,0.15));
          border: 1px solid rgba(168,85,247,0.4);
          box-shadow: 0 0 20px rgba(168,85,247,0.2);
          animation: sp-glow-pulse 3s ease-in-out infinite;
        }
        .sp-check {
          color: #4ade80;
          filter: drop-shadow(0 0 4px rgba(74,222,128,0.6));
          flex-shrink: 0;
        }
        .sp-x {
          color: #f87171;
          filter: drop-shadow(0 0 4px rgba(248,113,113,0.6));
          flex-shrink: 0;
        }
        .sp-badge {
          background: rgba(245,158,11,0.15);
          border: 1px solid rgba(245,158,11,0.3);
          color: #fbbf24;
        }
        .sp-highlight-box {
          background: rgba(245,158,11,0.08);
          border: 1px solid rgba(245,158,11,0.25);
        }
        .sp-warn-box {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.2);
        }
        .sp-footer-note {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .sp-chevron {
          transition: transform 0.25s ease;
        }
        .sp-chevron.open {
          transform: rotate(180deg);
        }
        .sp-bar-track {
          background: rgba(255,255,255,0.06);
          border-radius: 999px;
          overflow: hidden;
          height: 8px;
        }
        .sp-bar-fill {
          height: 100%;
          border-radius: 999px;
          animation: sp-bar-grow 0.8s ease forwards;
        }
      `}</style>

      <section className="relative z-10 px-4 py-12 md:py-16 lg:py-24 lg:px-16">
        <div className="max-w-4xl mx-auto space-y-10 md:space-y-14">

          {/* ── Hero ── */}
          <div className="sp-hero-card rounded-2xl p-8 md:p-10 text-center space-y-4">
            <div style={{ animation: "sp-float 4s ease-in-out infinite" }} className="text-5xl md:text-6xl">📜</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black sp-shimmer-heading">
              Compliance Policy
            </h1>
            <p className="text-purple-200 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              How <span className="font-bold text-white">Scotty Pumpkin</span> operates responsibly within Web3 commerce, regulatory frameworks, and user protection standards.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="sp-badge text-xs font-semibold px-3 py-1 rounded-full">
                Effective Date: February 26, 2026
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
                Web3 Commerce Infrastructure
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ade80" }}>
                AML Compliant
              </span>
            </div>
          </div>

          <div className="sp-divider" />

          {/* ── Sections ── */}
          <div className="space-y-4">
            {SECTIONS.map((section) => {
              const isOpen = activeSection === section.number;
              const isWarn = section.number === 7;

              return (
                <div
                  key={section.number}
                  id={`section-${section.number}`}
                  className={`sp-section-card rounded-2xl overflow-hidden ${isOpen ? "active" : ""}`}
                  onClick={() => setActiveSection(isOpen ? null : section.number)}
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 px-6 py-5 md:px-8">
                    <div className="flex-shrink-0">
                      <div className="sp-number w-11 h-11 rounded-xl flex items-center justify-center">
                        <span className="text-purple-300 font-black text-base">{section.number}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xl">{section.icon}</span>
                      <h2 className="text-base md:text-lg font-bold text-white truncate">
                        {section.title}
                      </h2>
                    </div>
                    <svg
                      className={`sp-chevron flex-shrink-0 w-5 h-5 text-purple-400 ${isOpen ? "open" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Body */}
                  {isOpen && (
                    <div className="sp-section-body px-6 pb-6 md:px-8 md:pb-7 space-y-4 border-t border-white/[0.06]">
                      <div className="h-1" />

                      {/* Paragraph */}
                      {"content" in section && section.content && (
                        <p className="text-white/75 text-sm md:text-base leading-relaxed">
                          {section.content}
                        </p>
                      )}

                      {/* Highlight box (escrow) */}
                      {"highlight" in section && section.highlight && (
                        <div className="sp-highlight-box rounded-xl px-4 py-3 flex items-center gap-3">
                          <span className="text-amber-400 text-lg flex-shrink-0">⏱️</span>
                          <p className="text-amber-300 text-sm font-semibold">{section.highlight}</p>
                        </div>
                      )}

                      {/* Allocation bars */}
                      {"allocation" in section && section.allocation && (
                        <div className="space-y-3">
                          {section.allocation.map((row, i) => (
                            <div key={i} className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-white/75 text-sm">{row.label}</span>
                                <span className="font-black text-sm" style={{ color: row.color }}>{row.value}</span>
                              </div>
                              <div className="sp-bar-track">
                                <div
                                  className="sp-bar-fill"
                                  style={{
                                    "--bar-width": row.value,
                                    width: row.value,
                                    background: row.color,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Items list — X marks for section 6 "not a..." */}
                      {"items" in section && section.items && (
                        <div className="space-y-2">
                          {section.items.map((item, i) => (
                            <p key={i} className="flex items-start gap-2 text-white/80 text-sm md:text-base">
                              {section.number === 6
                                ? <span className="sp-x mt-0.5">✕</span>
                                : isWarn
                                ? <span className="mt-0.5 flex-shrink-0" style={{ color: "#fbbf24", filter: "drop-shadow(0 0 4px rgba(251,191,36,0.6))" }}>⚠</span>
                                : <span className="sp-check mt-0.5">✓</span>
                              }
                              {item}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Warning box for risk section */}
                      {isWarn && (
                        <div className="sp-warn-box rounded-xl px-4 py-3">
                          <p className="text-red-300/80 text-xs leading-relaxed">
                            Scotty Pumpkin does not provide financial advice. Participation in Web3 ecosystems carries inherent risk. Please conduct your own due diligence.
                          </p>
                        </div>
                      )}

                      {/* Footer note */}
                      {"footer" in section && section.footer && (
                        <p className="text-white/40 text-xs italic mt-1">{section.footer}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="sp-divider" />

          {/* ── Footer ── */}
          <div className="sp-footer-note rounded-2xl p-6 text-center space-y-2">
            <p className="text-white/50 text-sm leading-relaxed">
              For compliance inquiries, contact us at{" "}
              <span className="text-purple-300 font-medium">support@scottypumpkin.com</span>.
            </p>
            <p className="text-white/30 text-xs">
              Scotty Pumpkin — Utility payment token used exclusively within the Scotty Pumpkin platform.
            </p>
          </div>

        </div>
      </section>
    </>
  );
}