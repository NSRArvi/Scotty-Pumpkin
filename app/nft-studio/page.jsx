"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Container from "../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";
import BuyModal from "@/app/components/BuyModal";

const CATEGORIES = ["art", "fashion", "jewelry", "music", "video", "digital"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ── Mint on Solana ─────────────────────────────────────────────────────────
async function mintOnSolana(metadataUri, walletAddress, signTransaction, signAllTransactions) {
  const { createUmi }              = await import("@metaplex-foundation/umi-bundle-defaults");
  const { walletAdapterIdentity }  = await import("@metaplex-foundation/umi-signer-wallet-adapters");
  const { create, mplCore }        = await import("@metaplex-foundation/mpl-core");
  const { generateSigner, base58 } = await import("@metaplex-foundation/umi");
  const { PublicKey }              = await import("@solana/web3.js");

  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
  const rpcUrl  = network === "mainnet-beta"
    ? "https://api.mainnet-beta.solana.com"
    : "https://api.devnet.solana.com";

  const umi = createUmi(rpcUrl).use(mplCore());
  umi.use(walletAdapterIdentity({
    publicKey:           new PublicKey(walletAddress),
    signTransaction:     (tx)  => signTransaction(tx),
    signAllTransactions: (txs) => signAllTransactions(txs),
  }));

  const assetSigner = generateSigner(umi);
  let signatureBytes;
  try {
    const result = await create(umi, {
      asset: assetSigner,
      name:  "NFT",
      uri:   metadataUri,
    }).sendAndConfirm(umi, {
      confirm: { commitment: "confirmed" },
      send:    { skipPreflight: false },
    });
    signatureBytes = result.signature;
  } catch (err) {
    const msg = err?.message || "";
    if (msg.includes("Attempt to debit an account") || msg.includes("Insufficient funds"))
      throw new Error("Your wallet does not have enough SOL balance.");
    if (msg.includes("User rejected") || msg.includes("User declined"))
      throw new Error("Transaction cancelled by user.");
    throw new Error("NFT minting failed. Please try again.");
  }

  const [transactionSig] = base58.deserialize(signatureBytes);
  const confirmed = await waitForTransactionVisible(transactionSig, rpcUrl);
  if (!confirmed) throw new Error("Transaction confirmed by wallet but not yet visible via RPC. Signature: " + transactionSig);
  return { mintAddress: assetSigner.publicKey.toString(), transactionSig };
}

async function waitForTransactionVisible(signature, rpcUrl, maxAttempts = 8, delayMs = 1500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res  = await fetch(rpcUrl, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getSignatureStatuses", params: [[signature], { searchTransactionHistory: true }] }),
      });
      const data   = await res.json();
      const status = data?.result?.value?.[0];
      if (status && ["confirmed", "finalized"].includes(status.confirmationStatus)) return true;
    } catch (_) {}
    if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, delayMs));
  }
  return false;
}

// ── Reusable components ─────────────────────────────────────────────────────
function Label({ children, className = "" }) {
  return <p className={`text-[10px] font-semibold tracking-[0.15em] uppercase text-orange-500 mb-1 ${className}`}>{children}</p>;
}
function FieldLabel({ children }) {
  return <span className="text-[11px] font-medium text-black/40 uppercase tracking-wider">{children}</span>;
}
function Input({ className = "", ...props }) {
  return <input className={`w-full px-3.5 py-2.5 rounded-lg bg-black/5 border border-black/10 text-black text-sm placeholder:text-black/30 outline-none focus:border-orange-500/60 transition-all ${className}`} {...props} />;
}
function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full px-3.5 py-2.5 rounded-lg bg-white border border-black/10 text-black text-sm outline-none focus:border-orange-500/60 transition-all appearance-none cursor-pointer ${className}`}
      style={{ colorScheme: "light" }}
      {...props}
    >
      {children}
    </select>
  );
}
function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-orange-500" : "bg-black/15"}`} onClick={() => onChange(!checked)}>
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </div>
      <span className="text-sm text-black/70 group-hover:text-black/90 transition-colors">{label}</span>
    </label>
  );
}
function SectionCard({ children, className = "" }) {
  return <div className={`rounded-2xl border border-black/8 bg-white shadow-sm p-6 space-y-5 ${className}`}>{children}</div>;
}

