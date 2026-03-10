"use client";

import { useState, useRef } from "react";

const TRENDING = [
  { id: "SCOTTY #001", emoji: "🎃", spump: null, usff: null, price: null, label: "SCOTTY #001", accent: "#f59e0b" },
  { id: "PURPLE DROP", emoji: "💎", spump: 150, usff: null, price: null, label: "PURPLE DROP", accent: "#a855f7" },
  { id: "LUXURY MASK", emoji: "🎭", spump: null, usff: null, price: 320, label: "LUXURY MASK", accent: "#eab308" },
  { id: "COSMIC RING", emoji: "🪐", spump: null, usff: null, price: 450, label: "COSMIC RING", accent: "#6366f1" },
];

const CATEGORIES = ["Art", "Fashion", "Jewelry", "Music", "Video", "Digital"];

export default function NFTStudioPage() {
  const [connected, setConnected] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [collection, setCollection] = useState("");
  const [category, setCategory] = useState("Art");
  const [limited, setLimited] = useState(5);
  const [traits, setTraits] = useState([]);
  const fileRef = useRef(null);

  const MINT_FEE = 15.0;
  const DISCOUNT = 2.25;
  const NETWORK = 0.5;
  const TOTAL = MINT_FEE - DISCOUNT + NETWORK;

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) setUploadedFile(file.name);
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) setUploadedFile(file.name);
  }

  function addTrait() {
    setTraits((prev) => [...prev, { key: "", value: "" }]);
  }

  return (
    <>
      <style>{`
        @keyframes sp-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes sp-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes sp-glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(245,158,11,0.3); }
          50%       { box-shadow: 0 0 40px rgba(245,158,11,0.7), 0 0 80px rgba(245,158,11,0.2); }
        }
        @keyframes sp-star-twinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50%       { opacity: 0.9;  transform: scale(1.5); }
        }
        @keyframes sp-fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sp-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes sp-card-glow {
          0%, 100% { box-shadow: 0 0 0 1px rgba(168,85,247,0.2), 0 8px 32px rgba(0,0,0,0.5); }
          50%       { box-shadow: 0 0 0 1px rgba(168,85,247,0.5), 0 8px 40px rgba(168,85,247,0.15), 0 0 60px rgba(168,85,247,0.08); }
        }

        .nft-page {
          min-height: 100vh;
        }

        /* Hero */
        .nft-hero-title {
          background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 30%, #f59e0b 60%, #d97706 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: sp-shimmer 4s linear infinite;
          text-shadow: none;
          filter: drop-shadow(0 0 30px rgba(245,158,11,0.4));
        }

        /* Fee banner */
        .nft-fee-banner {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(245,158,11,0.2);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        /* Main panel cards */
        .nft-panel {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
        }

        /* Section headers */
        .nft-section-label {
          color: #f59e0b;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        /* Step labels */
        .nft-step {
          color: rgba(255,255,255,0.5);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border-bottom: 1px solid rgba(245,158,11,0.2);
          padding-bottom: 6px;
          margin-bottom: 10px;
        }

        /* Connect wallet btn */
        .nft-connect-btn {
          background: linear-gradient(135deg, #15803d, #166534);
          border: 1px solid rgba(74,222,128,0.3);
          transition: all 0.25s ease;
          box-shadow: 0 4px 20px rgba(21,128,61,0.4);
        }
        .nft-connect-btn:hover {
          background: linear-gradient(135deg, #16a34a, #15803d);
          transform: scale(1.04);
          box-shadow: 0 6px 28px rgba(21,128,61,0.6);
        }
        .nft-connect-btn.connected {
          background: linear-gradient(135deg, #065f46, #064e3b);
          border-color: rgba(74,222,128,0.5);
        }

        /* Drop zone */
        .nft-dropzone {
          background: rgba(255,255,255,0.04);
          border: 2px dashed rgba(255,255,255,0.15);
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .nft-dropzone:hover, .nft-dropzone.active {
          border-color: rgba(245,158,11,0.6);
          background: rgba(245,158,11,0.05);
        }

        /* Buy NFT btn in dropzone */
        .nft-buy-btn {
          background: linear-gradient(135deg, #92400e, #78350f);
          border: 1px solid rgba(245,158,11,0.5);
          box-shadow: 0 4px 20px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.25s ease;
          animation: sp-glow-pulse 3s ease-in-out infinite;
        }
        .nft-buy-btn:hover {
          background: linear-gradient(135deg, #b45309, #92400e);
          transform: scale(1.04);
          box-shadow: 0 6px 28px rgba(245,158,11,0.5);
        }

        /* Inputs */
        .nft-input {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.85);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 0.8rem;
          width: 100%;
          transition: border-color 0.2s ease;
          outline: none;
        }
        .nft-input:focus {
          border-color: rgba(245,158,11,0.5);
          background: rgba(255,255,255,0.09);
        }
        .nft-input::placeholder { color: rgba(255,255,255,0.25); }

        .nft-select {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.8);
          border-radius: 8px;
          padding: 7px 10px;
          font-size: 0.8rem;
          outline: none;
          cursor: pointer;
        }

        /* Add trait btn */
        .nft-trait-btn {
          background: rgba(168,85,247,0.1);
          border: 1px solid rgba(168,85,247,0.3);
          color: rgba(168,85,247,0.9);
          border-radius: 8px;
          padding: 6px 12px;
          font-size: 0.75rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .nft-trait-btn:hover {
          background: rgba(168,85,247,0.2);
          border-color: rgba(168,85,247,0.6);
        }

        /* Live summary */
        .nft-summary {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07);
        }
        .nft-check { color: #f59e0b; font-weight: 900; }

        /* Calculator */
        .nft-calc-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 0.8rem;
        }
        .nft-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 12px;
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.3);
          border-radius: 10px;
          margin-top: 8px;
        }

        /* Mint button */
        .nft-mint-btn {
          background: linear-gradient(135deg, #15803d, #166534);
          border: 1px solid rgba(74,222,128,0.4);
          box-shadow: 0 4px 24px rgba(21,128,61,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.25s ease;
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          font-weight: 800;
          font-size: 1.05rem;
          color: white;
          letter-spacing: 0.05em;
          cursor: pointer;
        }
        .nft-mint-btn:hover {
          background: linear-gradient(135deg, #16a34a, #15803d);
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(21,128,61,0.7);
        }

        /* Trending */
        .nft-trend-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          overflow: hidden;
          transition: all 0.25s ease;
        }
        .nft-trend-card:hover {
          border-color: rgba(245,158,11,0.4);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.3), 0 0 30px rgba(245,158,11,0.08);
        }
        .nft-trend-img {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          background: radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(0,0,0,0.4) 100%);
          position: relative;
          overflow: hidden;
        }

        .nft-trend-buy {
          background: linear-gradient(135deg, #15803d, #166534);
          border: none;
          color: white;
          font-weight: 800;
          font-size: 0.8rem;
          padding: 8px;
          width: 100%;
          cursor: pointer;
          letter-spacing: 0.08em;
          transition: all 0.2s ease;
        }
        .nft-trend-buy:hover {
          background: linear-gradient(135deg, #16a34a, #15803d);
        }

        /* Divider */
        .nft-divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(245,158,11,0.3) 50%, transparent);
          margin: 10px 0;
        }

        .nft-star { display: none; }

        /* Decorative section title */
        .nft-section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #f59e0b;
          margin-bottom: 14px;
        }
        .nft-section-title::before,
        .nft-section-title::after {
          content: "◆";
          font-size: 0.5rem;
          opacity: 0.6;
        }

        .nft-status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          display: inline-block; margin-right: 6px;
        }
      `}</style>

      <div className="nft-page">

        {/* Background stars */}
        {[
          { size: 2, top: "5%",  left: "8%",  delay: "0s",   dur: "3s"   },
          { size: 1, top: "12%", left: "72%", delay: "0.4s", dur: "2.5s" },
          { size: 2, top: "20%", left: "40%", delay: "1s",   dur: "3.5s" },
          { size: 1, top: "60%", left: "88%", delay: "0.7s", dur: "2.8s" },
          { size: 2, top: "75%", left: "15%", delay: "1.3s", dur: "3.2s" },
          { size: 1, top: "88%", left: "55%", delay: "0.2s", dur: "2.3s" },
          { size: 3, top: "3%",  left: "55%", delay: "1.7s", dur: "4s"   },
          { size: 1, top: "45%", left: "2%",  delay: "0.9s", dur: "3.7s" },
        ].map((s, i) => (
          <div key={i} className="nft-star" style={{ width: s.size, height: s.size, top: s.top, left: s.left, animation: `sp-star-twinkle ${s.dur} ${s.delay} ease-in-out infinite` }} />
        ))}

        <div className="relative z-10 px-4 py-10 md:py-14 lg:px-12 max-w-6xl mx-auto space-y-8" style={{ animation: "sp-fade-up 0.5s ease both" }}>

          {/* ── Hero ── */}
          <div className="text-center space-y-3" style={{ animation: "sp-fade-up 0.5s ease 0.05s both" }}>
            <h1 className="nft-hero-title text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
              NFT Studio
            </h1>
            <p className="text-amber-400/70 text-base md:text-lg font-semibold tracking-widest">
              ✦ Mint Digital Prestige ✦
            </p>
            <p className="text-white/50 text-sm max-w-lg mx-auto leading-relaxed">
              Mint NFTs from art, fashion, jewelry, video &amp; digital goods. List free. Sell with only{" "}
              <span className="text-amber-400 font-bold">3%</span> when sold.
            </p>
          </div>

          {/* ── Fee Banner ── */}
          <div className="nft-fee-banner rounded-2xl px-6 py-3 flex flex-wrap items-center justify-center gap-4 text-sm" style={{ animation: "sp-fade-up 0.5s ease 0.1s both" }}>
            <span className="text-amber-300 font-bold">🎃 Mint <span className="text-white">-15% SPUMP/USFF</span></span>
            <span className="text-white/30">•</span>
            <span className="text-amber-300 font-bold">🎃 Buy <span className="text-white">-10% SPUMP/USFF</span></span>
            <span className="text-white/30">•</span>
            <span className="text-amber-300 font-bold">🎃 Sale Fee <span className="text-white">3%</span></span>
          </div>

          {/* ── Two column: Create NFT + Live Summary ── */}
          <div className="grid lg:grid-cols-5 gap-5" style={{ animation: "sp-fade-up 0.5s ease 0.15s both" }}>

            {/* LEFT — Create NFT */}
            <div className="lg:col-span-3 nft-panel rounded-2xl p-5 md:p-6 space-y-5">
              <div className="nft-section-title">Create NFT</div>

              {/* Step 1 */}
              <div>
                <p className="nft-step">Step 1 — Connect Wallet</p>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="nft-status-dot"
                      style={{ background: connected ? "#4ade80" : "#ef4444", boxShadow: `0 0 8px ${connected ? "rgba(74,222,128,0.6)" : "rgba(239,68,68,0.6)"}` }}
                    />
                    <span className="text-sm" style={{ color: connected ? "#4ade80" : "#f87171" }}>
                      {connected ? "Connected ✓" : "Not Connected"}
                    </span>
                  </div>
                  <button
                    onClick={() => setConnected((v) => !v)}
                    className={`nft-connect-btn px-5 py-2 rounded-lg text-sm font-bold text-white ${connected ? "connected" : ""}`}
                  >
                    {connected ? "Disconnect" : "Connect Wallet"}
                  </button>
                </div>
              </div>

              <div className="nft-divider" />

              {/* Step 2 */}
              <div>
                <p className="nft-step">Step 2 — Upload Artwork</p>
                <div
                  className={`nft-dropzone rounded-xl p-6 text-center space-y-3 ${dragOver ? "active" : ""}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept=".png,.jpg,.gif,.mp4" className="hidden" onChange={handleFileChange} />
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <span className="text-4xl">✅</span>
                      <p className="text-green-400 text-sm font-bold">{uploadedFile}</p>
                      <p className="text-white/35 text-xs">Click to change file</p>
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl" style={{ animation: "sp-float 3s ease-in-out infinite" }}>🖼️</div>
                      <div>
                        <p className="text-white/70 font-bold text-sm">DROP ARTWORK HERE</p>
                        <p className="text-white/40 text-xs">or <span className="text-amber-400 underline cursor-pointer">Choose File</span></p>
                      </div>
                      <p className="text-white/30 text-xs tracking-wider">PNG · JPG · GIF · MP4</p>
                    </>
                  )}
                  <button
                    className="nft-buy-btn px-6 py-2.5 rounded-lg text-sm font-black text-amber-200 tracking-wider"
                    onClick={(e) => e.stopPropagation()}
                  >
                    🎃 BUY NFT
                  </button>
                  <p className="text-white/25 text-xs">PNG · JPG · GIF · MP4</p>
                </div>
              </div>

              <div className="nft-divider" />

              {/* Step 3 */}
              <div>
                <p className="nft-step">Step 3 — NFT Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <input className="nft-input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <input className="nft-input" placeholder="Collection" value={collection} onChange={(e) => setCollection(e.target.value)} />
                  <input className="nft-input col-span-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
                  <div className="flex items-center gap-2">
                    <label className="text-white/45 text-xs font-bold whitespace-nowrap">Category</label>
                    <select className="nft-select flex-1" value={category} onChange={(e) => setCategory(e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-white/45 text-xs font-bold whitespace-nowrap">Limited</label>
                    <input
                      type="number"
                      min={1}
                      className="nft-input"
                      value={limited}
                      onChange={(e) => setLimited(e.target.value)}
                      style={{ width: 64 }}
                    />
                    <span className="text-white/40 text-xs">%</span>
                  </div>
                </div>

                {/* Traits */}
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <button className="nft-trait-btn" onClick={addTrait}>+ Add Trait</button>
                  <span className="text-white/35 text-xs">🎃 1/1 Unique</span>
                </div>
                {traits.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {traits.map((t, i) => (
                      <div key={i} className="flex gap-2">
                        <input className="nft-input" placeholder="Trait name" value={t.key}
                          onChange={(e) => setTraits((prev) => prev.map((x, xi) => xi === i ? { ...x, key: e.target.value } : x))} />
                        <input className="nft-input" placeholder="Value" value={t.value}
                          onChange={(e) => setTraits((prev) => prev.map((x, xi) => xi === i ? { ...x, value: e.target.value } : x))} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT — Live Summary + Calculator */}
            <div className="lg:col-span-2 space-y-4">

              {/* Live Summary */}
              <div className="nft-summary rounded-2xl p-5 space-y-4">
                <div className="nft-section-title">Live Summary</div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl">🎃</span>
                  <span className="text-white font-black text-base">Scotty Pumpkin</span>
                </div>

                <div className="space-y-2">
                  {[
                    { label: "-15% Mint Discount", ok: true },
                    { label: "-10% Buyer Discount", ok: true },
                    { label: "Free Listing", ok: true },
                  ].map((item) => (
                    <p key={item.label} className="flex items-center gap-2 text-sm text-white/80">
                      <span className="nft-check">✓</span>
                      <span style={{ color: "#f59e0b" }}>{item.label.split(" ")[0]}</span>
                      <span>{item.label.split(" ").slice(1).join(" ")}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Mint Calculator */}
              <div className="nft-summary rounded-2xl p-5 space-y-3">
                <div className="nft-section-title">Mint Calculator</div>

                <div className="space-y-1">
                  <div className="nft-calc-row">
                    <span className="text-white/55">Mint Fee</span>
                    <span className="text-white font-semibold">€{MINT_FEE.toFixed(2)}</span>
                  </div>
                  <div className="nft-calc-row">
                    <span className="text-white/55">Discount</span>
                    <span className="text-green-400 font-semibold">-€{DISCOUNT.toFixed(2)}</span>
                  </div>
                  <div className="nft-calc-row">
                    <span className="text-white/55">After discount</span>
                    <span className="text-white font-semibold">€{(MINT_FEE - DISCOUNT).toFixed(2)}</span>
                  </div>
                  <div className="nft-calc-row" style={{ borderBottom: "none" }}>
                    <span className="text-white/55">Network</span>
                    <span className="text-white/70 font-semibold">€{NETWORK.toFixed(2)}</span>
                  </div>
                </div>

                <div className="nft-total-row">
                  <span className="text-amber-300 font-black text-sm tracking-wider uppercase">Total</span>
                  <span className="text-amber-400 font-black text-xl">€{TOTAL.toFixed(2)}</span>
                </div>

                <button className="nft-mint-btn">
                  🎃 Mint NFT
                </button>
              </div>
            </div>
          </div>

          {/* ── Trending NFTs ── */}
          <div style={{ animation: "sp-fade-up 0.5s ease 0.25s both" }}>
            <div className="nft-section-title mb-5">Trending NFTs</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRENDING.map((nft) => (
                <div key={nft.id} className="nft-trend-card">
                  <div className="nft-trend-img" style={{ background: `radial-gradient(circle, ${nft.accent}20 0%, rgba(0,0,0,0.5) 100%)` }}>
                    <span style={{ animation: "sp-float 4s ease-in-out infinite", filter: `drop-shadow(0 0 16px ${nft.accent})` }}>
                      {nft.emoji}
                    </span>
                    {/* Decorative corner glow */}
                    <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 80% 20%, ${nft.accent}15 0%, transparent 60%)` }} />
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-white/90 text-xs font-black tracking-wider">{nft.label}</p>
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      {nft.spump && (
                        <span className="text-amber-400 text-xs font-bold">🎃 {nft.spump}</span>
                      )}
                      {nft.price && (
                        <>
                          <span className="text-white/60 text-xs">€ {nft.price}</span>
                          <span className="text-white/35 text-xs line-through">€ {nft.price}</span>
                        </>
                      )}
                      {nft.id === "SCOTTY #001" && (
                        <span className="text-amber-400 text-xs font-bold">SCOTTY #001 🎃</span>
                      )}
                    </div>
                  </div>
                  <button className="nft-trend-buy tracking-widest">BUY</button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}