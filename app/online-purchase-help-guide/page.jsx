"use client";

import Link from "next/link";
import { useState } from "react";

const TREASURY_WALLET = "7Q8EjhdB6qakUfhwjBVnNsD6Ks9FsTMVtG7dzE3KopRG";
const SPUMP_PRICE = 0.01;

const PROCESSES = [
  {
    id: "wallet",
    number: "01",
    label: "Process 1",
    title: "Wallet Setup",
    icon: "👛",
    accentClass: "text-amber-400",
    borderClass: "border-amber-500/30",
    bgClass: "bg-amber-500/5",
    glowClass: "shadow-amber-500/10",
    desc: "Set up your Solana wallet before making any transfer. Follow the same process as the Bank Transfer Wallet Setup Flow.",
    link: "See Wallet Setup Guide →",
    href: "/bank-purchase-help-guide",
  },
  {
    id: "fund",
    number: "02",
    label: "Process 2",
    title: "Fund Your Wallet",
    icon: "💰",
    accentClass: "text-purple-400",
    borderClass: "border-purple-500/30",
    bgClass: "bg-purple-500/5",
    glowClass: "shadow-purple-500/10",
    desc: "Add SOL, USDC, or USDT to your wallet before executing the transfer.",
    steps: [
      {
        n: "Step 1", title: "Open Your Wallet",
        items: ["Launch the Solflare app (mobile or browser extension)", "Log in to your wallet"],
      },
      {
        n: "Step 2", title: "Copy Your Wallet Address",
        items: ["Click on Receive", "Copy your Solana wallet address"],
      },
      {
        n: "Step 3", title: "Add SOL / USDC / USDT to Your Wallet",
        options: [
          {
            label: "Option A — Transfer from Another Wallet",
            items: ["Open another wallet (e.g., Phantom)", "Send SOL to your copied Solflare address"],
          },
          {
            label: "Option B — Transfer from an Exchange",
            sub: "Platforms: Binance, Coinbase",
            items: ["Go to Withdraw", "Select SOL (Solana)", "Paste your Solflare wallet address", "Choose Solana network", "Confirm transfer"],
          },
          {
            label: "Option C — Buy SOL Directly",
            items: ["In Solflare, click 'Buy'", "Choose a payment provider", "Complete purchase using card or bank transfer"],
          },
        ],
      },
      {
        n: "Step 4", title: "Confirm Balance",
        items: ["Return to your wallet dashboard", "Ensure SOL balance is updated"],
      },
    ],
  },
  {
    id: "transfer",
    number: "03",
    label: "Process 3",
    title: "Execute Transfer & Copy Tx Signature",
    icon: "🔏",
    accentClass: "text-indigo-400",
    borderClass: "border-indigo-500/30",
    bgClass: "bg-indigo-500/5",
    glowClass: "shadow-indigo-500/10",
    desc: "Send your crypto to the Scotty Pumpkin Treasury Wallet and retrieve your Transaction Signature to submit.",
    steps: [
      {
        n: "Step 1", title: "Perform a Transaction",
        items: [
          "Copy the Official Treasury Wallet Public Address below",
          "Choose Send Option from your wallet dashboard",
          "Enter your desired amount of SOL / USDC / USDT",
          "Enter the Treasury Wallet Address as recipient",
          "Double-check the amount, recipient address, and network (SOL)",
          "Verify the address multiple times before confirming",
        ],
        treasury: true,
      },
      {
        n: "Step 2", title: "Verify Status",
        items: ["Once transfer is executed, verify the transaction status shows 'SUCCESS'"],
        badge: { label: "SUCCESS", color: "text-green-400 bg-green-500/10 border-green-500/30" },
      },
      {
        n: "Step 3", title: "Activity Status",
        items: ["The successful transaction appears in the Activity tab", "The 'Activity Tab' appears in the bottom navigation bar"],
      },
      {
        n: "Step 4", title: "Open Activity in Explorer",
        items: [
          "Open the Activity tab in your wallet",
          "Choose the transfer for Scotty Pumpkin",
          "Click the activity to 'View on Explorer'",
          "You will be redirected to SOLSCAN",
        ],
        badge: { label: "SOLSCAN", color: "text-blue-400 bg-blue-500/10 border-blue-500/30" },
      },
      {
        n: "Step 5", title: "Copy Transfer Signature",
        items: [
          "Verify the transfer details on the explorer page",
          "Verify the From and To addresses and the amount transferred",
          "Once verified, copy the Transfer Signature",
          "Paste the signature into the CRYPTO TRANSFER FORM",
          "Verify the hash inside the form and proceed to submit",
        ],
        isFinal: true,
      },
    ],
  },
];

