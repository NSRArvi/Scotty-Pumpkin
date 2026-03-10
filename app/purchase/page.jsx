"use client";

import { useState } from "react";

const WALLET_ADDRESS = "3rjicH8cYBVACj5dYaIptegAXhy1opAK6uiP7aLoRq2H";

const BASE_PRICE = 3972;

const PAYMENT_METHODS = [
  {
    id: "spump",
    label: "Pay with",
    bold: "SPUMP",
    icon: "🎃",
    discount: 15,
    unit: "SPUMP",
    accent: "rgba(245,158,11,0.9)",
    border: "rgba(245,158,11,0.6)",
    glow: "rgba(245,158,11,0.2)",
    bg: "rgba(245,158,11,0.08)",
    activeBg: "rgba(245,158,11,0.12)",
  },
  {
    id: "usff",
    label: "Pay with",
    bold: "USFF",
    icon: "💚",
    discount: 15,
    unit: "USFF",
    accent: "rgba(74,222,128,0.9)",
    border: "rgba(74,222,128,0.4)",
    glow: "rgba(74,222,128,0.15)",
    bg: "rgba(74,222,128,0.06)",
    activeBg: "rgba(74,222,128,0.1)",
  },
  {
    id: "sol",
    label: "Pay with",
    bold: "SOL",
    icon: "◎",
    discount: 5,
    unit: "SOL",
    accent: "rgba(99,102,241,0.9)",
    border: "rgba(99,102,241,0.4)",
    glow: "rgba(99,102,241,0.15)",
    bg: "rgba(99,102,241,0.06)",
    activeBg: "rgba(99,102,241,0.1)",
  },
  {
    id: "usdc",
    label: "Pay with",
    bold: "USDC",
    icon: "💵",
    discount: 5,
    unit: "USDC",
    accent: "rgba(59,130,246,0.9)",
    border: "rgba(59,130,246,0.4)",
    glow: "rgba(59,130,246,0.15)",
    bg: "rgba(59,130,246,0.06)",
    activeBg: "rgba(59,130,246,0.1)",
  },
  {
    id: "crypto",
    label: "Pay with Other",
    bold: "Crypto",
    icon: "🔗",
    discount: 5,
    unit: "[Token]",
    accent: "rgba(168,85,247,0.9)",
    border: "rgba(168,85,247,0.4)",
    glow: "rgba(168,85,247,0.15)",
    bg: "rgba(168,85,247,0.06)",
    activeBg: "rgba(168,85,247,0.1)",
  },
  {
    id: "fiat",
    label: "Fiat (Card / Bank)",
    bold: "",
    icon: "💳",
    discount: 0,
    unit: "USD",
    accent: "rgba(255,255,255,0.5)",
    border: "rgba(255,255,255,0.15)",
    glow: "rgba(255,255,255,0.05)",
    bg: "rgba(255,255,255,0.04)",
    activeBg: "rgba(255,255,255,0.07)",
    noDiscount: true,
  },
];

