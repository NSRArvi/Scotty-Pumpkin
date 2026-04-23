import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const TREASURY_WALLET = "7Q8EjhdB6qakUfhwjBVnNsD6Ks9FsTMVtG7dzE3KopRG";
const COIN_TYPES = [
  { label: "USDC", value: "usdc" },
  { label: "USDT", value: "usdt" },
  { label: "SOL", value: "sol" },
];

export default function OnlinePurchaseHelpGuide({
  spumpPriceUsd = 0.01,
  fetchSolRateAction,
  verifySignatureRequest,
  submitCryptoTransfer,
}) {
  const [selectedCoin, setSelectedCoin] = useState("usdc");
  const [calcMode, setCalcMode] = useState("usd");
  const [enteredValue, setEnteredValue] = useState("");
  const [enteredSpump, setEnteredSpump] = useState("");
  const [solRate, setSolRate] = useState(0);
  const [loadingRate, setLoadingRate] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [expandedStep, setExpandedStep] = useState(null);

  // Step 7 state
  const [txHash, setTxHash] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyMeta, setVerifyMeta] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const effectiveSpumpPrice = Number(spumpPriceUsd) > 0 ? Number(spumpPriceUsd) : 0.01;

  useEffect(() => {
    async function loadSolRate() {
      if (selectedCoin !== "sol") return;
      try {
        setLoadingRate(true);
        const rate = await fetchSolRateAction();
        setSolRate(rate);
      } catch {
        setSolRate(0);
      } finally {
        setLoadingRate(false);
      }
    }
    loadSolRate();
  }, [selectedCoin, fetchSolRateAction]);

  const usdEquivalent = useMemo(() => {
    if (calcMode === "spump") {
      const spump = Number(enteredSpump || 0);
      return spump * effectiveSpumpPrice;
    }
    const value = Number(enteredValue || 0);
    if (!value) return 0;
    if (selectedCoin === "sol") {
      if (!solRate) return 0;
      return value * solRate;
    }
    return value;
  }, [enteredValue, enteredSpump, selectedCoin, solRate, calcMode, effectiveSpumpPrice]);

  const estimatedSpump = useMemo(() => {
    if (calcMode === "spump") return Number(enteredSpump || 0);
    if (!usdEquivalent) return 0;
    return Math.floor(usdEquivalent / effectiveSpumpPrice);
  }, [usdEquivalent, calcMode, enteredSpump, effectiveSpumpPrice]);

  const tokenAmountToSend = useMemo(() => {
    if (calcMode !== "spump") return null;
    const usd = usdEquivalent;
    if (!usd) return null;
    if (selectedCoin === "sol") {
      if (!solRate) return null;
      return (usd / solRate).toFixed(6);
    }
    return usd.toFixed(4);
  }, [calcMode, usdEquivalent, selectedCoin, solRate]);

  function copyWallet() {
    navigator.clipboard.writeText(TREASURY_WALLET).catch(() => {});
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  }

  function toggleStep(key) {
    setExpandedStep((prev) => (prev === key ? null : key));
  }

  async function verifySignature() {
    if (!txHash.trim()) return;
    try {
      setVerifying(true);
      const result = await verifySignatureRequest(txHash.trim());
      const verified = result?.txVerification ?? result?.data?.txVerification;
      if (!verified) throw new Error("Signature is not verified.");
      setIsVerified(true);
      setVerifyMeta({
        tokenSymbol: result?.data?.baseCoin || selectedCoin.toUpperCase(),
        tokenCount: Number(result?.data?.baseValue ?? usdEquivalent).toFixed(4),
        spumpCount: Number(result?.data?.spumpCount ?? estimatedSpump).toFixed(3),
      });
    } catch (error) {
      setIsVerified(false);
      setVerifyMeta(null);
      alert(error?.message || "Unable to verify signature.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleSubmit() {
    if (!isVerified || !walletAddress.trim()) return;
    try {
      setSubmitting(true);
      await submitCryptoTransfer({ walletAddress: walletAddress.trim(), txHash: txHash.trim() });
      setSubmitted(true);
    } catch (error) {
      alert(error?.message || "Unable to submit.");
    } finally {
      setSubmitting(false);
    }
  }

  const accentMap = {
    amber:  { border: "border-amber-500/30",  bg: "bg-amber-500/5",  text: "text-amber-400",  num: "bg-amber-500/15  border-amber-500/30  text-amber-300"  },
    indigo: { border: "border-indigo-500/30", bg: "bg-indigo-500/5", text: "text-indigo-400", num: "bg-indigo-500/15 border-indigo-500/30 text-indigo-300" },
    purple: { border: "border-purple-500/30", bg: "bg-purple-500/5", text: "text-purple-400", num: "bg-purple-500/15 border-purple-500/30 text-purple-300" },
    emerald:{ border: "border-emerald-500/30",bg: "bg-emerald-500/5",text: "text-emerald-400",num: "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"},
  };

  const STEPS = [
    {
      key: "s1",
      number: "01",
      label: "Step 1 of 7",
      title: "Download a Wallet App",
      icon: "📱",
      accent: "amber",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <p className="text-white/80 text-sm font-bold">1. Download the Solflare wallet app</p>
            <div className="space-y-2.5 pl-3 border-l-2 border-amber-500/30">
              <p className="text-white/65 text-sm leading-relaxed">
                On your phone or computer, search for <span className="text-amber-300 font-bold">SOLFLARE Wallet</span>. Install it and open it.
              </p>
              <p className="text-white/65 text-sm leading-relaxed">
                Follow the on-screen prompts to create a new wallet. Write down your secret recovery phrase and store it somewhere safe —{" "}
                <span className="text-red-300 font-bold">never share it with anyone</span>.
              </p>
            </div>
          </div>

          {/* Bank Transfer banner */}
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/8 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-purple-300 text-xs font-black uppercase tracking-widest mb-0.5">Also Available</p>
              <p className="text-white/75 text-sm font-medium">Bank Transfer method also available for buying SPUMP.</p>
            </div>
            <Link
              href="/bank-purchase"
              className="shrink-0 rounded-lg border border-purple-400/40 bg-purple-500/15 px-4 py-2 text-xs font-black text-purple-300 hover:bg-purple-500/25 transition-all whitespace-nowrap"
            >
              Bank Transfer →
            </Link>
          </div>

          {/* Skip note */}
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3 flex items-start gap-2.5">
            <span className="text-emerald-400 shrink-0 text-base mt-0.5">✓</span>
            <p className="text-white/60 text-sm leading-relaxed">
              Already have a wallet or an exchange account (Binance, Coinbase, etc.) with USDC, USDT, or SOL?{" "}
              <button
                onClick={() => setExpandedStep("s2")}
                className="text-emerald-300 font-bold underline underline-offset-2 cursor-pointer bg-transparent border-none"
              >
                Skip to Step 2
              </button>
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "s2",
      number: "02",
      label: "Step 2 of 7",
      title: "Choose Your Token",
      icon: "🪙",
      accent: "indigo",
      content: (
        <div className="space-y-4">
          <p className="text-white/60 text-sm leading-relaxed">
            Select the token you want to use for your transfer:{" "}
            <span className="text-white/85 font-bold">USDC</span>,{" "}
            <span className="text-white/85 font-bold">USDT</span>, or{" "}
            <span className="text-white/85 font-bold">SOL</span> on the Solana network.
          </p>

          {/* Token selector */}
          <div className="flex gap-3">
            {COIN_TYPES.map((coin) => (
              <button
                key={coin.value}
                type="button"
                onClick={() => setSelectedCoin(coin.value)}
                className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition-all ${
                  selectedCoin === coin.value
                    ? "border-indigo-400/60 bg-indigo-400/20 text-indigo-300"
                    : "border-white/15 bg-black/25 text-white/50 hover:border-white/25 hover:text-white/75"
                }`}
              >
                {coin.label}
              </button>
            ))}
          </div>

          {/* SPUMP Calculator */}
          <div className="rounded-xl border border-indigo-400/20 bg-black/20 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-indigo-300 text-xs font-black uppercase tracking-widest">SPUMP Count Calculator</p>
              <div className="flex rounded-lg border border-white/10 overflow-hidden text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setCalcMode("usd");
                    setEnteredSpump("");
                  }}
                  className={`px-3 py-1.5 transition-all ${calcMode === "usd" ? "bg-amber-400/20 text-amber-300" : "bg-black/20 text-white/40 hover:text-white/60"}`}
                >
                  By Amount
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCalcMode("spump");
                    setEnteredValue("");
                  }}
                  className={`px-3 py-1.5 transition-all ${calcMode === "spump" ? "bg-amber-400/20 text-amber-300" : "bg-black/20 text-white/40 hover:text-white/60"}`}
                >
                  By SPUMP
                </button>
              </div>
            </div>

            {calcMode === "usd" ? (
              <div>
                <p className="mb-1.5 text-xs text-white/40 uppercase tracking-widest">Enter Amount ({selectedCoin.toUpperCase()})</p>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={enteredValue}
                  onChange={(e) => setEnteredValue(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-white placeholder:text-white/30 outline-none text-sm"
                />
              </div>
            ) : (
              <div>
                <p className="mb-1.5 text-xs text-white/40 uppercase tracking-widest">Enter Desired SPUMP Count</p>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={enteredSpump}
                  onChange={(e) => setEnteredSpump(e.target.value)}
                  placeholder="e.g. 2500"
                  className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-white placeholder:text-white/30 outline-none text-sm"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-center">
              <div className="rounded-lg bg-white/5 border border-white/8 px-3 py-2.5">
                <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">USD Equivalent</p>
                <p className="text-sm font-bold text-white/80">
                  ${usdEquivalent > 0 ? usdEquivalent.toFixed(4) : "0.0000"}
                </p>
              </div>
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 px-3 py-2.5">
                <p className="text-[10px] text-amber-400/70 uppercase tracking-wider mb-0.5">Est. SPUMP</p>
                <p className="text-sm font-bold text-amber-300">
                  {estimatedSpump > 0 ? estimatedSpump.toLocaleString() : "0"}
                </p>
              </div>
              {calcMode === "spump" ? (
                <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/25 px-3 py-2.5">
                  <p className="text-[10px] text-indigo-300/70 uppercase tracking-wider mb-0.5">
                    {selectedCoin.toUpperCase()} to Send
                  </p>
                  <p className="text-sm font-bold text-indigo-300">
                    {tokenAmountToSend
                      ? selectedCoin === "sol" && loadingRate
                        ? "Loading..."
                        : tokenAmountToSend
                      : "—"}
                  </p>
                </div>
              ) : (
                <div className="rounded-lg bg-white/5 border border-white/8 px-3 py-2.5">
                  <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">SOL/USD Rate</p>
                  <p className="text-sm font-bold text-white/80">
                    {selectedCoin === "sol"
                      ? loadingRate ? "..." : solRate ? `$${solRate}` : "N/A"
                      : "N/A"}
                  </p>
                </div>
              )}
            </div>
            <p className="text-white/20 text-xs" suppressHydrationWarning>
              Rate: ${effectiveSpumpPrice.toFixed(6)} USD = 1 SPUMP · All figures are estimates
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "s3",
      number: "03",
      label: "Step 3 of 7",
      title: "Copy the Destination Address",
      icon: "📋",
      accent: "amber",
      content: (
        <div className="space-y-4">
          <p className="text-white/60 text-sm leading-relaxed">
            Copy the Official Treasury Wallet address below. This is the destination for your crypto transfer.
          </p>
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4 space-y-3">
            <p className="text-amber-400 text-xs font-black uppercase tracking-widest">Official Treasury Wallet</p>
            <p className="font-mono text-amber-300/85 text-xs break-all leading-loose bg-black/25 rounded-lg px-3 py-3 border border-amber-500/15 select-all">
              {TREASURY_WALLET}
            </p>
            <button
              onClick={copyWallet}
              className="flex items-center gap-2 bg-amber-500/12 border border-amber-500/35 text-amber-400 text-xs font-black px-4 py-2 rounded-lg cursor-pointer transition-all hover:bg-amber-500/22"
            >
              {copiedWallet ? "✓ Copied!" : "📋 Copy Treasury Address"}
            </button>
          </div>
          <div className="flex items-start gap-2.5 bg-red-500/6 border border-red-500/20 rounded-xl px-4 py-3">
            <span className="text-red-400 shrink-0">⚠️</span>
            <p className="text-red-300/75 text-xs leading-relaxed">
              Verify the address multiple times before confirming. Sending to the wrong address is irreversible.
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "s4",
      number: "04",
      label: "Step 4 of 7",
      title: "Send the Crypto",
      icon: "🚀",
      accent: "purple",
      content: (
        <div className="space-y-3">
          <p className="text-white/60 text-sm leading-relaxed">
            Open your wallet and send your chosen token to the Treasury Wallet address.
          </p>
          {[
            "Open your wallet and tap 'Send'",
            "Select your token: SOL, USDC, or USDT",
            "Paste the Treasury Wallet Address as the recipient",
            "Enter the amount you want to send",
            "Verify the recipient address, amount, and network (Solana) once more",
            "Confirm and submit the transaction",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-b-0">
              <span className="shrink-0 w-5 h-5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-black flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-white/65 text-sm leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      key: "s5",
      number: "05",
      label: "Step 5 of 7",
      title: "Wait for Confirmation",
      icon: "⏳",
      accent: "emerald",
      content: (
        <div className="space-y-4">
          <p className="text-white/60 text-sm leading-relaxed">
            After submitting, wait for the Solana network to confirm your transaction.
          </p>
          {[
            "Wait until the transaction shows 'Success'",
            "After confirming, go to your wallet's Activity or History tab — the transaction should appear there",
            "Do not close the app until you can see the confirmed transaction",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-white/4 last:border-b-0">
              <span className="text-emerald-400 shrink-0 mt-0.5">✓</span>
              <p className="text-white/65 text-sm leading-relaxed">{item}</p>
            </div>
          ))}
          <div className="flex items-center gap-3 rounded-xl bg-emerald-500/8 border border-emerald-500/25 px-4 py-3">
            <span className="text-xl">✅</span>
            <p className="text-white/60 text-sm">
              Look for status:{" "}
              <span className="text-green-400 font-black">SUCCESS</span>
              {" "}in your wallet activity
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "s6",
      number: "06",
      label: "Step 6 of 7",
      title: "Copy Your Transaction Signature",
      icon: "🔏",
      accent: "indigo",
      content: (
        <div className="space-y-3">
          <p className="text-white/60 text-sm leading-relaxed">
            Find and copy the Transaction Signature (TxHash) from your wallet or the Solana explorer.
          </p>
          {[
            "Open the Activity tab in your wallet",
            "Tap on the Scotty Pumpkin transfer to open its details",
            "Click 'View on Explorer' — you will be redirected to SOLSCAN",
            "On SOLSCAN, verify the From address, To address, and amount transferred",
            "Once verified, copy the Transfer Signature shown at the top of the page",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-white/5 last:border-b-0">
              <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-black flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <p className="text-white/65 text-sm leading-relaxed">{item}</p>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-xl bg-blue-500/8 border border-blue-500/25 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔍</span>
              <p className="text-blue-300 font-bold text-xs">View on SOLSCAN</p>
            </div>
            <span className="text-xs font-black px-2.5 py-1 rounded-full border text-blue-400 bg-blue-500/10 border-blue-500/30">
              SOLSCAN
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "s7",
      number: "07",
      label: "Step 7 of 7",
      title: "Verify Signature and Submit",
      icon: "✅",
      accent: "emerald",
      isFinal: true,
      content: (
        <div className="space-y-5">

          {/* Signature Verify */}
          <div className="space-y-3">
            <div>
              <p className="text-emerald-300 text-xs font-black uppercase tracking-widest mb-1">Signature Verify</p>
              <p className="text-white/40 text-xs mb-3">Paste Your Transaction Signature copied from Step 6</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={txHash}
                  onChange={(e) => setTxHash(e.target.value)}
                  placeholder="Enter Your Transfer Signature"
                  disabled={isVerified}
                  className="flex-1 rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-white/85 placeholder:text-white/25 outline-none text-sm disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={verifySignature}
                  disabled={verifying || isVerified || !txHash.trim()}
                  className="rounded-xl border border-amber-400/35 bg-amber-400/15 px-5 py-2.5 text-sm font-black text-amber-300 disabled:opacity-50 hover:bg-amber-400/25 transition-all whitespace-nowrap"
                >
                  {verifying ? "Verifying..." : isVerified ? "✓ Verified" : "Verify"}
                </button>
              </div>
            </div>

            {/* Post-verification response */}
            {isVerified && verifyMeta && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/8 p-4 space-y-3">
                <p className="text-emerald-300 text-xs font-black uppercase tracking-widest">✓ Verification Response</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-white/5 border border-white/8 px-3 py-3">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">1. Token Symbol</p>
                    <p className="text-sm font-black text-white">{verifyMeta.tokenSymbol}</p>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/8 px-3 py-3">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5">2. Token Count</p>
                    <p className="text-sm font-black text-white">{verifyMeta.tokenCount}</p>
                    <p className="text-[9px] text-white/20 mt-0.5">4 decimal places</p>
                  </div>
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 px-3 py-3">
                    <p className="text-[10px] text-amber-400/60 uppercase tracking-wider mb-1.5">3. SPUMP Count</p>
                    <p className="text-sm font-black text-amber-300">{verifyMeta.spumpCount}</p>
                    <p className="text-[9px] text-amber-400/30 mt-0.5">3 decimal places</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Wallet Address */}
          <div className="space-y-2">
            <p className="text-white/70 text-xs font-black uppercase tracking-widest">Enter Your Wallet Address</p>
            <p className="text-white/35 text-xs">This wallet will receive your allocated SPUMP</p>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder="Enter Your Solana Wallet Address"
              className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-white/85 placeholder:text-white/25 outline-none text-sm"
            />
            <p className="text-[11px] text-white/30 leading-relaxed">
              ⚠️ &quot;Your wallet address&quot; means <span className="text-white/50 font-bold">YOUR</span> address, not the destination address you sent to. SPUMP tokens will be delivered here.
            </p>
          </div>

          {/* Submit */}
          {submitted ? (
            <div className="rounded-xl border border-emerald-400/35 bg-emerald-500/10 px-4 py-5 text-center space-y-1.5">
              <p className="text-3xl">🎃</p>
              <p className="text-emerald-300 font-black text-sm">Form Submitted Successfully!</p>
              <p className="text-white/45 text-xs">Your SPUMP allocation is being processed.</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !isVerified || !walletAddress.trim()}
              className="w-full rounded-xl border border-emerald-400/35 bg-linear-to-r from-green-700 to-green-600 px-5 py-3.5 text-sm font-black text-white hover:from-green-600 hover:to-green-500 disabled:opacity-50 transition-all"
            >
              {submitting ? "Submitting..." : "Submit Form"}
            </button>
          )}

          {!isVerified && (
            <p className="text-xs text-white/30 text-center">Verify your signature above before submitting.</p>
          )}
        </div>
      ),
    },
  ];

  return (
    <section className="relative z-10 px-4 py-10 md:py-14 lg:px-10">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── Hero ── */}
        <div className="text-center space-y-3">
          <p className="text-amber-500/70 text-xs font-black uppercase tracking-widest">Step-by-Step Guide</p>
          <h1 className="sp-shimmer-heading text-3xl md:text-4xl font-black">
            Crypto Transfer Guide
          </h1>
          <p className="text-white/45 text-sm leading-relaxed max-w-md mx-auto">
            Send USDC, USDT, or SOL to the address below, then paste your transaction signature to complete the process.
          </p>
        </div>

        {/* ── How it works ── */}
        {/* <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
          <p className="text-white/35 text-xs font-black uppercase tracking-widest">How It Works</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { n: "01", label: "Select token",   sub: "USDC / USDT / SOL on Solana mainnet" },
              { n: "02", label: "Send on-chain",  sub: "Transfer to the destination address below" },
              { n: "03", label: "Get tx sig",     sub: "Copy the base58 signature from your wallet or explorer" },
              { n: "04", label: "Submit below",   sub: "Paste your sig + address to receive tokens" },
            ].map((h) => (
              <div key={h.n} className="space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-white/8 border border-white/10 text-white/55 text-xs font-black flex items-center justify-center mx-auto">
                  {h.n}
                </div>
                <p className="text-white/70 text-[11px] font-bold leading-tight">{h.label}</p>
                <p className="text-white/25 text-[10px] leading-tight">{h.sub}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* ── 7 Steps ── */}
        <div className="space-y-3">
          {STEPS.map((step, idx) => {
            const colors = accentMap[step.accent];
            const isOpen = expandedStep === step.key;
            const nextStep = STEPS[idx + 1];
            return (
              <div
                key={step.key}
                className={`rounded-2xl border overflow-hidden transition-all duration-200 ${
                  isOpen ? `${colors.border} shadow-lg` : "border-white/10 bg-white/5"
                }`}
              >
                {/* Header */}
                <div
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                  onClick={() => toggleStep(step.key)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 border ${colors.num}`}>
                    {step.number}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${colors.text}`}>{step.label}</p>
                    <p className="text-white font-bold text-sm leading-tight">{step.icon} {step.title}</p>
                  </div>
                  {step.isFinal && (
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full border text-amber-400 bg-amber-500/10 border-amber-500/30 shrink-0">
                      FINAL
                    </span>
                  )}
                  <svg
                    className={`shrink-0 w-4 h-4 text-white/30 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Body */}
                {isOpen && (
                  <div className={`px-5 pb-5 pt-4 border-t border-white/6 ${colors.bg}`}>
                    {step.content}
                    {nextStep && (
                      <button
                        type="button"
                        onClick={() => setExpandedStep(nextStep.key)}
                        className={`mt-5 text-xs font-bold cursor-pointer bg-transparent border-none ${colors.text}`}
                      >
                        Next: {nextStep.label} — {nextStep.title} →
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── Divider ── */}
        <div className="sp-divider" />

        {/* ── Footer ── */}
        <div className="sp-footer-note rounded-2xl p-6 text-center space-y-2">
          <p className="text-white/50 text-sm">
            Need help? Contact{" "}
            <span className="text-purple-300 font-medium">support@scottypumpkin.com</span>
          </p>
          <p className="text-white/25 text-xs">
            Scotty Pumpkin · SPUMP is a utility token — not a financial instrument
          </p>
        </div>

      </div>
    </section>
  );
}