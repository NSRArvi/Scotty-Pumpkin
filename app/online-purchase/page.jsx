"use client";

import { useState } from "react";
import { Toaster, toast } from "sonner";

function generateRefNo() {
  return `SP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
}

export default function OnlinePurchasePage() {
  const [showRiskModal, setShowRiskModal] = useState(true);
  const [txHash, setTxHash] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [referenceNo, setReferenceNo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitResponse, setSubmitResponse] = useState(null);

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
      const response = await fetch("/api/crypto-transfer/signature-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txHash: txHash.trim() }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Signature verification failed.");
      }

      const verified = result?.txVerification ?? result?.data?.txVerification;
      if (!verified) {
        throw new Error("Signature is not verified.");
      }

      setIsVerified(true);
      setReferenceNo(generateRefNo());

      toast.success(result?.message || "Signature verified successfully.");
    } catch (error) {
      setIsVerified(false);
      setReferenceNo("");
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
      const response = await fetch("/api/crypto-transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || "Failed to submit crypto form.");
      }

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
      <section className="relative z-10 min-h-[60vh] px-4 py-10 md:py-14 lg:px-10">
        <div className="mx-auto w-full max-w-4xl rounded-3xl border border-emerald-400/35 bg-white/5 backdrop-blur-2xl p-6 shadow-[0_0_60px_rgba(74,222,128,0.18)] sm:p-8">
          <div className="text-center">
            <div className="text-6xl mb-3">🎃</div>
            <h2 className="text-2xl font-black text-amber-300">Crypto Form Submitted!</h2>
            <p className="mt-3 text-sm leading-7 text-white/60">
              Your transaction details were verified and recorded successfully.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm text-white/80 space-y-2">
            <p><span className="text-white/50">Message:</span> {submitResponse?.message || "-"}</p>
            <p><span className="text-white/50">Status:</span> {submitResponse?.status || "-"}</p>
            <p className="break-all"><span className="text-white/50">Signature:</span> {submitResponse?.Signature || "-"}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-white/80 sm:grid-cols-2">
            <div><span className="text-white/50">ID:</span> {submitResponse?.data?.id || "-"}</div>
            <div><span className="text-white/50">Reference No:</span> {submitResponse?.data?.referenceNo || referenceNo || "-"}</div>
            <div className="sm:col-span-2 break-all"><span className="text-white/50">TX Hash:</span> {submitResponse?.data?.txHash || txHash || "-"}</div>
            <div><span className="text-white/50">TX Verified:</span> {submitResponse?.data?.txVerification ? "Yes" : "No"}</div>
            <div><span className="text-white/50">Base Coin:</span> {submitResponse?.data?.baseCoin || "-"}</div>
            <div><span className="text-white/50">Base Value:</span> {submitResponse?.data?.baseValue ?? "-"}</div>
            <div><span className="text-white/50">Base Count:</span> {submitResponse?.data?.baseCount ?? "-"}</div>
            <div><span className="text-white/50">Total Base Value:</span> {submitResponse?.data?.totalBaseValue ?? "-"}</div>
            <div><span className="text-white/50">SPUMP Count:</span> {submitResponse?.data?.spumpCount ?? "-"}</div>
            <div><span className="text-white/50">Execution Status:</span> {submitResponse?.data?.ExecutionStatus ? "Yes" : "No"}</div>
            <div className="sm:col-span-2 break-all"><span className="text-white/50">Wallet Address:</span> {submitResponse?.data?.walletAddress || walletAddress || "-"}</div>
            <div className="sm:col-span-2 break-all"><span className="text-white/50">Base Address:</span> {submitResponse?.data?.baseAddress || "-"}</div>
            <div className="sm:col-span-2 break-all"><span className="text-white/50">Execution Signature:</span> {submitResponse?.data?.executionSignature || "-"}</div>
            <div><span className="text-white/50">Block Time:</span> {submitResponse?.data?.blockTime || "-"}</div>
            <div><span className="text-white/50">Created At:</span> {submitResponse?.data?.created_at || "-"}</div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={downloadSubmitDocument}
              className="rounded-xl border border-amber-400/40 bg-amber-400/15 px-5 py-2.5 text-sm font-bold text-amber-300 hover:bg-amber-400/25"
            >
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
        <div className="fixed inset-0 z-120 bg-black/70 backdrop-blur-sm px-4 py-8 flex items-center justify-center">
          <div className="w-full max-w-lg rounded-3xl border border-amber-400/40 bg-[#12061f]/95 p-7 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="text-5xl">⚠️</div>
              <h2 className="text-2xl font-black text-amber-300">Crypto Risk Notice</h2>
              <p className="text-sm leading-7 text-white/65">
                Cryptocurrency values can change rapidly. Confirm transfer details and wallet signature carefully
                before proceeding.
              </p>
              <button
                onClick={() => setShowRiskModal(false)}
                className="w-full rounded-xl border border-emerald-400/35 bg-linear-to-r from-green-700 to-green-600 px-5 py-3.5 text-sm font-bold text-white hover:from-green-600 hover:to-green-500"
              >
                I Understand - Proceed
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="relative z-10 px-4 py-10 md:py-14 lg:px-10">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="text-center space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-400">Buy SPUMP Directly</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Get SPUMP via Crypto Transfer</h1>
            <p className="mx-auto max-w-xl text-sm leading-7 text-white/50">
              Verify transaction signature first, then submit your wallet address.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 space-y-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-400">Step 1 - Signature Verify</p>
            <input
              type="text"
              value={txHash}
              onChange={(event) => setTxHash(event.target.value)}
              placeholder="Enter transaction hash"
              disabled={isVerified}
              className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-white placeholder:text-white/30 outline-none"
            />
            <button
              type="button"
              onClick={verifySignature}
              disabled={verifying || isVerified}
              className="rounded-xl border border-amber-400/35 bg-amber-400/15 px-5 py-2.5 text-sm font-bold text-amber-300 disabled:opacity-50"
            >
              {verifying ? "Verifying..." : isVerified ? "Verified" : "Verify Signature"}
            </button>
            {isVerified ? (
              <p className="text-xs text-emerald-300">Signature verified. Transaction hash is now locked.</p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-2xl p-6 space-y-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-400">Step 2 - Wallet Address</p>

            <div>
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-white/45">Wallet Address</p>
              <input
                type="text"
                value={walletAddress}
                onChange={(event) => setWalletAddress(event.target.value)}
                placeholder="Enter your wallet address"
                className="w-full rounded-xl border border-white/15 bg-black/25 px-4 py-3 text-white placeholder:text-white/30 outline-none"
              />
            </div>
            {referenceNo ? (
              <p className="text-xs text-white/60">Generated reference number: <span className="font-mono text-amber-300">{referenceNo}</span></p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 space-y-4">
            <p className="text-[11px] font-black uppercase tracking-[0.16em] text-emerald-300">Step 3 - Crypto Form Submit</p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !isVerified}
              className="w-full rounded-xl border border-emerald-400/35 bg-linear-to-r from-green-700 to-green-600 px-5 py-3.5 text-sm font-bold text-white hover:from-green-600 hover:to-green-500 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Crypto Form"}
            </button>
            {!isVerified ? (
              <p className="text-xs text-white/50">Please verify signature before submitting.</p>
            ) : null}
          </div>
        </div>
      </section>

      <Toaster position="top-right" richColors closeButton />
    </>
  );
}