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
    border: "border-amber-400/40",
    bg: "bg-amber-500/8",
    activeBg: "bg-amber-500/12",
    activeBorder: "border-amber-400/60",
    accentText: "text-amber-500",
    iconBg: "bg-amber-500/10 border-amber-400/40",
    badgeBg: "bg-red-500/80",
  },
  {
    id: "usff",
    label: "Pay with",
    bold: "USFF",
    icon: "💚",
    discount: 15,
    unit: "USFF",
    border: "border-green-400/40",
    bg: "bg-green-500/6",
    activeBg: "bg-green-500/10",
    activeBorder: "border-green-400/50",
    accentText: "text-green-400",
    iconBg: "bg-green-500/10 border-green-400/40",
    badgeBg: "bg-red-500/80",
  },
  {
    id: "sol",
    label: "Pay with",
    bold: "SOL",
    icon: "◎",
    discount: 5,
    unit: "SOL",
    border: "border-indigo-400/40",
    bg: "bg-indigo-500/6",
    activeBg: "bg-indigo-500/10",
    activeBorder: "border-indigo-400/50",
    accentText: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border-indigo-400/40",
    badgeBg: "bg-amber-500/70",
  },
  {
    id: "usdc",
    label: "Pay with",
    bold: "USDC",
    icon: "💵",
    discount: 5,
    unit: "USDC",
    border: "border-blue-400/40",
    bg: "bg-blue-500/6",
    activeBg: "bg-blue-500/10",
    activeBorder: "border-blue-400/50",
    accentText: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-400/40",
    badgeBg: "bg-amber-500/70",
  },
  {
    id: "crypto",
    label: "Pay with Other",
    bold: "Crypto",
    icon: "🔗",
    discount: 5,
    unit: "[Token]",
    border: "border-purple-400/40",
    bg: "bg-purple-500/6",
    activeBg: "bg-purple-500/10",
    activeBorder: "border-purple-400/50",
    accentText: "text-purple-400",
    iconBg: "bg-purple-500/10 border-purple-400/40",
    badgeBg: "bg-amber-500/70",
  },
  {
    id: "fiat",
    label: "Fiat (Card / Bank)",
    bold: "",
    icon: "💳",
    discount: 0,
    unit: "USD",
    border: "border-secondary/15",
    bg: "bg-secondary/4",
    activeBg: "bg-secondary/7",
    activeBorder: "border-secondary/30",
    accentText: "text-secondary/50",
    iconBg: "bg-secondary/5 border-secondary/15",
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
    <section className="bg-primary-bg py-20">
      <Container>
        {/* ── Header ── */}
        <div className="flex items-start gap-5 mb-12 pb-8 border-b border-secondary/10">
          <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
            🖼️
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
              Scotty Pumpkin Ecosystem
            </p>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-4 text-secondary">
              Secure NFT <br />
              <span className="text-primary italic">Purchase</span>
            </h1>
          </div>
        </div>

        {/* ── Intro row ── */}
        <div className="flex gap-5 pb-8 items-start border-b border-secondary/[0.07] mb-8">
          <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
            01
          </span>
          <p className="flex-1 text-[15px] leading-[1.75] text-secondary/70 font-light m-0">
            Choose Payment Method &amp; Complete Payment — select your preferred
            payment type to get an instant discount.
          </p>
        </div>

        {/* ── Two column layout ── */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* ── LEFT: Payment Options ── */}
          <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
            <p className="text-[11px] font-medium tracking-widest uppercase text-primary">
              Payment Options
            </p>
            <p className="text-secondary/60 text-xs font-light">
              Select Payment Type — Get Instant Discount
            </p>

            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => {
                const isActive = selected === m.id;
                const discounted = Math.round(
                  BASE_PRICE * (1 - m.discount / 100),
                );
                const save = BASE_PRICE - discounted;

                return (
                  <div
                    key={m.id}
                    onClick={() => setSelected(m.id)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg border cursor-pointer transition-colors ${
                      isActive
                        ? `${m.activeBg} ${m.activeBorder}`
                        : `${m.bg} ${m.border} hover:${m.activeBg}`
                    }`}>
                    {/* Icon */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 border ${m.iconBg}`}>
                      {m.icon}
                    </div>

                    {/* Label */}
                    <div className="flex-1 min-w-0">
                      <p className="text-secondary text-sm font-medium">
                        {m.label}{" "}
                        {m.bold && (
                          <span className="font-semibold text-primary">
                            {m.bold}
                          </span>
                        )}
                      </p>
                      {!m.noDiscount && (
                        <p
                          className={`text-xs mt-0.5 font-light ${m.accentText}`}>
                          You Save: -{save} {m.unit}
                        </p>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="text-right shrink-0">
                      {m.discount > 0 && (
                        <div className="flex items-center gap-1.5 justify-end mb-1">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium text-white ${m.badgeBg}`}>
                            {m.discount}% OFF
                          </span>
                          <span className="text-secondary/50 text-xs line-through">
                            {BASE_PRICE.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <p className={`font-semibold text-sm ${m.accentText}`}>
                        {discounted.toLocaleString()} {m.unit}
                      </p>
                      {m.noDiscount && (
                        <p className="text-secondary/45 text-xs mt-0.5 font-light">
                          No Discount
                        </p>
                      )}
                    </div>

                    {/* Radio */}
                    <div
                      className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ml-1 transition-colors ${isActive ? "border-primary" : "border-secondary/25"}`}>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Connect Wallet */}
            <button className="w-full py-3 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors cursor-pointer">
              Connect Wallet to Pay
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-3 text-secondary/70 text-xs font-light pt-1">
              <span>🛡️ 100% Secure</span>
              <span>•</span>
              <span>⚡ Instant Delivery</span>
              <span>•</span>
              <span>✅ Verified</span>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="space-y-4">
            {/* Purchase Summary */}
            <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
              <p className="text-[11px] font-medium tracking-widest uppercase text-primary">
                Purchase Summary
              </p>

              {/* NFT info */}
              <div className="flex items-center gap-4 pb-4 border-b border-secondary/[0.07]">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl shrink-0">
                  🖼️
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-secondary font-medium text-sm leading-tight">
                    Tableau 11 – Digital Original
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-secondary/70 text-xs font-light">
                      Brian Fin
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/10 border border-blue-400/30 text-blue-400">
                      ✓ Verified
                    </span>
                  </div>
                  <p className="text-secondary/55 text-xs font-light">
                    Original Digital NFT – 1 of 1
                  </p>
                </div>
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-primary font-semibold text-xs leading-none">
                    1/1
                  </span>
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-0">
                <div className="flex justify-between items-center py-2.5 border-b border-secondary/[0.07]">
                  <span className="text-secondary/70 text-sm font-light">
                    Total Price:
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-primary text-xs">‹</span>
                    <span className="text-secondary font-medium text-base">
                      {BASE_PRICE.toLocaleString()} SPUMP
                    </span>
                    <span className="text-primary text-xs">›</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-secondary/[0.07]">
                  <span className="text-secondary/60 text-sm font-light flex items-center gap-1">
                    <span className="text-primary text-xs">●</span> Platform Fee
                    (3%):
                  </span>
                  <span className="text-secondary/70 text-sm font-light">
                    −{platformFee} SPUMP
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-secondary font-medium text-sm flex items-center gap-1">
                    <span>🎃</span> You Pay:
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-400/25">
                    <span className="text-primary font-semibold text-base">
                      {youPay.toLocaleString()} {method.unit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Payment To */}
            <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
              <p className="text-[11px] font-medium tracking-widest uppercase text-primary">
                Send Payment To
              </p>
              <p className="text-secondary/60 text-sm font-light">
                Scotty Pumpkin Official Treasury Wallet
              </p>

              <div className="flex items-center gap-3 px-4 py-3 bg-primary-bg border border-secondary/15 rounded-lg">
                <span className="flex-1 text-secondary/60 font-mono text-xs break-all font-light">
                  {WALLET_ADDRESS}
                </span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary font-semibold text-xs">R</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-secondary/60 text-xs font-light">
                  <span className="text-primary text-xs">◉</span>
                  <span>Network: Solana (SOL)</span>
                  <span className="text-secondary/20">»»»</span>
                </div>
                <button
                  onClick={handleCopy}
                  className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wider shrink-0 transition-colors cursor-pointer ${copied ? "bg-green-500/15 border border-green-400/30 text-green-500" : "bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white"}`}>
                  {copied ? "✓ Copied!" : "Copy Address"}
                </button>
              </div>

              <div className="flex gap-3.5 items-start px-4 py-3 bg-primary/5 border border-primary/15 border-l-2 border-l-primary rounded-lg">
                <span className="shrink-0 text-sm mt-0.5">⚠️</span>
                <p className="m-0 text-[12px] text-secondary/50 leading-relaxed font-light">
                  Only send{" "}
                  <span className="text-primary font-medium">SPUMP</span> · No
                  extra fees · Check amount carefully before sending
                </p>
              </div>
            </div>

            {/* NFT Delivery Wallet */}
            <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
              <p className="text-[11px] font-medium tracking-widest uppercase text-primary">
                NFT Delivery Wallet
              </p>
              <p className="text-secondary/70 text-sm font-light">
                Where should we send your NFT?
              </p>

              <div
                className={`flex items-center gap-3 px-3 py-3 rounded-lg border cursor-pointer transition-colors ${deliveryMode === "connected" ? "bg-primary/10 border-primary/25" : "bg-secondary/3 border-secondary/10 hover:border-secondary/20"}`}
                onClick={() => setDeliveryMode("connected")}>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${deliveryMode === "connected" ? "border-primary" : "border-secondary/25"}`}>
                  {deliveryMode === "connected" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-sm text-secondary/70 font-light flex-1">
                  Use{" "}
                  <span className="font-medium text-secondary">
                    Connected Wallet
                  </span>{" "}
                  <span className="text-primary/80 text-xs">(Recommended)</span>
                </span>
                <div className="w-7 h-7 rounded-lg bg-secondary/5 border border-secondary/10 flex items-center justify-center">
                  <span className="text-secondary/40 text-xs">≡</span>
                </div>
              </div>

              <div
                className={`flex items-center gap-3 px-3 py-3 rounded-lg border cursor-pointer transition-colors ${deliveryMode === "other" ? "bg-primary/10 border-primary/25" : "bg-secondary/3 border-secondary/10 hover:border-secondary/20"}`}
                onClick={() => setDeliveryMode("other")}>
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${deliveryMode === "other" ? "border-primary" : "border-secondary/25"}`}>
                  {deliveryMode === "other" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-sm text-secondary/70 font-light">
                  Enter Another Wallet Address
                </span>
              </div>

              {deliveryMode === "other" && (
                <input
                  className="w-full px-3 py-2.5 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm placeholder:text-secondary/30 font-light outline-none focus:border-primary/40 transition-colors"
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
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${confirmed ? "bg-primary border-primary" : "border-secondary/25 bg-transparent"}`}>
                  {confirmed && (
                    <span className="text-white text-xs font-semibold leading-none">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-secondary/60 text-sm font-light">
                  I confirm this address is correct
                </span>
              </div>

              {/* CTA */}
              <button
                className={`w-full py-4 rounded-xl font-medium text-base text-white tracking-wide transition-colors cursor-pointer ${sent ? "bg-green-700 hover:bg-green-700" : "bg-primary hover:bg-primary/90"}`}
                onClick={() => confirmed && setSent(true)}>
                {sent ? "✓ Payment Confirmed!" : "I Have Sent Payment"}
              </button>

              <div className="flex items-center justify-center gap-2">
                <span className="text-primary/50 text-xs">»»</span>
                <span className="text-secondary/50 text-xs font-light">
                  Scotty Pumpkin Secure Checkout
                </span>
                <span className="text-primary/50 text-xs">««</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
