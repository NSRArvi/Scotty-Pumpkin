"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Container from "../components/shared/Container";

// ── Solana & Metaplex imports ─────────────────────────
// npm install @solana/web3.js @metaplex-foundation/umi
// @metaplex-foundation/umi-bundle-defaults
// @metaplex-foundation/mpl-core

const CATEGORIES = ["art", "fashion", "jewelry", "music", "video", "digital"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const TRENDING = [
  { id: "SCOTTY #001", emoji: "🎃", spump: null, price: null, label: "SCOTTY #001", bg: "from-amber-500/20 to-black/50", glow: "bg-amber-500/10" },
  { id: "PURPLE DROP", emoji: "💎", spump: 150,  price: null, label: "PURPLE DROP", bg: "from-purple-500/20 to-black/50", glow: "bg-purple-500/10" },
  { id: "LUXURY MASK", emoji: "🎭", spump: null, price: 320,  label: "LUXURY MASK", bg: "from-yellow-500/20 to-black/50", glow: "bg-yellow-500/10" },
  { id: "COSMIC RING", emoji: "🪐", spump: null, price: 450,  label: "COSMIC RING", bg: "from-indigo-500/20 to-black/50", glow: "bg-indigo-500/10" },
];

// ── Solana Mint Helper ────────────────────────────────
async function mintOnSolana(metadataUri, walletAddress) {
  try {
    const { createUmi }            = await import("@metaplex-foundation/umi-bundle-defaults");
    const { walletAdapterIdentity } = await import("@metaplex-foundation/umi-signer-wallet-adapters");
    const { create, mplCore }      = await import("@metaplex-foundation/mpl-core");
    const { generateSigner }       = await import("@metaplex-foundation/umi");

    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
    const rpcUrl  = network === "mainnet-beta"
      ? "https://api.mainnet-beta.solana.com"
      : "https://api.devnet.solana.com";

    // UMI setup
    const umi = createUmi(rpcUrl).use(mplCore());

    // Phantom wallet adapter
    const phantomWallet = {
      publicKey: { toBytes: () => Buffer.from(walletAddress) },
      signTransaction:    (tx) => window.solana.signTransaction(tx),
      signAllTransactions:(txs) => window.solana.signAllTransactions(txs),
    };
    umi.use(walletAdapterIdentity(phantomWallet));

    // NFT Asset generate
    const assetSigner = generateSigner(umi);

    // Mint transaction
    const { signature } = await create(umi, {
      asset:  assetSigner,
      name:   "NFT",
      uri:    metadataUri,
    }).sendAndConfirm(umi);

    return {
      mintAddress:    assetSigner.publicKey.toString(),
      transactionSig: Buffer.from(signature).toString("base64"),
    };
  } catch (err) {
    throw new Error("Solana mint failed: " + err.message);
  }
}

export default function NFTStudioPage() {
  // ── Wallet ───────────────────────────────────────────
  const [connected, setConnected]       = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  // ── Upload ───────────────────────────────────────────
  const [dragOver, setDragOver]         = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileObj, setUploadedFileObj] = useState(null);
  const fileRef = useRef(null);

  // ── NFT Details ──────────────────────────────────────
  const [title, setTitle]               = useState("");
  const [description, setDescription]  = useState("");
  const [symbol, setSymbol]             = useState("");
  const [category, setCategory]         = useState("art");
  const [editionType, setEditionType]   = useState("limited");
  const [totalSupply, setTotalSupply]   = useState(100);
  const [royalty, setRoyalty]           = useState(5);
  const [traits, setTraits]             = useState([]);

  // ── Collection ───────────────────────────────────────
  const [collections, setCollections]   = useState([]);
  const [collectionId, setCollectionId] = useState("");
  const [newCollection, setNewCollection] = useState("");
  const [showNewCollection, setShowNewCollection] = useState(false);

  // ── Pricing ──────────────────────────────────────────
  const [mintPrice, setMintPrice]                   = useState(0.5);
  const [isFreeListing, setIsFreeListing]           = useState(false);
  const [hasMintDiscount, setHasMintDiscount]       = useState(true);
  const [mintDiscountPercent, setMintDiscountPercent] = useState(15);
  const [hasBuyerDiscount, setHasBuyerDiscount]     = useState(true);
  const [buyerDiscountPercent, setBuyerDiscountPercent] = useState(10);
  const [buyerDiscountMaxUses, setBuyerDiscountMaxUses] = useState(50);

  // ── Calculated ───────────────────────────────────────
  const NETWORK_FEE     = 0.00001;
  const discountAmount  = hasMintDiscount && !isFreeListing ? (mintPrice * mintDiscountPercent) / 100 : 0;
  const priceAfter      = isFreeListing ? 0 : mintPrice - discountAmount;
  const totalCost       = priceAfter + NETWORK_FEE;

  // ── State ────────────────────────────────────────────
  const [step, setStep]     = useState("idle"); // idle | uploading | minting | done | error
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState(null);
  const [mintStep, setMintStep] = useState(""); // progress message

  // ── Auto-connect Phantom ─────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && window.solana?.isConnected) {
      window.solana.connect({ onlyIfTrusted: true })
        .then((resp) => {
          setWalletAddress(resp.publicKey.toString());
          setConnected(true);
        }).catch(() => {});
    }
  }, []);

  // ── Load Collections ─────────────────────────────────
  const loadCollections = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const res  = await fetch(`${API_URL}/collections?wallet=${walletAddress}`);
      const data = await res.json();
      if (data.success) setCollections(data.data || []);
    } catch (_) {}
  }, [walletAddress]);

  useEffect(() => {
    if (connected && walletAddress) loadCollections();
  }, [connected, walletAddress, loadCollections]);

  // ── Phantom Connect ───────────────────────────────────
  async function connectWallet() {
    try {
      if (typeof window === "undefined" || !window.solana) {
        alert("Phantom Wallet not found!\nInstall from: https://phantom.app");
        return;
      }
      const resp = await window.solana.connect();
      setWalletAddress(resp.publicKey.toString());
      setConnected(true);
    } catch (err) {
      setError("Wallet connection failed: " + err.message);
    }
  }

  async function disconnectWallet() {
    if (window.solana) await window.solana.disconnect();
    setConnected(false);
    setWalletAddress("");
    setCollections([]);
  }

  // ── File Handlers ─────────────────────────────────────
  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) { setUploadedFile(file.name); setUploadedFileObj(file); }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) { setUploadedFile(file.name); setUploadedFileObj(file); }
  }

  function addTrait() {
    setTraits((p) => [...p, { key: "", value: "" }]);
  }

  function removeTrait(i) {
    setTraits((p) => p.filter((_, xi) => xi !== i));
  }

  // ── Create Collection ─────────────────────────────────
  async function handleCreateCollection() {
    if (!newCollection.trim()) return;
    try {
      const res = await fetch(`${API_URL}/collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name: newCollection, wallet_address: walletAddress }),
      });
      const data = await res.json();
      if (data.success) {
        setCollections((p) => [data.data, ...p]);
        setCollectionId(data.data.id.toString());
        setNewCollection("");
        setShowNewCollection(false);
      }
    } catch (err) {
      setError("Collection create failed: " + err.message);
    }
  }

  // ── Main Mint Handler ─────────────────────────────────
  async function handleMint() {
    setError("");
    setSuccess(null);

    if (!connected || !walletAddress) return setError("Please connect your Phantom Wallet first.");
    if (!uploadedFileObj)             return setError("Please upload an artwork.");
    if (!title.trim())                return setError("Please enter NFT title.");
    if (!description.trim())          return setError("Please enter a description.");

    setStep("uploading");

    try {
      // ── Step 1: Image + Metadata → Laravel API ────────
      setMintStep("📤 Uploading to IPFS...");
      const formData = new FormData();
      formData.append("wallet_address", walletAddress);
      formData.append("name",           title);
      formData.append("description",    description);
      formData.append("symbol",         symbol || "NFT");
      formData.append("image",          uploadedFileObj);
      formData.append("category",       category);
      formData.append("edition_type",   editionType);
      if (editionType === "limited") formData.append("total_supply", totalSupply);
      if (collectionId)              formData.append("collection_id", collectionId);
      formData.append("mint_price",           isFreeListing ? "0" : mintPrice.toString());
      formData.append("is_free_listing",      isFreeListing ? "true" : "false");
      formData.append("has_mint_discount",    hasMintDiscount ? "true" : "false");
      if (hasMintDiscount) formData.append("mint_discount_percent", mintDiscountPercent.toString());
      formData.append("has_buyer_discount",   hasBuyerDiscount ? "true" : "false");
      if (hasBuyerDiscount) {
        formData.append("buyer_discount_percent",  buyerDiscountPercent.toString());
        formData.append("buyer_discount_max_uses", buyerDiscountMaxUses.toString());
      }
      formData.append("royalty", royalty.toString());
      traits.forEach((t, i) => {
        if (t.key && t.value) {
          formData.append(`attributes[${i}][trait_type]`, t.key);
          formData.append(`attributes[${i}][value]`,      t.value);
        }
      });

      const apiRes  = await fetch(`${API_URL}/nft/create`, { method: "POST", body: formData });
      const apiData = await apiRes.json();
      if (!apiData.success) throw new Error(apiData.message || "API Error");

      const { nft_id, metadata_uri } = apiData.data;

      // ── Step 2: Solana Mint via Phantom ───────────────
      setStep("minting");
      setMintStep("🔗 Minting on Solana...");

      const { mintAddress, transactionSig } = await mintOnSolana(metadata_uri, walletAddress);

      // ── Step 3: Confirm to Laravel ────────────────────
      setMintStep("✅ Confirming...");
      const confirmRes  = await fetch(`${API_URL}/nft/mint`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nft_id,
          mint_address:    mintAddress,
          transaction_sig: transactionSig,
          wallet_address:  walletAddress,
        }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmData.success) throw new Error(confirmData.message || "Confirm failed");

      // ── Done ──────────────────────────────────────────
      setStep("done");
      setMintStep("");
      setSuccess({
        ...apiData.data,
        mint_address:    mintAddress,
        transaction_sig: transactionSig,
        explorer_url:    `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
      });

    } catch (err) {
      setStep("error");
      setMintStep("");
      setError(err.message);
    }
  }

  const loading = step === "uploading" || step === "minting";

  return (
    <section className="bg-primary-bg py-20">
      <Container>
        {/* ── Header ── */}
        <div className="flex items-start gap-5 mb-12 pb-8 border-b border-secondary/10">
          <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">🎃</div>
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">Scotty Pumpkin Ecosystem</p>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-4 text-secondary">
              NFT<span className="text-primary italic">Studio</span>
            </h1>
          </div>
        </div>

        <div className="space-y-8">
          {/* Intro */}
          <div className="flex gap-5 pb-8 items-start border-b border-secondary/[0.07]">
            <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">01</span>
            <p className="flex-1 text-[15px] leading-[1.75] text-secondary/70 font-light m-0">
              ✦ Mint Digital Prestige ✦ — Mint NFTs from art, fashion, jewelry, video &amp; digital goods. List free. Sell with only{" "}
              <span className="text-primary font-medium">3%</span> when sold.
            </p>
          </div>

          {/* Fee Banner */}
          <div className="flex gap-5 pb-8 items-start border-b border-secondary/[0.07]">
            <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">02</span>
            <div className="flex-1 flex flex-wrap items-center gap-4 px-5 py-4 bg-primary/5 border border-primary/15 border-l-2 border-l-primary rounded-lg text-sm">
              <span className="text-primary font-medium">🎃 Mint <span className="text-secondary/70 font-light">-15% SPUMP/USFF</span></span>
              <span className="text-secondary/20">•</span>
              <span className="text-primary font-medium">🎃 Buy <span className="text-secondary/70 font-light">-10% SPUMP/USFF</span></span>
              <span className="text-secondary/20">•</span>
              <span className="text-primary font-medium">🎃 Sale Fee <span className="text-secondary/70 font-light">3%</span></span>
            </div>
          </div>

          <p className="text-[11px] font-medium tracking-widest uppercase text-primary">Create NFT</p>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start gap-2">
              <span>⚠️</span><span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="px-5 py-4 bg-green-500/10 border border-green-500/30 rounded-xl space-y-3">
              <p className="text-green-400 font-medium">🎉 NFT Minted Successfully on Solana!</p>
              <div className="space-y-1 text-xs text-secondary/60">
                <p>Mint Address: <span className="text-primary break-all">{success.mint_address}</span></p>
                <p>Image: <a href={success.image_url} target="_blank" className="text-primary underline">View on IPFS</a></p>
                <p><a href={success.explorer_url} target="_blank" className="text-primary underline">View on Solana Explorer ↗</a></p>
              </div>
              <div className="pt-1 space-y-1 text-xs text-secondary/50">
                <p>Mint Fee: {success.pricing?.mint_price}</p>
                <p>After Discount: {success.pricing?.price_after_discount}</p>
                <p>Network Fee: {success.pricing?.network_fee}</p>
                <p className="text-primary font-medium">Total: {success.pricing?.total_cost}</p>
              </div>
            </div>
          )}

          {/* Progress */}
          {mintStep && (
            <div className="px-4 py-3 bg-primary/5 border border-primary/20 rounded-lg text-primary text-sm animate-pulse">
              {mintStep}
            </div>
          )}

          <div className="grid lg:grid-cols-5 gap-5">
            {/* ── LEFT ── */}
            <div className="lg:col-span-3 bg-white border border-secondary/[0.07] rounded-xl p-5 md:p-6 space-y-6">

              {/* Step 1 — Connect Wallet */}
              <div className="flex gap-5 items-start pb-6 border-b border-secondary/[0.07]">
                <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">01</span>
                <div className="flex-1">
                  <p className="text-[13px] font-medium uppercase tracking-wide text-secondary/80 mb-3">Connect Wallet</p>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-400" : "bg-red-400"}`} />
                      <span className={`text-sm font-light ${connected ? "text-green-500" : "text-red-400"}`}>
                        {connected ? `${walletAddress.slice(0,4)}...${walletAddress.slice(-4)} ✓` : "Not Connected"}
                      </span>
                    </div>
                    <button
                      onClick={connected ? disconnectWallet : connectWallet}
                      className={`px-5 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer ${connected ? "bg-secondary/70 hover:bg-secondary/60" : "bg-primary hover:bg-primary/90"}`}>
                      {connected ? "Disconnect" : "Connect Wallet"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2 — Upload */}
              <div className="flex gap-5 items-start pb-6 border-b border-secondary/[0.07]">
                <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">02</span>
                <div className="flex-1">
                  <p className="text-[13px] font-medium uppercase tracking-wide text-secondary/80 mb-3">Upload Artwork</p>
                  <div
                    className={`rounded-xl p-6 text-center space-y-3 border-2 border-dashed cursor-pointer transition-colors ${dragOver ? "border-primary/60 bg-primary/5" : "border-secondary/15 bg-primary-bg hover:border-primary/30"}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}>
                    <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.gif,.webp" className="hidden" onChange={handleFileChange} />
                    {uploadedFile ? (
                      <div className="space-y-2">
                        <span className="text-4xl">✅</span>
                        <p className="text-green-500 text-sm font-medium">{uploadedFile}</p>
                        <p className="text-secondary/40 text-xs font-light">Click to change</p>
                      </div>
                    ) : (
                      <>
                        <div className="text-4xl">🖼️</div>
                        <p className="text-secondary font-medium text-sm">DROP ARTWORK HERE</p>
                        <p className="text-secondary/70 text-xs font-light">or <span className="text-primary underline">Choose File</span></p>
                        <p className="text-secondary/70 text-xs tracking-wider">PNG · JPG · GIF · WEBP</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3 — Details */}
              <div className="flex gap-5 items-start pb-6 border-b border-secondary/[0.07]">
                <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">03</span>
                <div className="flex-1">
                  <p className="text-[13px] font-medium uppercase tracking-wide text-secondary/70 mb-3">NFT Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <input className="col-span-1 px-3 py-2.5 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm placeholder:text-secondary/50 font-light outline-none focus:border-primary/40" placeholder="Title *" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <input className="col-span-1 px-3 py-2.5 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm placeholder:text-secondary/50 font-light outline-none focus:border-primary/40" placeholder="Symbol (e.g. MNFT)" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
                    <textarea className="col-span-2 px-3 py-2.5 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm placeholder:text-secondary/50 font-light outline-none focus:border-primary/40 resize-none h-20" placeholder="Description *" value={description} onChange={(e) => setDescription(e.target.value)} />

                    {/* Collection Dropdown */}
                    <div className="col-span-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="text-secondary/60 text-xs font-medium whitespace-nowrap">Collection</label>
                        <select
                          className="flex-1 px-2 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40"
                          value={collectionId}
                          onChange={(e) => setCollectionId(e.target.value)}>
                          <option value="">— None —</option>
                          {collections.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => setShowNewCollection((v) => !v)}
                          className="px-3 py-2 rounded-lg border border-primary/25 text-primary text-xs font-medium hover:bg-primary/10 transition-colors cursor-pointer whitespace-nowrap">
                          + New
                        </button>
                      </div>
                      {showNewCollection && (
                        <div className="flex gap-2">
                          <input
                            className="flex-1 px-3 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40"
                            placeholder="Collection name"
                            value={newCollection}
                            onChange={(e) => setNewCollection(e.target.value)}
                          />
                          <button onClick={handleCreateCollection} className="px-4 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary/90 cursor-pointer">Create</button>
                        </div>
                      )}
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-2">
                      <label className="text-secondary/60 text-xs font-medium whitespace-nowrap">Category</label>
                      <select className="flex-1 px-2 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40" value={category} onChange={(e) => setCategory(e.target.value)}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </select>
                    </div>

                    {/* Edition */}
                    <div className="flex items-center gap-2">
                      <label className="text-secondary/60 text-xs font-medium whitespace-nowrap">Edition</label>
                      <select className="flex-1 px-2 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40" value={editionType} onChange={(e) => setEditionType(e.target.value)}>
                        <option value="unlimited">Unlimited</option>
                        <option value="limited">Limited</option>
                      </select>
                    </div>

                    {editionType === "limited" && (
                      <div className="col-span-2 flex items-center gap-2">
                        <label className="text-secondary/60 text-xs font-medium whitespace-nowrap">Total Supply</label>
                        <input type="number" min={1} className="w-24 px-2 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40" value={totalSupply} onChange={(e) => setTotalSupply(e.target.value)} />
                        <span className="text-secondary/50 text-xs">copies</span>
                      </div>
                    )}

                    {/* Royalty */}
                    <div className="col-span-2 flex items-center gap-2">
                      <label className="text-secondary/60 text-xs font-medium whitespace-nowrap">Royalty</label>
                      <input type="number" min={0} max={50} className="w-16 px-2 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40" value={royalty} onChange={(e) => setRoyalty(e.target.value)} />
                      <span className="text-secondary/50 text-xs">%</span>
                    </div>
                  </div>

                  {/* Traits */}
                  <div className="flex items-center gap-3 mt-4">
                    <button className="px-3 py-1.5 rounded-lg border border-primary/25 text-primary text-xs font-medium hover:bg-primary/10 transition-colors cursor-pointer" onClick={addTrait}>+ Add Trait</button>
                    <span className="text-secondary/60 text-xs font-light">1/1 Unique</span>
                  </div>
                  {traits.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {traits.map((t, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input className="flex-1 px-3 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40" placeholder="Trait name" value={t.key} onChange={(e) => setTraits((p) => p.map((x, xi) => xi === i ? { ...x, key: e.target.value } : x))} />
                          <input className="flex-1 px-3 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40" placeholder="Value" value={t.value} onChange={(e) => setTraits((p) => p.map((x, xi) => xi === i ? { ...x, value: e.target.value } : x))} />
                          <button onClick={() => removeTrait(i)} className="text-red-400 text-sm hover:text-red-600 cursor-pointer">✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Step 4 — Pricing */}
              <div className="flex gap-5 items-start">
                <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">04</span>
                <div className="flex-1">
                  <p className="text-[13px] font-medium uppercase tracking-wide text-secondary/70 mb-3">Pricing & Discounts</p>
                  <div className="space-y-3">
                    {/* Free Listing */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={isFreeListing} onChange={(e) => setIsFreeListing(e.target.checked)} className="w-4 h-4 accent-primary" />
                      <span className="text-secondary/70 text-sm font-light">Free Listing</span>
                    </label>

                    {!isFreeListing && (
                      <div className="flex items-center gap-2 ml-7">
                        <label className="text-secondary/60 text-xs font-medium">Mint Price</label>
                        <input type="number" min={0} step={0.01} className="w-24 px-2 py-2 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40" value={mintPrice} onChange={(e) => setMintPrice(parseFloat(e.target.value) || 0)} />
                        <span className="text-secondary/50 text-xs">SOL</span>
                      </div>
                    )}

                    {/* Mint Discount */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={hasMintDiscount} onChange={(e) => setHasMintDiscount(e.target.checked)} className="w-4 h-4 accent-primary" />
                      <span className="text-secondary/70 text-sm font-light">Mint Discount</span>
                      {hasMintDiscount && (
                        <div className="flex items-center gap-1">
                          <input type="number" min={1} max={90} className="w-14 px-2 py-1 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40" value={mintDiscountPercent} onChange={(e) => setMintDiscountPercent(parseFloat(e.target.value) || 0)} />
                          <span className="text-secondary/50 text-xs">%</span>
                        </div>
                      )}
                    </label>

                    {/* Buyer Discount */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" checked={hasBuyerDiscount} onChange={(e) => setHasBuyerDiscount(e.target.checked)} className="w-4 h-4 accent-primary" />
                      <span className="text-secondary/70 text-sm font-light">Buyer Discount</span>
                      {hasBuyerDiscount && (
                        <div className="flex items-center gap-1">
                          <input type="number" min={1} max={90} className="w-14 px-2 py-1 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40" value={buyerDiscountPercent} onChange={(e) => setBuyerDiscountPercent(parseFloat(e.target.value) || 0)} />
                          <span className="text-secondary/50 text-xs">%</span>
                        </div>
                      )}
                    </label>
                    {hasBuyerDiscount && (
                      <div className="flex items-center gap-2 ml-7">
                        <label className="text-secondary/60 text-xs font-medium">Max Uses</label>
                        <input type="number" min={1} className="w-20 px-2 py-1 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm font-light outline-none focus:border-primary/40" value={buyerDiscountMaxUses} onChange={(e) => setBuyerDiscountMaxUses(parseInt(e.target.value) || 1)} />
                        <span className="text-secondary/50 text-xs">buyers</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT ── */}
            <div className="lg:col-span-2 space-y-4">
              {/* Live Summary */}
              <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
                <p className="text-[11px] font-medium tracking-widest uppercase text-primary">Live Summary</p>
                <div className="flex items-center gap-3 pb-3 border-b border-secondary/[0.07]">
                  <span className="text-2xl">🎃</span>
                  <span className="text-secondary font-medium text-base">Scotty Pumpkin</span>
                </div>
                <div className="space-y-2">
                  {[
                    isFreeListing ? "✓ Free Listing" : `✓ Mint Price ${mintPrice} SOL`,
                    hasMintDiscount ? `✓ -${mintDiscountPercent}% Mint Discount` : "✗ No Mint Discount",
                    hasBuyerDiscount ? `✓ -${buyerDiscountPercent}% Buyer Discount` : "✗ No Buyer Discount",
                    `✓ ${royalty}% Royalty`,
                  ].map((item) => (
                    <p key={item} className="text-sm text-secondary/70 font-light">{item}</p>
                  ))}
                  {walletAddress && (
                    <p className="text-xs text-secondary/40 pt-1 break-all">{walletAddress.slice(0,8)}...{walletAddress.slice(-6)}</p>
                  )}
                </div>
              </div>

              {/* Mint Calculator */}
              <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
                <p className="text-[11px] font-medium tracking-widest uppercase text-primary">Mint Calculator</p>
                <div className="space-y-0">
                  {[
                    { label: "Mint Fee",       value: isFreeListing ? "Free" : `${mintPrice.toFixed(5)} SOL` },
                    { label: "Discount",       value: `-${discountAmount.toFixed(5)} SOL` },
                    { label: "After Discount", value: `${priceAfter.toFixed(5)} SOL` },
                    { label: "Network Fee",    value: `${NETWORK_FEE} SOL` },
                  ].map((row, i) => (
                    <div key={i} className={`flex justify-between items-center py-2.5 ${i < 3 ? "border-b border-secondary/[0.07]" : ""}`}>
                      <span className="text-secondary/70 text-sm font-light">{row.label}</span>
                      <span className="text-primary font-medium text-sm">{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center px-4 py-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <span className="text-primary font-medium text-sm uppercase tracking-wider">Total</span>
                  <span className="text-primary font-semibold text-xl">
                    {isFreeListing ? `${NETWORK_FEE} SOL` : `${totalCost.toFixed(5)} SOL`}
                  </span>
                </div>

                <button
                  onClick={handleMint}
                  disabled={loading || !connected}
                  className={`w-full py-3 rounded-lg font-medium text-sm tracking-wider transition-colors ${
                    loading          ? "bg-primary/60 text-white cursor-not-allowed"
                    : !connected     ? "bg-secondary/20 text-secondary/40 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90 cursor-pointer"
                  }`}>
                  {loading ? `⏳ ${mintStep || "Processing..."}` : !connected ? "Connect Wallet First" : "🎃 Mint NFT"}
                </button>
              </div>
            </div>
          </div>

          {/* Trending NFTs */}
          <div>
            <div className="h-px bg-secondary/10 mb-8" />
            <p className="text-[11px] font-medium tracking-widest uppercase text-primary mb-6">Trending NFTs</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRENDING.map((nft) => (
                <div key={nft.id} className="bg-white border border-secondary/[0.07] rounded-xl overflow-hidden hover:border-primary/20 transition-colors">
                  <div className={`relative h-36 bg-linear-to-br ${nft.bg} flex items-center justify-center`}>
                    <span className="text-5xl">{nft.emoji}</span>
                    <div className={`absolute inset-0 ${nft.glow}`} />
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-secondary/70 text-xs font-medium tracking-wider">{nft.label}</p>
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      {nft.spump && <span className="text-primary text-xs font-medium">🎃 {nft.spump}</span>}
                      {nft.price && <span className="text-secondary/70 text-xs font-light">€ {nft.price}</span>}
                    </div>
                  </div>
                  <div className="px-3 pb-3">
                    <button className="w-full py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-medium tracking-widest hover:bg-primary hover:text-white transition-colors cursor-pointer">BUY</button>
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