// ── Trending NFT Card — Buy button  ─────────────────────────────────────────
function TrendingCard({ nft, walletAddress }) {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [toast, setToast]               = useState("");
  const accent = "#F97316";

  function showToastMsg(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  return (
    <>
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}

      <div className="group rounded-2xl border border-black/8 bg-white shadow-sm hover:border-black/15 hover:shadow-md transition-all overflow-hidden">
        {/* Image — click to detail page */}
        <Link href={`/nft-marketplace/${nft.mint_address || nft.id}`}>
          <div className="relative aspect-square overflow-hidden bg-black/4 cursor-pointer">
            {nft.image_url ? (
              <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl" style={{ background: `radial-gradient(ellipse at center, ${accent}18, transparent 70%)` }}>
                <span className="relative z-10">🎨</span>
              </div>
            )}
            {nft.is_listed && (
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 text-[10px] font-semibold">Listed</span>
              </div>
            )}
          </div>
        </Link>

        <div className="p-3.5 space-y-3">
          <div>
            <p className="text-black/80 text-xs font-semibold tracking-wider truncate">{nft.name}</p>
            <p className="text-black/40 text-[10px] capitalize mt-0.5">{nft.category}</p>
          </div>

          <div className="flex items-center justify-between">
            {nft.is_listed && nft.list_price ? (
              <span className="text-orange-500 text-sm font-bold font-mono">{parseFloat(nft.list_price).toFixed(3)} SOL</span>
            ) : (
              <span className="text-black/30 text-xs">Not listed</span>
            )}
            {nft.royalty > 0 && <span className="text-black/30 text-[10px]">{nft.royalty}% royalty</span>}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Link
              href={`/nft-marketplace/${nft.mint_address || nft.id}`}
              className="flex-1 py-1.5 rounded-lg border border-black/10 text-black/50 text-xs font-semibold text-center hover:bg-black/5 hover:text-black transition-all"
            >
              View
            </Link>
            {nft.is_listed && nft.wallet_address !== walletAddress && (
              // <button
              //   onClick={() => setShowBuyModal(true)}
              //   className="flex-1 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 transition-colors cursor-pointer"
              // >
              //   Buy Now
              // </button>

              // ── Buy Now → deferant Purchase page ──
              <Link
                href={`/purchase/${nft.mint_address}`}
                className=" flex justify-center flex-1 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 transition-colors cursor-pointer"
              >
                Buy Now
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      {showBuyModal && (
        <BuyModal
          nft={nft}
          buyerWallet={walletAddress}
          onClose={() => setShowBuyModal(false)}
          onSuccess={() => {
            setShowBuyModal(false);
            showToastMsg("NFT purchased! 🎉");
          }}
        />
      )}
    </>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function NFTStudioPage() {
  const { connected, walletAddress, walletName, walletIcon, signTransaction, signAllTransactions } = useSolanaWallet();

  const [dragOver, setDragOver]               = useState(false);
  const [uploadedFileObj, setUploadedFileObj] = useState(null);
  const [previewUrl, setPreviewUrl]           = useState(null);
  const fileRef = useRef(null);

  const [title, setTitle]             = useState("");
  const [description, setDescription] = useState("");
  const [symbol, setSymbol]           = useState("");
  const [category, setCategory]       = useState("art");
  const [editionType, setEditionType] = useState("limited");
  const [totalSupply, setTotalSupply] = useState(100);
  const [royalty, setRoyalty]         = useState(5);
  const [traits, setTraits]           = useState([]);

  const [collections, setCollections]             = useState([]);
  const [collectionId, setCollectionId]           = useState("");
  const [newCollection, setNewCollection]         = useState("");
  const [showNewCollection, setShowNewCollection] = useState(false);

  const [mintPrice, setMintPrice]                       = useState(0.5);
  const [isFreeListing, setIsFreeListing]               = useState(false);
  const [hasMintDiscount, setHasMintDiscount]           = useState(true);
  const [mintDiscountPercent, setMintDiscountPercent]   = useState(15);
  const [hasBuyerDiscount, setHasBuyerDiscount]         = useState(true);
  const [buyerDiscountPercent, setBuyerDiscountPercent] = useState(10);
  const [buyerDiscountMaxUses, setBuyerDiscountMaxUses] = useState(50);

  const NETWORK_FEE    = 0.00001;
  const discountAmount = hasMintDiscount && !isFreeListing ? (mintPrice * mintDiscountPercent) / 100 : 0;
  const priceAfter     = isFreeListing ? 0 : mintPrice - discountAmount;
  const totalCost      = priceAfter + NETWORK_FEE;

  const [step, setStep]         = useState("idle");
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState(null);
  const [mintStep, setMintStep] = useState("");

  const [trendingNfts, setTrendingNfts]       = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const [platformFeePercent, setPlatformFeePercent] = useState(3);


  const loadTrending = useCallback(() => {
    fetch(`${API_URL}/marketplace?sort=latest&per_page=4`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setTrendingNfts(d.data?.data?.slice(0, 4) || []); })
      .catch(() => {})
      .finally(() => setTrendingLoading(false));
  }, []);

  useEffect(() => { loadTrending(); }, [loadTrending]);

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

  // ── useEffect এ API থেকে নিন ──────────────────────────────
  useEffect(() => {
    fetch(`${API_URL}/config`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPlatformFeePercent(d.data.platform_fee_percent);
      })
      .catch(() => {});
  }, []);

  function handleDrop(e) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) { setUploadedFileObj(file); setPreviewUrl(URL.createObjectURL(file)); }
  }
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) { setUploadedFileObj(file); setPreviewUrl(URL.createObjectURL(file)); }
  }
  function addTrait() { setTraits((p) => [...p, { key: "", value: "" }]); }
  function removeTrait(i) { setTraits((p) => p.filter((_, xi) => xi !== i)); }

  async function handleCreateCollection() {
    if (!newCollection.trim()) return;
    try {
      const res  = await fetch(`${API_URL}/collections`, {
        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ name: newCollection, wallet_address: walletAddress }),
      });
      const data = await res.json();
      if (data.success) {
        setCollections((p) => [data.data, ...p]);
        setCollectionId(data.data.id.toString());
        setNewCollection(""); setShowNewCollection(false);
      }
    } catch (err) { setError("Collection create failed: " + err.message); }
  }

  async function handleMint() {
    setError(""); setSuccess(null);
    if (!connected || !walletAddress) return setError("Please connect your wallet first.");
    if (!uploadedFileObj)             return setError("Please upload an artwork.");
    if (!title.trim())                return setError("Please enter NFT title.");
    if (!description.trim())          return setError("Please enter a description.");

    setStep("uploading");
    try {
      setMintStep("Uploading to IPFS...");
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
      formData.append("mint_price",         isFreeListing ? "0" : mintPrice.toString());
      formData.append("is_free_listing",    isFreeListing ? "1" : "0");
      formData.append("has_mint_discount",  hasMintDiscount ? "1" : "0");
      if (hasMintDiscount) formData.append("mint_discount_percent", mintDiscountPercent.toString());
      formData.append("has_buyer_discount", hasBuyerDiscount ? "1" : "0");
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
      setStep("minting");
      setMintStep("Minting on Solana...");

      const { mintAddress, transactionSig } = await mintOnSolana(metadata_uri, walletAddress, signTransaction, signAllTransactions);

      setMintStep("Confirming on-chain...");
      const confirmRes  = await fetch(`${API_URL}/nft/mint`, {
        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ nft_id, mint_address: mintAddress, transaction_sig: transactionSig, wallet_address: walletAddress }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmData.success) throw new Error(confirmData.message || "Confirm failed");

      setStep("done"); setMintStep("");
      setSuccess({ ...apiData.data, mint_address: mintAddress, transaction_sig: transactionSig, explorer_url: `https://explorer.solana.com/address/${mintAddress}?cluster=devnet` });
      loadTrending();
    } catch (err) {
      setStep("error"); setMintStep(""); setError(err.message);
    }
  }

  const loading = step === "uploading" || step === "minting";

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-black">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-3xl" />
      </div>
      <div className="relative">
        <Container>
          <div className="pt-16 pb-24">

            {/* Header */}
            <div className="mb-14">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px flex-1 max-w-[40px] bg-orange-500/40" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-500">Scotty Pumpkin Ecosystem</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
                NFT<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Studio</span>
              </h1>
              <p className="text-black/50 text-base font-light max-w-xl leading-relaxed">
                Mint digital prestige — art, fashion, jewelry, video & digital goods. List free. Pay only{" "}
                <span className="text-orange-500 font-medium">3%</span> when sold.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 px-5 py-4 rounded-xl border border-black/8 bg-white shadow-sm">
                {[
                  { label: "Mint Discount",          value: `-${mintDiscountPercent}%` },
                  { label: "Buyer Discount",          value: `-${buyerDiscountPercent}%` },
                  { label: "Free Listing • Sale Fee", value: `${platformFeePercent}%` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {i > 0 && <div className="w-px h-4 bg-black/10" />}
                    <span className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[10px] text-orange-500 font-bold">✓</span>
                    <span className="text-black/50 text-xs">{item.label}</span>
                    <span className="text-orange-500 text-sm font-bold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                <span>{error}</span>
              </div>
            )}
            {mintStep && (
              <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 text-sm">
                <div className="w-4 h-4 rounded-full border-2 border-orange-400 border-t-transparent animate-spin shrink-0" />
                <span>{mintStep}</span>
              </div>
            )}
            {success && (
              <div className="mb-6 px-5 py-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <p className="text-emerald-600 font-semibold text-sm">NFT minted successfully on Solana</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <div className="px-3 py-2 rounded-lg bg-white border border-black/8">
                    <p className="text-black/40 mb-0.5">Mint address</p>
                    <p className="text-orange-500 font-mono truncate">{success.mint_address}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white border border-black/8 flex items-center gap-2">
                    <a href={success.explorer_url} target="_blank" rel="noreferrer" className="text-orange-500 underline text-xs">Solana Explorer ↗</a>
                    <span className="text-black/20">•</span>
                    <a href={success.image_url} target="_blank" rel="noreferrer" className="text-orange-500 underline text-xs">IPFS Image ↗</a>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Link href={`/nft-marketplace/${success.mint_address}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-400 transition-colors shadow-lg shadow-orange-500/20">
                    View on Marketplace →
                  </Link>
                  <Link href={`/profile/${walletAddress}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-black/15 text-black/60 text-xs font-semibold hover:bg-black/5 hover:text-black transition-colors">
                    My Profile →
                  </Link>
                </div>
              </div>
            )}

            {/* Main Grid */}
            <div className="grid lg:grid-cols-5 gap-4">
              <div className="lg:col-span-3 space-y-4">

                <SectionCard>
                  <div className="flex items-center justify-between">
                    <div><Label>Step 01</Label><p className="text-black font-semibold">Connect Wallet</p></div>
                    <div className="flex items-center gap-3">
                      {connected && walletIcon && <img src={walletIcon} alt={walletName} className="w-5 h-5 rounded-full" />}
                      <WalletButton />
                    </div>
                  </div>
                </SectionCard>

                <SectionCard>
                  <Label>Step 02</Label>
                  <p className="text-black font-semibold mb-4">Upload Artwork</p>
                  <div
                    className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${dragOver ? "border-orange-500/60 bg-orange-500/5" : "border-black/10 hover:border-black/20"}`}
                    style={{ minHeight: 200 }}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.gif,.webp" className="hidden" onChange={handleFileChange} />
                    {previewUrl ? (
                      <div className="flex flex-col items-center justify-center p-6 gap-3">
                        <img src={previewUrl} alt="Preview" className="max-h-48 rounded-xl object-contain" />
                        <p className="text-black/40 text-xs">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-10 gap-3 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center">
                          <svg className="w-6 h-6 text-black/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4a3 3 0 014 0l4 4m-4-4v9M4 4h16M4 4v1m16-1v1" /></svg>
                        </div>
                        <div>
                          <p className="text-black/80 text-sm font-medium">Drop artwork here</p>
                          <p className="text-black/40 text-xs mt-1">PNG · JPG · GIF · WEBP</p>
                        </div>
                        <span className="text-orange-500 text-xs font-medium underline">Browse files</span>
                      </div>
                    )}
                  </div>
                </SectionCard>

                <SectionCard>
                  <Label>Step 03</Label>
                  <p className="text-black font-semibold mb-4">NFT Details</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5"><FieldLabel>Title *</FieldLabel><Input placeholder="e.g. Cosmic Pumpkin" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                    <div className="space-y-1.5"><FieldLabel>Symbol</FieldLabel><Input placeholder="e.g. CPMP" value={symbol} onChange={(e) => setSymbol(e.target.value)} /></div>
                    <div className="col-span-2 space-y-1.5">
                      <FieldLabel>Description *</FieldLabel>
                      <textarea className="w-full px-3.5 py-2.5 rounded-lg bg-black/5 border border-black/10 text-black text-sm placeholder:text-black/30 outline-none focus:border-orange-500/60 transition-all resize-none h-20" placeholder="Describe your NFT..." value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <FieldLabel>Collection</FieldLabel>
                      <div className="flex gap-2">
                        <Select value={collectionId} onChange={(e) => setCollectionId(e.target.value)}>
                          <option value="">— No collection —</option>
                          {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </Select>
                        <button onClick={() => setShowNewCollection((v) => !v)} className="px-3.5 py-2 rounded-lg border border-black/10 text-black/50 text-xs font-medium hover:bg-black/5 hover:text-black transition-all cursor-pointer whitespace-nowrap">+ New</button>
                      </div>
                      {showNewCollection && (
                        <div className="flex gap-2 mt-1.5">
                          <Input placeholder="Collection name" value={newCollection} onChange={(e) => setNewCollection(e.target.value)} />
                          <button onClick={handleCreateCollection} className="px-4 py-2 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 transition-colors cursor-pointer whitespace-nowrap">Create</button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Category</FieldLabel>
                      <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Edition</FieldLabel>
                      <Select value={editionType} onChange={(e) => setEditionType(e.target.value)}>
                        <option value="unlimited">Unlimited</option>
                        <option value="limited">Limited</option>
                      </Select>
                    </div>
                    {editionType === "limited" && (
                      <div className="col-span-2 flex items-center gap-3">
                        <FieldLabel>Total Supply</FieldLabel>
                        <Input type="number" min={1} className="w-28" value={totalSupply} onChange={(e) => setTotalSupply(e.target.value)} />
                        <span className="text-black/40 text-xs">copies</span>
                      </div>
                    )}
                    <div className="col-span-2 flex items-center gap-3">
                      <FieldLabel>Royalty</FieldLabel>
                      <Input type="number" min={0} max={50} className="w-20" value={royalty} onChange={(e) => setRoyalty(e.target.value)} />
                      <span className="text-black/40 text-xs">% per resale</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-black/5">
                    <div className="flex items-center justify-between mb-3">
                      <FieldLabel>Traits / Attributes</FieldLabel>
                      <button onClick={addTrait} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/30 text-orange-500 text-xs font-medium hover:bg-orange-500/10 transition-colors cursor-pointer">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Add trait
                      </button>
                    </div>
                    {traits.length > 0 ? (
                      <div className="space-y-2">
                        {traits.map((t, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <Input placeholder="Trait name" value={t.key} onChange={(e) => setTraits((p) => p.map((x, xi) => xi === i ? { ...x, key: e.target.value } : x))} />
                            <Input placeholder="Value" value={t.value} onChange={(e) => setTraits((p) => p.map((x, xi) => xi === i ? { ...x, value: e.target.value } : x))} />
                            <button onClick={() => removeTrait(i)} className="p-2 text-black/30 hover:text-red-500 transition-colors cursor-pointer shrink-0">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-black/25 text-xs">No traits added — traits increase rarity and uniqueness</p>
                    )}
                  </div>
                </SectionCard>

                <SectionCard>
                  <Label>Step 04</Label>
                  <p className="text-black font-semibold mb-4">Pricing & Discounts</p>
                  <div className="space-y-5">
                    <Toggle checked={isFreeListing} onChange={setIsFreeListing} label="Free listing" />
                    {!isFreeListing && (
                      <div className="ml-[52px] flex items-center gap-3">
                        <FieldLabel>Mint price</FieldLabel>
                        <Input type="number" min={0} step={0.01} className="w-28" value={mintPrice} onChange={(e) => setMintPrice(parseFloat(e.target.value) || 0)} />
                        <span className="text-black/40 text-xs">SOL</span>
                      </div>
                    )}
                    <div className="h-px bg-black/5" />
                    <div className="space-y-1.5">
                      <Toggle checked={hasMintDiscount} onChange={setHasMintDiscount} label="Mint discount" />
                      {hasMintDiscount && (
                        <div className="ml-[52px] flex items-center gap-3 mt-2">
                          <Input type="number" min={1} max={90} className="w-20" value={mintDiscountPercent} onChange={(e) => setMintDiscountPercent(parseFloat(e.target.value) || 0)} />
                          <span className="text-black/40 text-xs">% off</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Toggle checked={hasBuyerDiscount} onChange={setHasBuyerDiscount} label="Buyer discount (for first buyers)" />
                      {hasBuyerDiscount && (
                        <div className="ml-[52px] flex items-center gap-4 mt-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Input type="number" min={1} max={90} className="w-20" value={buyerDiscountPercent} onChange={(e) => setBuyerDiscountPercent(parseFloat(e.target.value) || 0)} />
                            <span className="text-black/40 text-xs">% off</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FieldLabel>Max uses</FieldLabel>
                            <Input type="number" min={1} className="w-20" value={buyerDiscountMaxUses} onChange={(e) => setBuyerDiscountMaxUses(parseInt(e.target.value) || 1)} />
                            <span className="text-black/40 text-xs">buyers</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SectionCard>
              </div>

              {/* RIGHT */}
              <div className="lg:col-span-2 space-y-4">
                <SectionCard>
                  <Label>Preview</Label>
                  <div className="rounded-xl overflow-hidden bg-black/4 border border-black/8 aspect-square flex items-center justify-center">
                    {previewUrl ? (
                      <img src={previewUrl} alt="NFT Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-black/15">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} /><path strokeLinecap="round" strokeWidth={1} d="M3 16l5-5 4 4 3-3 6 6" /></svg>
                        <p className="text-xs">No image uploaded</p>
                      </div>
                    )}
                  </div>
                  {title && <p className="text-black font-semibold truncate">{title}</p>}
                  {symbol && <p className="text-black/40 text-xs font-mono">{symbol}</p>}
                </SectionCard>

                <SectionCard>
                  <Label>Cost Breakdown</Label>
                  <div className="space-y-3">
                    {[
                      { label: "Mint price",    value: isFreeListing ? "Free" : `${mintPrice.toFixed(4)} SOL` },
                      { label: "Discount",      value: `-${discountAmount.toFixed(4)} SOL` },
                      { label: "After discount",value: `${priceAfter.toFixed(4)} SOL` },
                      { label: "Network fee",   value: `${NETWORK_FEE} SOL` },
                    ].map((row, i) => (
                      <div key={i} className={`flex justify-between items-center text-sm ${i < 3 ? "pb-3 border-b border-black/5" : ""}`}>
                        <span className="text-black/50 font-light">{row.label}</span>
                        <span className="text-black/80 font-medium font-mono">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center px-4 py-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Total</span>
                    <span className="text-orange-500 font-bold text-2xl font-mono">
                      {isFreeListing ? `${NETWORK_FEE} SOL` : `${totalCost.toFixed(5)} SOL`}
                    </span>
                  </div>
                </SectionCard>

                <button
                  onClick={handleMint}
                  disabled={loading || !connected}
                  className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wider transition-all ${loading ? "bg-orange-500/40 text-white/60 cursor-not-allowed" : !connected ? "bg-black/5 text-black/20 cursor-not-allowed border border-black/8" : "bg-orange-500 text-white hover:bg-orange-400 cursor-pointer shadow-xl shadow-orange-500/25 active:scale-[0.98]"}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      {mintStep || "Processing..."}
                    </span>
                  ) : !connected ? "Connect wallet to mint" : "Mint NFT →"}
                </button>

                <div className="flex flex-wrap gap-2">
                  {[
                    `${category.charAt(0).toUpperCase() + category.slice(1)}`,
                    editionType === "limited" ? `${totalSupply} copies` : "Unlimited",
                    `${royalty}% royalty`,
                  ].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full border border-black/8 bg-white text-black/40 text-[11px]">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trending NFTs */}
            <div className="mt-16">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Label className="mb-0">Trending NFTs</Label>
                  <div className="h-px bg-black/5 w-20" />
                </div>
                <Link href="/nft-marketplace" className="text-orange-500 text-xs hover:text-orange-400 transition-colors">View all →</Link>
              </div>

              {trendingLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-black/8 bg-white overflow-hidden animate-pulse">
                      <div className="aspect-square bg-black/5" />
                      <div className="p-3.5 space-y-2">
                        <div className="h-3 bg-black/5 rounded w-3/4" />
                        <div className="h-3 bg-black/5 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : trendingNfts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {trendingNfts.map((nft) => (
                    <TrendingCard key={nft.id} nft={nft} walletAddress={walletAddress} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-black/25 text-sm">
                  No trending NFTs yet — mint the first one above! 🎨
                </div>
              )}
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}
