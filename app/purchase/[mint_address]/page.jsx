"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "../../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";

const API_URL   = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const SOL_MINT  = "So11111111111111111111111111111111111111112";
const SPUMP_MINT = "AKdCsQHoLKCpu3n2QcMS3BK8vQTWDcSDpujLr8UjeyNT";

// ── Jupiter API to live SPUMP price ─────────────────────────────────
async function getSpumpPerSol() {
  try {
    const res = await fetch(`${API_URL}/buy/spump-price`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (data.success && Number(data.spump_per_sol) > 0) {
      return Number(data.spump_per_sol);
    }
  } catch (err) {
    console.error("SPUMP price error:", err);
  }

  return null;
}

const PAYMENT_METHODS = [
  {
    id: "sol", bold: "SOL", icon: "◎", unit: "SOL", active: true,
    border: "border-indigo-400/40", bg: "bg-indigo-500/6",
    activeBg: "bg-indigo-500/12", activeBorder: "border-indigo-400/60",
    accentText: "text-indigo-400", iconBg: "bg-indigo-500/10 border-indigo-400/40",
  },
  {
    id: "spump", bold: "SPUMP", icon: "🎃", unit: "SPUMP", active: true,
    discount: 15,
    border: "border-amber-400/40", bg: "bg-amber-500/8",
    activeBg: "bg-amber-500/12", activeBorder: "border-amber-400/60",
    accentText: "text-amber-500", iconBg: "bg-amber-500/10 border-amber-400/40",
  },
  {
    id: "usff", bold: "USFF", icon: "💚", unit: "USFF", active: false,
    discount: 15,
    border: "border-green-400/40", bg: "bg-green-500/6",
    activeBg: "bg-green-500/10", activeBorder: "border-green-400/50",
    accentText: "text-green-400", iconBg: "bg-green-500/10 border-green-400/40",
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
  const router      = useRouter();
  const mintAddress = params?.mint_address;

  const { connected, walletAddress, signTransaction } = useSolanaWallet();

  const [nft, setNft]             = useState(null);
  const [loading, setLoading]     = useState(true);
  const [loadError, setLoadError] = useState("");

  // ── Platform fee (dynamic) ─────────────────────────
  const [platformFeePercent, setPlatformFeePercent] = useState(3);

  // ── SPUMP live rate ────────────────────────────────
  const [spumpPerSol, setSpumpPerSol]       = useState(null);
  const [rateLoading, setRateLoading]       = useState(false);
  const [rateError, setRateError]           = useState("");

  const [selected, setSelected]         = useState("sol");
  const [deliveryMode, setDeliveryMode] = useState("connected");
  const [walletInput, setWalletInput]   = useState("");
  const [confirmed, setConfirmed]       = useState(false);

  const [step, setStep]   = useState("idle");
  const [error, setError] = useState("");
  const [txSig, setTxSig] = useState("");

  // ── Load config ────────────────────────────────────
  useEffect(() => {
    fetch(`${API_URL}/config`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setPlatformFeePercent(d.data.platform_fee_percent ?? 3); })
      .catch(() => {});
  }, []);

  // ── Load NFT ───────────────────────────────────────
  useEffect(() => {
    if (!mintAddress) return;
    fetch(`${API_URL}/nft/${mintAddress}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          if (!d.data.is_listed) setLoadError("This NFT is not currently listed for sale.");
          setNft(d.data);
        } else setLoadError("NFT not found.");
      })
      .catch(() => setLoadError("Failed to load NFT details."))
      .finally(() => setLoading(false));
  }, [mintAddress]);

  // ── Load SPUMP rate যখন SPUMP select হয় ──────────
  useEffect(() => {
    if (selected !== "spump") return;
    setRateLoading(true);
    setRateError("");
    getSpumpPerSol()
      .then((rate) => {
        if (rate) setSpumpPerSol(rate);
        else setRateError("Could not fetch live SPUMP rate. Try again.");
      })
      .finally(() => setRateLoading(false));
  }, [selected]);

  // ── Calculations ───────────────────────────────────
  const basePrice      = nft ? parseFloat(nft.list_price) : 0;
  const platformFee    = basePrice * (platformFeePercent / 100);
  const sellerGets     = basePrice - platformFee;
  const isOwner        = nft?.wallet_address === walletAddress;

  // SPUMP amount with 15% discount
  const spumpDiscount  = 15;
  const spumpAmount    = spumpPerSol
    ? Math.ceil(basePrice * spumpPerSol * (1 - spumpDiscount / 100))
    : null;
  const spumpFee       = spumpAmount ? Math.ceil(spumpAmount * (platformFeePercent / 100)) : null;
  const spumpTotal     = spumpAmount ?? 0;

  const deliveryWallet        = deliveryMode === "connected" ? walletAddress : walletInput;
  const isValidDeliveryWallet = deliveryWallet && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(deliveryWallet);

  // ── Handle Purchase ────────────────────────────────
  async function handlePurchase() {
    setError("");
    if (!connected || !walletAddress) { setError("Please connect your wallet first."); return; }
    if (!confirmed)                   { setError("Please confirm the delivery address is correct."); return; }
    if (!isValidDeliveryWallet)       { setError("Please enter a valid delivery wallet address."); return; }
    if (isOwner)                      { setError("You cannot buy your own NFT."); return; }

    if (selected === "spump" && !spumpAmount) {
      setError("SPUMP rate not loaded. Please wait and try again."); return;
    }

    setStep("paying");
    try {
      const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
      const rpcUrl  = network === "mainnet-beta"
        ? "https://api.mainnet-beta.solana.com"
        : "https://api.devnet.solana.com";

      // Prepare — seller + platform wallet
      const prepRes  = await fetch(`${API_URL}/buy/prepare/${nft.id}`);
      const prepData = await prepRes.json();
      if (!prepData.success) throw new Error(prepData.message);
      const { seller_wallet, platform_wallet } = prepData.data;

      const { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } =
        await import("@solana/web3.js");
      const connection  = new Connection(rpcUrl, "confirmed");
      const buyerPubkey = new PublicKey(walletAddress);

      let tx = new Transaction();

      if (selected === "sol") {
        // ── SOL Transfer ───────────────────────────────
        tx.add(SystemProgram.transfer({
          fromPubkey: buyerPubkey,
          toPubkey:   new PublicKey(seller_wallet),
          lamports:   Math.floor(sellerGets * LAMPORTS_PER_SOL),
        }));
        const isPlatformValid = platform_wallet && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(platform_wallet);
        if (isPlatformValid && platformFee > 0) {
          tx.add(SystemProgram.transfer({
            fromPubkey: buyerPubkey,
            toPubkey:   new PublicKey(platform_wallet),
            lamports:   Math.floor(platformFee * LAMPORTS_PER_SOL),
          }));
        }

      } else if (selected === "spump") {
        // ── SPUMP SPL Token Transfer ───────────────────
        const {
          getAssociatedTokenAddress,
          createAssociatedTokenAccountInstruction,
          createTransferInstruction,
          TOKEN_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        } = await import("@solana/spl-token");

        const spumpMint      = new PublicKey(SPUMP_MINT);
        const sellerPubkey   = new PublicKey(seller_wallet);
        const platformPubkey = platform_wallet && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(platform_wallet)
          ? new PublicKey(platform_wallet) : null;

        // Token accounts
        const buyerAta   = await getAssociatedTokenAddress(spumpMint, buyerPubkey);
        const sellerAta  = await getAssociatedTokenAddress(spumpMint, sellerPubkey);
        const platformAta = platformPubkey
          ? await getAssociatedTokenAddress(spumpMint, platformPubkey) : null;

        // Seller token account 
        const sellerAccInfo = await connection.getAccountInfo(sellerAta);
        if (!sellerAccInfo) {
          tx.add(createAssociatedTokenAccountInstruction(
            buyerPubkey, sellerAta, sellerPubkey, spumpMint,
            TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
          ));
        }

        // SPUMP decimals 
        const spumpDecimals = 6;
        const sellerAmount  = BigInt(Math.floor((spumpTotal - (spumpFee ?? 0)) * Math.pow(10, spumpDecimals)));
        const feeAmount     = spumpFee ? BigInt(Math.floor(spumpFee * Math.pow(10, spumpDecimals))) : BigInt(0);

        // Seller কে পাঠাও
        tx.add(createTransferInstruction(
          buyerAta, sellerAta, buyerPubkey,
          sellerAmount, [], TOKEN_PROGRAM_ID
        ));

        // Platform fee 
        if (platformAta && feeAmount > BigInt(0)) {
          const platformAccInfo = await connection.getAccountInfo(platformAta);
          if (!platformAccInfo) {
            tx.add(createAssociatedTokenAccountInstruction(
              buyerPubkey, platformAta, platformPubkey, spumpMint,
              TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID
            ));
          }
          tx.add(createTransferInstruction(
            buyerAta, platformAta, buyerPubkey,
            feeAmount, [], TOKEN_PROGRAM_ID
          ));
        }
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

      // Backend confirm
      const confirmRes  = await fetch(`${API_URL}/buy/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nft_id:           nft.id,
          buyer_wallet:     deliveryWallet,
          transaction_sig:  signature,
          payment_method:   selected,
          payment_amount:   selected === "sol" ? basePrice : spumpTotal,
          payment_currency: selected.toUpperCase(),
        }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmData.success) throw new Error(confirmData.message);

      setStep("done");
    } catch (err) {
      console.error("Purchase error:", err);
      const raw = err?.message || "";
      let msg   = "Something went wrong. Please try again.";

      if (raw.includes("Attempt to debit") || raw.includes("insufficient funds") || raw.includes("Insufficient funds"))
        msg = selected === "spump"
          ? "Insufficient SPUMP balance. Please add more SPUMP tokens and try again."
          : "Insufficient SOL balance. Please add more SOL and try again.";
      else if (raw.includes("User rejected") || raw.includes("User declined"))
        msg = "Transaction was cancelled.";
      else if (raw.includes("Transport") || raw.includes("transport"))
        msg = "Wallet connection issue. Please refresh and reconnect your wallet.";
      else if (raw.includes("blockhash") || raw.includes("Blockhash not found"))
        msg = "Network is busy. Please try again in a moment.";
      else if (raw.includes("Simulation failed"))
        msg = "Transaction could not be completed. Please check your balance.";
      else if (raw.includes("not confirmed") || raw.includes("timeout"))
        msg = "Transaction is taking longer than expected. Check your wallet for status.";
      else if (raw.includes("Invalid public key"))
        msg = "Invalid wallet address. Please check and try again.";
      else if (raw.includes("TokenAccountNotFound") || raw.includes("token account"))
        msg = "SPUMP token account not found. Make sure you have SPUMP tokens in your wallet.";

      setError(msg);
      setStep("error");
    }
  }

  // ── Loading ────────────────────────────────────────
  if (loading) {
    return (
      <section className="bg-primary-bg py-20 min-h-screen">
        <Container>
          <div className="grid lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <div className="space-y-4"><Skeleton className="h-48" /><Skeleton className="h-32" /></div>
          </div>
        </Container>
      </section>
    );
  }

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

  // ── Display price based on selected method ─────────
  const displayPrice = selected === "spump"
    ? (spumpAmount ? `${spumpAmount.toLocaleString()} SPUMP` : "Loading...")
    : `${basePrice.toFixed(4)} SOL`;

  const displayFee = selected === "spump"
    ? (spumpFee ? `${spumpFee.toLocaleString()} SPUMP` : "—")
    : `${platformFee.toFixed(4)} SOL`;

  return (
    <section className="bg-primary-bg py-20">
      <Container>

        {/* Header */}
        <div className="flex items-start gap-5 mb-12 pb-8 border-b border-secondary/10">
          <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
            {nft?.image_url ? <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" /> : <span className="text-2xl">🖼️</span>}
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">Scotty Pumpkin Ecosystem</p>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-4 text-secondary">
              Secure NFT <br /><span className="text-primary italic">Purchase</span>
            </h1>
          </div>
        </div>

        {loadError && nft && (
          <div className="mb-8 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-600 text-sm">{loadError}</div>
        )}
        {isOwner && (
          <div className="mb-8 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-600 text-sm">You already own this NFT.</div>
        )}

        <div className="flex gap-5 pb-8 items-start border-b border-secondary/[0.07] mb-8">
          <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">01</span>
          <p className="flex-1 text-[15px] leading-[1.75] text-secondary/70 font-light m-0">
            Choose your payment method — SOL or SPUMP (15% discount). Confirm your delivery wallet and complete your purchase.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {/* LEFT: Payment Options */}
          <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
            <p className="text-[11px] font-medium tracking-widest uppercase text-primary">Payment Options</p>
            <p className="text-secondary/60 text-xs font-light">SPUMP holders get 15% discount!</p>

            <div className="space-y-2">
              {PAYMENT_METHODS.map((m) => {
                const isActive = selected === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => m.active && setSelected(m.id)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg border transition-colors ${!m.active ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${isActive ? `${m.activeBg} ${m.activeBorder}` : `${m.bg} ${m.border}`}`}
                  >
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0 border ${m.iconBg}`}>{m.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-secondary text-sm font-medium">
                        Pay with <span className="font-semibold text-primary">{m.bold}</span>
                        {m.discount && m.active && (
                          <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-500/80 text-white text-[10px] font-bold">{m.discount}% OFF</span>
                        )}
                      </p>
                      {!m.active
                        ? <p className="text-secondary/40 text-xs mt-0.5 font-light">Coming soon</p>
                        : m.id === "spump"
                          ? <p className={`text-xs mt-0.5 font-light ${m.accentText}`}>
                              {rateLoading ? "Loading rate..." : rateError ? rateError : spumpAmount ? `≈ ${spumpAmount.toLocaleString()} SPUMP` : "Live rate"}
                            </p>
                          : <p className={`text-xs mt-0.5 font-light ${m.accentText}`}>{basePrice.toFixed(4)} SOL</p>
                      }
                    </div>
                    {m.active && (
                      <div className={`shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ml-1 transition-colors ${isActive ? "border-primary" : "border-secondary/25"}`}>
                        {isActive && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* SPUMP live rate info */}
            {selected === "spump" && spumpPerSol && (
              <div className="px-4 py-3 rounded-lg bg-amber-500/8 border border-amber-400/20 text-xs text-amber-700 space-y-1">
                <p className="font-medium">Live Rate (Jupiter)</p>
                <p>1 SOL ≈ {spumpPerSol.toLocaleString()} SPUMP</p>
                <p className="text-amber-600/60">15% discount applied for SPUMP holders</p>
              </div>
            )}

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

            <div className="flex items-center justify-center gap-3 text-secondary/70 text-xs font-light pt-1">
              <span>🛡️ 100% Secure</span><span>•</span><span>⚡ Instant</span><span>•</span><span>✅ On-chain</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            {/* Purchase Summary */}
            <div className="bg-white border border-secondary/[0.07] rounded-xl p-5 space-y-4">
              <p className="text-[11px] font-medium tracking-widest uppercase text-primary">Purchase Summary</p>

              <div className="flex items-center gap-4 pb-4 border-b border-secondary/[0.07]">
                <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden shrink-0">
                  {nft?.image_url ? <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" /> : <span className="text-2xl">🖼️</span>}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-secondary font-medium text-sm leading-tight truncate">{nft?.name}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-secondary/70 text-xs font-mono">{nft?.wallet_address?.slice(0,4)}...{nft?.wallet_address?.slice(-4)}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-blue-500/10 border border-blue-400/30 text-blue-400">✓ On-chain</span>
                  </div>
                  <p className="text-secondary/55 text-xs capitalize">{nft?.category} · {nft?.edition_type === "limited" ? `${nft?.total_supply} editions` : "Unlimited"}</p>
                </div>
              </div>

              <div className="space-y-0">
                <div className="flex justify-between items-center py-2.5 border-b border-secondary/[0.07]">
                  <span className="text-secondary/70 text-sm font-light">NFT Price:</span>
                  <span className="text-secondary font-medium">{basePrice.toFixed(4)} SOL</span>
                </div>
                {selected === "spump" && (
                  <div className="flex justify-between items-center py-2.5 border-b border-secondary/[0.07]">
                    <span className="text-amber-600 text-sm font-light">15% SPUMP Discount:</span>
                    <span className="text-amber-600 text-sm font-medium">
                      {spumpPerSol ? `−${Math.ceil(basePrice * spumpPerSol * 0.15).toLocaleString()} SPUMP` : "—"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2.5 border-b border-secondary/[0.07]">
                  <span className="text-secondary/60 text-sm font-light">Platform Fee ({platformFeePercent}%):</span>
                  <span className="text-secondary/70 text-sm font-light">{displayFee}</span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-secondary font-medium text-sm flex items-center gap-1">
                    <span>{selected === "spump" ? "🎃" : "◎"}</span> You Pay:
                  </span>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-400/25">
                    {rateLoading && selected === "spump" ? (
                      <span className="text-secondary/40 text-sm">Loading...</span>
                    ) : (
                      <span className="text-primary font-semibold text-base">{displayPrice}</span>
                    )}
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

              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setConfirmed((v) => !v)}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${confirmed ? "bg-primary border-primary" : "border-secondary/25 bg-transparent"}`}>
                  {confirmed && <span className="text-white text-xs font-semibold leading-none">✓</span>}
                </div>
                <span className="text-secondary/60 text-sm font-light">I confirm this address is correct</span>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-lg bg-red-500/8 border border-red-400/20 text-red-500 text-xs">{error}</div>
              )}

              {(step === "paying" || step === "verifying") && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/8 border border-primary/20">
                  <Spinner />
                  <span className="text-primary text-xs font-medium">
                    {step === "paying" ? "Waiting for wallet approval..." : "Confirming on-chain..."}
                  </span>
                </div>
              )}

              {step === "done" ? (
                <div className="space-y-3">
                  <div className="px-4 py-3 rounded-lg bg-green-500/10 border border-green-400/25 text-center">
                    <p className="text-green-600 font-semibold text-sm">✓ Purchase Complete!</p>
                    <p className="text-green-600/70 text-xs mt-1">The NFT now belongs to your wallet.</p>
                  </div>
                  {txSig && (
                    <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" rel="noreferrer" className="block text-center text-primary text-xs underline">
                      View transaction ↗
                    </a>
                  )}
                  <button onClick={() => router.push(`/nft-marketplace/${mintAddress}`)} className="w-full py-3 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors cursor-pointer">
                    View NFT
                  </button>
                </div>
              ) : (
                <button
                  disabled={step === "paying" || step === "verifying" || isOwner || !nft?.is_listed || (selected === "spump" && !spumpAmount)}
                  className={`w-full py-4 rounded-xl font-medium text-base text-white tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    (step === "paying" || step === "verifying" || isOwner || !nft?.is_listed || (selected === "spump" && !spumpAmount))
                      ? "bg-secondary/20 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                  onClick={handlePurchase}
                >
                  {step === "paying" || step === "verifying" ? (
                    <><Spinner /> Processing...</>
                  ) : !nft?.is_listed ? "Not Available"
                    : isOwner ? "You Own This NFT"
                    : selected === "spump" && !spumpAmount ? "Loading SPUMP Rate..."
                    : `Pay with ${selected.toUpperCase()} →`}
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