export default function PurchasePage() {
  const [selected, setSelected] = useState("spump");
  const [deliveryMode, setDeliveryMode] = useState("connected");
  const [walletInput, setWalletInput] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const method = PAYMENT_METHODS.find((m) => m.id === selected);
  const discountedPrice = Math.round(BASE_PRICE * (1 - method.discount / 100));
  const saving = BASE_PRICE - discountedPrice;
  const platformFee = Math.round(BASE_PRICE * 0.03);
  const youPay = discountedPrice - platformFee;

  function handleCopy() {
    navigator.clipboard.writeText(WALLET_ADDRESS).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }
        @keyframes sp-arrow-bounce {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(5px); }
        }

        .pu-title {
          background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #f59e0b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: sp-shimmer 4s linear infinite;
          filter: drop-shadow(0 0 20px rgba(245,158,11,0.4));
        }

        .pu-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(245,158,11,0.3) 50%, transparent);
        }

        /* Glass panels */
        .pu-panel {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07);
        }

        /* Payment option rows */
        .pu-method {
          border-radius: 14px;
          padding: 14px 16px;
          cursor: pointer;
          transition: all 0.22s ease;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          position: relative;
          overflow: hidden;
        }
        .pu-method:hover {
          border-color: rgba(245,158,11,0.3);
          background: rgba(255,255,255,0.06);
        }
        .pu-method.active {
          transform: none;
        }

        /* Discount badge */
        .pu-badge {
          border-radius: 6px;
          padding: 2px 8px;
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        /* Radio */
        .pu-radio {
          width: 20px; height: 20px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }
        .pu-radio.active {
          border-color: rgba(245,158,11,0.8);
          background: rgba(245,158,11,0.15);
          box-shadow: 0 0 10px rgba(245,158,11,0.4);
        }
        .pu-radio-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #f59e0b;
        }

        /* Wallet address box */
        .pu-wallet-box {
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 10px;
          padding: 10px 14px;
          font-family: monospace;
          font-size: 0.7rem;
          color: rgba(255,255,255,0.7);
          word-break: break-all;
          line-height: 1.5;
        }

        /* Copy button */
        .pu-copy-btn {
          background: linear-gradient(135deg, #991b1b, #7f1d1d);
          border: 1px solid rgba(239,68,68,0.4);
          transition: all 0.22s ease;
          box-shadow: 0 4px 16px rgba(239,68,68,0.3);
        }
        .pu-copy-btn:hover {
          background: linear-gradient(135deg, #b91c1c, #991b1b);
          transform: scale(1.04);
        }

        /* Connect wallet btn */
        .pu-connect-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(245,158,11,0.4);
          transition: all 0.25s ease;
          width: 100%;
        }
        .pu-connect-btn:hover {
          background: rgba(245,158,11,0.1);
          border-color: rgba(245,158,11,0.7);
        }

        /* Confirm payment btn */
        .pu-confirm-btn {
          background: linear-gradient(135deg, #991b1b, #7f1d1d);
          border: 1px solid rgba(239,68,68,0.5);
          box-shadow: 0 4px 24px rgba(239,68,68,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
          transition: all 0.25s ease;
          width: 100%;
          animation: sp-glow-pulse 3s ease-in-out infinite;
        }
        .pu-confirm-btn:hover {
          background: linear-gradient(135deg, #b91c1c, #991b1b);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(239,68,68,0.55);
        }

        /* Wallet input */
        .pu-input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.8);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.8rem;
          width: 100%;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .pu-input:focus {
          border-color: rgba(245,158,11,0.5);
          background: rgba(255,255,255,0.08);
        }
        .pu-input::placeholder { color: rgba(255,255,255,0.2); font-style: italic; }

        /* Delivery option */
        .pu-delivery-opt {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        .pu-delivery-opt:hover { background: rgba(255,255,255,0.04); }
        .pu-delivery-opt.active {
          background: rgba(245,158,11,0.07);
          border-color: rgba(245,158,11,0.2);
        }

        /* Checkbox */
        .pu-checkbox {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.2);
          border-radius: 4px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .pu-checkbox.checked {
          background: rgba(245,158,11,0.8);
          border-color: rgba(245,158,11,0.9);
        }

        /* Summary price */
        .pu-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
        }

        /* Warning strip */
        .pu-warn-strip {
          background: rgba(245,158,11,0.08);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.72rem;
        }

        /* NFT thumbnail */
        .pu-nft-thumb {
          width: 72px; height: 72px;
          border-radius: 10px;
          border: 1px solid rgba(245,158,11,0.3);
          background: rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          flex-shrink: 0;
          overflow: hidden;
        }

        .pu-1of1 {
          background: linear-gradient(135deg, #92400e, #78350f);
          border: 2px solid rgba(245,158,11,0.5);
          border-radius: 50%;
          width: 44px; height: 44px;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          box-shadow: 0 0 16px rgba(245,158,11,0.3);
        }

        .pu-section-label {
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #f59e0b;
          text-align: center;
          position: relative;
        }
        .pu-section-label::before,
        .pu-section-label::after {
          content: "◆ ◆";
          opacity: 0.4;
          font-size: 0.45rem;
          margin: 0 6px;
        }

        .pu-arrow {
          color: #f59e0b;
          font-size: 1.4rem;
          animation: sp-arrow-bounce 1.5s ease-in-out infinite;
        }
      `}</style>

      <section className="relative z-10 px-4 py-10 md:py-14 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-8" style={{ animation: "sp-fade-up 0.4s ease both" }}>

          {/* ── Hero ── */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <span className="pu-arrow">»»</span>
              <h1 className="pu-title text-4xl md:text-5xl lg:text-6xl font-black tracking-wide uppercase">
                Secure NFT Purchase
              </h1>
              <span className="pu-arrow">««</span>
            </div>
            <p className="text-white/50 text-sm md:text-base">Choose Payment Method &amp; Complete Payment</p>
          </div>

          {/* ── Two column layout ── */}
          <div className="grid lg:grid-cols-2 gap-6">

            {/* ── LEFT: Payment Options ── */}
            <div className="pu-panel rounded-2xl p-6 space-y-4">
              <div className="pu-section-label">Payment Options</div>
              <p className="text-center text-white/40 text-xs">Select Payment Type — Get Instant Discount</p>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((m) => {
                  const isActive = selected === m.id;
                  const discounted = Math.round(BASE_PRICE * (1 - m.discount / 100));
                  const save = BASE_PRICE - discounted;

                  return (
                    <div
                      key={m.id}
                      className={`pu-method`}
                      style={isActive ? { background: m.activeBg, borderColor: m.border, boxShadow: `0 0 20px ${m.glow}` } : {}}
                      onClick={() => setSelected(m.id)}
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                          style={{ background: `${m.accent}18`, border: `1px solid ${m.border}` }}>
                          {m.icon}
                        </div>

                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-sm font-semibold">
                            {m.label}{" "}
                            {m.bold && <span className="font-black text-white">{m.bold}</span>}
                          </p>
                          {!m.noDiscount && (
                            <p className="text-xs mt-0.5" style={{ color: m.accent }}>
                              You Save: -{save} {m.unit}
                            </p>
                          )}
                        </div>

                        {/* Pricing */}
                        <div className="text-right flex-shrink-0">
                          {m.discount > 0 && (
                            <div className="flex items-center gap-2 justify-end mb-1">
                              <span
                                className="pu-badge text-white"
                                style={{ background: m.discount === 15 ? "rgba(239,68,68,0.8)" : "rgba(245,158,11,0.7)" }}
                              >
                                {m.discount}% OFF
                              </span>
                              <span className="text-white/30 text-xs line-through">{BASE_PRICE.toLocaleString()}</span>
                            </div>
                          )}
                          <p className="font-black text-base" style={{ color: m.accent }}>
                            {discounted.toLocaleString()} {m.unit}
                          </p>
                          {m.noDiscount && <p className="text-white/35 text-xs mt-0.5">No Discount</p>}
                        </div>

                        {/* Radio */}
                        <div className={`pu-radio ml-2 ${isActive ? "active" : ""}`}>
                          {isActive && <div className="pu-radio-dot" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Connect Wallet */}
              <button className="pu-connect-btn py-3.5 rounded-xl font-bold text-white text-sm mt-2">
                Connect Wallet to Pay
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 text-white/35 text-xs pt-1">
                <span>🛡️ 100% Secure</span>
                <span>•</span>
                <span>⚡ Instant Delivery</span>
                <span>•</span>
                <span>✅ Verified</span>
              </div>
            </div>

            {/* ── RIGHT: Summary + Wallet + Delivery ── */}
            <div className="space-y-4">

              {/* Purchase Summary */}
              <div className="pu-panel rounded-2xl p-6 space-y-4">
                <div className="pu-section-label">Purchase Summary</div>

                {/* NFT info */}
                <div className="flex items-center gap-4">
                  <div className="pu-nft-thumb">🖼️</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-white font-black text-base leading-tight">Tableau 11 – Digital Original</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white/60 text-xs">Brian Fin</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", color: "#93c5fd" }}>✓ Verified</span>
                    </div>
                    <p className="text-white/40 text-xs">Original Digital NFT – 1 of 1</p>
                  </div>
                  <div className="pu-1of1 flex-shrink-0">
                    <span className="text-amber-400 font-black text-xs leading-none">1/1</span>
                  </div>
                </div>

                <div className="pu-divider" />

                {/* Pricing breakdown */}
                <div className="space-y-1">
                  <div className="pu-price-row">
                    <span className="text-white/55 text-sm">Total Price:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 text-sm">‹</span>
                      <span className="text-white font-black text-xl">{BASE_PRICE.toLocaleString()} SPUMP</span>
                      <span className="text-amber-400 text-sm">›</span>
                    </div>
                  </div>
                  <div className="pu-price-row border-b border-white/[0.05]">
                    <span className="text-white/55 text-sm flex items-center gap-1">
                      <span className="text-amber-500">●</span> Platform Fee (3%):
                    </span>
                    <span className="text-white/70 text-sm font-semibold flex items-center gap-1">
                      −{platformFee} SPUMP
                      <span className="text-white/30 text-xs">∨</span>
                    </span>
                  </div>
                  <div className="pu-price-row">
                    <span className="text-white font-bold text-sm flex items-center gap-1">
                      <span className="text-red-500">🎃</span> You Pay:
                    </span>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}>
                      <span className="text-red-400 font-black text-lg">{youPay.toLocaleString()} {method.unit}</span>
                      <span className="text-red-400 text-sm">∨</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Send Payment To */}
              <div className="pu-panel rounded-2xl p-6 space-y-4">
                <div className="pu-section-label">Send Payment To</div>
                <p className="text-center text-white/70 text-sm font-semibold">Scotty Pumpkin Official Treasury Wallet</p>

                <div className="pu-wallet-box">
                  <div className="flex items-center gap-2">
                    <span className="flex-1 text-amber-300/80 font-mono text-xs break-all">{WALLET_ADDRESS}</span>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.3)" }}>
                      <span className="text-red-400 font-black text-xs">R</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-white/50 text-xs">
                    <span className="text-green-400">◉</span>
                    <span>Network: Solana (SOL)</span>
                    <span className="text-white/30">»»»</span>
                  </div>
                  <button onClick={handleCopy} className="pu-copy-btn px-5 py-2 rounded-lg text-white text-xs font-black tracking-wider flex-shrink-0">
                    {copied ? "✓ Copied!" : "Copy Address"}
                  </button>
                </div>

                <div className="pu-warn-strip flex flex-wrap items-center gap-3 text-amber-300/70">
                  <span>⚠️ Only send <span className="font-bold text-amber-300">SPUMP</span></span>
                  <span>•</span>
                  <span>⚠️ No extra fees</span>
                  <span>•</span>
                  <span>⚠️ Check amount</span>
                </div>
              </div>

              {/* NFT Delivery Wallet */}
              <div className="pu-panel rounded-2xl p-6 space-y-4">
                <div className="pu-section-label">NFT Delivery Wallet</div>
                <p className="text-center text-white/55 text-sm">Where should we send your NFT?</p>

                <div
                  className={`pu-delivery-opt ${deliveryMode === "connected" ? "active" : ""}`}
                  onClick={() => setDeliveryMode("connected")}
                >
                  <div className={`pu-radio ${deliveryMode === "connected" ? "active" : ""}`}>
                    {deliveryMode === "connected" && <div className="pu-radio-dot" />}
                  </div>
                  <span className="text-sm text-white/80">
                    Use <span className="font-bold text-white">Connected Wallet</span>{" "}
                    <span className="text-amber-400/70 text-xs">(Recommended)</span>
                  </span>
                  <div className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <span className="text-white/50 text-xs">≡</span>
                  </div>
                </div>

                <div
                  className={`pu-delivery-opt ${deliveryMode === "other" ? "active" : ""}`}
                  onClick={() => setDeliveryMode("other")}
                >
                  <div className={`pu-radio ${deliveryMode === "other" ? "active" : ""}`}>
                    {deliveryMode === "other" && <div className="pu-radio-dot" />}
                  </div>
                  <span className="text-sm text-white/70">Enter Another Wallet Address</span>
                </div>

                {deliveryMode === "other" && (
                  <input
                    className="pu-input"
                    placeholder="Paste your wallet address here..."
                    value={walletInput}
                    onChange={(e) => setWalletInput(e.target.value)}
                  />
                )}

                {/* Confirm checkbox */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setConfirmed((v) => !v)}>
                  <div className={`pu-checkbox ${confirmed ? "checked" : ""}`}>
                    {confirmed && <span className="text-white text-xs font-black leading-none">✓</span>}
                  </div>
                  <span className="text-white/60 text-sm">I confirm this address is correct</span>
                </div>

                {/* CTA */}
                <button
                  className="pu-confirm-btn py-4 rounded-xl font-black text-lg text-white tracking-wide"
                  onClick={() => confirmed && setSent(true)}
                  style={sent ? { background: "linear-gradient(135deg, #065f46, #064e3b)", animation: "none" } : {}}
                >
                  {sent ? "✓ Payment Confirmed!" : "I Have Sent Payment"}
                </button>

                <div className="flex items-center justify-center gap-3">
                  <span className="pu-arrow text-sm">»»</span>
                  <span className="text-white/20 text-xs">Scotty Pumpkin Secure Checkout</span>
                  <span className="pu-arrow text-sm">««</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
    </>
  );
}