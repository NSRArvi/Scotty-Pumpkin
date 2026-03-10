"use client";

import { useState, useEffect } from "react";

const TREASURY_WALLET = "3rjicH8CYBVACj5d'Ya1ptcgAXXhytopAK6uiP7aLoRq2H";
const TREASURY_WALLET_FULL = "3rjicH8CYBVACj5dYa1ptcgAXXhytopAK6uiP7aLoRq2H";
const ORDER_REF = "SP-NFT-8F41K2Q";
const BASE_PRICE = 3972;
const DISCOUNTED = 3378;
const EXPIRES_SECONDS = 15 * 60 - 1; // 14:59

export default function CheckoutPage() {
  const [tab, setTab] = useState("smart"); // "smart" | "manual"
  const [generated, setGenerated] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState("connected");
  const [confirmed, setConfirmed] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXPIRES_SECONDS);
  const [checkedOut, setCheckedOut] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!generated) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [generated]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  function copy(text, setter) {
    navigator.clipboard.writeText(text).catch(() => {});
    setter(true);
    setTimeout(() => setter(false), 2000);
  }

  return (
    <>
      <style>{`
        @keyframes sp-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes sp-fade-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sp-glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.25); }
          50%       { box-shadow: 0 0 40px rgba(245,158,11,0.55), 0 0 80px rgba(245,158,11,0.15); }
        }
        @keyframes sp-border-pulse {
          0%, 100% { border-color: rgba(245,158,11,0.35); }
          50%       { border-color: rgba(245,158,11,0.75); }
        }
        @keyframes sp-timer-pulse {
          0%, 100% { color: rgba(245,158,11,0.8); }
          50%       { color: rgba(245,158,11,1); text-shadow: 0 0 12px rgba(245,158,11,0.6); }
        }
        @keyframes sp-tick {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }

        .co-title {
          background: linear-gradient(135deg, #f59e0b 0%, #fcd34d 40%, #f59e0b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: sp-shimmer 4s linear infinite;
          filter: drop-shadow(0 0 20px rgba(245,158,11,0.35));
        }

        /* Outer wrapper card — matches the amber-bordered card in screenshot */
        .co-outer {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(245,158,11,0.3);
          box-shadow: 0 0 0 1px rgba(245,158,11,0.08), 0 12px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06);
          animation: sp-border-pulse 4s ease-in-out infinite;
        }

        /* Inner glass section */
        .co-section {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }

        /* Tab switcher */
        .co-tab-bar {
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(245,158,11,0.25);
          border-radius: 10px;
          padding: 3px;
          display: flex;
          gap: 2px;
        }
        .co-tab {
          flex: 1;
          padding: 9px 14px;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 700;
          text-align: center;
          cursor: pointer;
          transition: all 0.22s ease;
          color: rgba(255,255,255,0.45);
          border: 1px solid transparent;
        }
        .co-tab.active {
          background: rgba(245,158,11,0.15);
          border-color: rgba(245,158,11,0.4);
          color: #fbbf24;
          box-shadow: 0 0 16px rgba(245,158,11,0.2);
        }
        .co-tab:hover:not(.active) {
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.04);
        }

        /* Section label */
        .co-section-label {
          font-size: 0.72rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #f59e0b;
          text-align: center;
        }

        /* Generate button */
        .co-gen-btn {
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.4);
          transition: all 0.22s ease;
          animation: sp-glow-pulse 3s ease-in-out infinite;
        }
        .co-gen-btn:hover {
          background: rgba(245,158,11,0.18);
          border-color: rgba(245,158,11,0.7);
          transform: scale(1.02);
        }
        .co-gen-btn.done {
          background: rgba(74,222,128,0.1);
          border-color: rgba(74,222,128,0.4);
          animation: none;
        }

        /* Detail rows */
        .co-detail-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.82rem;
        }
        .co-detail-row:last-child { border-bottom: none; }
        .co-detail-label { color: rgba(255,255,255,0.45); flex-shrink: 0; min-width: 140px; }
        .co-detail-value { color: rgba(255,255,255,0.85); font-weight: 600; flex: 1; word-break: break-all; }

        /* Copy inline btn */
        .co-copy-inline {
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.35);
          border-radius: 7px;
          padding: 4px 10px;
          font-size: 0.72rem;
          font-weight: 700;
          color: #fbbf24;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .co-copy-inline:hover {
          background: rgba(245,158,11,0.22);
          border-color: rgba(245,158,11,0.6);
        }

        /* Timer */
        .co-timer {
          font-family: monospace;
          font-size: 1rem;
          font-weight: 900;
          animation: sp-timer-pulse 1s ease-in-out infinite, sp-tick 1s ease-in-out infinite;
        }

        /* Action buttons */
        .co-action-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(245,158,11,0.3);
          transition: all 0.22s ease;
          flex: 1;
          padding: 11px;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          color: rgba(255,255,255,0.75);
          text-align: center;
          cursor: pointer;
        }
        .co-action-btn:hover {
          background: rgba(245,158,11,0.1);
          border-color: rgba(245,158,11,0.55);
          color: #fbbf24;
        }

        /* Checkout btn */
        .co-checkout-btn {
          background: rgba(255,255,255,0.05);
          border: 2px solid rgba(245,158,11,0.55);
          transition: all 0.25s ease;
          box-shadow: 0 4px 24px rgba(245,158,11,0.15);
          animation: sp-glow-pulse 3s ease-in-out infinite;
        }
        .co-checkout-btn:hover {
          background: rgba(245,158,11,0.12);
          border-color: rgba(245,158,11,0.85);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(245,158,11,0.3);
        }
        .co-checkout-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
          animation: none;
        }
        .co-checkout-btn.done {
          background: rgba(74,222,128,0.12);
          border-color: rgba(74,222,128,0.6);
          animation: none;
        }

        /* Radio */
        .co-radio {
          width: 18px; height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .co-radio.active {
          border-color: rgba(245,158,11,0.8);
          background: rgba(245,158,11,0.12);
        }
        .co-radio-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #f59e0b;
        }

        /* Checkbox */
        .co-checkbox {
          width: 16px; height: 16px;
          border-radius: 4px;
          border: 2px solid rgba(245,158,11,0.4);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .co-checkbox.checked {
          background: rgba(245,158,11,0.8);
          border-color: rgba(245,158,11,1);
        }

        /* QR modal */
        .co-qr-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          z-index: 100;
          animation: sp-fade-up 0.2s ease both;
        }
        .co-qr-modal {
          background: rgba(15,5,30,0.9);
          border: 1px solid rgba(245,158,11,0.4);
          border-radius: 20px;
          padding: 32px;
          text-align: center;
          space-y: 4;
          box-shadow: 0 0 60px rgba(245,158,11,0.2);
        }

        /* NFT thumb */
        .co-nft-thumb {
          width: 80px; height: 80px;
          border-radius: 10px;
          border: 1px solid rgba(245,158,11,0.3);
          object-fit: cover;
          flex-shrink: 0;
          background: rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          font-size: 2.2rem;
        }

        .co-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(245,158,11,0.25) 50%, transparent);
        }

        /* Manual tab wallet box */
        .co-wallet-mono {
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 10px;
          padding: 10px 14px;
          font-family: monospace;
          font-size: 0.72rem;
          color: rgba(245,158,11,0.8);
          word-break: break-all;
          line-height: 1.6;
        }
      `}</style>

      {/* QR Modal */}
      {showQR && (
        <div className="co-qr-overlay" onClick={() => setShowQR(false)}>
          <div className="co-qr-modal" onClick={(e) => e.stopPropagation()}>
            <p className="text-amber-400 font-black text-sm tracking-widest uppercase mb-4">Scan to Pay</p>
            {/* QR placeholder grid */}
            <div className="mx-auto mb-4" style={{ width: 160, height: 160, background: "white", borderRadius: 8, display: "grid", placeItems: "center" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 2, padding: 10, width: "100%", height: "100%" }}>
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} style={{ background: Math.random() > 0.45 ? "#000" : "#fff", borderRadius: 1 }} />
                ))}
              </div>
            </div>
            <p className="text-white/50 text-xs mb-1">Amount: <span className="text-amber-400 font-bold">{DISCOUNTED} SPUMP</span></p>
            <p className="text-white/35 text-xs mb-4">Ref: {ORDER_REF}</p>
            <button onClick={() => setShowQR(false)} className="text-white/40 text-xs hover:text-white/70 transition-colors">✕ Close</button>
          </div>
        </div>
      )}

      <section className="relative z-10 px-4 py-10 md:py-14 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6" style={{ animation: "sp-fade-up 0.4s ease both" }}>

          {/* ── Title ── */}
          <h1 className="co-title text-3xl md:text-4xl font-black text-center tracking-widest uppercase">
            Checkout – Tableau 11
          </h1>

          {/* ── Outer card ── */}
          <div className="co-outer rounded-2xl p-5 md:p-6 space-y-5">

            {/* NFT Summary row */}
            <div className="flex items-center gap-4">
              <div className="co-nft-thumb">🖼️</div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white font-black text-lg leading-tight">Tableau 11</p>
                  <button className="text-amber-400/70 text-sm font-semibold hover:text-amber-400 transition-colors flex-shrink-0">Edit</button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white/55 text-xs">Brian Fin</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd" }}>🤝 Verified</span>
                </div>
                <p className="text-white/40 text-xs">Original Digital NFT – 1 of 1</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-amber-400 font-black text-xl">{BASE_PRICE.toLocaleString()}</p>
                <p className="text-amber-400/70 text-xs font-bold">SPUMP</p>
              </div>
            </div>

            {/* Network + Balance row */}
            <div className="flex items-center justify-between">
              <p className="text-white/50 text-sm">Network: <span className="text-white/75 font-semibold">Solana</span></p>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)", color: "#fbbf24" }}>
                Balance: 2,490 SPUMP
              </span>
            </div>

            <div className="co-divider" />

            {/* Payment method section */}
            <div className="space-y-3">
              <div className="co-section-label">SPAYMENT Method &amp; Discounts</div>
              <p className="text-center text-white/35 text-xs">Generates a unique reference for your order. Funds still go to Scotty Treasury.</p>

              {/* Tab switcher */}
              <div className="co-tab-bar">
                <div className={`co-tab ${tab === "smart" ? "active" : ""}`} onClick={() => setTab("smart")}>
                  Smart Request (Auto-Verify)
                </div>
                <div className={`co-tab ${tab === "manual" ? "active" : ""}`} onClick={() => setTab("manual")}>
                  Manual Send (Copy Address)
                </div>
              </div>
            </div>

            {/* ── SMART TAB ── */}
            {tab === "smart" && (
              <div className="co-section rounded-xl p-5 space-y-5">
                <div className="space-y-1 text-center">
                  <p className="co-section-label">— Smart Payment Generator ⚙</p>
                  <p className="text-white/35 text-xs">Creates a unique reference for your order. Funds still go to Scotty Treasury.</p>
                </div>

                {/* Generate button */}
                <button
                  onClick={() => setGenerated(true)}
                  className={`co-gen-btn w-full py-3.5 rounded-xl font-black text-sm tracking-wider flex items-center justify-center gap-2 ${generated ? "done" : ""}`}
                >
                  {generated
                    ? <><span className="text-green-400">✓</span> Payment Request Generated</>
                    : <><span>📋</span> Generate Payment Request</>
                  }
                </button>

                {generated && (
                  <div className="co-wallet-mono text-xs text-white/50 text-center">
                    Creates a unique reference for your order. Funds still go to Scotty Treasury.
                  </div>
                )}

                {/* Step B */}
                {generated && (
                  <div className="space-y-1">
                    <p className="text-amber-400/80 text-xs font-bold mb-3">Step B – Request Details</p>

                    <div className="co-detail-row">
                      <span className="co-detail-label">Treasury Wallet:</span>
                      <span className="co-detail-value text-amber-300/80 font-mono text-xs truncate">{TREASURY_WALLET}</span>
                      <span className="text-amber-400/50 text-sm">›</span>
                    </div>
                    <div className="co-detail-row">
                      <span className="co-detail-label">Token:</span>
                      <span className="co-detail-value text-amber-400 font-black">SPUMP</span>
                    </div>
                    <div className="co-detail-row">
                      <span className="co-detail-label">Amount Due:</span>
                      <span className="co-detail-value text-amber-400 font-black">{DISCOUNTED.toLocaleString()} SPUMP</span>
                    </div>
                    <div className="co-detail-row">
                      <span className="co-detail-label">Order Reference (Memo):</span>
                      <span className="co-detail-value text-white font-mono font-bold">{ORDER_REF}</span>
                      <button className="co-copy-inline" onClick={() => copy(ORDER_REF, setCopiedRef)}>
                        {copiedRef ? "✓" : "Copy"} ›
                      </button>
                    </div>
                    <div className="co-detail-row" style={{ borderBottom: "none" }}>
                      <span className="co-detail-label">Expires in:</span>
                      <span className={`co-timer font-mono font-black ${timeLeft < 60 ? "text-red-400" : "text-amber-400"}`}>
                        {mins}:{secs}
                      </span>
                    </div>
                  </div>
                )}

                {/* Open in wallet / Show QR */}
                {generated && (
                  <div className="flex gap-3">
                    <button className="co-action-btn">📱 Open in Wallet</button>
                    <button className="co-action-btn" onClick={() => setShowQR(true)}>
                      <span className="inline-block mr-1">▦</span> Show QR
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── MANUAL TAB ── */}
            {tab === "manual" && (
              <div className="co-section rounded-xl p-5 space-y-4">
                <p className="text-amber-400/80 text-xs font-bold">Treasury Wallet Address</p>
                <div className="co-wallet-mono">
                  {TREASURY_WALLET_FULL}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-white/45 text-xs">
                    Network: <span className="text-white/70 font-semibold">Solana (SOL)</span>
                  </div>
                  <button className="co-copy-inline" onClick={() => copy(TREASURY_WALLET_FULL, setCopiedWallet)}>
                    {copiedWallet ? "✓ Copied!" : "Copy Address"}
                  </button>
                </div>
                <div className="space-y-1">
                  {["Only send SPUMP", "No extra fees", "Include exact amount"].map((w) => (
                    <p key={w} className="text-amber-300/60 text-xs flex items-center gap-2">
                      <span>⚠️</span> {w}
                    </p>
                  ))}
                </div>
                <div className="co-detail-row" style={{ borderBottom: "none" }}>
                  <span className="co-detail-label">Amount:</span>
                  <span className="text-amber-400 font-black">{DISCOUNTED.toLocaleString()} SPUMP</span>
                </div>
              </div>
            )}

            <div className="co-divider" />

            {/* Step D — Auto Verification */}
            <div className="space-y-3">
              <p className="text-amber-400/80 text-xs font-bold">Step D – Auto Verification</p>

              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setDeliveryMode("connected")}>
                <div className={`co-radio ${deliveryMode === "connected" ? "active" : ""}`}>
                  {deliveryMode === "connected" && <div className="co-radio-dot" />}
                </div>
                <span className="text-white/75 text-sm">Use connected wallet <span className="text-amber-400/70 text-xs">(Recommended)</span></span>
              </div>

              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setDeliveryMode("manual")}>
                <div className={`co-radio ${deliveryMode === "manual" ? "active" : ""}`}>
                  {deliveryMode === "manual" && <div className="co-radio-dot" />}
                </div>
                <span className="text-white/75 text-sm">Enter manually</span>
              </div>

              {deliveryMode === "manual" && (
                <input
                  className="w-full rounded-lg px-3 py-2.5 text-sm outline-none"
                  placeholder="Paste wallet address..."
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}
                />
              )}

              {/* Confirm checkbox */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setConfirmed((v) => !v)}>
                <div className={`co-checkbox ${confirmed ? "checked" : ""}`}>
                  {confirmed && <span className="text-black text-xs font-black leading-none">✓</span>}
                </div>
                <span className="text-white/60 text-sm">I confirm this address is correct</span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              disabled={!confirmed}
              onClick={() => confirmed && setCheckedOut(true)}
              className={`co-checkout-btn w-full py-4 rounded-xl font-bold text-lg text-white tracking-wide flex items-center justify-center gap-3 ${checkedOut ? "done" : ""}`}
            >
              {checkedOut ? "✓ Purchase Complete!" : <>Checkout Purchase <span className="text-amber-400">→</span></>}
            </button>

            {/* Legal note */}
            <p className="text-center text-white/25 text-xs leading-relaxed">
              By confirming your purchase, you agree to the{" "}
              <span className="text-amber-400/60 underline cursor-pointer hover:text-amber-400 transition-colors">
                Terms of Service &amp; Refund Policy
              </span>
              .
            </p>

          </div>
        </div>
      </section>
    </>
  );
}