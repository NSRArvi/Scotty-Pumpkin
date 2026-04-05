"use client";

import { useState } from "react";

const LEGAL_ENTITIES = {
  principal: {
    title: "Principal Entity (France / EU)",
    name: "SAS Association Familiale Fin (AFFIN)",
    registration: "803 965 227 RCS Montpellier",
    addressLines: ["8 Rue Dublin", "34200 Sete", "France"],
    role: [
      "Group Holding and Administrative Entity",
      "Entity Management for USFRANC and Scotty Pumpkin Ecosystem: USFRANC LTD",
      "Technology, Development and Ecosystem Operations Entity",
    ],
  },
  uk: {
    title: "United Kingdom Entity",
    name: "USFRANC LTD",
    registration: "10325829",
    addressLines: [
      "4th Floor, Silverstream House",
      "45 Fitzroy Street",
      "London",
      "W1T 6EB",
      "United Kingdom",
    ],
  },
  contactEmail: "usfranc@bobosohomail.com",
};

const SECTIONS = [
  {
    id: "privacy",
    number: "01",
    tag: "Section 1",
    title: "Privacy Policy",
    subtitle: "Enhanced GDPR Version",
    icon: "🛡️",
    accentColor: "rgba(99,102,241,0.8)",
    accentBorder: "rgba(99,102,241,0.35)",
    accentGlow: "rgba(99,102,241,0.15)",
    subsections: [
      {
        title: "1. Data Controller",
        content: "USFRANC LTD acts as the Data Controller for personal data processed within the Scotty Pumpkin Eco Market System.",
      },
      {
        title: "2. Categories of Personal Data",
        items: [
          "Identification Data (name, email, business details)",
          "Account & Login Credentials",
          "Transaction Data (order details, payment confirmations)",
          "Blockchain Data (wallet addresses, transaction hashes)",
          "Technical Data (IP address, browser, device information)",
        ],
      },
      {
        title: "3. Legal Basis (GDPR Art. 6)",
        items: [
          "Contractual necessity (service delivery)",
          "Legitimate interest (security & fraud prevention)",
          "Legal obligation compliance",
          "Explicit consent (marketing)",
        ],
      },
      {
        title: "4. International Transfers",
        content: "Where data is transferred outside the EEA/UK, appropriate safeguards such as Standard Contractual Clauses (SCCs) are implemented.",
      },
      {
        title: "5. Data Subject Rights",
        content: "Users may request access, rectification, erasure, restriction, portability, or objection to processing by contacting: legal@scottypumpkin.com",
        isContact: true,
      },
      {
        title: "6. Data Security",
        content: "Scotty Pumpkin implements encryption, access controls, and secure wallet integrations. Users remain responsible for safeguarding private keys.",
      },
    ],
  },
  {
    id: "compliance",
    number: "02",
    tag: "Section 2",
    title: "Compliance Policy",
    subtitle: "Platform & Token Standards",
    icon: "⚖️",
    accentColor: "rgba(168,85,247,0.8)",
    accentBorder: "rgba(168,85,247,0.35)",
    accentGlow: "rgba(168,85,247,0.15)",
    subsections: [
      {
        title: "1. Platform Nature",
        content: "Scotty Pumpkin operates as a Web3 commerce infrastructure integrating ecommerce, marketplace, and social commerce functionalities.",
      },
      {
        title: "2. Utility Token Positioning",
        content: "SPUMP functions exclusively as a utility payment token within the ecosystem. It does not represent securities, shares, or investment contracts.",
      },
      {
        title: "3. No Financial Rights",
        content: "Token holders receive no ownership, dividend, governance, or profit-sharing rights.",
        isWarning: true,
      },
      {
        title: "4. AML / Anti-Fraud Measures",
        items: [
          "Transaction monitoring and fraud detection systems",
          "Escrow protections and dispute resolution mechanisms",
          "KYC obligations may apply on CEX platforms",
        ],
      },
    ],
  },
  {
    id: "cex",
    number: "03",
    tag: "Section 3",
    title: "CEX Listing Compliance Annex",
    subtitle: "Exchange Listing Documentation",
    icon: "🏛️",
    accentColor: "rgba(245,158,11,0.8)",
    accentBorder: "rgba(245,158,11,0.35)",
    accentGlow: "rgba(245,158,11,0.15)",
    subsections: [
      {
        title: "1. Token Classification Statement",
        content: "SPUMP is a utility token used within the Scotty Pumpkin Eco Market System. It does not grant equity, debt, revenue rights, or profit participation.",
      },
      {
        title: "2. Revenue Allocation Disclosure",
        intro: "After-tax inflows from first sales and 1% administrative fees are allocated as:",
        allocation: [
          { label: "Ecosystem Growth & Innovation", value: "60%", color: "rgba(245,158,11,0.9)" },
          { label: "Operational reserves", value: "10%", color: "rgba(168,85,247,0.9)" },
          { label: "Liquidity support", value: "10%", color: "rgba(99,102,241,0.9)" },
          { label: "Operating expenses", value: "10%", color: "rgba(59,130,246,0.9)" },
          { label: "Community welfare initiatives", value: "10%", color: "rgba(74,222,128,0.9)" },
        ],
        footer: "These allocations remain property of the operating entity and do not create financial claims for token holders.",
      },
      {
        title: "3. Risk Disclosure",
        items: [
          "Digital assets are volatile in value",
          "Blockchain transactions are irreversible",
          "No guarantee of appreciation or financial performance is provided",
        ],
        isRisk: true,
      },
    ],
  },
  {
    id: "terms",
    number: "04",
    tag: "Section 4",
    title: "Terms & Conditions Clause Insert",
    subtitle: "Web3 Payment & Escrow Clause",
    icon: "📋",
    accentColor: "rgba(74,222,128,0.8)",
    accentBorder: "rgba(74,222,128,0.35)",
    accentGlow: "rgba(74,222,128,0.15)",
    subsections: [
      {
        title: "Web3 Payment & Escrow Clause",
        content: "SPUMP may be used as a payment method within Bfinit, Sosay, and Scotty Marketplace. For marketplace transactions involving physical goods, escrow release occurs 48 hours after confirmed delivery unless a dispute is raised.",
        highlight: "48-hour escrow release window after confirmed delivery.",
      },
      {
        title: "Platform Fee Ownership",
        content: "All financial inflows generated from platform fees remain the exclusive property of the operating entity.",
        isWarning: true,
      },
    ],
  },
];

