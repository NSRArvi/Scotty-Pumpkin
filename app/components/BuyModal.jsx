"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ── base58 encode (pure JS) ───────────────────────────────────────────────
function bytesToBase58(bytes) {
  const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  const digits = Array.from(bytes);
  let result = "";
  while (digits.length > 0) {
    let remainder = 0;
    const newDigits = [];
    for (const d of digits) {
      const val = remainder * 256 + d;
      const q = Math.floor(val / 58);
      remainder = val % 58;
      if (newDigits.length > 0 || q > 0) newDigits.push(q);
    }
    result = ALPHABET[remainder] + result;
    digits.splice(0, digits.length, ...newDigits);
  }
  for (const b of bytes) {
    if (b === 0) result = "1" + result;
    else break;
  }
  return result;
}

function Spinner() {
  return <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />;
}

export default function BuyModal({ nft, buyerWallet, onClose, onSuccess }) {
  const [step, setStep]   = useState("confirm"); // confirm | paying | verifying | done | error
  const [error, setError] = useState("");
  const [txSig, setTxSig] = useState("");

  const platformFee    = (nft.list_price * 3) / 100;
  const sellerReceives = nft.list_price - platformFee;
  const LAMPORTS       = 1_000_000_000;

  async function handleBuy() {
    setError("");
    setStep("paying");

    try {
      // ── ১. Prepare — seller wallet and platform get  wallet  ─────────────
      const prepRes  = await fetch(`${API_URL}/buy/prepare/${nft.id}`);
      const prepData = await prepRes.json();
      if (!prepData.success) throw new Error(prepData.message);

      const { seller_wallet, platform_wallet, list_price, platform_fee } = prepData.data;

      // ── ২. Solana imports ──────────────────────────────────────────────
      const { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } =
        await import("@solana/web3.js");

      const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
      const rpcUrl  = network === "mainnet-beta"
        ? "https://api.mainnet-beta.solana.com"
        : "https://api.devnet.solana.com";

      const connection  = new Connection(rpcUrl, "confirmed");
      const buyerPubkey = new PublicKey(buyerWallet);

      // ── ৩. Transaction build  ──────────────────────────────────────
      const tx = new Transaction();

      // Seller send to (total - platform fee)
      tx.add(
        SystemProgram.transfer({
          fromPubkey: buyerPubkey,
          toPubkey:   new PublicKey(seller_wallet),
          lamports:   Math.floor(sellerReceives * LAMPORTS_PER_SOL),
        })
      );

      // Platform fee  (3%)
      
      if (platform_wallet && platform_wallet.length > 30 && platformFee > 0) {
        tx.add(
          SystemProgram.transfer({
            fromPubkey: buyerPubkey,
            toPubkey:   new PublicKey(platform_wallet),
            lamports:   Math.floor(platformFee * LAMPORTS_PER_SOL),
          })
        );
      }

      // Recent blockhash
      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash  = blockhash;
      tx.feePayer         = buyerPubkey;

      // ── ৪. Phantom  sign ও send ──────────────────────────────────
      const signedTx  = await window.solana.signTransaction(tx);
      const rawTx     = signedTx.serialize();
      const signature = await connection.sendRawTransaction(rawTx, {
        skipPreflight:       false,
        preflightCommitment: "confirmed",
      });

      console.log("Payment tx:", signature);
      setTxSig(signature);
      setStep("verifying");

      // ── ৫. Confirm await ──────────────────────────────────────────────
      await connection.confirmTransaction(signature, "confirmed");

      // ── ৬. Backend  confirm  ───────────────────────────────────
      const confirmRes  = await fetch(`${API_URL}/buy/confirm`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nft_id:          nft.id,
          buyer_wallet:    buyerWallet,
          transaction_sig: signature,
        }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmData.success) throw new Error(confirmData.message);

      setStep("done");
      onSuccess && onSuccess(confirmData.data);

    }  catch (err) {
  console.error("Buy error:", err);
  
  // error message বের করো
  const msg = err?.message 
    || err?.error?.message 
    || (typeof err === "string" ? err : null)
    || JSON.stringify(err)
    || "Unknown error occurred";
    
  setError(msg);
  setStep("error");
}
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/8 flex items-center justify-between">
          <p className="text-white font-bold text-lg">
            {step === "done" ? "Purchase Complete! 🎉" : "Buy NFT"}
          </p>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors cursor-pointer text-xl leading-none">×</button>
        </div>

        <div className="p-6 space-y-5">

          {/* NFT preview */}
          <div className="flex items-center gap-4">
            {nft.image_url ? (
              <img src={nft.image_url} alt={nft.name} className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-white/8 border border-white/10" />
            )}
            <div>
              <p className="text-white font-semibold">{nft.name}</p>
              <p className="text-white/30 text-xs font-mono mt-0.5">
                {nft.mint_address ? `${nft.mint_address.slice(0,6)}...${nft.mint_address.slice(-4)}` : "—"}
              </p>
            </div>
          </div>

          {/* Price breakdown */}
          <div className="rounded-xl bg-white/4 border border-white/8 p-4 space-y-2.5">
            {[
              { label: "NFT Price",     value: `${nft.list_price?.toFixed(4)} SOL` },
              { label: "Platform fee",  value: `-${platformFee.toFixed(4)} SOL`,  dim: true },
              { label: "Seller gets",   value: `${sellerReceives.toFixed(4)} SOL`, dim: true },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-white/40">{row.label}</span>
                <span className={row.dim ? "text-white/40 font-mono" : "text-white font-mono"}>{row.value}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-white/8 flex justify-between">
              <span className="text-orange-400 font-semibold text-sm">You pay</span>
              <span className="text-orange-400 font-bold font-mono">{nft.list_price?.toFixed(4)} SOL</span>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Status steps */}
          {(step === "paying" || step === "verifying") && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Spinner />
              <span className="text-orange-400 text-sm">
                {step === "paying" ? "Waiting for wallet approval..." : "Confirming transaction..."}
              </span>
            </div>
          )}

          {/* Done */}
          {step === "done" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-emerald-400 text-sm font-medium">NFT is now yours!</span>
              </div>
              {txSig && (
                <a
                  href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center text-orange-400 text-xs underline hover:text-orange-300"
                >
                  View transaction on Solana Explorer ↗
                </a>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            {step === "done" ? (
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-400 transition-colors cursor-pointer"
              >
                Done
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  disabled={step === "paying" || step === "verifying"}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-sm font-semibold hover:bg-white/8 transition-all cursor-pointer disabled:opacity-30"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuy}
                  disabled={step === "paying" || step === "verifying"}
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {step === "paying" || step === "verifying" ? <Spinner /> : "Confirm Purchase"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
