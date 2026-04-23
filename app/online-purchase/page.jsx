"use client";
import { useCallback, useEffect, useState } from "react";
import OnlinePurchase from "./OnlinePurchase";
import OnlinePurchaseHelpGuide from "./OnlinePurchaseHelpGuide";

const SPUMP_TOKEN = "AKdCsQHoLKCpu3n2QcMS3BK8vQTWDcSDpujLr8UjeyNT";
const DEFAULT_SPUMP_PRICE = 0.01;

export default function Page() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("experienced");
  const [spumpPriceUsd, setSpumpPriceUsd] = useState(DEFAULT_SPUMP_PRICE);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    async function fetchSpumpPrice() {
      try {
        const response = await fetch(
          `https://api-v3.raydium.io/mint/price?mints=${SPUMP_TOKEN}`,
          { cache: "no-store" }
        );
        if (!response.ok) return;

        const data = await response.json();
        if(data?.success === true){
          const price = Number(data?.data?.AKdCsQHoLKCpu3n2QcMS3BK8vQTWDcSDpujLr8UjeyNT);
          if (Number.isFinite(price) && price > 0) {
            setSpumpPriceUsd(price);
          }
        }

      
      } catch {
        // Keep fallback price.
      }
    }

    fetchSpumpPrice();
  }, [isMounted]);

  const fetchSolRate = useCallback(async () => {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { cache: "no-store" },
    );
    if (!response.ok) throw new Error("Unable to fetch SOL rate.");

    const result = await response.json();
    const rate = Number(result?.solana?.usd || 0);
    if (!rate) throw new Error("Invalid SOL rate response.");
    return rate;
  }, []);

  const verifySignatureRequest = useCallback(async (txHash) => {
    const response = await fetch("/api/crypto-transfer/signature-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txHash }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.message || "Signature verification failed.");
    }
    return result;
  }, []);

  const submitCryptoTransfer = useCallback(async (payload) => {
    const response = await fetch("/api/crypto-transfer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.message || "Failed to submit crypto form.");
    }
    return result;
  }, []);

  return (
    <div>
      {/* Tab Navigation */}
      <div className="max-w-2xl mx-auto px-4 md:px-10">
        <div className="flex justify-center gap-2 py-4">
          <button
            onClick={() => setActiveTab("experienced")}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
              activeTab === "experienced"
                ? "bg-emerald-400/20 border border-emerald-400/35 text-emerald-300"
                : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
            }`}
          >
            ⚡ Experienced User
          </button>

          <button
            onClick={() => setActiveTab("firsttime")}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
              activeTab === "firsttime"
                ? "bg-amber-400/20 border border-amber-400/35 text-amber-300"
                : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
            }`}
          >
            📚 First Time Here?
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "firsttime" && (
          <OnlinePurchaseHelpGuide
            spumpPriceUsd={spumpPriceUsd}
            fetchSolRateAction={fetchSolRate}
            verifySignatureRequest={verifySignatureRequest}
            submitCryptoTransfer={submitCryptoTransfer}
          />
        )}
        {activeTab === "experienced" && (
          <OnlinePurchase
            spumpPriceUsd={spumpPriceUsd}
            fetchSolRateAction={fetchSolRate}
            verifySignatureRequest={verifySignatureRequest}
            submitCryptoTransfer={submitCryptoTransfer}
          />
        )}
      </div>
    </div>
  );
}
