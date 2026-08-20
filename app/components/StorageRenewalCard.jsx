"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Fallbacks only — used until /api/config resolves, or if it fails.
// The admin-configurable platform_wallet / token mint settings are the
// source of truth; a hardcoded env value here can silently drift out of
// sync with what the backend actually verifies payment against.
const FALLBACK_TREASURY_WALLET = process.env.NEXT_PUBLIC_TREASURY_WALLET || "";
const FALLBACK_SPUMP_MINT = process.env.NEXT_PUBLIC_SPUMP_MINT_ADDRESS || "AKdCsQHoLKCpu3n2QcMS3BK8vQTWDcSDpujLr8UjeyNT";
const FALLBACK_USDC_MINT  = process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS || "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

const formatAmount = (n) =>
  Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 });

function formatDate(d) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }); }
  catch (_) { return "—"; }
}

const STATUS_COPY = {
  active:        { label: (until) => `Storage active until ${formatDate(until)}`, cls: "bg-emerald-500/10 border-emerald-500/25 text-emerald-600" },
  expiring_soon: { label: (until) => `Storage expiring date — ${formatDate(until)}`, cls: "bg-amber-500/10 border-amber-500/25 text-amber-600" },
  grace_period:  { label: (until) => `Expired ${formatDate(until)} — grace period`, cls: "bg-red-500/10 border-red-500/25 text-red-600" },
  hidden:        { label: () => "Hidden — storage unpaid", cls: "bg-red-500/10 border-red-500/25 text-red-600" },
};

// Pays another year of storage via a direct SPL transfer to the treasury
// wallet, then confirms with the backend — which independently
// recalculates and verifies the payment on-chain (see
// NftController::renewStorage). Same pattern as the purchase page and
// MarketplaceClient's renewal flow. Handles both classic SPL Token and
// Token-2022 mints.
async function renewNftStorage({ nft, walletAddress, signTransaction, rpcUrl, currency, treasuryWallet, tokenMints, spumpPerUsdc }) {
  const { Connection, PublicKey, Transaction } = await import("@solana/web3.js");
  const {
    getAssociatedTokenAddress, createAssociatedTokenAccountInstruction,
    createTransferInstruction, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID,
  } = await import("@solana/spl-token");

  if (!treasuryWallet) throw new Error("Platform treasury wallet isn't configured.");

  const connection = new Connection(rpcUrl, "confirmed");
  const mintAddr   = currency === "usdc" ? tokenMints.usdcMint : tokenMints.spumpMint;
  if (!mintAddr) throw new Error(`${currency.toUpperCase()} mint isn't configured.`);

  const mintPk     = new PublicKey(mintAddr);
  const buyerPk    = new PublicKey(walletAddress);
  const treasuryPk = new PublicKey(treasuryWallet);

  const mintAccountInfo = await connection.getAccountInfo(mintPk);
  if (!mintAccountInfo) throw new Error("Could not read the payment token's mint account.");
  const tokenProgramId = mintAccountInfo.owner.equals(TOKEN_2022_PROGRAM_ID)
    ? TOKEN_2022_PROGRAM_ID
    : TOKEN_PROGRAM_ID;

  const fromAta = await getAssociatedTokenAddress(mintPk, buyerPk, false, tokenProgramId);
  const toAta   = await getAssociatedTokenAddress(mintPk, treasuryPk, false, tokenProgramId);

  const tx = new Transaction();
  const toAtaInfo = await connection.getAccountInfo(toAta);
  if (!toAtaInfo) {
    tx.add(createAssociatedTokenAccountInstruction(buyerPk, toAta, treasuryPk, mintPk, tokenProgramId));
  }

  // nft.storage_fee_spump is the exact, backend-calculated annual fee
  // for THIS NFT's actual image size (see StorageFeeService — never
  // re-estimated client-side). Convert to USDC via a freshly-fetched
  // live rate right before paying, not a value cached earlier in the
  // component's lifetime, so it can't go stale mid-flow.
  let amount = nft.storage_fee_spump;
  if (currency === "usdc") {
    const rate = spumpPerUsdc ?? await (async () => {
      const priceRes  = await fetch(`${API_URL}/buy/spump-price`);
      const priceData = await priceRes.json();
      if (!priceData?.success || !priceData.spump_per_usdc) {
        throw new Error("Unable to fetch the current SPUMP/USDC rate. Please try again.");
      }
      return priceData.spump_per_usdc;
    })();
    amount = amount / rate;
  }
  const rawAmount = BigInt(Math.round(amount * 10 ** 6));

  tx.add(createTransferInstruction(fromAta, toAta, buyerPk, rawAmount, [], tokenProgramId));

  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.feePayer = buyerPk;

  const signedTx = await signTransaction(tx);
  const signature = await connection.sendRawTransaction(signedTx.serialize(), { skipPreflight: false, preflightCommitment: "confirmed" });
  await connection.confirmTransaction(signature, "confirmed");

  const confirmRes = await fetch(`${API_URL}/nft/${nft.id}/storage/renew`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({ wallet_address: walletAddress, transaction_sig: signature, payment_currency: currency }),
  });
  const confirmData = await confirmRes.json();
  if (!confirmData.success) throw new Error(confirmData.message || "Storage renewal failed to confirm.");
  // nft.id isn't part of the backend's response (NftController::renewStorage
  // only returns { storage_paid_until, renewal_fee_spump }) — attach it here
  // so callers that key off it (e.g. updating one row in a list by id) don't
  // each have to remember to do this themselves.
  return { ...confirmData.data, id: nft.id };
}

