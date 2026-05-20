import { useState } from "react";
import Link from "next/link";

// const STEPS = [
//   {
//     number: 1,
//     title: "Download the Wallet",
//     icon: "📲",
//     accent: "rgba(245,158,11,0.8)",
//     border: "rgba(245,158,11,0.35)",
//     bg: "rgba(245,158,11,0.07)",
//     content:
//       "Solana is available as a browser extension. You can also download the mobile app or use it as a browser extension.",
//     details: [
//       "Visit the official Belfax / Phantom wallet website",
//       "Choose Download now for your platform",
//       "Install the browser extension or mobile app",
//       "Open the wallet once installed",
//     ],
//     tip: null,
//     highlight: null,
//   },
//   {
//     number: 2,
//     title: "Create a New Wallet",
//     icon: "👛",
//     accent: "rgba(168,85,247,0.8)",
//     border: "rgba(168,85,247,0.35)",
//     bg: "rgba(168,85,247,0.07)",
//     content:
//       "Once you open Solana, choose Create wallet on the onboarding page or 'I need a new wallet'. This will give you a unique secret recovery phrase — this is the most important part of your wallet setup.",
//     details: [
//       "Open your wallet app or browser extension",
//       "Tap or click 'Create a new wallet'",
//       "Follow the on-screen setup instructions",
//     ],
//     tip: null,
//     highlight: null,
//   },
//   {
//     number: 3,
//     title: "Save Your Recovery Phrase (Manually)",
//     icon: "📝",
//     accent: "rgba(239,68,68,0.8)",
//     border: "rgba(239,68,68,0.35)",
//     bg: "rgba(239,68,68,0.06)",
//     content:
//       "Your recovery phrase (also known as a seed phrase) is a group of 12 or 24 words in a specific order that acts as your master password. Think of it as your master password.",
//     details: [
//       "Write down your seed phrase on paper and keep it offline",
//       "Never store it electronically",
//       "Confirm the recovery phrase and you have protected it correctly",
//     ],
//     dos: [
//       "Write it down on paper and keep it offline",
//       "Store multiple copies somewhere safe",
//       "Consider storing offline with a hardware wallet",
//     ],
//     donts: [
//       "Never take a screenshot or photo of your phrase",
//       "Never share your phrase with anyone",
//       "Never input it with anyone online",
//       "Never store it with anyone",
//     ],
//     tip: "In the future you might consider using Solana with a hardware wallet to further increase your security.",
//     highlight:
//       "⚠️ Anyone who has access to your recovery phrase has access to your wallet.",
//   },
//   {
//     number: 4,
//     title: "Set a Strong Password or Use Biometrics",
//     icon: "🔐",
//     accent: "rgba(99,102,241,0.8)",
//     border: "rgba(99,102,241,0.35)",
//     bg: "rgba(99,102,241,0.07)",
//     content:
//       "Our recommendation is that you use a complex, randomly generated password depending on your device. You can set an additional layer of security to protect access to your Solana wallet. Your password is your first line of defence. Your best protection: Never share your password!",
//     details: [
//       "Set a strong password you haven't used elsewhere",
//       "Enable biometric authentication if your device supports it",
//       "Your password protects local access to your wallet app",
//     ],
//     tip: "Use a complex random password that you don't use elsewhere.",
//     highlight: null,
//   },
//   {
//     number: 5,
//     title: "You're All Set",
//     icon: "✅",
//     accent: "rgba(74,222,128,0.8)",
//     border: "rgba(74,222,128,0.35)",
//     bg: "rgba(74,222,128,0.06)",
//     content: "Congratulations! You now have your Solana address ready to use.",
//     details: [
//       "You can now receive SOL, NFTs, tokens",
//       "Send and receive SOL or SPL tokens",
//       "Access dApps, DeFi, and NFT marketplaces",
//       "Participate within the Scotty Pumpkin ecosystem",
//     ],
//     tip: "You're on your way to the decentralised web — and you're in control.",
//     highlight: null,
//   },
//   {
//     number: 6,
//     title: "Copy Your Wallet Public Address",
//     icon: "📋",
//     accent: "rgba(245,158,11,0.8)",
//     border: "rgba(245,158,11,0.35)",
//     bg: "rgba(245,158,11,0.07)",
//     content:
//       "Your public address is displayed at the top of the interface. Simply click the wallet name or the address to copy it to your clipboard.",
//     details: [
//       "Open your wallet app or extension",
//       "Your public address is shown at the top of the screen",
//       "Click or tap the wallet name or address to copy",
//       "The address is now on your clipboard",
//     ],
//     tip: null,
//     highlight:
//       "✅ Paste the Copied Wallet Public address in your Bank Transfer Form.",
//     highlightGreen: true,
//   },
// ];

