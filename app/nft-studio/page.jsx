"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Container from "../components/shared/Container";


const CATEGORIES = ["art", "fashion", "jewelry", "music", "video", "digital"];
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const TRENDING = [
  { id: "SCOTTY #001", icon: "👻", price: null, spump: null,  label: "SCOTTY #001", accent: "#F97316" },
  { id: "PURPLE DROP", icon: "💎", price: null, spump: 150,   label: "PURPLE DROP", accent: "#8B5CF6" },
  { id: "LUXURY MASK", icon: "🎭", price: 320,  spump: null,  label: "LUXURY MASK", accent: "#EAB308" },
  { id: "COSMIC RING", icon: "🪐", price: 450,  spump: null,  label: "COSMIC RING", accent: "#6366F1" },
];

// async function mintOnSolana(metadataUri, walletAddress) {
//   try {
//     const { createUmi }             = await import("@metaplex-foundation/umi-bundle-defaults");
//     const { walletAdapterIdentity } = await import("@metaplex-foundation/umi-signer-wallet-adapters");
//     const { create, mplCore }       = await import("@metaplex-foundation/mpl-core");
//     const { generateSigner }        = await import("@metaplex-foundation/umi");
//     const { PublicKey }             = await import("@solana/web3.js");

//     const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
//     const rpcUrl  = network === "mainnet-beta"
//       ? "https://api.mainnet-beta.solana.com"
//       : "https://api.devnet.solana.com";

//     const umi = createUmi(rpcUrl).use(mplCore());
//     const phantomWallet = {
//       publicKey:           new PublicKey(walletAddress),
//       signTransaction:     (tx)  => window.solana.signTransaction(tx),
//       signAllTransactions: (txs) => window.solana.signAllTransactions(txs),
//     };
//     umi.use(walletAdapterIdentity(phantomWallet));
//     const assetSigner = generateSigner(umi);
//     const { signature } = await create(umi, {
//       asset: assetSigner,
//       name:  "NFT",
//       uri:   metadataUri,
//     }).sendAndConfirm(umi);

//       return {
//         mintAddress: assetSigner.publicKey.toString(),
//         transactionSig: bs58.encode(signature),  
//       };  
  
//       // return {
//       //   mintAddress: assetSigner.publicKey.toString(),
//       //   transactionSig: signature.toString(),
//       // };  
//   } catch (err) {
//     throw new Error("Solana mint failed: " + err.message);
//   }
// }

async function mintOnSolana(metadataUri, walletAddress) {
  const { createUmi }             = await import("@metaplex-foundation/umi-bundle-defaults");
  const { walletAdapterIdentity } = await import("@metaplex-foundation/umi-signer-wallet-adapters");
  const { create, mplCore }       = await import("@metaplex-foundation/mpl-core");
  const { generateSigner, base58 } = await import("@metaplex-foundation/umi");
  const { PublicKey }              = await import("@solana/web3.js");

  if (!window.solana || !window.solana.isPhantom) {
    throw new Error("Phantom wallet not found. Please install it from https://phantom.app");
  }

  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
  const rpcUrl  = network === "mainnet-beta"
    ? "https://api.mainnet-beta.solana.com"
    : "https://api.devnet.solana.com";

  const umi = createUmi(rpcUrl).use(mplCore());

  const phantomWallet = {
    publicKey:           new PublicKey(walletAddress),
    signTransaction:     (tx)  => window.solana.signTransaction(tx),
    signAllTransactions: (txs) => window.solana.signAllTransactions(txs),
  };
  umi.use(walletAdapterIdentity(phantomWallet));

  const assetSigner = generateSigner(umi);

  // ── Step 1: Mint + wait for on-chain confirmation ───────────
  
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
    throw new Error("Mint transaction failed on-chain: " + err.message);
  }

  // ── Step 2: Convert to valid base58 string ──────────────────
  
  const [transactionSig] = base58.deserialize(signatureBytes);

  
  const confirmed = await waitForTransactionVisible(umi, transactionSig, rpcUrl);
  if (!confirmed) {
    throw new Error(
      "Transaction confirmed by wallet but not yet visible via RPC. " +
      "Signature: " + transactionSig + " — check Solana Explorer manually, it likely succeeded."
    );
  }

  return {
    mintAddress: assetSigner.publicKey.toString(),
    transactionSig,
  };
}