/**
 * StorageRenewalCard
 *
 * Shows storage status for one NFT — driven by the backend's
 * authoritative `nft.storage_status` (Nft::getStorageStatusAttribute,
 * computed fresh every request from storage_paid_until + the admin's
 * grace-period setting: active / expiring_soon / grace_period / hidden)
 * — and, if the connected wallet is the current owner, lets them pay
 * for another year at any time (early renewal keeps remaining time and
 * adds a year on top; renewing after expiry starts fresh from today —
 * both handled server-side, see NftController::renewStorage).
 */
export default function StorageRenewalCard({ nft, walletAddress, signTransaction, onRenewed }) {
  const [currency, setCurrency]   = useState("spump");
  const [renewing, setRenewing]   = useState(false);
  const [error, setError]         = useState("");
  const [spumpPerUsdc, setSpumpPerUsdc] = useState(null);

  // Live from /api/config — same platform_wallet / spump_mint / usdc_mint
  // the backend itself reads from, so this can never drift out of sync
  // with what NftController::renewStorage actually verifies payment
  // against.
  const [treasuryWallet, setTreasuryWallet] = useState(FALLBACK_TREASURY_WALLET);
  const [tokenMints, setTokenMints] = useState({ spumpMint: FALLBACK_SPUMP_MINT, usdcMint: FALLBACK_USDC_MINT });

  useEffect(() => {
    fetch(`${API_URL}/buy/spump-price`)
      .then((r) => r.json())
      .then((d) => { if (d?.success) setSpumpPerUsdc(d.spump_per_usdc ?? null); })
      .catch(() => {});
    fetch(`${API_URL}/config`)
      .then((r) => r.json())
      .then((d) => {
        if (!d.success) return;
        if (d.data.platform_wallet) setTreasuryWallet(d.data.platform_wallet);
        if (d.data.spump_mint || d.data.usdc_mint) {
          setTokenMints({
            spumpMint: d.data.spump_mint || FALLBACK_SPUMP_MINT,
            usdcMint:  d.data.usdc_mint  || FALLBACK_USDC_MINT,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Pre-feature NFTs (minted before this existed) have no storage
  // tracking at all — nothing to show.
  if (!nft?.storage_status) return null;

  const isOwner = nft.wallet_address === walletAddress;
  const status  = STATUS_COPY[nft.storage_status];
  const unit    = currency.toUpperCase();

  function toCurrency(amountSpump) {
    if (currency !== "usdc") return amountSpump;
    if (!spumpPerUsdc) return null;
    return amountSpump / spumpPerUsdc;
  }

  async function handleRenew() {
    setError("");
    setRenewing(true);
    try {
      const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
      const rpcUrl  = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
        || (network === "mainnet-beta" ? "https://api.mainnet-beta.solana.com" : "https://api.devnet.solana.com");
      const result = await renewNftStorage({ nft, walletAddress, signTransaction, rpcUrl, currency, treasuryWallet, tokenMints, spumpPerUsdc });
      onRenewed && onRenewed(result);
    } catch (err) {
      console.error("Storage renewal error:", err);
      setError(err.message || "Renewal failed. Please try again.");
    } finally {
      setRenewing(false);
    }
  }

  return (
    <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-6 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {nft.image_url && <img src={nft.image_url} alt={nft.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />}
          <div className="min-w-0">
            <p className="text-black font-semibold truncate">{nft.name || "NFT"}</p>
            <p className="text-black/40 text-xs font-mono truncate">{nft.mint_address || nft.wallet_address}</p>
          </div>
        </div>
        <span className={`shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${status.cls}`}>
          {status.label(nft.storage_paid_until)}
        </span>
      </div>

      {error && (
        <div className="px-3.5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 text-xs">{error}</div>
      )}

      {!isOwner ? (
        <p className="text-black/35 text-xs">
          {nft.storage_status === "hidden"
            ? "This NFT's image may become unavailable — only the current owner can renew its storage."
            : <>Only the current owner (<span className="font-mono">{nft.wallet_address?.slice(0, 4)}...{nft.wallet_address?.slice(-4)}</span>) can renew this NFT's storage.</>}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "spump", icon: "🎃", label: "SPUMP" },
              { id: "usdc",  icon: "💵", label: "USDC" },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCurrency(c.id)}
                className={`py-2 rounded-lg border text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  currency === c.id ? "bg-orange-500 text-white border-orange-500" : "border-black/10 text-black/50 hover:bg-black/5"
                }`}
              >
                <span>{c.icon}</span> {c.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-black/[0.02] border border-black/6 text-sm">
            <span className="text-black/50">1 year renewal ({nft.image_size_bytes ? (nft.image_size_bytes / (1024 * 1024)).toFixed(2) : "?"} MB)</span>
            <span className="text-black/80 font-mono font-medium">
              {toCurrency(nft.storage_fee_spump) === null ? "Loading rate..." : `${formatAmount(toCurrency(nft.storage_fee_spump))} ${unit}`}
            </span>
          </div>

          <button
            onClick={handleRenew}
            disabled={renewing || (currency === "usdc" && !spumpPerUsdc)}
            className="w-full py-3 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20"
          >
            {renewing ? "Processing..." : (currency === "usdc" && !spumpPerUsdc) ? "Loading rate..." : "Renew Storage — 1 More Year"}
          </button>

          <p className="text-black/30 text-[11px] leading-relaxed">
            The exact fee is recalculated at the current rate when you renew. If storage already expired, renewing
            starts a fresh year from today; if it's not expired yet, your remaining time is preserved and the new
            year is added on top.
          </p>
        </>
      )}
    </div>
  );
}
