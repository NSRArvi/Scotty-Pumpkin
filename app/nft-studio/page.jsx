"use client";

import { useState, useRef } from "react";
import Container from "../components/shared/Container";

const TRENDING = [
  {
    id: "SCOTTY #001",
    emoji: "🎃",
    spump: null,
    usff: null,
    price: null,
    label: "SCOTTY #001",
    accent: "#f59e0b",
  },
  {
    id: "PURPLE DROP",
    emoji: "💎",
    spump: 150,
    usff: null,
    price: null,
    label: "PURPLE DROP",
    accent: "#a855f7",
  },
  {
    id: "LUXURY MASK",
    emoji: "🎭",
    spump: null,
    usff: null,
    price: 320,
    label: "LUXURY MASK",
    accent: "#eab308",
  },
  {
    id: "COSMIC RING",
    emoji: "🪐",
    spump: null,
    usff: null,
    price: 450,
    label: "COSMIC RING",
    accent: "#6366f1",
  },
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
      <section className="bg-primary-bg">
        <Container>
          <div className="nft-page">
            {/* Background stars */}
            {[
              { size: 2, top: "5%", left: "8%", delay: "0s", dur: "3s" },
              { size: 1, top: "12%", left: "72%", delay: "0.4s", dur: "2.5s" },
              { size: 2, top: "20%", left: "40%", delay: "1s", dur: "3.5s" },
              { size: 1, top: "60%", left: "88%", delay: "0.7s", dur: "2.8s" },
              { size: 2, top: "75%", left: "15%", delay: "1.3s", dur: "3.2s" },
              { size: 1, top: "88%", left: "55%", delay: "0.2s", dur: "2.3s" },
              { size: 3, top: "3%", left: "55%", delay: "1.7s", dur: "4s" },
              { size: 1, top: "45%", left: "2%", delay: "0.9s", dur: "3.7s" },
            ].map((s, i) => (
              <div
                key={i}
                className="nft-star"
                style={{
                  width: s.size,
                  height: s.size,
                  top: s.top,
                  left: s.left,
                  animation: `sp-star-twinkle ${s.dur} ${s.delay} ease-in-out infinite`,
                }}
              />
            ))}

            <div
              className="relative z-10 py-10 md:py-14 space-y-8"
              style={{ animation: "sp-fade-up 0.5s ease both" }}>
              {/* ── Hero ── */}
              <div
                className="text-center space-y-3"
                style={{ animation: "sp-fade-up 0.5s ease 0.05s both" }}>
                <h1 className="nft-hero-title text-5xl md:text-6xl lg:text-7xl font-black tracking-tight">
                  NFT Studio
                </h1>
                <p className="text-primary/70 text-base md:text-lg font-semibold tracking-widest">
                  ✦ Mint Digital Prestige ✦
                </p>
                <p className="text-secondary/80 text-sm max-w-lg mx-auto leading-relaxed">
                  Mint NFTs from art, fashion, jewelry, video &amp; digital
                  goods. List free. Sell with only{" "}
                  <span className="text-primary font-bold">3%</span> when sold.
                </p>
              </div>

              {/* ── Fee Banner ── */}
              <div
                className="nft-fee-banner rounded-2xl px-6 py-3 flex flex-wrap items-center justify-center gap-4 text-sm"
                style={{ animation: "sp-fade-up 0.5s ease 0.1s both" }}>
                <span className="text-primary font-bold">
                  🎃 Mint{" "}
                  <span className="text-secondary/80">-15% SPUMP/USFF</span>
                </span>
                <span className="text-secondary/70">•</span>
                <span className="text-primary font-bold">
                  🎃 Buy{" "}
                  <span className="text-secondary/80">-10% SPUMP/USFF</span>
                </span>
                <span className="text-secondary/70">•</span>
                <span className="text-primary font-bold">
                  🎃 Sale Fee <span className="text-secondary/80">3%</span>
                </span>
              </div>

              {/* ── Two column: Create NFT + Live Summary ── */}
              <div
                className="grid lg:grid-cols-5 gap-5"
                style={{ animation: "sp-fade-up 0.5s ease 0.15s both" }}>
                {/* LEFT — Create NFT */}
                <div className="lg:col-span-3  rounded-2xl p-5 md:p-6 space-y-5 bg-white/80">
                  <div className="nft-section-title">Create NFT</div>

                  {/* Step 1 */}
                  <div>
                    <p className="nft-step">Step 1 — Connect Wallet</p>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="nft-status-dot"
                          style={{
                            background: connected ? "#4ade80" : "#ef4444",
                          }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: connected ? "#4ade80" : "#f87171" }}>
                          {connected ? "Connected ✓" : "Not Connected"}
                        </span>
                      </div>
                      <button
                        onClick={() => setConnected((v) => !v)}
                        className={`nft-connect-btn ui-btn ui-btn-success px-5 py-2 rounded-lg text-sm font-bold text-white ${connected ? "connected" : ""}`}>
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
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}>
                      <input
                        ref={fileRef}
                        type="file"
                        accept=".png,.jpg,.gif,.mp4"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      {uploadedFile ? (
                        <div className="space-y-2">
                          <span className="text-4xl">✅</span>
                          <p className="text-green-400 text-sm font-bold">
                            {uploadedFile}
                          </p>
                          <p className="text-white/35 text-xs">
                            Click to change file
                          </p>
                        </div>
                      ) : (
                        <>
                          <div className="text-4xl">🖼️</div>
                          <div>
                            <p className="text-secondary font-bold text-sm">
                              DROP ARTWORK HERE
                            </p>
                            <p className="text-secondary/80 text-xs">
                              or{" "}
                              <span className="text-primary underline cursor-pointer">
                                Choose File
                              </span>
                            </p>
                          </div>
                          <p className="text-secondary/80 text-xs tracking-wider">
                            PNG · JPG · GIF · MP4
                          </p>
                        </>
                      )}
                      <button
                        className="nft-buy-btn ui-btn ui-btn-warn px-6 py-2.5 rounded-lg text-sm font-black text-white tracking-wider"
                        onClick={(e) => e.stopPropagation()}>
                        🎃 BUY NFT
                      </button>
                      <p className="text-white/25 text-xs">
                        PNG · JPG · GIF · MP4
                      </p>
                    </div>
                  </div>

                  <div className="nft-divider" />

                  {/* Step 3 */}
                  <div>
                    <p className="nft-step">Step 3 — NFT Details</p>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="nft-input placeholder-secondary/80"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                      <input
                        className="nft-input"
                        placeholder="Collection"
                        value={collection}
                        onChange={(e) => setCollection(e.target.value)}
                      />
                      <input
                        className="nft-input col-span-2"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <label className="text-secondary/80 text-xs font-bold whitespace-nowrap">
                          Category
                        </label>
                        <select
                          className="nft-select flex-1"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}>
                          {CATEGORIES.map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-secondary/70 text-xs font-bold whitespace-nowrap">
                          Limited
                        </label>
                        <input
                          type="number"
                          min={1}
                          className="nft-input"
                          value={limited}
                          onChange={(e) => setLimited(e.target.value)}
                          style={{ width: 64 }}
                        />
                        <span className="text-secondary/70 text-xs">%</span>
                      </div>
                    </div>

                    {/* Traits */}
                    <div className="flex items-center gap-3 mt-4 flex-wrap">
                      <button className="nft-trait-btn" onClick={addTrait}>
                        + Add Trait
                      </button>
                      <span className="text-secondary/80 text-xs">
                        1/1 Unique
                      </span>
                    </div>
                    {traits.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {traits.map((t, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              className="nft-input"
                              placeholder="Trait name"
                              value={t.key}
                              onChange={(e) =>
                                setTraits((prev) =>
                                  prev.map((x, xi) =>
                                    xi === i
                                      ? { ...x, key: e.target.value }
                                      : x,
                                  ),
                                )
                              }
                            />
                            <input
                              className="nft-input"
                              placeholder="Value"
                              value={t.value}
                              onChange={(e) =>
                                setTraits((prev) =>
                                  prev.map((x, xi) =>
                                    xi === i
                                      ? { ...x, value: e.target.value }
                                      : x,
                                  ),
                                )
                              }
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT — Live Summary + Calculator */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Live Summary */}
                  <div className=" rounded-2xl p-5 space-y-4 bg-white/80">
                    <div className="nft-section-title">Live Summary</div>

                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🎃</span>
                      <span className="text-secondary/80 font-black text-base">
                        Scotty Pumpkin
                      </span>
                    </div>

                    <div className="space-y-2">
                      {[
                        { label: "-15% Mint Discount", ok: true },
                        { label: "-10% Buyer Discount", ok: true },
                        { label: "Free Listing", ok: true },
                      ].map((item) => (
                        <p
                          key={item.label}
                          className="flex items-center gap-2 text-sm text-white/80">
                          <span className="nft-check">✓</span>
                          <span
                            // style={{ color: "#f59e0b" }}
                            className="text-primary">
                            {item.label.split(" ")[0]}
                          </span>
                          <span className="text-secondary/80">
                            {item.label.split(" ").slice(1).join(" ")}
                          </span>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Mint Calculator */}
                  <div className="bg-white/80 rounded-2xl p-5 space-y-3">
                    <div className="nft-section-title">Mint Calculator</div>

                    <div className="space-y-1">
                      <div className="nft-calc-row">
                        <span className="text-secondary/80">Mint Fee</span>
                        <span className="text-primary font-semibold">
                          €{MINT_FEE.toFixed(2)}
                        </span>
                      </div>
                      <div className="nft-calc-row">
                        <span className="text-secondary/80">Discount</span>
                        <span className="text-primary font-semibold">
                          -€{DISCOUNT.toFixed(2)}
                        </span>
                      </div>
                      <div className="nft-calc-row">
                        <span className="text-secondary/80">
                          After discount
                        </span>
                        <span className="text-primary font-semibold">
                          €{(MINT_FEE - DISCOUNT).toFixed(2)}
                        </span>
                      </div>
                      <div
                        className="nft-calc-row"
                        style={{ borderBottom: "none" }}>
                        <span className="text-secondary/80">Network</span>
                        <span className="text-primary font-semibold">
                          €{NETWORK.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="nft-total-row">
                      <span className="text-primary font-black text-sm tracking-wider uppercase">
                        Total
                      </span>
                      <span className="text-primary font-black text-xl">
                        €{TOTAL.toFixed(2)}
                      </span>
                    </div>

                    <button className="nft-mint-btn ui-btn ui-btn-warn">
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
                      <div
                        className="nft-trend-img"
                        style={{
                          background: `radial-gradient(circle, ${nft.accent}20 0%, rgba(0,0,0,0.5) 100%)`,
                        }}>
                        <span
                          style={{
                            animation: "sp-float 4s ease-in-out infinite",
                          }}>
                          {nft.emoji}
                        </span>
                        {/* Decorative corner glow */}
                        <div
                          className="absolute inset-0"
                          style={{
                            background: `radial-gradient(circle at 80% 20%, ${nft.accent}15 0%, transparent 60%)`,
                          }}
                        />
                      </div>
                      <div className="p-3 space-y-2">
                        <p className="text-secondary/80 text-xs font-black tracking-wider">
                          {nft.label}
                        </p>
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          {nft.spump && (
                            <span className="text-primary text-xs font-bold">
                              🎃 {nft.spump}
                            </span>
                          )}
                          {nft.price && (
                            <>
                              <span className="text-secondary/80 text-xs">
                                € {nft.price}
                              </span>
                              <span className="text-secondary/80 text-xs line-through">
                                € {nft.price}
                              </span>
                            </>
                          )}
                          {nft.id === "SCOTTY #001" && (
                            <span className="text-primary text-xs font-bold">
                              SCOTTY #001 🎃
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="nft-trend-buy ui-btn ui-btn-warn tracking-widest">
                        BUY
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
