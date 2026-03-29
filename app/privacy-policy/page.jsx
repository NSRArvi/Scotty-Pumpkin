"use client";

import { useState } from "react";

const SECTIONS = [
  {
    number: 1,
    title: "Introduction",
    icon: "🎃",
    content: `Scotty Pumpkin operates the Scotty Pumpkin Eco Market System, including Scotty Pumpkin Marketplace, E-Bfinit (Ecommerce Builder), Sosay (Social Marketplace), and the Scotty Web3 Payment Infrastructure. We are committed to protecting personal data in accordance with applicable data protection laws including GDPR and UK GDPR.`,
  },
  {
    number: 2,
    title: "Data We Collect",
    icon: "🗂️",
    subsections: [
      {
        label: "A. Information You Provide",
        items: [
          "Name, email address, account credentials",
          "Billing and business information",
          "Support communications",
        ],
      },
      {
        label: "B. Automatically Collected Data",
        items: [
          "IP address, device and browser information",
          "Usage analytics and log data",
        ],
      },
      {
        label: "C. Blockchain Data",
        items: [
          "Public wallet addresses",
          "Transaction hashes and confirmations",
        ],
      },
    ],
  },
  {
    number: 3,
    title: "Purpose of Processing",
    icon: "⚙️",
    items: [
      "Provide ecommerce services",
      "Process SPUMP payments",
      "Operate escrow mechanisms",
      "Deliver services and manage tracking systems",
      "Provide customer support",
      "Prevent fraud",
      "Comply with legal obligations",
    ],
  },
  {
    number: 4,
    title: "Legal Basis for Processing",
    icon: "⚖️",
    items: [
      "Contractual necessity",
      "Legitimate interest",
      "Legal compliance",
      "User consent where applicable",
    ],
  },
  {
    number: 5,
    title: "Data Sharing",
    icon: "🔗",
    content: `We do not sell personal data. Data may be shared with hosting providers, payment infrastructure services, tracking providers, and legal authorities where required by law.`,
  },
  {
    number: 6,
    title: "Data Retention",
    icon: "🗄️",
    content: `Data is retained as long as accounts remain active and as required by applicable laws. Blockchain records cannot be altered or deleted once recorded.`,
  },
  {
    number: 7,
    title: "Your Rights",
    icon: "🛡️",
    items: [
      "Request access to your personal data",
      "Request correction of inaccurate data",
      "Request deletion (where legally permitted)",
      "Restriction of processing",
      "Data portability",
    ],
    footer: "To exercise your rights, contact us at support@scottypumpkin.com.",
  },
  {
    number: 8,
    title: "Security",
    icon: "🔒",
    items: [
      "Encrypted communications",
      "Secure wallet integrations",
      "Escrow protections",
      "Internal access controls",
    ],
    footer: "Users are responsible for securing their own private keys.",
  },
  {
    number: 9,
    title: "Children",
    icon: "🚫",
    content: `Services are not intended for individuals under 18 years of age.`,
  },
  {
    number: 10,
    title: "Changes to Policy",
    icon: "📋",
    content: `This policy may be updated periodically. Continued use of services constitutes acceptance of the updated policy.`,
  },
];

export default function PrivacyPolicyPage() {
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
        .sp-subsection {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
        }
        .sp-check {
          color: #4ade80;
          filter: drop-shadow(0 0 4px rgba(74,222,128,0.6));
          flex-shrink: 0;
        }
        .sp-badge {
          background: rgba(245,158,11,0.15);
          border: 1px solid rgba(245,158,11,0.3);
          color: #fbbf24;
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
      `}</style>

      <section className="relative z-10 px-4 py-12 md:py-16 lg:py-24 lg:px-16">
        <div className="max-w-4xl mx-auto space-y-10 md:space-y-14">

          {/* ── Hero ── */}
          <div className="sp-hero-card rounded-2xl p-8 md:p-10 text-center space-y-4">
            <div style={{ animation: "sp-float 4s ease-in-out infinite" }} className="text-5xl md:text-6xl">🎃</div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black sp-shimmer-heading">
              Privacy Policy
            </h1>
            <p className="text-purple-200 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              How <span className="font-bold text-white">Scotty Pumpkin</span> collects, uses, and protects your data across our ecosystem.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <span className="sp-badge text-xs font-semibold px-3 py-1 rounded-full">
                Effective Date: February 26, 2026
              </span>
              <span className="sp-badge text-xs font-semibold px-3 py-1 rounded-full">
                Last Updated: February 26, 2026
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}>
                GDPR &amp; UK GDPR Compliant
              </span>
            </div>
          </div>

          <div className="sp-divider" />

          {/* ── Sections ── */}
          <div className="space-y-4">
            {SECTIONS.map((section) => {
              const isOpen = activeSection === section.number;
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

                      {/* Paragraph content */}
                      {"content" in section && section.content && (
                        <p className="text-white/75 text-sm md:text-base leading-relaxed">
                          {section.content}
                        </p>
                      )}

                      {/* Simple item list */}
                      {"items" in section && section.items && (
                        <div className="space-y-2">
                          {section.items.map((item, i) => (
                            <p key={i} className="flex items-start gap-2 text-white/80 text-sm md:text-base">
                              <span className="sp-check mt-0.5">✓</span>
                              {item}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Subsections */}
                      {"subsections" in section && section.subsections && (
                        <div className="space-y-3">
                          {section.subsections.map((sub, si) => (
                            <div key={si} className="sp-subsection rounded-xl p-4 space-y-2">
                              <p className="text-amber-400 text-sm font-bold">{sub.label}</p>
                              <div className="space-y-1.5">
                                {sub.items.map((item, ii) => (
                                  <p key={ii} className="flex items-start gap-2 text-white/75 text-sm">
                                    <span className="sp-check mt-0.5">✓</span>
                                    {item}
                                  </p>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer note */}
                      {"footer" in section && section.footer && (
                        <p className="text-white/45 text-xs italic mt-2">{section.footer}</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="sp-divider" />

          {/* ── Footer note ── */}
          <div className="sp-footer-note rounded-2xl p-6 text-center space-y-2">
            <p className="text-white/50 text-sm leading-relaxed">
              For privacy inquiries, contact us at{" "}
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