/**
 * Poll the RPC endpoint directly until the transaction is visible
 * via getSignatureStatuses, with bounded retries. This guarantees
 * that by the time we hand the signature to Laravel, Laravel's own
 * getTransaction call will succeed on the first try.
 */
async function waitForTransactionVisible(umi, signature, rpcUrl, maxAttempts = 8, delayMs = 1500) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(rpcUrl, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id:      1,
          method:  "getSignatureStatuses",
          params:  [[signature], { searchTransactionHistory: true }],
        }),
      });
      const data = await response.json();
      const status = data?.result?.value?.[0];

      if (status && (status.confirmationStatus === "confirmed" || status.confirmationStatus === "finalized")) {
        return true;
      }
    } catch (_) {
      // network hiccup — just retry
    }

    if (attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return false;
}

export { mintOnSolana };
// ── Small reusable components ──────────────────────────────────────────────

function Label({ children, className = "" }) {
  return (
    <p className={`text-[10px] font-semibold tracking-[0.15em] uppercase text-orange-500 mb-1 ${className}`}>
      {children}
    </p>
  );
}

function FieldLabel({ children }) {
  return <span className="text-[11px] font-medium text-white/40 uppercase tracking-wider">{children}</span>;
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all ${className}`}
      {...props}
    />
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-orange-500/60 transition-all appearance-none cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div
        className={`relative w-10 h-5 rounded-full transition-colors ${checked ? "bg-orange-500" : "bg-white/15"}`}
        onClick={() => onChange(!checked)}
      >
        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </div>
      <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">{label}</span>
    </label>
  );
}

function SectionCard({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm p-6 space-y-5 ${className}`}>
      {children}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function NFTStudioPage() {
  const [connected, setConnected]         = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  const [dragOver, setDragOver]               = useState(false);
  const [uploadedFile, setUploadedFile]       = useState(null);
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

  const [collections, setCollections]           = useState([]);
  const [collectionId, setCollectionId]         = useState("");
  const [newCollection, setNewCollection]       = useState("");
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

  const [step, setStep]       = useState("idle");
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(null);
  const [mintStep, setMintStep] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.solana?.isConnected) {
      window.solana.connect({ onlyIfTrusted: true })
        .then((resp) => {
          setWalletAddress(resp.publicKey.toString());
          setConnected(true);
        }).catch(() => {});
    }
  }, []);

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

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file.name);
      setUploadedFileObj(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file.name);
      setUploadedFileObj(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  function addTrait() { setTraits((p) => [...p, { key: "", value: "" }]); }
  function removeTrait(i) { setTraits((p) => p.filter((_, xi) => xi !== i)); }

  async function handleCreateCollection() {
    if (!newCollection.trim()) return;
    try {
      const res = await fetch(`${API_URL}/collections`, {
        method:  "POST",
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

  async function handleMint() {
    setError("");
    setSuccess(null);

    if (!connected || !walletAddress) return setError("Please connect your Phantom Wallet first.");
    if (!uploadedFileObj)             return setError("Please upload an artwork.");
    if (!title.trim())                return setError("Please enter NFT title.");
    if (!description.trim())          return setError("Please enter a description.");

    setStep("uploading");

    try {
      setMintStep("Uploading to IPFS...");
      const formData = new FormData();
      formData.append("wallet_address",  walletAddress);
      formData.append("name",            title);
      formData.append("description",     description);
      formData.append("symbol",          symbol || "NFT");
      formData.append("image",           uploadedFileObj);
      formData.append("category",        category);
      formData.append("edition_type",    editionType);
      if (editionType === "limited") formData.append("total_supply", totalSupply);
      if (collectionId)              formData.append("collection_id", collectionId);
      formData.append("mint_price",           isFreeListing ? "0" : mintPrice.toString());
      formData.append("is_free_listing",      isFreeListing ? "1" : "0");
      formData.append("has_mint_discount",    hasMintDiscount ? "1" : "0");
      if (hasMintDiscount) formData.append("mint_discount_percent", mintDiscountPercent.toString());
      formData.append("has_buyer_discount",   hasBuyerDiscount ? "1" : "0");
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

      const { mintAddress, transactionSig } = await mintOnSolana(metadata_uri, walletAddress);

      setMintStep("Confirming on-chain...");
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
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-3xl" />
      </div>

      <div className="relative">
        <Container>
          <div className="pt-16 pb-24">

            {/* ── Hero Header ── */}
            <div className="mb-14">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-px flex-1 max-w-[40px] bg-orange-500/40" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-500">Scotty Pumpkin Ecosystem</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
                NFT<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Studio</span>
              </h1>
              <p className="text-white/40 text-base font-light max-w-xl leading-relaxed">
                Mint digital prestige — art, fashion, jewelry, video & digital goods. List free. Pay only{" "}
                <span className="text-orange-400 font-medium">3%</span> when sold.
              </p>

              {/* Fee Banner */}
              <div className="mt-6 flex flex-wrap items-center gap-3 px-5 py-4 rounded-xl border border-white/8 bg-white/3">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[10px] text-orange-400 font-bold">✓</span>
                  <span className="text-white/50 text-xs">Mint Discount</span>
                  <span className="text-orange-400 text-sm font-bold">-{mintDiscountPercent}%</span>
                  <span className="text-white/20 text-xs">SPUMP/USFF</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[10px] text-orange-400 font-bold">✓</span>
                  <span className="text-white/50 text-xs">Buyer Discount</span>
                  <span className="text-orange-400 text-sm font-bold">-{buyerDiscountPercent}%</span>
                  <span className="text-white/20 text-xs">SPUMP/USFF</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[10px] text-orange-400 font-bold">✓</span>
                  <span className="text-white/50 text-xs">Free Listing</span>
                  <span className="text-white/20 text-xs">•</span>
                  <span className="text-white/50 text-xs">Sale Fee</span>
                  <span className="text-orange-400 text-sm font-bold">3%</span>
                </div>
              </div>
            </div>

            {/* ── Alerts ── */}
            {error && (
              <div className="mb-6 flex items-start gap-3 px-4 py-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                <span>{error}</span>
              </div>
            )}

            {mintStep && (
              <div className="mb-6 flex items-center gap-3 px-4 py-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm">
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
                  <p className="text-emerald-400 font-semibold text-sm">NFT minted successfully on Solana</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 text-xs text-white/50">
                  <div className="px-3 py-2 rounded-lg bg-white/4 border border-white/8">
                    <p className="text-white/30 mb-0.5">Mint address</p>
                    <p className="text-orange-400 font-mono truncate">{success.mint_address}</p>
                  </div>
                  <div className="px-3 py-2 rounded-lg bg-white/4 border border-white/8 flex items-center gap-2">
                    <a href={success.explorer_url} target="_blank" rel="noreferrer" className="text-orange-400 underline text-xs">View on Solana Explorer ↗</a>
                    <span className="text-white/20">•</span>
                    <a href={success.image_url} target="_blank" rel="noreferrer" className="text-orange-400 underline text-xs">IPFS Image ↗</a>
                  </div>
                </div>
              </div>
            )}

            {/* ── Main grid ── */}
            <div className="grid lg:grid-cols-5 gap-4">

              {/* ── LEFT COLUMN ── */}
              <div className="lg:col-span-3 space-y-4">

                {/* Wallet */}
                <SectionCard>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Step 01</Label>
                      <p className="text-white font-semibold">Connect Wallet</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {connected && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          <span className="text-emerald-400 text-xs font-mono">
                            {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                          </span>
                        </div>
                      )}
                      <button
                        onClick={connected ? disconnectWallet : connectWallet}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          connected
                            ? "bg-white/8 text-white/60 hover:bg-white/12 border border-white/10"
                            : "bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-500/20"
                        }`}
                      >
                        {connected ? "Disconnect" : "Connect Phantom"}
                      </button>
                    </div>
                  </div>
                </SectionCard>

                {/* Upload */}
                <SectionCard>
                  <Label>Step 02</Label>
                  <p className="text-white font-semibold mb-4">Upload Artwork</p>
                  <div
                    className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden ${
                      dragOver ? "border-orange-500/60 bg-orange-500/5" : "border-white/10 hover:border-white/20"
                    }`}
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
                        <p className="text-white/40 text-xs">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-10 gap-3 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4-4a3 3 0 014 0l4 4m-4-4v9M4 4h16M4 4v1m16-1v1" /></svg>
                        </div>
                        <div>
                          <p className="text-white/80 text-sm font-medium">Drop artwork here</p>
                          <p className="text-white/30 text-xs mt-1">PNG · JPG · GIF · WEBP</p>
                        </div>
                        <span className="text-orange-400 text-xs font-medium underline">Browse files</span>
                      </div>
                    )}
                  </div>
                </SectionCard>

                {/* NFT Details */}
                <SectionCard>
                  <Label>Step 03</Label>
                  <p className="text-white font-semibold mb-4">NFT Details</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <FieldLabel>Title *</FieldLabel>
                      <Input placeholder="e.g. Cosmic Pumpkin" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <FieldLabel>Symbol</FieldLabel>
                      <Input placeholder="e.g. CPMP" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
                    </div>
                    <div className="col-span-2 space-y-1.5">
                      <FieldLabel>Description *</FieldLabel>
                      <textarea
                        className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 outline-none focus:border-orange-500/60 transition-all resize-none h-20"
                        placeholder="Describe your NFT..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    {/* Collection */}
                    <div className="col-span-2 space-y-1.5">
                      <FieldLabel>Collection</FieldLabel>
                      <div className="flex gap-2">
                        <Select value={collectionId} onChange={(e) => setCollectionId(e.target.value)}>
                          <option value="">— No collection —</option>
                          {collections.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </Select>
                        <button
                          onClick={() => setShowNewCollection((v) => !v)}
                          className="px-3.5 py-2 rounded-lg border border-white/10 text-white/50 text-xs font-medium hover:bg-white/8 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                        >
                          + New
                        </button>
                      </div>
                      {showNewCollection && (
                        <div className="flex gap-2 mt-1.5">
                          <Input placeholder="Collection name" value={newCollection} onChange={(e) => setNewCollection(e.target.value)} />
                          <button onClick={handleCreateCollection} className="px-4 py-2 rounded-lg bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 transition-colors cursor-pointer whitespace-nowrap">
                            Create
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Category & Edition */}
                    <div className="space-y-1.5">
                      <FieldLabel>Category</FieldLabel>
                      <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
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
                        <Input
                          type="number" min={1} className="w-28"
                          value={totalSupply}
                          onChange={(e) => setTotalSupply(e.target.value)}
                        />
                        <span className="text-white/30 text-xs">copies</span>
                      </div>
                    )}

                    <div className="col-span-2 flex items-center gap-3">
                      <FieldLabel>Royalty</FieldLabel>
                      <Input
                        type="number" min={0} max={50} className="w-20"
                        value={royalty}
                        onChange={(e) => setRoyalty(e.target.value)}
                      />
                      <span className="text-white/30 text-xs">% per resale</span>
                    </div>
                  </div>

                  {/* Traits */}
                  <div className="pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <FieldLabel>Traits / Attributes</FieldLabel>
                      <button
                        onClick={addTrait}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/30 text-orange-400 text-xs font-medium hover:bg-orange-500/10 transition-colors cursor-pointer"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        Add trait
                      </button>
                    </div>
                    {traits.length > 0 && (
                      <div className="space-y-2">
                        {traits.map((t, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <Input placeholder="Trait name" value={t.key} onChange={(e) => setTraits((p) => p.map((x, xi) => xi === i ? { ...x, key: e.target.value } : x))} />
                            <Input placeholder="Value" value={t.value} onChange={(e) => setTraits((p) => p.map((x, xi) => xi === i ? { ...x, value: e.target.value } : x))} />
                            <button onClick={() => removeTrait(i)} className="p-2 text-white/30 hover:text-red-400 transition-colors cursor-pointer shrink-0">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {traits.length === 0 && (
                      <p className="text-white/20 text-xs">No traits added — traits increase rarity and uniqueness</p>
                    )}
                  </div>
                </SectionCard>

                {/* Pricing */}
                <SectionCard>
                  <Label>Step 04</Label>
                  <p className="text-white font-semibold mb-4">Pricing & Discounts</p>
                  <div className="space-y-5">
                    <Toggle checked={isFreeListing} onChange={setIsFreeListing} label="Free listing" />

                    {!isFreeListing && (
                      <div className="ml-[52px] flex items-center gap-3">
                        <FieldLabel>Mint price</FieldLabel>
                        <Input
                          type="number" min={0} step={0.01} className="w-28"
                          value={mintPrice}
                          onChange={(e) => setMintPrice(parseFloat(e.target.value) || 0)}
                        />
                        <span className="text-white/30 text-xs">SOL</span>
                      </div>
                    )}

                    <div className="h-px bg-white/5" />

                    <div className="space-y-1.5">
                      <Toggle checked={hasMintDiscount} onChange={setHasMintDiscount} label="Mint discount (SPUMP / USFF holders)" />
                      {hasMintDiscount && (
                        <div className="ml-[52px] flex items-center gap-3 mt-2">
                          <Input
                            type="number" min={1} max={90} className="w-20"
                            value={mintDiscountPercent}
                            onChange={(e) => setMintDiscountPercent(parseFloat(e.target.value) || 0)}
                          />
                          <span className="text-white/30 text-xs">% off</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Toggle checked={hasBuyerDiscount} onChange={setHasBuyerDiscount} label="Buyer discount (for first buyers)" />
                      {hasBuyerDiscount && (
                        <div className="ml-[52px] flex items-center gap-4 mt-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Input type="number" min={1} max={90} className="w-20" value={buyerDiscountPercent} onChange={(e) => setBuyerDiscountPercent(parseFloat(e.target.value) || 0)} />
                            <span className="text-white/30 text-xs">% off</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FieldLabel>Max uses</FieldLabel>
                            <Input type="number" min={1} className="w-20" value={buyerDiscountMaxUses} onChange={(e) => setBuyerDiscountMaxUses(parseInt(e.target.value) || 1)} />
                            <span className="text-white/30 text-xs">buyers</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SectionCard>
              </div>

              {/* ── RIGHT COLUMN ── */}
              <div className="lg:col-span-2 space-y-4">

                {/* Preview card */}
                <SectionCard>
                  <Label>Preview</Label>
                  <div className="rounded-xl overflow-hidden bg-white/4 border border-white/8 aspect-square flex items-center justify-center">
                    {previewUrl ? (
                      <img src={previewUrl} alt="NFT Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-white/15">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} /><path strokeLinecap="round" strokeWidth={1} d="M3 16l5-5 4 4 3-3 6 6" /></svg>
                        <p className="text-xs">No image uploaded</p>
                      </div>
                    )}
                  </div>
                  {title && <p className="text-white font-semibold truncate">{title}</p>}
                  {symbol && <p className="text-white/30 text-xs font-mono">{symbol}</p>}
                </SectionCard>

                {/* Cost breakdown */}
                <SectionCard>
                  <Label>Cost Breakdown</Label>
                  <div className="space-y-3">
                    {[
                      { label: "Mint price",      value: isFreeListing ? "Free" : `${mintPrice.toFixed(4)} SOL` },
                      { label: "Discount",         value: `-${discountAmount.toFixed(4)} SOL` },
                      { label: "After discount",   value: `${priceAfter.toFixed(4)} SOL` },
                      { label: "Network fee",      value: `${NETWORK_FEE} SOL` },
                    ].map((row, i) => (
                      <div key={i} className={`flex justify-between items-center text-sm ${i < 3 ? "pb-3 border-b border-white/5" : ""}`}>
                        <span className="text-white/40 font-light">{row.label}</span>
                        <span className="text-white/80 font-medium font-mono">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-between items-center px-4 py-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <span className="text-orange-400 font-semibold text-sm uppercase tracking-wider">Total</span>
                    <span className="text-orange-400 font-bold text-2xl font-mono">
                      {isFreeListing ? `${NETWORK_FEE} SOL` : `${totalCost.toFixed(5)} SOL`}
                    </span>
                  </div>
                </SectionCard>

                {/* Mint button */}
                <button
                  onClick={handleMint}
                  disabled={loading || !connected}
                  className={`w-full py-4 rounded-2xl font-bold text-sm tracking-wider transition-all relative overflow-hidden ${
                    loading
                      ? "bg-orange-500/40 text-white/60 cursor-not-allowed"
                      : !connected
                      ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/8"
                      : "bg-orange-500 text-white hover:bg-orange-400 cursor-pointer shadow-xl shadow-orange-500/25 active:scale-[0.98]"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      {mintStep || "Processing..."}
                    </span>
                  ) : !connected ? (
                    "Connect wallet to mint"
                  ) : (
                    "Mint NFT →"
                  )}
                </button>

                {/* Info pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    `${category.charAt(0).toUpperCase() + category.slice(1)}`,
                    editionType === "limited" ? `${totalSupply} copies` : "Unlimited",
                    `${royalty}% royalty`,
                  ].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-full border border-white/8 text-white/35 text-[11px]">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Trending NFTs ── */}
            <div className="mt-16">
              <div className="flex items-center gap-4 mb-8">
                <Label className="mb-0">Trending NFTs</Label>
                <div className="flex-1 h-px bg-white/5" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TRENDING.map((nft) => (
                  <div key={nft.id} className="group rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all overflow-hidden cursor-pointer">
                    <div
                      className="h-40 flex items-center justify-center text-5xl relative"
                      style={{ background: `radial-gradient(ellipse at center, ${nft.accent}18, transparent 70%)` }}
                    >
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: `radial-gradient(ellipse at center, ${nft.accent}28, transparent 70%)` }}
                      />
                      <span className="relative z-10 drop-shadow-lg">{nft.icon}</span>
                    </div>
                    <div className="p-3.5">
                      <p className="text-white/80 text-xs font-semibold tracking-wider mb-2">{nft.label}</p>
                      <div className="flex items-center justify-between mb-3">
                        {nft.spump && <span className="text-orange-400 text-xs font-medium">{nft.spump} SPUMP</span>}
                        {nft.price && <span className="text-white/40 text-xs">€{nft.price}</span>}
                        {!nft.spump && !nft.price && <span className="text-white/20 text-xs">—</span>}
                      </div>
                      <button className="w-full py-1.5 rounded-lg border border-white/10 text-white/50 text-xs font-semibold tracking-widest hover:bg-white/8 hover:text-white hover:border-white/20 transition-all cursor-pointer">
                        BUY
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}
