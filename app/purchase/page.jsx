"use client";

import { useState } from "react";
import Container from "../components/shared/Container";

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
      `}</style>

      <section className="relative z-10 py-10 md:py-14 bg-primary-bg">
        <Container>
          <div
            className="space-y-8"
            style={{ animation: "sp-fade-up 0.4s ease both" }}>
            {/* ── Hero ── */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-3">
                <span className="pu-arrow">»»</span>
                <h1 className="pu-title text-4xl md:text-5xl lg:text-6xl font-black tracking-wide uppercase">
                  Secure NFT Purchase
                </h1>
                <span className="pu-arrow">««</span>
              </div>
              <p className="text-white/50 text-sm md:text-base">
                Choose Payment Method &amp; Complete Payment
              </p>
            </div>

            {/* ── Two column layout ── */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* ── LEFT: Payment Options ── */}
              <div className="pu-panel rounded-2xl p-6 space-y-4">
                <div className="pu-section-label">Payment Options</div>
                <p className="text-center text-secondary/80 text-xs">
                  Select Payment Type — Get Instant Discount
                </p>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((m) => {
                    const isActive = selected === m.id;
                    const discounted = Math.round(
                      BASE_PRICE * (1 - m.discount / 100),
                    );
                    const save = BASE_PRICE - discounted;

                    return (
                      <div
                        key={m.id}
                        className={`pu-method`}
                        style={
                          isActive
                            ? {
                                background: m.activeBg,
                                borderColor: m.border,
                              }
                            : {}
                        }
                        onClick={() => setSelected(m.id)}>
                        <div className="flex items-center gap-3">
                          {/* Icon */}
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0"
                            style={{
                              background: `${m.accent}18`,
                              border: `1px solid ${m.border}`,
                            }}>
                            {m.icon}
                          </div>

                          {/* Label */}
                          <div className="flex-1 min-w-0">
                            <p className="text-secondary text-sm font-semibold">
                              {m.label}{" "}
                              {m.bold && (
                                <span className="font-black text-primary">
                                  {m.bold}
                                </span>
                              )}
                            </p>
                            {!m.noDiscount && (
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: m.accent }}>
                                You Save: -{save} {m.unit}
                              </p>
                            )}
                          </div>

                          {/* Pricing */}
                          <div className="text-right shrink-0">
                            {m.discount > 0 && (
                              <div className="flex items-center gap-2 justify-end mb-1">
                                <span
                                  className="pu-badge text-white"
                                  style={{
                                    background:
                                      m.discount === 15
                                        ? "rgba(239,68,68,0.8)"
                                        : "rgba(245,158,11,0.7)",
                                  }}>
                                  {m.discount}% OFF
                                </span>
                                <span className="text-white/30 text-xs line-through">
                                  {BASE_PRICE.toLocaleString()}
                                </span>
                              </div>
                            )}
                            <p
                              className="font-black text-base"
                              style={{ color: m.accent }}>
                              {discounted.toLocaleString()} {m.unit}
                            </p>
                            {m.noDiscount && (
                              <p className="text-white/35 text-xs mt-0.5">
                                No Discount
                              </p>
                            )}
                          </div>

                          {/* Radio */}
                          <div
                            className={`pu-radio border-primary ml-2 ${isActive ? "active" : ""}`}>
                            {isActive && <div className="pu-radio-dot" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Connect Wallet */}
                <button className="bg-primary w-full py-3.5 rounded-xl font-bold text-white text-sm mt-2">
                  Connect Wallet to Pay
                </button>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 text-secondary/80 text-xs pt-1">
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
                      <p className="text-secondary/80 font-black text-base leading-tight">
                        Tableau 11 – Digital Original
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-secondary/80 text-xs">
                          Brian Fin
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            background: "rgba(59,130,246,0.15)",
                            border: "1px solid rgba(59,130,246,0.3)",
                            color: "#93c5fd",
                          }}>
                          ✓ Verified
                        </span>
                      </div>
                      <p className="text-secondary/80 text-xs">
                        Original Digital NFT – 1 of 1
                      </p>
                    </div>
                    <div className="pu-1of1 shrink-0">
                      <span className="text-white font-black text-xs leading-none">
                        1/1
                      </span>
                    </div>
                  </div>

                  <div className="pu-divider" />

                  {/* Pricing breakdown */}
                  <div className="space-y-1">
                    <div className="pu-price-row">
                      <span className="text-secondary/80 text-sm">
                        Total Price:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-primary text-sm">‹</span>
                        <span className="text-secondary/80 font-black text-xl">
                          {BASE_PRICE.toLocaleString()} SPUMP
                        </span>
                        <span className="text-primary text-sm">›</span>
                      </div>
                    </div>
                    <div className="pu-price-row border-b border-white/5">
                      <span className="text-secondary/80 text-sm flex items-center gap-1">
                        <span className="text-primary">●</span> Platform Fee
                        (3%):
                      </span>
                      <span className="text-secondary/80 text-sm font-semibold flex items-center gap-1">
                        −{platformFee} SPUMP
                        <span className="text-secondary/70 text-xs">∨</span>
                      </span>
                    </div>
                    <div className="pu-price-row">
                      <span className="text-secondary font-bold text-sm flex items-center gap-1">
                        <span className="text-primary">🎃</span> You Pay:
                      </span>
                      <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{
                          background: "rgba(239,68,68,0.12)",
                          border: "1px solid rgba(239,68,68,0.25)",
                        }}>
                        <span className="text-primary font-black text-lg">
                          {youPay.toLocaleString()} {method.unit}
                        </span>
                        <span className="text-primary text-sm">∨</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Send Payment To */}
                <div className="pu-panel rounded-2xl p-6 space-y-4">
                  <div className="pu-section-label">Send Payment To</div>
                  <p className="text-center text-secondary/80 text-sm font-semibold">
                    Scotty Pumpkin Official Treasury Wallet
                  </p>

                  <div className="pu-wallet-box">
                    <div className="flex items-center gap-2">
                      <span className="flex-1 text-primary/80 font-mono text-xs break-all">
                        {WALLET_ADDRESS}
                      </span>
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          background: "rgba(239,68,68,0.2)",
                          border: "1px solid rgba(239,68,68,0.3)",
                        }}>
                        <span className="text-primary font-black text-xs">
                          R
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-secondary/80 text-xs">
                      <span className="text-primary">◉</span>
                      <span>Network: Solana (SOL)</span>
                      <span className="text-white/30">»»»</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="pu-copy-btn ui-btn ui-btn-danger px-5 py-2 rounded-lg text-white text-xs font-black tracking-wider shrink-0">
                      {copied ? "✓ Copied!" : "Copy Address"}
                    </button>
                  </div>

                  <div className="pu-warn-strip flex flex-wrap items-center gap-3 text-primary/80">
                    <span>
                      ⚠️ Only send{" "}
                      <span className="font-bold text-primary">SPUMP</span>
                    </span>
                    <span>•</span>
                    <span>⚠️ No extra fees</span>
                    <span>•</span>
                    <span>⚠️ Check amount</span>
                  </div>
                </div>

                {/* NFT Delivery Wallet */}
                <div className="pu-panel rounded-2xl p-6 space-y-4">
                  <div className="pu-section-label">NFT Delivery Wallet</div>
                  <p className="text-center text-secondary/80z text-sm">
                    Where should we send your NFT?
                  </p>

                  <div
                    className={`pu-delivery-opt ${deliveryMode === "connected" ? "active" : ""}`}
                    onClick={() => setDeliveryMode("connected")}>
                    <div
                      className={`pu-radio ${deliveryMode === "connected" ? "active" : ""}`}>
                      {deliveryMode === "connected" && (
                        <div className="pu-radio-dot" />
                      )}
                    </div>
                    <span className="text-sm text-secondary/90">
                      Use{" "}
                      <span className="font-bold text-secondary">
                        Connected Wallet
                      </span>{" "}
                      <span className="text-primary/80 text-xs">
                        (Recommended)
                      </span>
                    </span>
                    <div
                      className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}>
                      <span className="text-secondary text-xs">≡</span>
                    </div>
                  </div>

                  <div
                    className={`pu-delivery-opt ${deliveryMode === "other" ? "active" : ""}`}
                    onClick={() => setDeliveryMode("other")}>
                    <div
                      className={`pu-radio ${deliveryMode === "other" ? "active" : ""}`}>
                      {deliveryMode === "other" && (
                        <div className="pu-radio-dot" />
                      )}
                    </div>
                    <span className="text-sm text-secondary/80">
                      Enter Another Wallet Address
                    </span>
                  </div>

                  {deliveryMode === "other" && (
                    <input
                      className="pu-input"
                      placeholder="Paste enter your wallet address here..."
                      value={walletInput}
                      onChange={(e) => setWalletInput(e.target.value)}
                    />
                  )}

                  {/* Confirm checkbox */}
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setConfirmed((v) => !v)}>
                    <div
                      className={`pu-checkbox ${confirmed ? "checked" : ""}`}>
                      {confirmed && (
                        <span className="text-white text-xs font-black leading-none">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-secondary/80 text-sm">
                      I confirm this address is correct
                    </span>
                  </div>

                  {/* CTA */}
                  <button
                    className="pu-confirm-btn ui-btn ui-btn-danger py-4 rounded-xl font-black text-lg text-white tracking-wide"
                    onClick={() => confirmed && setSent(true)}
                    style={
                      sent
                        ? {
                            background:
                              "linear-gradient(135deg, #065f46, #064e3b)",
                            animation: "none",
                          }
                        : {}
                    }>
                    {sent ? "✓ Payment Confirmed!" : "I Have Sent Payment"}
                  </button>

                  <div className="flex items-center justify-center gap-3">
                    <span className="pu-arrow text-sm">»»</span>
                    <span className="text-secondary/70 text-xs">
                      Scotty Pumpkin Secure Checkout
                    </span>
                    <span className="pu-arrow text-sm">««</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