export default function CryptoGuide() {
  const [activeProcess, setActiveProcess] = useState("transfer");
  const [calcAmount, setCalcAmount] = useState("");
  const [calcCoin, setCalcCoin] = useState("USDC");
  const [copied, setCopied] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);

  const spumpCount = calcAmount ? Math.floor(parseFloat(calcAmount) / SPUMP_PRICE) : 0;

  function copyWallet() {
    navigator.clipboard.writeText(TREASURY_WALLET).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const current = PROCESSES.find((p) => p.id === activeProcess);

  return (
    <section className="relative z-10 px-4 py-10 md:py-14 lg:px-10">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* ── Hero ── */}
        <div className="text-center space-y-3">
          <p className="text-amber-500/70 text-xs font-black uppercase tracking-widest">Support Guide</p>
          <h1 className="sp-shimmer-heading text-3xl md:text-4xl lg:text-5xl font-black">
            Crypto Transfer Guide
          </h1>
          <p className="text-white/45 text-sm md:text-base leading-relaxed max-w-lg mx-auto">
            To complete your submission, provide your transaction hash (TxHash). Your SPUMP payment will be processed only after the hash is successfully validated on the blockchain.
          </p>
        </div>

        {/* ── SPUMP Calculator ── */}
        <div className="sp-step-card rounded-2xl p-5 space-y-4">
          <p className="text-amber-400 text-xs font-black uppercase tracking-widest">SPUMP Count Calculator</p>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex items-center gap-2 flex-1 w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
              <span className="text-white/40 text-sm">$</span>
              <input
                type="number"
                min="0"
                placeholder="Enter amount in USD"
                value={calcAmount}
                onChange={(e) => setCalcAmount(e.target.value)}
                className="bg-transparent outline-none text-white/80 text-sm w-full placeholder-white/20"
              />
            </div>
            <select
              value={calcCoin}
              onChange={(e) => setCalcCoin(e.target.value)}
              className="bg-white/5 border border-white/10 text-white/70 text-sm rounded-xl px-4 py-2.5 outline-none cursor-pointer"
            >
              {["USDC", "USDT", "SOL"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <div className="flex items-center gap-2 bg-amber-500/8 border border-amber-500/25 rounded-xl px-4 py-2.5 min-w-[160px]">
              <span className="text-xl">🎃</span>
              <span className="text-amber-400 font-black text-sm">{spumpCount > 0 ? spumpCount.toLocaleString() : "0"} SPUMP</span>
            </div>
          </div>
          <p className="text-white/25 text-xs">Rate: $0.01 USD = 1 SPUMP · All figures are estimates</p>
        </div>

        {/* ── Process Tab Nav ── */}
        <div className="grid grid-cols-3 gap-3">
          {PROCESSES.map((p) => (
            <button
              key={p.id}
              onClick={() => { setActiveProcess(p.id); setExpandedStep(null); }}
              className={`rounded-xl p-4 text-left border transition-all duration-200 cursor-pointer ${
                activeProcess === p.id
                  ? `${p.bgClass} ${p.borderClass} shadow-lg ${p.glowClass}`
                  : "bg-white/3 border-white/7 hover:bg-white/5 hover:border-white/12"
              }`}
            >
              <p className={`text-xs font-black uppercase tracking-widest mb-1 ${activeProcess === p.id ? p.accentClass : "text-white/30"}`}>
                {p.label}
              </p>
              <span className="text-2xl block mb-1">{p.icon}</span>
              <p className={`text-xs font-bold leading-tight ${activeProcess === p.id ? "text-white" : "text-white/45"}`}>
                {p.title}
              </p>
            </button>
          ))}
        </div>

        {/* ── Active Process Content ── */}
        {current && (
          <div className="space-y-4">

            {/* Process header */}
            <div className={`rounded-2xl p-5 border ${current.bgClass} ${current.borderClass}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{current.icon}</span>
                <div>
                  <p className={`text-xs font-black uppercase tracking-widest ${current.accentClass}`}>{current.label}</p>
                  <h2 className="text-white font-black text-xl">{current.title}</h2>
                </div>
              </div>
              <p className="text-white/55 text-sm leading-relaxed">{current.desc}</p>
              {current.link && (
                <Link href={current.href} className={`text-sm font-bold mt-3 ${current.accentClass} cursor-pointer`}>
                  {current.link}
                </Link>
              )}
            </div>

            {/* Steps */}
            {current.steps && (
              <div className="space-y-3">
                {current.steps.map((step, si) => {
                  const key = `${current.id}-${si}`;
                  const isOpen = expandedStep === key;
                  return (
                    <div
                      key={key}
                      className={`sp-step-card rounded-xl overflow-hidden transition-all duration-200 ${isOpen ? `${current.borderClass} shadow-lg` : ""}`}
                    >
                      {/* Step header */}
                      <div
                        className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                        onClick={() => setExpandedStep(isOpen ? null : key)}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${current.bgClass} border ${current.borderClass}`}>
                          <span className={current.accentClass}>{si + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold ${current.accentClass}`}>{step.n}</p>
                          <p className="text-white font-bold text-sm">{step.title}</p>
                        </div>
                        {step.badge && (
                          <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${step.badge.color} flex-shrink-0`}>
                            {step.badge.label}
                          </span>
                        )}
                        {step.isFinal && (
                          <span className="text-xs font-black px-2.5 py-1 rounded-full border text-amber-400 bg-amber-500/10 border-amber-500/30 flex-shrink-0">
                            FINAL
                          </span>
                        )}
                        <svg
                          className={`flex-shrink-0 w-4 h-4 text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      {/* Step body */}
                      {isOpen && (
                        <div className="px-5 pb-5 border-t border-white/[0.06] pt-4 space-y-4">

                          {/* Treasury wallet (step 1 of process 3) */}
                          {step.treasury && (
                            <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 space-y-3">
                              <p className="text-amber-400 text-xs font-black uppercase tracking-widest">Official Treasury Wallet</p>
                              <p className="font-mono text-amber-300/80 text-xs break-all leading-relaxed bg-black/20 rounded-lg px-3 py-2.5 border border-amber-500/15">
                                {TREASURY_WALLET}
                              </p>
                              <button
                                onClick={copyWallet}
                                className="flex items-center gap-2 bg-amber-500/12 border border-amber-500/35 text-amber-400 text-xs font-black px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-amber-500/22"
                              >
                                {copied ? "✓ Copied!" : "📋 Copy Treasury Address"}
                              </button>
                              <div className="flex items-start gap-2 bg-red-500/6 border border-red-500/18 rounded-lg px-3 py-2.5">
                                <span className="text-red-400 flex-shrink-0">⚠️</span>
                                <p className="text-red-300/75 text-xs leading-relaxed">Verify the address multiple times to avoid sending tokens to the wrong destination.</p>
                              </div>
                            </div>
                          )}

                          {/* Regular items */}
                          {step.items && (
                            <div className="space-y-2">
                              {step.items.map((item, ii) => (
                                <div key={ii} className="flex items-start gap-2.5 py-1.5 border-b border-white/[0.04] last:border-b-0">
                                  <span className={`flex-shrink-0 mt-0.5 text-sm ${current.accentClass}`}>✓</span>
                                  <p className="text-white/70 text-sm leading-relaxed">{item}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Options (for funding step) */}
                          {step.options && (
                            <div className="space-y-3">
                              {step.options.map((opt, oi) => (
                                <div key={oi} className="bg-white/3 border border-white/7 rounded-xl p-4 space-y-2">
                                  <p className="text-white/80 text-xs font-black uppercase tracking-wider">{opt.label}</p>
                                  {opt.sub && <p className="text-white/35 text-xs">{opt.sub}</p>}
                                  <div className="space-y-1.5 pt-1">
                                    {opt.items.map((item, ii) => (
                                      <p key={ii} className="flex items-start gap-2 text-white/60 text-sm">
                                        <span className={`flex-shrink-0 ${current.accentClass}`}>›</span>
                                        {item}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Final step highlight */}
                          {step.isFinal && (
                            <div className="bg-amber-500/8 border border-amber-500/25 rounded-xl p-4 flex items-start gap-3">
                              <span className="text-2xl flex-shrink-0">📋</span>
                              <div>
                                <p className="text-amber-400 font-black text-sm mb-1">Paste into Crypto Transfer Form</p>
                                <p className="text-white/55 text-xs leading-relaxed">
                                  Paste the copied Transfer Signature into the Tx Hash field of the CRYPTO TRANSFER FORM, verify the hash, then proceed to submit your application.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Next step btn */}
                          {si < current.steps.length - 1 && (
                            <button
                              onClick={() => setExpandedStep(`${current.id}-${si + 1}`)}
                              className={`text-xs font-bold cursor-pointer bg-transparent border-none ${current.accentClass}`}
                            >
                              Next: {current.steps[si + 1].n} — {current.steps[si + 1].title} →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Divider ── */}
        <div className="sp-divider" />

        {/* ── Footer note ── */}
        <div className="sp-footer-note rounded-2xl p-6 text-center space-y-2">
          <p className="text-white/50 text-sm">
            Need help? Contact{" "}
            <span className="text-purple-300 font-medium">support@scottypumpkin.com</span>
          </p>
          <p className="text-white/25 text-xs">
            Scotty Pumpkin · SPUMP is a utility token — not a financial instrument
          </p>
        </div>

      </div>
    </section>
  );
}