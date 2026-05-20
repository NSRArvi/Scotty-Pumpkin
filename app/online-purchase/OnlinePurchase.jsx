import { useEffect, useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import Container from "../components/shared/Container";

const TREASURY_WALLET = "7Q8EjhdB6qakUfhwjBVnNsD6Ks9FsTMVtG7dzE3KopRG";

const COIN_TYPES = [
  { label: "USDC", value: "usdc" },
  { label: "USDT", value: "usdt" },
  { label: "SOL", value: "sol" },
];

function generateRefNo() {
  return `SP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export default function OnlinePurchase({
  spumpPriceUsd = 0.01,
  fetchSolRateAction,
  verifySignatureRequest,
  submitCryptoTransfer,
}) {
  const [showRiskModal, setShowRiskModal] = useState(true);
  const [txHash, setTxHash] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedCoin, setSelectedCoin] = useState("usdc");
  // Calculator — two modes: enter USD amount OR enter desired SPUMP count
  const [calcMode, setCalcMode] = useState("usd"); // "usd" | "spump"
  const [enteredValue, setEnteredValue] = useState(""); // USD/token amount to send
  const [enteredSpump, setEnteredSpump] = useState(""); // desired SPUMP count
  const [solRate, setSolRate] = useState(0);
  const [loadingRate, setLoadingRate] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);
  const [copiedWallet, setCopiedWallet] = useState(false);
  // Post-verification display fields
  const [verifyMeta, setVerifyMeta] = useState(null); // { tokenSymbol, tokenCount, spumpCount }
  const effectiveSpumpPrice =
    Number(spumpPriceUsd) > 0 ? Number(spumpPriceUsd) : 0.01;

  useEffect(() => {
    async function loadSolRate() {
      if (selectedCoin !== "sol") return;
      try {
        setLoadingRate(true);
        const rate = await fetchSolRateAction();
        setSolRate(rate);
      } catch (error) {
        setSolRate(0);
        toast.error(error?.message || "Unable to fetch SOL rate.");
      } finally {
        setLoadingRate(false);
      }
    }
    loadSolRate();
  }, [selectedCoin, fetchSolRateAction]);

  // When mode = "usd": user enters token amount → derive USD + SPUMP
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
  }, [
    enteredValue,
    enteredSpump,
    selectedCoin,
    solRate,
    calcMode,
    effectiveSpumpPrice,
  ]);

  const estimatedSpump = useMemo(() => {
    if (calcMode === "spump") return Number(enteredSpump || 0);
    if (!usdEquivalent) return 0;
    return Math.floor(usdEquivalent / effectiveSpumpPrice);
  }, [usdEquivalent, calcMode, enteredSpump, effectiveSpumpPrice]);

  // Token amount to send when mode = "spump"
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

  function downloadSubmitDocument() {
    if (!submitResponse) return;
    const fileName = `crypto-transfer-${submitResponse?.data?.referenceNo || referenceNo || "document"}.json`;
    const blob = new Blob([JSON.stringify(submitResponse, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function verifySignature() {
    if (!txHash.trim()) {
      toast.error("Transaction hash is required.");
      return;
    }
    try {
      setVerifying(true);
      const result = await verifySignatureRequest(txHash.trim());

      const verified = result?.txVerification ?? result?.data?.txVerification;
      if (!verified) throw new Error("Signature is not verified.");

      setIsVerified(true);
      setReferenceNo(generateRefNo());

      // Build post-verification meta from response
      const tokenSymbol = result?.data?.baseCoin || selectedCoin.toUpperCase();
      const tokenCount = Number(
        result?.data?.baseValue ?? usdEquivalent,
      ).toFixed(4);
      const spumpCount = Number(
        result?.data?.spumpCount ?? estimatedSpump,
      ).toFixed(3);
      setVerifyMeta({ tokenSymbol, tokenCount, spumpCount });

      toast.success(result?.message || "Signature verified successfully.");
    } catch (error) {
      setIsVerified(false);
      setReferenceNo("");
      setVerifyMeta(null);
      toast.error(error?.message || "Unable to verify signature.");
    } finally {
      setVerifying(false);
    }
  }

  async function handleSubmit() {
    if (!isVerified) {
      toast.error("Verify signature first.");
      return;
    }
    if (!walletAddress.trim()) {
      toast.error("Wallet address is required.");
      return;
    }
    const payload = {
      referenceNo,
      walletAddress: walletAddress.trim(),
      txHash: txHash.trim(),
    };
    try {
      setSubmitting(true);
      const result = await submitCryptoTransfer(payload);
      toast.success(result?.message || "Crypto form submitted successfully.");
      setSubmitResponse(result);
      setSubmitted(true);
    } catch (error) {
      toast.error(error?.message || "Unable to submit crypto form.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="relative z-10 min-h-[60vh]  py-10 md:py-14">
        <div className="mx-auto w-full max-w-4xl rounded-3xl border border-emerald-400/35 bg-white/5 backdrop-blur-2xl p-6 sm:p-8">
          <div className="text-center">
            <div className="text-6xl mb-3">🎃</div>
            <h2 className="text-2xl font-black text-amber-300">
              Crypto Form Submitted!
            </h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Your transaction details were verified and recorded successfully.
            </p>
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/80 space-y-2">
            <p>
              <span className="text-white/50">Message:</span>{" "}
              {submitResponse?.message || "-"}
            </p>
            <p>
              <span className="text-white/50">Status:</span>{" "}
              {submitResponse?.status || "-"}
            </p>
            <p className="break-all">
              <span className="text-white/50">Signature:</span>{" "}
              {submitResponse?.Signature || "-"}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-white/80 sm:grid-cols-2">
            <div>
              <span className="text-white/50">ID:</span>{" "}
              {submitResponse?.data?.id || "-"}
            </div>
            <div>
              <span className="text-white/50">Reference No:</span>{" "}
              {submitResponse?.data?.referenceNo || referenceNo || "-"}
            </div>
            <div className="sm:col-span-2 break-all">
              <span className="text-white/50">TX Hash:</span>{" "}
              {submitResponse?.data?.txHash || txHash || "-"}
            </div>
            <div>
              <span className="text-white/50">TX Verified:</span>{" "}
              {submitResponse?.data?.txVerification ? "Yes" : "No"}
            </div>
            <div>
              <span className="text-white/50">Base Coin:</span>{" "}
              {submitResponse?.data?.baseCoin || "-"}
            </div>
            <div>
              <span className="text-white/50">Base Value:</span>{" "}
              {submitResponse?.data?.baseValue ?? "-"}
            </div>
            <div>
              <span className="text-white/50">Base Count:</span>{" "}
              {submitResponse?.data?.baseCount ?? "-"}
            </div>
            <div>
              <span className="text-white/50">Total Base Value:</span>{" "}
              {submitResponse?.data?.totalBaseValue ?? "-"}
            </div>
            <div>
              <span className="text-white/50">SPUMP Count:</span>{" "}
              {submitResponse?.data?.spumpCount ?? "-"}
            </div>
            <div>
              <span className="text-white/50">Execution Status:</span>{" "}
              {submitResponse?.data?.ExecutionStatus ? "Yes" : "No"}
            </div>
            <div className="sm:col-span-2 break-all">
              <span className="text-white/50">Wallet Address:</span>{" "}
              {submitResponse?.data?.walletAddress || walletAddress || "-"}
            </div>
            <div className="sm:col-span-2 break-all">
              <span className="text-white/50">Base Address:</span>{" "}
              {submitResponse?.data?.baseAddress || "-"}
            </div>
            <div className="sm:col-span-2 break-all">
              <span className="text-white/50">Execution Signature:</span>{" "}
              {submitResponse?.data?.executionSignature || "-"}
            </div>
            <div>
              <span className="text-white/50">Block Time:</span>{" "}
              {submitResponse?.data?.blockTime || "-"}
            </div>
            <div>
              <span className="text-white/50">Created At:</span>{" "}
              {submitResponse?.data?.created_at || "-"}
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={downloadSubmitDocument}
              className="rounded-xl border border-amber-400/40 bg-amber-400/15 px-5 py-2.5 text-sm font-bold text-amber-300 hover:bg-amber-400/25">
              Download Document
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {showRiskModal ? (
        <div className="fixed inset-0 z-120 bg-black/70 backdrop-blur-sm  py-8 flex items-center justify-center">
          <div className="w-full max-w-lg rounded-3xl border border-amber-400/40 bg-white p-7 ">
            <div className="text-center space-y-4">
              <div className="text-5xl">⚠️</div>
              <h2 className="text-2xl font-black text-primary">
                Crypto Risk Notice
              </h2>
              <p className="text-sm leading-7 text-secondary/80">
                Cryptocurrency values can change rapidly. Confirm transfer
                details and wallet signature carefully before proceeding.
              </p>
              <button
                onClick={() => setShowRiskModal(false)}
                className="w-full rounded-xl border border-primary bg-primary/90 px-5 py-3.5 text-sm font-bold text-white hover:bg-primary cursor-pointer">
                I Understand - Proceed
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="relative z-10  py-10 md:py-14 px-0!">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
              Receive Your SPUMP Instantly
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-secondary">
              Get SPUMP via Crypto Transfer
            </h1>
            <p className="mx-auto max-w-xl text-sm leading-7 text-secondary/80">
              Send USDC, USDT, or SOL to the address below, then paste your
              transaction signature to complete the process.
            </p>
          </div>

          {/* ── STEP 1 — Choose Token Destination ── */}
          <div className="rounded-2xl border border-white/10 bg-white/80 backdrop-blur-2xl py-6 md:px-4 space-y-5">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
              Step 1 — Choose Token Destination
            </p>

            {/* Token selector */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-secondary/80">
                Select Token to Send
              </p>
              <div className="flex gap-3">
                {COIN_TYPES.map((coin) => (
                  <button
                    key={coin.value}
                    type="button"
                    onClick={() => setSelectedCoin(coin.value)}
                    className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition-all ${
                      selectedCoin === coin.value
                        ? "border-amber-400/60 bg-primary text-white"
                        : "border-white/15 bg-secondary/90 text-white hover:border-secondary/25"
                    }`}>
                    {coin.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination wallet address */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-secondary/80">
                Destination Wallet Address{" "}
                <span className="text-primary normal-case">
                  · Solana Mainnet
                </span>
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-amber-400/25 bg-white/90 px-4 py-3">
                <p className="flex-1 font-mono text-xs text-primary break-all leading-relaxed">
                  {TREASURY_WALLET}
                </p>
                <button
                  type="button"
                  onClick={copyWallet}
                  className="shrink-0 rounded-lg border border-amber-400/35 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all">
                  {copiedWallet ? "✓ Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* ── SPUMP Calculator (dual-mode) ── */}
            <div className="rounded-xl border border-indigo-300/20 bg-white/90 py-4 px-2 space-y-4">
              <div className="flex items-center justify-between">
                <p className="w-full md:w-full text-xs font-black uppercase tracking-[0.12em] text-primary">
                  SPUMP Count Calculator
                </p>
                {/* Mode toggle */}
                <div className="md:w-fit w-full flex rounded-lg border border-white/10 overflow-hidden text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => {
                      setCalcMode("usd");
                      setEnteredSpump("");
                    }}
                    className={`px-3 py-1.5 transition-all ${calcMode === "usd" ? "bg-amber-400/20 text-primary" : "bg-primary/20 text-secondary hover:text-primary/80"}`}>
                    By Amount
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalcMode("spump");
                      setEnteredValue("");
                    }}
                    className={`px-3 py-1.5 transition-all ${calcMode === "spump" ? "bg-amber-400/20 text-primary" : "bg-primary/20 text-secondary hover:text-primary/80"}`}>
                    By SPUMP
                  </button>
                </div>
              </div>

              {calcMode === "usd" ? (
                <div>
                  <p className="mb-1.5 text-xs text-secondary/80 uppercase tracking-widest">
                    Enter Amount ({selectedCoin.toUpperCase()})
                  </p>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={enteredValue}
                    onChange={(e) => setEnteredValue(e.target.value)}
                    placeholder={`e.g. 25`}
                    className="w-full rounded-xl border border-secondary/50 bg-primary/2 px-4 py-3 text-secondary/80 placeholder:text-secondary/80 outline-none text-sm"
                  />
                </div>
              ) : (
                <div>
                  <p className="mb-1.5 text-xs text-secondary/80 uppercase tracking-widest">
                    Enter Desired SPUMP Count
                  </p>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={enteredSpump}
                    onChange={(e) => setEnteredSpump(e.target.value)}
                    placeholder={`e.g. 2500`}
                    className="w-full rounded-xl border border-secondary/50 bg-primary/2 px-4 py-3 text-secondary/80 placeholder:text-secondary/80 outline-none text-sm"
                  />
                </div>
              )}

              {/* Summary */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 text-center">
                <div className="rounded-lg bg-secondary/80 border border-white/8 px-3 py-2.5">
                  <p className="text-[10px] text-white uppercase tracking-wider mb-0.5">
                    USD Equivalent
                  </p>
                  <p className="text-sm font-bold text-white">
                    ${usdEquivalent > 0 ? usdEquivalent.toFixed(4) : "0.0000"}
                  </p>
                </div>
                <div className="rounded-lg bg-primary border border-amber-500/25 px-3 py-2.5">
                  <p className="text-[10px] text-white uppercase tracking-wider mb-0.5">
                    Est. SPUMP
                  </p>
                  <p className="text-sm font-bold text-white">
                    {estimatedSpump > 0 ? estimatedSpump.toLocaleString() : "0"}
                  </p>
                </div>
                {calcMode === "spump" ? (
                  <div className="rounded-lg bg-indigo-500 border border-indigo-500/25 px-3 py-2.5">
                    <p className="text-[10px] text-white uppercase tracking-wider mb-0.5">
                      {selectedCoin.toUpperCase()} to Send
                    </p>
                    <p className="text-sm font-bold text-white">
                      {tokenAmountToSend
                        ? selectedCoin === "sol" && loadingRate
                          ? "Loading..."
                          : tokenAmountToSend
                        : "—"}
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg bg-white/5 border border-white/8 px-3 py-2.5">
                    <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">
                      SOL/USD Rate
                    </p>
                    <p className="text-sm font-bold text-white/80">
                      {selectedCoin === "sol"
                        ? loadingRate
                          ? "..."
                          : solRate
                            ? `$${solRate}`
                            : "N/A"
                        : "N/A"}
                    </p>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-white/25" suppressHydrationWarning>
                Rate: ${effectiveSpumpPrice.toFixed(6)} USD = 1 SPUMP · All
                figures are estimates
              </p>
            </div>
          </div>

          {/* ── STEP 2 — Signature Verify ── */}
          <div className="rounded-2xl border border-white/10 bg-white/80 backdrop-blur-2xl p-6 space-y-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
              Step 2 — Your Detail Signature
            </p>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-secondary/80">
                Signature Verify — Paste Your Transaction Signature
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={txHash}
                  onChange={(event) => setTxHash(event.target.value)}
                  placeholder="Enter Your Transfer Signature"
                  disabled={isVerified}
                  className="w-full rounded-xl border border-secondary/50 bg-primary/2 px-4 py-3 text-secondary/80 placeholder:text-secondary/80 outline-none text-sm"
                />
                <button
                  type="button"
                  onClick={verifySignature}
                  disabled={verifying || isVerified}
                  className="rounded-xl border border-amber-400/35 bg-secondary/10 px-5 py-2.5 text-sm font-bold text-primary disabled:opacity-50 whitespace-nowrap hover:bg-secondary/25 transition-all">
                  {verifying
                    ? "Verifying..."
                    : isVerified
                      ? "✓ Verified"
                      : "Verify"}
                </button>
              </div>
            </div>

            {/* Post-verification response message */}
            {isVerified && verifyMeta && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/8 p-4 space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-emerald-300 mb-3">
                  ✓ Verification Successful
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-white/5 border border-white/8 px-3 py-2.5">
                    <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">
                      Token Symbol
                    </p>
                    <p className="text-sm font-bold text-white">
                      {verifyMeta.tokenSymbol}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/5 border border-white/8 px-3 py-2.5">
                    <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">
                      Token Count
                    </p>
                    <p className="text-sm font-bold text-white">
                      {verifyMeta.tokenCount}
                    </p>
                  </div>
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/25 px-3 py-2.5">
                    <p className="text-[10px] text-amber-400/70 uppercase tracking-wider mb-0.5">
                      SPUMP Count
                    </p>
                    <p className="text-sm font-bold text-amber-300">
                      {verifyMeta.spumpCount}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-emerald-300/60 pt-1">
                  Transaction hash is now locked.
                </p>
              </div>
            )}

            {/* Wallet address */}
            <div>
              <p className="mb-1.5 text-xs font-medium uppercase tracking-[0.12em] text-secondary/80">
                Enter Your Wallet Address
              </p>
              <p className="mb-2 text-[11px] text-secondary/80">
                This wallet will receive your allocated SPUMP
              </p>
              <input
                type="text"
                value={walletAddress}
                onChange={(event) => setWalletAddress(event.target.value)}
                placeholder="Enter Your Solana Wallet Address"
                className="w-full rounded-xl border border-secondary/50 bg-primary/2 px-4 py-3 text-secondary/80 placeholder:text-secondary/80 outline-none text-sm"
              />
              <p className="mt-2 text-[11px] text-red-600 leading-relaxed">
                ⚠️ &quot;Your wallet address&quot; means YOUR address, not the
                destination address you sent to. It&apos;s also where the SPUMP
                tokens will be delivered back to you.
              </p>
            </div>

            {referenceNo ? (
              <p className="text-xs text-white/60">
                Generated reference number:{" "}
                <span className="font-mono text-amber-300">{referenceNo}</span>
              </p>
            ) : null}
          </div>

          {/* ── STEP 3 — Submit ── */}
          <div className="rounded-2xl border border-emerald-400/30 bg-white/80 p-6 space-y-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
              Step 3 — Submit Form
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !isVerified}
              className="w-full rounded-xl border border-primary bg-primary px-5 py-3.5 text-sm font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {submitting ? "Submitting..." : "Submit Form"}
            </button>
            {!isVerified ? (
              <p className="text-xs text-secondary/80">
                Please verify signature before submitting.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