export default function LegalPackPage() {
  const [activeSection, setActiveSection] = useState("privacy");

  const current = SECTIONS.find((s) => s.id === activeSection);

  return (
    <>
      <section className="relative z-10 px-4 py-12 md:py-16 lg:py-24 lg:px-16">
        <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">

          {/* ── Hero ── */}
          <div className="sp-hero-card rounded-2xl p-8 md:p-10 text-center space-y-5">
            <div style={{ animation: "sp-float 4s ease-in-out infinite" }} className="text-5xl md:text-6xl">⚖️</div>
            <div className="space-y-2">
              <p className="text-purple-300/70 text-xs font-bold uppercase tracking-widest">Scotty Pumpkin Eco Market System</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black sp-shimmer-heading">
                Master Legal &amp; Compliance Pack
              </h1>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <span className="sp-badge-amber text-xs font-semibold px-3 py-1 rounded-full">England &amp; Wales</span>
              <span className="sp-badge-indigo text-xs font-semibold px-3 py-1 rounded-full">GDPR Enhanced</span>
              <span className="sp-badge-green text-xs font-semibold px-3 py-1 rounded-full">AML Compliant</span>
            </div>
          </div>

          {/* ── Legal Entity Structure ── */}
          <div className="sp-entity-card rounded-2xl p-5 md:p-6 space-y-4">
            <div className="space-y-1">
              <p className="sp-entity-title">Legal Entity Structure</p>
              <p className="text-white/55 text-sm">Principal entity, UK entity, and secure legal contact details.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="sp-entity-subcard space-y-3">
                <p className="text-amber-300 text-xs font-bold uppercase tracking-widest">{LEGAL_ENTITIES.principal.title}</p>
                <p className="text-white text-base font-bold">{LEGAL_ENTITIES.principal.name}</p>
                <p className="text-white/65 text-sm">
                  <span className="font-semibold text-white/80">Registration No:</span> {LEGAL_ENTITIES.principal.registration}
                </p>
                <div className="space-y-1">
                  <p className="text-white/35 text-xs font-semibold uppercase tracking-wider">Registered Address</p>
                  {LEGAL_ENTITIES.principal.addressLines.map((line) => (
                    <p key={line} className="text-white/75 text-sm">{line}</p>
                  ))}
                </div>
                <div className="space-y-1">
                  <p className="text-white/35 text-xs font-semibold uppercase tracking-wider">Role</p>
                  <ul className="sp-entity-list list-disc pl-4">
                    {LEGAL_ENTITIES.principal.role.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="sp-entity-subcard space-y-3">
                <p className="text-amber-300 text-xs font-bold uppercase tracking-widest">{LEGAL_ENTITIES.uk.title}</p>
                <p className="text-white text-base font-bold">{LEGAL_ENTITIES.uk.name}</p>
                <p className="text-white/65 text-sm">
                  <span className="font-semibold text-white/80">Registration No:</span> {LEGAL_ENTITIES.uk.registration}
                </p>
                <div className="space-y-1">
                  <p className="text-white/35 text-xs font-semibold uppercase tracking-wider">Registered Address</p>
                  {LEGAL_ENTITIES.uk.addressLines.map((line) => (
                    <p key={line} className="text-white/75 text-sm">{line}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="sp-entity-subcard space-y-2">
              <p className="text-amber-300 text-xs font-bold uppercase tracking-widest">Secure Contact Email</p>
              <p className="text-purple-300 font-semibold text-sm md:text-base">{LEGAL_ENTITIES.contactEmail}</p>
            </div>
          </div>

          <div className="sp-divider" />

          {/* ── Tab Nav ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`sp-tab rounded-xl px-4 py-3.5 text-left ${activeSection === s.id ? "active" : ""}`}
              >
                <div
                  className="sp-tab-indicator"
                  style={{ background: s.accentColor, opacity: activeSection === s.id ? 1 : 0 }}
                />
                <p className="sp-sec-num text-white">{s.tag}</p>
                <p className="text-lg mt-1">{s.icon}</p>
                <p className={`text-sm font-bold mt-1 ${activeSection === s.id ? "text-white" : "text-white/55"}`}>
                  {s.title}
                </p>
              </button>
            ))}
          </div>

          {/* ── Content Panel ── */}
          {current && (
            <div
              key={current.id}
              className="sp-content-panel rounded-2xl p-6 md:p-8 space-y-5"
              style={{ borderColor: current.accentBorder, boxShadow: `0 8px 40px rgba(0,0,0,0.35), 0 0 50px ${current.accentGlow}` }}
            >
              {/* Panel header */}
              <div className="flex items-center gap-4 pb-2">
                <span className="text-3xl">{current.icon}</span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: current.accentColor }}>{current.tag}</p>
                  <h2 className="text-xl md:text-2xl font-black text-white">{current.title}</h2>
                  <p className="text-white/45 text-sm">{current.subtitle}</p>
                </div>
              </div>

              <div className="sp-divider" />

              {/* Sub-sections */}
              <div className="space-y-4">
                {current.subsections.map((sub, i) => {
                  const cardClass = sub.isWarning ? "sp-sub-card warn" : sub.isRisk ? "sp-sub-card risk" : "sp-sub-card";
                  return (
                    <div key={i} className={cardClass}>
                      <h3 className="font-bold text-white/90 text-sm md:text-base mb-3" style={{ color: "rgba(255,255,255,0.9)" }}>
                        {sub.title}
                      </h3>

                      {/* Intro text */}
                      {sub.intro && (
                        <p className="text-white/60 text-xs mb-3 italic">{sub.intro}</p>
                      )}

                      {/* Paragraph */}
                      {sub.content && (
                        <p className={`text-sm md:text-base leading-relaxed ${sub.isWarning ? "text-red-300/80" : sub.isContact ? "text-purple-300" : "text-white/70"}`}>
                          {sub.content}
                        </p>
                      )}

                      {/* Highlight callout */}
                      {sub.highlight && (
                        <div className="mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
                          <span className="text-amber-400 shrink-0">⏱️</span>
                          <p className="text-amber-300 text-sm font-semibold">{sub.highlight}</p>
                        </div>
                      )}

                      {/* Item list */}
                      {sub.items && (
                        <div className="space-y-2 mt-1">
                          {sub.items.map((item, ii) => (
                            <p key={ii} className="flex items-start gap-2 text-white/75 text-sm md:text-base">
                              {sub.isRisk
                                ? <span className="sp-risk-icon mt-0.5">⚠</span>
                                : <span className="sp-check mt-0.5">✓</span>
                              }
                              {item}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Allocation bars */}
                      {sub.allocation && (
                        <div className="space-y-3 mt-1">
                          {sub.allocation.map((row, ri) => (
                            <div key={ri} className="space-y-1.5">
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

                      {/* Sub-footer */}
                      {sub.footer && (
                        <p className="text-white/35 text-xs italic mt-3">{sub.footer}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="sp-divider" />

          {/* ── Footer ── */}
          <div className="sp-footer-note rounded-2xl p-6 text-center space-y-2">
            <p className="text-white/50 text-sm">
              For legal enquiries contact{" "}
              <span className="text-purple-300 font-medium">usfranc@bobosohomail.com</span>
            </p>
            <p className="text-white/30 text-xs">
              Scotty Pumpkin Ltd — Governing Law: England &amp; Wales — Effective Date: February 26, 2026
            </p>
          </div>

        </div>
      </section>
    </>
  );
}