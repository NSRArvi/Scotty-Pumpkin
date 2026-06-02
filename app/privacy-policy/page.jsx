"use client";

import { useState } from "react";
import Container from "../components/shared/Container";

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
      <section className="bg-primary-bg relative z-10 py-12 md:py-16 lg:py-24">
        <Container>
          <div className="max-w-5xl mx-auto space-y-10 md:space-y-14">
            {/* ── Hero ── */}
            <div>
              <div className="flex items-start gap-5 mb-12 pb-8 border-b border-secondary/10">
                <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
                  🎃
                </div>
                <div>
                  <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
                    Scotty Pumpkin Ecosystem
                  </p>

                  <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-4 text-secondary">
                    Privacy
                    <span className="text-primary italic">Policy</span>
                  </h1>
                </div>
              </div>

              <div className="flex gap-5 pb-6 items-start border-b border-secondary/[0.07]">
                <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                  01
                </span>
                <p className="flex-1 text-[15px] leading-[1.75] text-secondary/70 font-light m-0">
                  How{" "}
                  <span className="font-medium text-secondary">
                    Scotty Pumpkin
                  </span>{" "}
                  collects, uses, and protects your data across our ecosystem.
                </p>
              </div>

              <div className="flex gap-5 pt-6 items-start">
                <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                  02
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-secondary/80">
                    📅 Effective Date: February 26, 2026
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-secondary/80">
                    🔄 Last Updated: February 26, 2026
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-primary/15 text-xs text-secondary/80">
                    ✅ GDPR &amp; UK GDPR Compliant
                  </span>
                </div>
              </div>
            </div>

            <div className="sp-divider" />

            <div className="space-y-4">
              {SECTIONS.map((section) => {
                const isOpen = activeSection === section.number;
                return (
                  <div
                    key={section.number}
                    id={`section-${section.number}`}
                    className={`sp-section-card rounded-2xl overflow-hidden ${isOpen ? "active" : ""}`}
                    onClick={() =>
                      setActiveSection(isOpen ? null : section.number)
                    }>
                    <div className="flex items-center gap-4 px-6 py-5 md:px-8">
                      <div className="shrink-0">
                        <div className="sp-number w-11 h-11 rounded-xl flex items-center justify-center">
                          <span className="text-secondary font-black text-base">
                            {section.number}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xl">{section.icon}</span>
                        <h2 className="text-base md:text-lg font-bold text-secondary/80 truncate">
                          {section.title}
                        </h2>
                      </div>
                      <svg
                        className={`sp-chevron shrink-0 w-5 h-5 text-purple-400 ${isOpen ? "open" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>

                    {isOpen && (
                      <div className="sp-section-body px-6 pb-6 md:px-8 md:pb-7 space-y-4 border-t border-white/6">
                        <div className="h-1" />

                        {/* Paragraph content */}
                        {"content" in section && section.content && (
                          <p className="text-secondary/80 text-sm md:text-base leading-relaxed">
                            {section.content}
                          </p>
                        )}

                        {"items" in section && section.items && (
                          <div className="space-y-2">
                            {section.items.map((item, i) => (
                              <p
                                key={i}
                                className="flex items-start gap-2 text-secondary/80 text-sm md:text-base">
                                <span className="sp-check mt-0.5">✓</span>
                                {item}
                              </p>
                            ))}
                          </div>
                        )}

                        {"subsections" in section && section.subsections && (
                          <div className="space-y-3">
                            {section.subsections.map((sub, si) => (
                              <div
                                key={si}
                                className="sp-subsection rounded-xl p-4 space-y-2">
                                <p className="text-primary text-sm font-bold">
                                  {sub.label}
                                </p>
                                <div className="space-y-1.5">
                                  {sub.items.map((item, ii) => (
                                    <p
                                      key={ii}
                                      className="flex items-start gap-2 text-secondary/80 text-sm">
                                      <span className="sp-check mt-0.5">✓</span>
                                      {item}
                                    </p>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {"footer" in section && section.footer && (
                          <p className="text-white/45 text-xs italic mt-2">
                            {section.footer}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="sp-divider" />

            <div className="sp-footer-note rounded-2xl p-6 text-center space-y-2">
              <p className="text-secondary/80 text-sm leading-relaxed">
                For privacy inquiries, contact us at{" "}
                <span className="text-secondary font-medium">
                  support@scottypumpkin.com
                </span>
                .
              </p>
              <p className="text-secondary text-xs">
                Scotty Pumpkin — Utility payment token used exclusively within
                the Scotty Pumpkin platform.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