const STEPS = [
  {
    number: 1,
    title: "Download the Wallet",
    icon: "📲",

    accent: "#f17005",
    border: "rgba(241,112,5,0.22)",
    bg: "rgba(241,112,5,0.08)",

    content:
      "Solana is available as a browser extension. You can also download the mobile app or use it as a browser extension.",

    details: [
      "Visit the official Belfax / Phantom wallet website",
      "Choose Download now for your platform",
      "Install the browser extension or mobile app",
      "Open the wallet once installed",
    ],

    tip: null,
    highlight: null,
  },

  {
    number: 2,
    title: "Create a New Wallet",
    icon: "👛",

    accent: "#d96506",
    border: "rgba(217,101,6,0.22)",
    bg: "rgba(217,101,6,0.08)",

    content:
      "Once you open Solana, choose Create wallet on the onboarding page or 'I need a new wallet'. This will give you a unique secret recovery phrase — this is the most important part of your wallet setup.",

    details: [
      "Open your wallet app or browser extension",
      "Tap or click 'Create a new wallet'",
      "Follow the on-screen setup instructions",
    ],

    tip: null,
    highlight: null,
  },

  {
    number: 3,
    title: "Save Your Recovery Phrase (Manually)",
    icon: "📝",

    accent: "#dc2626",
    border: "rgba(220,38,38,0.18)",
    bg: "rgba(220,38,38,0.06)",

    content:
      "Your recovery phrase (also known as a seed phrase) is a group of 12 or 24 words in a specific order that acts as your master password. Think of it as your master password.",

    details: [
      "Write down your seed phrase on paper and keep it offline",
      "Never store it electronically",
      "Confirm the recovery phrase and you have protected it correctly",
    ],

    dos: [
      "Write it down on paper and keep it offline",
      "Store multiple copies somewhere safe",
      "Consider storing offline with a hardware wallet",
    ],

    donts: [
      "Never take a screenshot or photo of your phrase",
      "Never share your phrase with anyone",
      "Never input it with anyone online",
      "Never store it with anyone",
    ],

    tip: "In the future you might consider using Solana with a hardware wallet to further increase your security.",

    highlight:
      "⚠️ Anyone who has access to your recovery phrase has access to your wallet.",
  },

  {
    number: 4,
    title: "Set a Strong Password or Use Biometrics",
    icon: "🔐",

    accent: "#0f2027",
    border: "rgba(15,32,39,0.16)",
    bg: "rgba(15,32,39,0.05)",

    content:
      "Our recommendation is that you use a complex, randomly generated password depending on your device. You can set an additional layer of security to protect access to your Solana wallet. Your password is your first line of defence. Your best protection: Never share your password!",

    details: [
      "Set a strong password you haven't used elsewhere",
      "Enable biometric authentication if your device supports it",
      "Your password protects local access to your wallet app",
    ],

    tip: "Use a complex random password that you don't use elsewhere.",

    highlight: null,
  },

  {
    number: 5,
    title: "You're All Set",
    icon: "✅",

    accent: "#16a34a",
    border: "rgba(22,163,74,0.18)",
    bg: "rgba(22,163,74,0.06)",

    content: "Congratulations! You now have your Solana address ready to use.",

    details: [
      "You can now receive SOL, NFTs, tokens",
      "Send and receive SOL or SPL tokens",
      "Access dApps, DeFi, and NFT marketplaces",
      "Participate within the Scotty Pumpkin ecosystem",
    ],

    tip: "You're on your way to the decentralised web — and you're in control.",

    highlight: null,
  },

  {
    number: 6,
    title: "Copy Your Wallet Public Address",
    icon: "📋",

    accent: "#f17005",
    border: "rgba(241,112,5,0.22)",
    bg: "rgba(241,112,5,0.08)",

    content:
      "Your public address is displayed at the top of the interface. Simply click the wallet name or the address to copy it to your clipboard.",

    details: [
      "Open your wallet app or extension",
      "Your public address is shown at the top of the screen",
      "Click or tap the wallet name or address to copy",
      "The address is now on your clipboard",
    ],

    tip: null,

    highlight:
      "✅ Paste the copied wallet public address in your Bank Transfer Form.",

    highlightGreen: true,
  },
];

