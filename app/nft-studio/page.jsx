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
    bg: "from-amber-500/20 to-black/50",
    glow: "bg-amber-500/10",
  },
  {
    id: "PURPLE DROP",
    emoji: "💎",
    spump: 150,
    usff: null,
    price: null,
    label: "PURPLE DROP",
    bg: "from-purple-500/20 to-black/50",
    glow: "bg-purple-500/10",
  },
  {
    id: "LUXURY MASK",
    emoji: "🎭",
    spump: null,
    usff: null,
    price: 320,
    label: "LUXURY MASK",
    bg: "from-yellow-500/20 to-black/50",
    glow: "bg-yellow-500/10",
  },
  {
    id: "COSMIC RING",
    emoji: "🪐",
    spump: null,
    usff: null,
    price: 450,
    label: "COSMIC RING",
    bg: "from-indigo-500/20 to-black/50",
    glow: "bg-indigo-500/10",
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
    <section className="bg-primary-bg py-20">
      <Container>
        {/* ── Header ── */}
        <div className="flex items-start gap-5 mb-12 pb-8 border-b border-secondary/10">
          <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
            🎃
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
              Scotty Pumpkin Ecosystem
            </p>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-4 text-secondary">
              NFT
              <span className="text-primary italic">Studio</span>
            </h1>
          </div>
        </div>

        <div className="space-y-8">
          {/* ── Intro row ── */}
          <div className="flex gap-5 pb-8 items-start border-b border-secondary/[0.07]">
            <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
              01
            </span>
            <p className="flex-1 text-[15px] leading-[1.75] text-secondary/70 font-light m-0">
              ✦ Mint Digital Prestige ✦ — Mint NFTs from art, fashion, jewelry,
              video &amp; digital goods. List free. Sell with only{" "}
              <span className="text-primary font-medium">3%</span> when sold.
            </p>
          </div>

          {/* ── Fee Banner ── */}
          <div className="flex gap-5 pb-8 items-start border-b border-secondary/[0.07]">
            <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
              02
            </span>
            <div className="flex-1 flex flex-wrap items-center gap-4 px-5 py-4 bg-primary/5 border border-primary/15 border-l-2 border-l-primary rounded-lg text-sm">
              <span className="text-primary font-medium">
                🎃 Mint{" "}
                <span className="text-secondary/70 font-light">
                  -15% SPUMP/USFF
                </span>
              </span>
              <span className="text-secondary/20">•</span>
              <span className="text-primary font-medium">
                🎃 Buy{" "}
                <span className="text-secondary/70 font-light">
                  -10% SPUMP/USFF
                </span>
              </span>
              <span className="text-secondary/20">•</span>
              <span className="text-primary font-medium">
                🎃 Sale Fee{" "}
                <span className="text-secondary/70 font-light">3%</span>
              </span>
            </div>
          </div>

          {/* ── Section label ── */}
          <p className="text-[11px] font-medium tracking-widest uppercase text-primary">
            Create NFT
          </p>

          <div className="grid lg:grid-cols-5 gap-5">
            {/* LEFT — Create NFT */}
            <div className="lg:col-span-3 bg-white border border-secondary/[0.07] rounded-xl p-5 md:p-6 space-y-6">
              {/* Step 1 */}
              <div className="flex gap-5 items-start pb-6 border-b border-secondary/[0.07]">
                <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                  01
                </span>
                <div className="flex-1">
                  <p className="text-[13px] font-medium uppercase tracking-wide text-secondary/80 mb-3">
                    Connect Wallet
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`}
                      />
                      <span
                        className={`text-sm font-light ${connected ? "text-green-500" : "text-red-400"}`}>
                        {connected ? "Connected ✓" : "Not Connected"}
                      </span>
                    </div>
                    <button
                      onClick={() => setConnected((v) => !v)}
                      className={`px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer ${connected ? "bg-secondary/70 hover:bg-secondary/60" : "bg-primary hover:bg-primary/90"}`}>
                      {connected ? "Disconnect" : "Connect Wallet"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-5 items-start pb-6 border-b border-secondary/[0.07]">
                <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                  02
                </span>
                <div className="flex-1">
                  <p className="text-[13px] font-medium uppercase tracking-wide text-secondary/80 mb-3">
                    Upload Artwork
                  </p>
                  <div
                    className={`rounded-xl p-6 text-center space-y-3 border-2 border-dashed cursor-pointer transition-colors ${dragOver ? "border-primary/60 bg-primary/5" : "border-secondary/15 bg-primary-bg hover:border-primary/30"}`}
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
                        <p className="text-green-500 text-sm font-medium">
                          {uploadedFile}
                        </p>
                        <p className="text-secondary/40 text-xs font-light">
                          Click to change file
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl">🖼️</div>
                        <div>
                          <p className="text-secondary font-medium text-sm">
                            DROP ARTWORK HERE
                          </p>
                          <p className="text-secondary/70 text-xs font-light">
                            or{" "}
                            <span className="text-primary underline cursor-pointer">
                              Choose File
                            </span>
                          </p>
                        </div>
                        <p className="text-secondary/70 text-xs tracking-wider">
                          PNG · JPG · GIF · MP4
                        </p>
                      </>
                    )}
                    <button
                      className="px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-medium tracking-wider hover:bg-primary/90 transition-colors cursor-pointer"
                      onClick={(e) => e.stopPropagation()}>
                      🎃 BUY NFT
                    </button>
                    <p className="text-secondary/60 text-xs">
                      PNG · JPG · GIF · MP4
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-5 items-start">
                <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                  03
                </span>
                <div className="flex-1">
                  <p className="text-[13px] font-medium uppercase tracking-wide text-secondary/70 mb-3">
                    NFT Details
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="col-span-1 px-3 py-2.5 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm placeholder:text-secondary/50 font-light outline-none focus:border-primary/40 transition-colors"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                      className="col-span-1 px-3 py-2.5 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm placeholder:text-secondary/50 font-light outline-none focus:border-primary/40 transition-colors"
                      placeholder="Collection"
                      value={collection}
                      onChange={(e) => setCollection(e.target.value)}
                    />
                    <input
                      className="col-span-2 px-3 py-2.5 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm placeholder:text-secondary/50 font-light outline-none focus:border-primary/40 transition-colors"
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <label className="text-secondary/60 text-xs font-medium whitespace-nowrap">
                        Category
                      </label>
                      <select
                        className="flex-1 px-2 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40 transition-colors"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}>
                        {CATEGORIES.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-secondary/60 text-xs font-medium whitespace-nowrap">
                        Limited
                      </label>
                      <input
                        type="number"
                        min={1}
                        className="w-16 px-2 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40 transition-colors"
                        value={limited}
                        onChange={(e) => setLimited(e.target.value)}
                      />
                      <span className="text-secondary/50 text-xs">%</span>
                    </div>
                  </div>

                  {/* Traits */}
                  <div className="flex items-center gap-3 mt-4 flex-wrap">
                    <button
                      className="px-3 py-1.5 rounded-lg border border-primary/25 text-primary text-xs font-medium hover:bg-primary/10 transition-colors cursor-pointer"
                      onClick={addTrait}>
                      + Add Trait
                    </button>
                    <span className="text-secondary/60 text-xs font-light">
                      1/1 Unique
                    </span>
                  </div>
                  {traits.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {traits.map((t, i) => (
                        <div key={i} className="flex gap-2">
                          <input
                            className="flex-1 px-3 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm placeholder:text-secondary/30 font-light outline-none focus:border-primary/40 transition-colors"
                            placeholder="Trait name"
                            value={t.key}
                            onChange={(e) =>
                              setTraits((prev) =>
                                prev.map((x, xi) =>
                                  xi === i ? { ...x, key: e.target.value } : x,
                                ),
                              )
                            }
                          />
                          <input
                            className="flex-1 px-3 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm placeholder:text-secondary/30 font-light outline-none focus:border-primary/40 transition-colors"
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
            </div>

            {/* RIGHT — Live Summary + Calculator */}
            <div className="lg:col-span-2 space-y-4">
              {/* Live Summary */}
              <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
                <p className="text-[11px] font-medium tracking-widest uppercase text-primary">
                  Live Summary
                </p>
                <div className="flex items-center gap-3 pb-3 border-b border-secondary/[0.07]">
                  <span className="text-2xl">🎃</span>
                  <span className="text-secondary font-medium text-base">
                    Scotty Pumpkin
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "-15% Mint Discount" },
                    { label: "-10% Buyer Discount" },
                    { label: "Free Listing" },
                  ].map((item) => (
                    <p
                      key={item.label}
                      className="flex items-center gap-2 text-sm">
                      <span className="text-primary">✓</span>
                      <span className="text-primary font-medium">
                        {item.label.split(" ")[0]}
                      </span>
                      <span className="text-secondary/55 font-light">
                        {item.label.split(" ").slice(1).join(" ")}
                      </span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Mint Calculator */}
              <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
                <p className="text-[11px] font-medium tracking-widest uppercase text-primary">
                  Mint Calculator
                </p>
                <div className="space-y-0">
                  {[
                    { label: "Mint Fee", value: `€${MINT_FEE.toFixed(2)}` },
                    { label: "Discount", value: `-€${DISCOUNT.toFixed(2)}` },
                    {
                      label: "After discount",
                      value: `€${(MINT_FEE - DISCOUNT).toFixed(2)}`,
                    },
                    { label: "Network", value: `€${NETWORK.toFixed(2)}` },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className={`flex justify-between items-center py-2.5 ${i < 3 ? "border-b border-secondary/[0.07]" : ""}`}>
                      <span className="text-secondary/70 text-sm font-light">
                        {row.label}
                      </span>
                      <span className="text-primary font-medium text-sm">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center px-4 py-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <span className="text-primary font-medium text-sm uppercase tracking-wider">
                    Total
                  </span>
                  <span className="text-primary font-semibold text-xl">
                    €{TOTAL.toFixed(2)}
                  </span>
                </div>
                <button className="w-full py-3 rounded-lg bg-primary text-white font-medium text-sm tracking-wider hover:bg-primary/90 transition-colors cursor-pointer">
                  🎃 Mint NFT
                </button>
              </div>
            </div>
          </div>

          {/* ── Trending NFTs ── */}
          <div>
            <div className="h-px bg-secondary/10 mb-8" />
            <p className="text-[11px] font-medium tracking-widest uppercase text-primary mb-6">
              Trending NFTs
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRENDING.map((nft) => (
                <div
                  key={nft.id}
                  className="bg-white border border-secondary/[0.07] rounded-xl overflow-hidden hover:border-primary/20 transition-colors">
                  <div
                    className={`relative h-36 bg-linear-to-br ${nft.bg} flex items-center justify-center`}>
                    <span className="text-5xl">{nft.emoji}</span>
                    <div className={`absolute inset-0 ${nft.glow}`} />
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-secondary/70 text-xs font-medium tracking-wider">
                      {nft.label}
                    </p>
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      {nft.spump && (
                        <span className="text-primary text-xs font-medium">
                          🎃 {nft.spump}
                        </span>
                      )}
                      {nft.price && (
                        <>
                          <span className="text-secondary/70 text-xs font-light">
                            € {nft.price}
                          </span>
                          <span className="text-secondary/50 text-xs line-through font-light">
                            € {nft.price}
                          </span>
                        </>
                      )}
                      {nft.id === "SCOTTY #001" && (
                        <span className="text-primary text-xs font-medium">
                          SCOTTY #001 🎃
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <button className="w-full py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-widest hover:bg-primary hover:text-white transition-colors cursor-pointer">
                      BUY
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
