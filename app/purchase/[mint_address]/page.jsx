"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "../../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";



// ── Payment Methods — Currently only SOL is active; the others are marked as "Coming Soon" ──────────────
// Once SPUMP/USFF tokens are available in the future, simply set `active: true` to enable them.
const PAYMENT_METHODS = [
  {
    id: "sol",
    bold: "SOL",
    icon: "◎",
    unit: "SOL",
    active: true,
    border: "border-indigo-400/40",
    bg: "bg-indigo-500/6",
    activeBg: "bg-indigo-500/12",
    activeBorder: "border-indigo-400/60",
    accentText: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border-indigo-400/40",
  },
  {
    id: "spump",
    bold: "SPUMP",
    icon: "🎃",
    discount: 15,
    unit: "SPUMP",
    active: false,
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
    bold: "USFF",
    icon: "💚",
    discount: 15,
    unit: "USFF",
    active: false,
    border: "border-green-400/40",
    bg: "bg-green-500/6",
    activeBg: "bg-green-500/10",
    activeBorder: "border-green-400/50",
    accentText: "text-green-400",
    iconBg: "bg-green-500/10 border-green-400/40",
    badgeBg: "bg-red-500/80",
  },
];

function Spinner({ className = "w-4 h-4" }) {
  return <div className={`${className} rounded-full border-2 border-white/40 border-t-white animate-spin`} />;
}

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-secondary/8 rounded-xl ${className}`} />;
}

export default function PurchasePage() {
  const params      = useParams();
  const router       = useRouter();
  const mintAddress = params?.mint_address;

  const { connected, walletAddress, signTransaction, connect } = useSolanaWallet();

  const [nft, setNft]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selected, setSelected]         = useState("sol");
  const [deliveryMode, setDeliveryMode] = useState("connected");
  const [walletInput, setWalletInput]   = useState("");
  const [confirmed, setConfirmed]       = useState(false);

  const [step, setStep]   = useState("idle"); // idle | paying | verifying | done | error
  const [error, setError] = useState("");
  const [txSig, setTxSig] = useState("");
  const [platformFeePercent, setPlatformFeePercent] = useState(3);
  // ── Load NFT ────────────────────────────────────────
  useEffect(() => {
    if (!mintAddress) return;
    fetch(`${API_URL}/nft/${mintAddress}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (!d.data.is_listed) {
            setLoadError("This NFT is not currently listed for sale.");
          }
          setNft(d.data);
        } else {
          setLoadError("NFT not found.");
        }
      })
      .catch(() => setLoadError("Failed to load NFT details."))
      .finally(() => setLoading(false));
  }, [mintAddress]);

  useEffect(() => {
  fetch(`${API_URL}/config`)
    .then((r) => r.json())
    .then((d) => {
      if (d.success) setPlatformFeePercent(d.data.platform_fee_percent);
    })
    .catch(() => {});
  }, []);

  const method        = PAYMENT_METHODS.find((m) => m.id === selected);
  const basePrice     = nft ? parseFloat(nft.list_price) : 0;
  const platformFee = basePrice * (platformFeePercent / 100);
  const youPay      = basePrice - platformFee; // seller receives this; buyer pays full basePrice
  const isOwner        = nft?.wallet_address === walletAddress;

  const deliveryWallet = deliveryMode === "connected" ? walletAddress : walletInput;
  const isValidDeliveryWallet = deliveryWallet && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(deliveryWallet);

  // ── Handle Purchase ───────────────────────────────────
  async function handlePurchase() {
    setError("");

    if (!connected || !walletAddress) { setError("Please connect your wallet first."); return; }
    if (!confirmed) { setError("Please confirm the delivery address is correct."); return; }
    if (!isValidDeliveryWallet) { setError("Please enter a valid delivery wallet address."); return; }
    if (isOwner) { setError("You cannot buy your own NFT."); return; }

    setStep("paying");
    try {
      const {
        Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL,
      } = await import("@solana/web3.js");

      const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
      const rpcUrl  = network === "mainnet-beta"
        ? "https://api.mainnet-beta.solana.com"
        : "https://api.devnet.solana.com";

      const connection  = new Connection(rpcUrl, "confirmed");
      const buyerPubkey = new PublicKey(walletAddress);

      // Prepare — seller + platform wallet নাও
      const prepRes  = await fetch(`${API_URL}/buy/prepare/${nft.id}`);
      const prepData = await prepRes.json();
      if (!prepData.success) throw new Error(prepData.message);

      const { seller_wallet, platform_wallet } = prepData.data;

      const tx = new Transaction();

      tx.add(SystemProgram.transfer({
        fromPubkey: buyerPubkey,
        toPubkey:   new PublicKey(seller_wallet),
        lamports:   Math.floor(youPay * LAMPORTS_PER_SOL),
      }));

      const isPlatformValid = platform_wallet && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(platform_wallet);
      if (isPlatformValid && platformFee > 0) {
        tx.add(SystemProgram.transfer({
          fromPubkey: buyerPubkey,
          toPubkey:   new PublicKey(platform_wallet),
          lamports:   Math.floor(platformFee * LAMPORTS_PER_SOL),
        }));
      }

      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash  = blockhash;
      tx.feePayer         = buyerPubkey;

      const signedTx  = await signTransaction(tx);
      const signature  = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false, preflightCommitment: "confirmed",
      });

      setTxSig(signature);
      setStep("verifying");
      await connection.confirmTransaction(signature, "confirmed");

      const confirmRes  = await fetch(`${API_URL}/buy/confirm`, {
        method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nft_id:          nft.id,
          buyer_wallet:    deliveryWallet,
          transaction_sig: signature,
        }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmData.success) throw new Error(confirmData.message);

      setStep("done");
    } catch (err) {
      console.error("Purchase error:", err);

      const rawMsg = err?.message || "";
      let msg = "Something went wrong. Please try again.";

      if (
        rawMsg.includes("Attempt to debit an account") ||
        rawMsg.includes("insufficient funds") ||
        rawMsg.includes("Insufficient funds")
      ) {
        msg = "Insufficient SOL balance in your wallet. Please add more SOL and try again.";
      }
      else if (
        rawMsg.includes("User rejected") ||
        rawMsg.includes("User declined") ||
        rawMsg.includes("rejected the request")
      ) {
        msg = "Transaction was cancelled.";
      }
      else if (
        rawMsg.includes("Transport") ||
        rawMsg.includes("transport")
      ) {
        msg = "Wallet connection issue. Please refresh the page and reconnect your wallet.";
      }
      else if (
        rawMsg.includes("blockhash") ||
        rawMsg.includes("Blockhash not found")
      ) {
        msg = "Network is busy. Please try again in a moment.";
      }
      else if (rawMsg.includes("Simulation failed")) {
        msg = "Transaction could not be completed. Please check your wallet balance and try again.";
      }
      else if (
        rawMsg.includes("not confirmed") ||
        rawMsg.includes("timeout")
      ) {
        msg = "Transaction is taking longer than expected. Please check your wallet for confirmation status.";
      }
      else if (rawMsg.includes("Invalid public key")) {
        msg = "Invalid wallet address. Please check the delivery address and try again.";
      }

      setError(msg);
      setStep("error");
    }
  }

  // ── Loading state ──────────────────────────────────
  if (loading) {
    return (
      <section className="bg-primary-bg py-20 min-h-screen">
        <Container>
          <div className="grid lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <div className="space-y-4">
              <Skeleton className="h-48" />
              <Skeleton className="h-32" />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // ── Error / Not found ──────────────────────────────
  if (loadError && !nft) {
    return (
      <section className="bg-primary-bg py-20 min-h-screen flex items-center justify-center">
        <Container>
          <div className="text-center space-y-4">
            <p className="text-secondary/50 text-lg">{loadError}</p>
            <button onClick={() => router.push("/nft-marketplace")} className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold">
              Back to Marketplace
            </button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-primary-bg py-20">
      <Container>
        {/* ── Header ── */}
        <div className="flex items-start gap-5 mb-12 pb-8 border-b border-secondary/10">
          <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
            {nft?.image_url ? (
              <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl">🖼️</span>
            )}
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

        {/* ── Not listed warning ── */}
        {loadError && nft && (
          <div className="mb-8 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-600 text-sm">
            {loadError}
          </div>
        )}

        {/* ── Already owner ── */}
        {isOwner && (
          <div className="mb-8 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-600 text-sm">
            You already own this NFT.
          </div>
        )}

        {/* ── Intro row ── */}
        <div className="flex gap-5 pb-8 items-start border-b border-secondary/[0.07] mb-8">
          <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">01</span>
          <p className="flex-1 text-[15px] leading-[1.75] text-secondary/70 font-light m-0">
            Choose Payment Method &amp; Complete Payment — select your preferred payment type and confirm your delivery wallet.
          </p>
        </div>

        {/* ── Two column layout ── */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {/* ── LEFT: Payment Options ── */}
          <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
            <p className="text-[11px] font-medium tracking-widest uppercase text-primary">Payment Options</p>
            <p className="text-secondary/60 text-xs font-light">Select your preferred payment token</p>

            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => {
                const isActive = selected === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => m.active && setSelected(m.id)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg border transition-colors ${
                      !m.active ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                    } ${isActive ? `${m.activeBg} ${m.activeBorder}` : `${m.bg} ${m.border}`}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 border ${m.iconBg}`}>
                      {m.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-secondary text-sm font-medium">
                        Pay with <span className="font-semibold text-primary">{m.bold}</span>
                      </p>
                      {!m.active && (
                        <p className="text-secondary/40 text-xs mt-0.5 font-light">Coming soon</p>
                      )}
                      {m.active && (
                        <p className={`text-xs mt-0.5 font-light ${m.accentText}`}>Available now</p>
                      )}
                    </div>
                    {m.active && (
                      <p className={`font-semibold text-sm shrink-0 ${m.accentText}`}>
                        {basePrice.toFixed(4)} {m.unit}
                      </p>
                    )}
                    <div className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ml-1 transition-colors ${isActive ? "border-primary" : "border-secondary/25"}`}>
                      {isActive && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Connect Wallet */}
            {!connected ? (
              <div className="space-y-2">
                <p className="text-center text-secondary/50 text-xs">Connect your wallet to continue</p>
                <WalletButton />
              </div>
            ) : (
              <div className="px-4 py-3 rounded-lg bg-emerald-500/8 border border-emerald-400/20 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-600 text-xs font-mono">{walletAddress.slice(0,6)}...{walletAddress.slice(-4)} connected</span>
              </div>
            )}

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-3 text-secondary/70 text-xs font-light pt-1">
              <span>🛡️ 100% Secure</span><span>•</span>
              <span>⚡ Instant Delivery</span><span>•</span>
              <span>✅ On-chain Verified</span>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div className="space-y-4">

            {/* Purchase Summary */}
            <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
              <p className="text-[11px] font-medium tracking-widest uppercase text-primary">Purchase Summary</p>

              <div className="flex items-center gap-4 pb-4 border-b border-secondary/[0.07]">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                  {nft?.image_url ? (
                    <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🖼️</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-secondary font-medium text-sm leading-tight truncate">{nft?.name}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-secondary/70 text-xs font-light font-mono">
                      {nft?.wallet_address?.slice(0,4)}...{nft?.wallet_address?.slice(-4)}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/10 border border-blue-400/30 text-blue-400">
                      ✓ On-chain
                    </span>
                  </div>
                  <p className="text-secondary/55 text-xs font-light capitalize">
                    {nft?.category} · {nft?.edition_type === "limited" ? `${nft?.total_supply} editions` : "Unlimited"}
                  </p>
                </div>
              </div>

              <div className="space-y-0">
                <div className="flex justify-between items-center py-2.5 border-b border-secondary/[0.07]">
                  <span className="text-secondary/70 text-sm font-light">List Price:</span>
                  <span className="text-secondary font-medium text-base">{basePrice.toFixed(4)} SOL</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-secondary/[0.07]">
                  <span className="text-secondary/60 text-sm font-light">Platform Fee ({platformFeePercent}%):</span>
                  <span className="text-secondary/70 text-sm font-light">included</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-secondary font-medium text-sm flex items-center gap-1"><span>◎</span> You Pay:</span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-400/25">
                    <span className="text-primary font-semibold text-base">{basePrice.toFixed(4)} SOL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* NFT Delivery Wallet */}
            <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
              <p className="text-[11px] font-medium tracking-widest uppercase text-primary">NFT Delivery Wallet</p>
              <p className="text-secondary/70 text-sm font-light">Where should we send your NFT?</p>

              <div
                className={`flex items-center gap-3 px-3 py-3 rounded-lg border cursor-pointer transition-colors ${deliveryMode === "connected" ? "bg-primary/10 border-primary/25" : "bg-secondary/3 border-secondary/10 hover:border-secondary/20"}`}
                onClick={() => setDeliveryMode("connected")}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${deliveryMode === "connected" ? "border-primary" : "border-secondary/25"}`}>
                  {deliveryMode === "connected" && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="text-sm text-secondary/70 font-light flex-1">
                  Use <span className="font-medium text-secondary">Connected Wallet</span>{" "}
                  <span className="text-primary/80 text-xs">(Recommended)</span>
                </span>
              </div>

              <div
                className={`flex items-center gap-3 px-3 py-3 rounded-lg border cursor-pointer transition-colors ${deliveryMode === "other" ? "bg-primary/10 border-primary/25" : "bg-secondary/3 border-secondary/10 hover:border-secondary/20"}`}
                onClick={() => setDeliveryMode("other")}
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${deliveryMode === "other" ? "border-primary" : "border-secondary/25"}`}>
                  {deliveryMode === "other" && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className="text-sm text-secondary/70 font-light">Enter Another Wallet Address</span>
              </div>

              {deliveryMode === "other" && (
                <input
                  className="w-full px-3 py-2.5 rounded-lg bg-primary-bg border border-secondary/15 text-secondary text-sm placeholder:text-secondary/30 font-light outline-none focus:border-primary/40 transition-colors"
                  placeholder="Paste wallet address here..."
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                />
              )}

              {/* Confirm checkbox */}
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setConfirmed((v) => !v)}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${confirmed ? "bg-primary border-primary" : "border-secondary/25 bg-transparent"}`}>
                  {confirmed && <span className="text-white text-xs font-semibold leading-none">✓</span>}
                </div>
                <span className="text-secondary/60 text-sm font-light">I confirm this address is correct</span>
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-500/8 border border-red-400/20 text-red-500 text-xs">
                  {error}
                </div>
              )}

              {/* Status */}
              {(step === "paying" || step === "verifying") && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/8 border border-primary/20">
                  <Spinner />
                  <span className="text-primary text-xs font-medium">
                    {step === "paying" ? "Waiting for wallet approval..." : "Confirming on-chain..."}
                  </span>
                </div>
              )}

              {/* Done */}
              {step === "done" ? (
                <div className="space-y-3">
                  <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-400/25 text-center">
                    <p className="text-green-600 font-semibold text-sm">✓ Purchase Complete!</p>
                    <p className="text-green-600/70 text-xs mt-1">The NFT now belongs to your wallet.</p>
                  </div>
                  {txSig && (
                    <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" rel="noreferrer"
                      className="block text-center text-primary text-xs underline">
                      View transaction ↗
                    </a>
                  )}
                  <button
                    onClick={() => router.push(`/nft-marketplace/${mintAddress}`)}
                    className="w-full py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors cursor-pointer"
                  >
                    View NFT
                  </button>
                </div>
              ) : (
                <button
                  disabled={step === "paying" || step === "verifying" || isOwner || !nft?.is_listed}
                  className={`w-full py-4 rounded-xl font-medium text-base text-white tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    (step === "paying" || step === "verifying" || isOwner || !nft?.is_listed)
                      ? "bg-secondary/20 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                  onClick={handlePurchase}
                >
                  {step === "paying" || step === "verifying" ? (
                    <><Spinner /> Processing...</>
                  ) : !nft?.is_listed ? (
                    "Not Available"
                  ) : isOwner ? (
                    "You Own This NFT"
                  ) : (
                    "Confirm Purchase"
                  )}
                </button>
              )}

              <div className="flex items-center justify-center gap-2">
                <span className="text-primary/50 text-xs">»»</span>
                <span className="text-secondary/50 text-xs font-light">Scotty Pumpkin Secure Checkout</span>
                <span className="text-primary/50 text-xs">««</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