export default function BankPurchaseHelpGuide() {
  const [activeStep, setActiveStep] = useState(null);
  const [copiedDemo, setCopiedDemo] = useState(false);

  function handleCopyDemo() {
    setCopiedDemo(true);
    setTimeout(() => setCopiedDemo(false), 2000);
  }

  return (
    <>
      <section
        className="relative z-10 px-4 py-10 md:py-14 lg:px-10"
        style={{ animation: "hg-fade-up 0.4s ease both" }}>
        <div className="max-w-2xl mx-auto space-y-8">
          {/* ── Hero ── */}
          <div className="text-center space-y-3">
            <p className="text-xs font-black tracking-widest uppercase text-primary">
              Bank Transfer Flow
            </p>
            <h1 className="text-secondary text-5xl md:text-6xl font-black leading-tight">
              Setting Up &amp; Getting Your Wallet Public Address
            </h1>
            <p className="text-sm leading-relaxed text-secondary/80 max-w-lg mx-auto">
              Follow this step-by-step guide to create your Solana wallet and
              retrieve your public address for the SPUMP Bank Transfer form.
            </p>
          </div>

          {/* ── Progress indicator ── */}
          <div className="hg-panel bg-white/80 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                Setup Progress
              </p>
              <p className="text-xs font-bold text-primary">6 Steps</p>
            </div>
            <div className="hg-progress-track">
              <div
                className="hg-progress-fill"
                style={{
                  width: activeStep ? `${(activeStep / 6) * 100}%` : "8%",
                }}
              />
            </div>
            <div className="flex justify-between">
              {STEPS.map((s) => (
                <button
                  key={s.number}
                  onClick={() =>
                    setActiveStep(activeStep === s.number ? null : s.number)
                  }
                  className="w-8 h-8 rounded text-xs font-black cursor-pointer transition-all"
                  style={{
                    background:
                      activeStep === s.number
                        ? "linear-gradient(135deg, #f17005 0%, #d96506 100%)"
                        : "rgba(15, 32, 39, 0.06)",

                    border: `1px solid ${
                      activeStep === s.number
                        ? "rgba(241,112,5,0.35)"
                        : "rgba(15,32,39,0.08)"
                    }`,

                    color:
                      activeStep === s.number
                        ? "#ffffff"
                        : "rgba(15,32,39,0.55)",

                    boxShadow:
                      activeStep === s.number
                        ? "0 8px 18px rgba(241,112,5,0.22)"
                        : "none",
                  }}>
                  {s.number}
                </button>
              ))}
            </div>
          </div>

          <div className="hg-divider" />

          {/* ── Steps accordion ── */}
          <div className="space-y-3">
            {STEPS.map((step) => {
              const isOpen = activeStep === step.number;
              return (
                <div
                  key={step.number}
                  className={`hg-step-card ${isOpen ? "active" : ""}`}
                  style={{
                    "--step-accent": step.border,
                    "--step-glow": step.bg,
                  }}
                  onClick={() => setActiveStep(isOpen ? null : step.number)}>
                  {/* Header */}
                  <div className="flex items-center gap-3.5 p-4">
                    <div
                      className="hg-step-num"
                      style={{
                        background: step.bg,
                        border: `1px solid ${step.border}`,
                      }}>
                      <span style={{ color: step.accent }}>{step.number}</span>
                    </div>
                    <span className="text-3xl shrink-0">{step.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-secondary font-black text-base">
                        {step.title}
                      </p>
                    </div>
                    <svg
                      className={`hg-chevron ${isOpen ? "open" : ""} shrink-0`}
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Expanded body */}
                  {isOpen && (
                    <div
                      className="hg-expanded px-5 pb-5 border-t pt-4"
                      style={{ borderTop: `1px solid ${step.border}` }}
                      onClick={(e) => e.stopPropagation()}>
                      <div className="space-y-4">
                        {/* Main description */}
                        <p className="text-secondary/80 text-sm leading-relaxed">
                          {step.content}
                        </p>

                        {/* Detail list */}
                        {step.details && (
                          <div className="bg-white text-secondary/80 border border-secondary/50 rounded-lg p-3">
                            {step.details.map((d, i) => (
                              <div
                                key={i}
                                className="text-secondary/80 space-y-4 py-2 flex gap-2 items-center">
                                <span
                                  style={{
                                    color: step.accent,
                                    flexShrink: 0,
                                    marginTop: 2,
                                  }}>
                                  ✓
                                </span>
                                {d}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Do / Don't (step 3) */}
                        {step.dos && step.donts && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="hg-do-card">
                              <p className="text-green-400 font-black text-xs uppercase tracking-widest mb-2">
                                ✅ Do
                              </p>
                              {step.dos.map((d, i) => (
                                <p
                                  key={i}
                                  className="text-secondary/80 text-xs leading-relaxed mb-1">
                                  • {d}
                                </p>
                              ))}
                            </div>
                            <div className="hg-dont-card">
                              <p className="text-red-400 font-black text-xs uppercase tracking-widest mb-2">
                                🚫 Don't
                              </p>
                              {step.donts.map((d, i) => (
                                <p
                                  key={i}
                                  className="text-secondary/80 text-xs leading-relaxed mb-1">
                                  • {d}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Mock wallet UI (step 6) */}
                        {step.number === 6 && (
                          <div className="hg-mock-wallet">
                            <p className="text-secondary/80 text-xs font-bold uppercase tracking-widest mb-2">
                              Your Wallet — Example
                            </p>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">👛</span>
                              <span className="text-secondary/80 text-sm font-semibold">
                                Main Wallet
                              </span>
                            </div>
                            <div
                              className="hg-mock-address"
                              onClick={handleCopyDemo}>
                              7Q8EjhdB6qakUfhwjBVnNsD6Ks9FsTMVtG7dzE3KopRG
                            </div>
                            <div className="flex justify-end mt-2">
                              <button
                                className="hg-copy-btn"
                                onClick={handleCopyDemo}>
                                {copiedDemo ? "✓ Copied!" : "📋 Copy Address"}
                              </button>
                            </div>
                            <p className="text-secondary/70 text-xs mt-1.5">
                              👆 Click the address or Copy button to copy to
                              clipboard
                            </p>
                          </div>
                        )}

                        {/* Highlight box */}
                        {step.highlight && (
                          <div
                            className={`hg-highlight ${step.highlightGreen ? "success" : "warn"}`}>
                            {step.highlight}
                          </div>
                        )}

                        {/* Tip */}
                        {step.tip && (
                          <div className="hg-tip">
                            💡 <strong>Tip:</strong> {step.tip}
                          </div>
                        )}

                        {/* Next step hint */}
                        {step.number < 6 && (
                          <button
                            onClick={() => setActiveStep(step.number + 1)}
                            className="flex items-center gap-1.5 text-xs font-bold bg-transparent border-none cursor-pointer pt-1"
                            style={{ color: step.accent }}>
                            Next: Step {step.number + 1} →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hg-divider" />

          {/* ── Final CTA ── */}
          <div
            className="hg-panel rounded-2xl p-6 text-center space-y-4"
            style={{
              border: "1px solid rgba(245,158,11,0.25)",
              animation: "hg-glow-pulse 4s ease-in-out infinite",
            }}>
            <span
              className="text-5xl block"
              style={{ animation: "hg-float 3s ease-in-out infinite" }}>
              🎃
            </span>
            <h3 className="text-secondary font-black text-lg">
              Ready to Buy SPUMP?
            </h3>
            <p className="text-secondary/80 text-sm leading-relaxed max-w-sm mx-auto">
              Now that you have your Solana wallet public address, you can paste
              it into the Bank Transfer form and complete your SPUMP purchase.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/bank-purchase">
                <button className="bg-primary/90 hover:bg-primary border border-primary rounded-lg px-7 py-2.5 font-black text-sm text-white cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
                  → Go to Bank Transfer
                </button>
              </Link>
            </div>
            <p className="text-secondary/70 text-xs">
              support@scottypumpkin.com
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
