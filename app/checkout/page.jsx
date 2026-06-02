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
    <div className="bg-primary-bg min-h-screen text-secondary">
      {/* QR Modal */}
      {showQR && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm"
          onClick={() => setShowQR(false)}>
          <div
            className="w-full max-w-sm rounded-2xl p-6 text-center border border-secondary/10 bg-primary-bg"
            onClick={(e) => e.stopPropagation()}>
            <p className="text-primary font-black text-sm tracking-widest uppercase mb-4">
              Scan to Pay
            </p>
            {/* QR placeholder grid */}
            <div className="mx-auto mb-4 w-40 h-40 bg-primary-bg border border-secondary/10 rounded-lg grid place-items-center p-2">
              <div className="grid grid-cols-8 gap-0.5 w-full h-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-sm ${Math.random() > 0.45 ? "bg-secondary" : "bg-transparent"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-secondary/70 text-xs mb-1">
              Amount:{" "}
              <span className="text-primary font-bold">{DISCOUNTED} SPUMP</span>
            </p>
            <p className="text-secondary/35 text-xs mb-4">Ref: {ORDER_REF}</p>
            <button
              onClick={() => setShowQR(false)}
              className="text-secondary/40 text-xs hover:text-secondary/70 transition-colors">
              ✕ Close
            </button>
          </div>
        </div>
      )}

      <section className="relative z-10 px-4 py-10 md:py-14 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6 animate-[fade-webkit_0.4s_ease_both]">
          {/* ── Title ── */}
          <h1 className=" text-3xl md:text-4xl font-black text-center tracking-widest uppercase text-primary">
            Checkout – Tableau 11
          </h1>

          {/* ── Outer card ── */}
          <div className=" rounded-2xl p-5 md:p-6 space-y-5 border border-secondary/10 bg-white/80">
            {/* NFT Summary row */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/5">
              <div className=" text-2xl w-12 h-12 rounded-lg flex items-center justify-center bg-primary-bg border border-secondary/10">
                🖼️
              </div>
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-secondary font-black text-lg leading-tight">
                    Tableau 11
                  </p>
                  <button className="text-primary/70 text-sm font-semibold hover:text-primary transition-colors shrink-0">
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-secondary/55 text-xs">Brian Fin</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-primary/15 border border-primary/30 text-primary">
                    🤝 Verified
                  </span>
                </div>
                <p className="text-secondary/40 text-xs">
                  Original Digital NFT – 1 of 1
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-primary font-black text-xl">
                  {BASE_PRICE.toLocaleString()}
                </p>
                <p className="text-primary/70 text-xs font-bold">SPUMP</p>
              </div>
            </div>

            {/* Network + Balance row */}
            <div className="flex items-center justify-between">
              <p className="text-secondary/50 text-sm">
                Network:{" "}
                <span className="text-secondary/75 font-semibold">Solana</span>
              </p>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/25 text-primary">
                Balance: 2,490 SPUMP
              </span>
            </div>

            <div className=" border-b border-secondary/10" />

            {/* Payment method section */}
            <div className="space-y-3">
              <div className=" text-xs font-black uppercase tracking-wider text-secondary/60">
                SPAYMENT Method &amp; Discounts
              </div>
              <p className="text-center text-secondary/35 text-xs">
                Generates a unique reference for your order. Funds still go to
                Scotty Treasury.
              </p>

              {/* Tab switcher */}
              <div className=" flex p-1 rounded-xl bg-secondary/5 gap-1">
                <div
                  className={` flex-1 text-center py-2.5 rounded-lg text-xs font-bold cursor-pointer transition duration-300 ${tab === "smart" ? "bg-primary text-white" : "text-white bg-secondary hover:bg-primary hover:text-white"}`}
                  onClick={() => setTab("smart")}>
                  Smart Request (Auto-Verify)
                </div>
                <div
                  className={`flex-1 text-center py-2.5 rounded-lg text-xs font-bold transition duration-300 cursor-pointer ${tab === "manual" ? "bg-primary text-white" : "text-white bg-secondary hover:bg-primary hover:text-white"}`}
                  onClick={() => setTab("manual")}>
                  Manual Send (Copy Address)
                </div>
              </div>
            </div>

            {/* ── SMART TAB ── */}
            {tab === "smart" && (
              <div className=" rounded-xl p-5 space-y-5 border border-secondary/10 bg-white/80">
                <div className="space-y-1 text-center">
                  <p className=" text-xs font-black uppercase tracking-wider text-primary">
                    — Smart Payment Generator ⚙
                  </p>
                  <p className="text-secondary/70 text-xs">
                    Creates a unique reference for your order. Funds still go to
                    Scotty Treasury.
                  </p>
                </div>

                {/* Generate button */}
                <button
                  onClick={() => setGenerated(true)}
                  className={`w-full py-3.5 rounded-xl font-black text-sm tracking-wider flex items-center justify-center gap-2 border transition-all ${generated ? "bg-secondary border-primary text-white" : "bg-primary border-primary text-white"}`}>
                  {generated ? (
                    <>
                      <span className="text-secondary">✓</span> Payment Request
                      Generated
                    </>
                  ) : (
                    <>
                      <span>📋</span> Generate Payment Request
                    </>
                  )}
                </button>

                {generated && (
                  <div className="text-xs text-secondary/80 text-center font-mono">
                    Creates a unique reference for your order. Funds still go to
                    Scotty Treasury.
                  </div>
                )}

                {/* Step B */}
                {generated && (
                  <div className="space-y-1">
                    <p className="text-primary text-xs font-bold mb-3">
                      Step B – Request Details
                    </p>

                    <div className="flex items-center justify-between py-2.5 border-b border-secondary/5">
                      <span className=" text-secondary/60 text-xs">
                        Treasury Wallet:
                      </span>
                      <span className=" text-primary/80 font-mono text-xs truncate max-w-50">
                        {TREASURY_WALLET}
                      </span>
                      <span className="text-primary/50 text-sm">›</span>
                    </div>
                    <div className=" flex items-center justify-between py-2.5 border-b border-secondary/5">
                      <span className=" text-secondary/60 text-xs">Token:</span>
                      <span className=" text-primary font-black text-xs">
                        SPUMP
                      </span>
                    </div>
                    <div className=" flex items-center justify-between py-2.5 border-b border-secondary/5">
                      <span className=" text-secondary/60 text-xs">
                        Amount Due:
                      </span>
                      <span className=" text-primary font-black text-xs">
                        {DISCOUNTED.toLocaleString()} SPUMP
                      </span>
                    </div>
                    <div className=" flex items-center justify-between py-2.5 border-b border-secondary/5">
                      <span className=" text-secondary/60 text-xs">
                        Order Reference (Memo):
                      </span>
                      <span className=" text-secondary font-mono font-bold text-xs">
                        {ORDER_REF}
                      </span>
                      <button
                        className=" text-primary text-xs font-bold underline"
                        onClick={() => copy(ORDER_REF, setCopiedRef)}>
                        {copiedRef ? "✓" : "Copy"} ›
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-2.5 text-xs">
                      <span className=" text-secondary/60">Expires in:</span>
                      <span
                        className={` font-mono font-black ${timeLeft < 60 ? "text-red-500" : "text-primary"}`}>
                        {mins}:{secs}
                      </span>
                    </div>
                  </div>
                )}

                {/* Open in wallet / Show QR */}
                {generated && (
                  <div className="flex gap-3">
                    <button className=" flex-1 py-2.5 rounded-lg text-xs font-bold border border-secondary/20 text-secondary bg-primary-bg hover:bg-secondary/5 transition-colors">
                      📱 Open in Wallet
                    </button>
                    <button
                      className=" flex-1 py-2.5 rounded-lg text-xs font-bold border border-secondary/20 text-secondary bg-primary-bg hover:bg-secondary/5 transition-colors"
                      onClick={() => setShowQR(true)}>
                      <span className="inline-block mr-1">▦</span> Show QR
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── MANUAL TAB ── */}
            {tab === "manual" && (
              <div className="rounded-xl p-5 space-y-4 border border-secondary/10 bg-secondary/2">
                <p className="text-primary/80 text-xs font-bold">
                  Treasury Wallet Address
                </p>
                <div className=" p-3 rounded-xl font-mono text-xs break-all border border-secondary/10 bg-secondary/5 text-secondary font-bold select-all">
                  {TREASURY_WALLET_FULL}
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-secondary/45 text-xs">
                    Network:{" "}
                    <span className="text-secondary/70 font-semibold">
                      Solana (SOL)
                    </span>
                  </div>
                  <button
                    className=" text-primary text-xs font-bold underline"
                    onClick={() => copy(TREASURY_WALLET_FULL, setCopiedWallet)}>
                    {copiedWallet ? "✓ Copied!" : "Copy Address"}
                  </button>
                </div>
                <div className="space-y-1">
                  {[
                    "Only send SPUMP",
                    "No extra fees",
                    "Include exact amount",
                  ].map((w) => (
                    <p
                      key={w}
                      className="text-primary/70 text-xs flex items-center gap-2 font-medium">
                      <span>⚠️</span> {w}
                    </p>
                  ))}
                </div>
                <div className=" flex items-center justify-between pt-3 border-t border-secondary/5 text-xs">
                  <span className=" text-secondary/60">Amount:</span>
                  <span className="text-primary font-black text-sm">
                    {DISCOUNTED.toLocaleString()} SPUMP
                  </span>
                </div>
              </div>
            )}

            <div className=" border-b border-secondary/10" />

            {/* Step D — Auto Verification */}
            <div className="space-y-3">
              <p className="text-primary/80 text-xs font-bold">
                Step D – Auto Verification
              </p>

              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setDeliveryMode("connected")}>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${deliveryMode === "connected" ? "border-primary" : "border-secondary/30"}`}>
                  {deliveryMode === "connected" && (
                    <div className="c w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-secondary/75 text-sm">
                  Use connected wallet{" "}
                  <span className="text-primary/70 text-xs">(Recommended)</span>
                </span>
              </div>

              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setDeliveryMode("manual")}>
                <div
                  className={` w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${deliveryMode === "manual" ? "border-primary" : "border-secondary/30"}`}>
                  {deliveryMode === "manual" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
                <span className="text-secondary/75 text-sm">
                  Enter manually
                </span>
              </div>

              {deliveryMode === "manual" && (
                <input
                  className="w-full rounded-lg px-3 py-2.5 text-sm outline-none border border-secondary/15 bg-secondary/5 text-secondary/80 focus:border-primary/50 transition-colors"
                  placeholder="Paste wallet address..."
                />
              )}

              {/* Confirm checkbox */}
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => setConfirmed((v) => !v)}>
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${confirmed ? "bg-primary border-primary" : "border-secondary/30"}`}>
                  {confirmed && (
                    <span className="text-primary-bg text-xs font-black leading-none">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-secondary/60 text-sm">
                  I confirm this address is correct
                </span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              disabled={!confirmed}
              onClick={() => confirmed && setCheckedOut(true)}
              className={` w-full py-4 rounded-xl font-bold text-lg text-primary-bg tracking-wide flex items-center justify-center gap-3 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${checkedOut ? "bg-green-600" : "bg-secondary"}`}>
              {checkedOut ? (
                "✓ Purchase Complete!"
              ) : (
                <>
                  Checkout Purchase <span className="text-primary">→</span>
                </>
              )}
            </button>

            {/* Legal note */}
            <p className="text-center text-secondary/25 text-xs leading-relaxed">
              By confirming your purchase, you agree to the{" "}
              <span className="text-primary/60 underline cursor-pointer hover:text-primary transition-colors">
                Terms of Service &amp; Refund Policy
              </span>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
