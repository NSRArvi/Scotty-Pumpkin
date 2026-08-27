"use client";

import { useState, useEffect, useCallback } from "react";
import { useSolanaWallet } from "@/hooks/useWallet";
import { createResilientConnection } from "@/lib/solanaRpc";
import { cn } from "@/lib/utils";

const API_URL    = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const SPUMP_MINT = process.env.NEXT_PUBLIC_SPUMP_MINT || "AKdCsQHoLKCpu3n2QcMS3BK8vQTWDcSDpujLr8UjeyNT";
// Real Solana-native USDC — devnet's USDC test-mint differs from mainnet's.
// Prefer whatever the backend resolves (config('services.tokens.usdc_mint')),
// fetched into `usdcMint` state below; this is just the initial fallback.
const USDC_MINT_FALLBACK =
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet") === "mainnet-beta"
    ? "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    : "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

const CURRENCIES = [
  { id: "sol",   label: "SOL",   icon: "◎" },
  { id: "spump", label: "SPUMP", icon: "🎃" },
  { id: "usdc",  label: "USDC",  icon: "💵" },
];

function formatAmount(n) {
  if (n == null || Number.isNaN(n)) return "—";
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

// Encode raw transaction bytes to base64 without relying on a global
// Buffer (not polyfilled in the browser by default under App Router).
function uint8ToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

// Live rates — spump_per_usdc from /buy/spump-price, sol_per_usdc /
// spump_per_sol from /buy/sol-price. Fetched together and merged into one
// `rates` object so every currency pair (sol↔spump, sol↔usdc, spump↔usdc)
// converts using the SAME source the backend itself uses per pair (see
// BuyController::getConversionFactor) — never a value derived client-side
// from a different pair, which could drift from what /buy/confirm verifies.
async function fetchRates() {
  const [spumpRes, solRes] = await Promise.allSettled([
    fetch(`${API_URL}/buy/spump-price`).then((r) => r.json()),
    fetch(`${API_URL}/buy/sol-price`).then((r) => r.json()),
  ]);

  const spump = spumpRes.status === "fulfilled" ? spumpRes.value : null;
  const sol   = solRes.status   === "fulfilled" ? solRes.value   : null;

  const spumpOk = spump?.success && spump.spump_per_usdc > 0;
  const solOk   = sol?.success && sol.sol_per_usdc > 0 && sol.spump_per_sol > 0;

  if (!spumpOk && !solOk) {
    return { rates: null, error: spump?.message || sol?.message || "Rate temporarily unavailable." };
  }

  return {
    rates: {
      spumpPerUsdc: spumpOk ? spump.spump_per_usdc : null,
      solPerUsdc:   solOk   ? sol.sol_per_usdc     : null,
      spumpPerSol:  solOk   ? sol.spump_per_sol    : null,
    },
    error: null,
  };
}

// Amount of `to` equal in value to `amount` of `from` — mirrors
// BuyController::getConversionFactor() on the backend pair-for-pair, so
// what's shown here always matches what /buy/confirm will independently
// recompute and verify on-chain.
function convertAmount(amount, from, to, rates) {
  if (amount == null || from === to) return amount;
  if (!rates) return null;

  if ((from === "usdc" && to === "spump") || (from === "spump" && to === "usdc")) {
    if (!rates.spumpPerUsdc) return null;
    return from === "usdc" ? amount * rates.spumpPerUsdc : amount / rates.spumpPerUsdc;
  }
  if ((from === "usdc" && to === "sol") || (from === "sol" && to === "usdc")) {
    if (!rates.solPerUsdc) return null;
    return from === "usdc" ? amount * rates.solPerUsdc : amount / rates.solPerUsdc;
  }
  if ((from === "spump" && to === "sol") || (from === "sol" && to === "spump")) {
    if (!rates.spumpPerSol) return null;
    return from === "spump" ? amount / rates.spumpPerSol : amount * rates.spumpPerSol;
  }
  return null;
}

function isValidWallet(w) {
  return w && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(w);
}

/**
 * Compact buy-now modal — same purchase contract as
 * purchase/[mint_address]/page.jsx (signed_tx + payment_currency,
 * co-signed and broadcast server-side), just condensed for in-page use.
 * Any change to how a purchase is built/verified should stay in sync
 * with that page.
 */
export default function BuyModal({ nft, buyerWallet, onClose, onSuccess }) {
  const { signTransaction } = useSolanaWallet();

  const [step, setStep]   = useState("confirm"); // confirm | paying | verifying | done | error
  const [error, setError] = useState("");
  const [txSig, setTxSig] = useState("");

  const [pricing, setPricing]   = useState(null);
  const [selected, setSelected] = useState(
    ["sol", "spump", "usdc"].includes(nft?.list_currency) ? nft.list_currency : "sol"
  );
  const [rates, setRates]             = useState(null);
  const [rateLoading, setRateLoading] = useState(false);
  const [usdcMint, setUsdcMint]       = useState(USDC_MINT_FALLBACK);

  // Resolve the actual USDC mint this deployment uses.
  useEffect(() => {
    fetch(`${API_URL}/config`)
      .then((r) => r.json())
      .then((d) => { if (d?.success && d.data?.usdc_mint) setUsdcMint(d.data.usdc_mint); })
      .catch(() => {});
  }, []);

  // Authoritative pricing preview — seller/platform/royalty split,
  // discount eligibility, etc. Re-fetched again right before building the
  // transaction in handleBuy() so nothing here is trusted for the actual
  // on-chain amounts.
  useEffect(() => {
    if (!nft?.id) return;
    fetch(`${API_URL}/buy/prepare/${nft.id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.success) {
          setPricing(d.data);
          if (!["sol", "spump", "usdc"].includes(selected)) setSelected(d.data.list_currency);
        }
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nft?.id]);

  const loadRate = useCallback(() => {
    setRateLoading(true);
    fetchRates()
      .then((r) => { if (r.rates) setRates(r.rates); })
      .finally(() => setRateLoading(false));
  }, []);

  useEffect(() => {
    loadRate();
    const id = setInterval(loadRate, 30_000);
    return () => clearInterval(id);
  }, [loadRate]);

  const listCurrency       = pricing?.list_currency ?? (nft?.list_currency || "sol");
  const priceAfterDiscount = pricing?.price_after_discount ?? nft?.list_price ?? 0;
  const platformFee        = pricing?.platform_fee ?? 0;
  const royaltyAmount      = pricing?.royalty_amount ?? 0;
  const isResale           = pricing?.is_resale ?? false;
  const sellerReceives     = pricing?.seller_receives ?? 0;
  const isDiscountEligible = pricing?.is_discount_eligible ?? false;
  const buyerDiscountPct   = pricing?.buyer_discount_percent ?? 0;

  const displayTotal   = convertAmount(priceAfterDiscount, listCurrency, selected, rates);
  const displaySeller  = convertAmount(sellerReceives, listCurrency, selected, rates);
  const displayFee     = convertAmount(platformFee, listCurrency, selected, rates);
  const displayRoyalty = convertAmount(royaltyAmount, listCurrency, selected, rates);

  async function handleBuy() {
    setError("");
    setStep("paying");
    try {
      if (!buyerWallet || !signTransaction) {
        throw new Error("Please connect your wallet first.");
      }

      const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
        || (network === "mainnet-beta"
            ? "https://api.mainnet-beta.solana.com"
            : "https://api.devnet.solana.com");

      // Re-fetch pricing right here — not the modal's possibly-stale
      // `pricing` state — so the amounts we actually transfer always
      // match what /buy/confirm will verify on-chain.
      const prepRes  = await fetch(`${API_URL}/buy/prepare/${nft.id}`);
      const prepData = await prepRes.json();
      if (!prepData.success) throw new Error(prepData.message);

      const {
        seller_wallet, creator_wallet, platform_wallet, delegate_wallet,
        platform_fee, royalty_amount, seller_receives, is_resale, list_currency,
      } = prepData.data;

      if (!delegate_wallet) {
        throw new Error("Marketplace transfer isn't configured yet (missing delegate wallet). Please contact support.");
      }

      const { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = await import("@solana/web3.js");
      // Resilient connection: retries a rate-limited (429/403) RPC call
      // with backoff, and permanently falls back to the next configured
      // endpoint if the current one keeps failing.
      const connection  = createResilientConnection(rpcUrl);
      const buyerPubkey = new PublicKey(buyerWallet);

      let tx = new Transaction();

      // All pricing.* amounts above are denominated in `list_currency`
      // (sol, spump, or usdc — sol is the platform's primary/default).
      // If the buyer picked a different currency, convert every leg
      // using freshly-fetched rates right here.
      let ratesNow = rates;
      if (selected !== list_currency) {
        const fresh = await fetchRates();
        if (!fresh.rates || convertAmount(1, list_currency, selected, fresh.rates) == null) {
          throw new Error(fresh.error || "Unable to fetch the current exchange rate. Please try again.");
        }
        ratesNow = fresh.rates;
      }
      const convertFresh = (amount, from, to) => convertAmount(amount, from, to, ratesNow);
      const roundAmt = (n) => Number(n.toFixed(6));

      const sellerAmount   = roundAmt(convertFresh(seller_receives, list_currency, selected));
      const feeAmount      = roundAmt(convertFresh(platform_fee, list_currency, selected));
      const royaltyAmountP = (is_resale && royalty_amount > 0)
        ? roundAmt(convertFresh(royalty_amount, list_currency, selected))
        : 0;

      const sellerPubkey   = isValidWallet(seller_wallet)   ? new PublicKey(seller_wallet)   : null;
      const creatorPubkey  = isValidWallet(creator_wallet)  ? new PublicKey(creator_wallet)  : null;
      const platformPubkey = isValidWallet(platform_wallet) ? new PublicKey(platform_wallet) : null;

      if (selected === "sol") {
        // ── Native SOL payment ─────────────────────────────────────
        function sendSol(toPubkey, amount) {
          if (!amount || amount <= 0) return;
          tx.add(SystemProgram.transfer({
            fromPubkey: buyerPubkey,
            toPubkey,
            lamports:   Math.round(amount * LAMPORTS_PER_SOL),
          }));
        }
        if (sellerPubkey && sellerAmount > 0) sendSol(sellerPubkey, sellerAmount);
        if (creatorPubkey && royaltyAmountP > 0 && is_resale) sendSol(creatorPubkey, royaltyAmountP);
        if (platformPubkey && feeAmount > 0) sendSol(platformPubkey, feeAmount);

      } else {
        // ── SPL Token payment (SPUMP or USDC) ──────────────────────
        const {
          getAssociatedTokenAddress,
          createAssociatedTokenAccountInstruction,
          createTransferInstruction,
          TOKEN_PROGRAM_ID,
          TOKEN_2022_PROGRAM_ID,
          ASSOCIATED_TOKEN_PROGRAM_ID,
        } = await import("@solana/spl-token");

        const payMint     = selected === "usdc" ? usdcMint : SPUMP_MINT;
        const payDecimals = 6; // both SPUMP and USDC use 6 decimals
        const payMintPk   = new PublicKey(payMint);

        // SPUMP/USDC may be a Token-2022 mint rather than the legacy
        // Token program — the ATA derivation, its creation instruction,
        // AND the transfer instruction all need the mint's *actual*
        // owning program, not an assumed one.
        const mintAccountInfo = await connection.getAccountInfo(payMintPk);
        if (!mintAccountInfo) {
          throw new Error("Could not read the payment token's mint account. Please try again.");
        }
        const payTokenProgramId = mintAccountInfo.owner.equals(TOKEN_2022_PROGRAM_ID)
          ? TOKEN_2022_PROGRAM_ID
          : TOKEN_PROGRAM_ID;

        async function sendToken(toPubkey, amount) {
          if (!amount || amount <= 0) return;
          const toAta   = await getAssociatedTokenAddress(payMintPk, toPubkey, false, payTokenProgramId);
          const fromAta = await getAssociatedTokenAddress(payMintPk, buyerPubkey, false, payTokenProgramId);
          const accInfo = await connection.getAccountInfo(toAta);
          if (!accInfo) {
            tx.add(createAssociatedTokenAccountInstruction(
              buyerPubkey, toAta, toPubkey, payMintPk,
              payTokenProgramId, ASSOCIATED_TOKEN_PROGRAM_ID
            ));
          }
          tx.add(createTransferInstruction(
            fromAta, toAta, buyerPubkey,
            BigInt(Math.round(amount * Math.pow(10, payDecimals))),
            [], payTokenProgramId
          ));
        }

        if (sellerPubkey && sellerAmount > 0) await sendToken(sellerPubkey, sellerAmount);
        if (creatorPubkey && royaltyAmountP > 0 && is_resale) await sendToken(creatorPubkey, royaltyAmountP);
        if (platformPubkey && feeAmount > 0) await sendToken(platformPubkey, feeAmount);
      }

      // ── NFT ownership transfer (delegated) ───────────────────────
      const tokenStandard = nft.token_standard || "mpl_core";

      if (tokenStandard === "mpl_core") {
        const { createUmi }        = await import("@metaplex-foundation/umi-bundle-defaults");
        const { publicKey: umiPk, createNoopSigner, signerIdentity } = await import("@metaplex-foundation/umi");
        const { transfer, mplCore, fetchAsset } = await import("@metaplex-foundation/mpl-core");
        const { toWeb3JsInstruction } = await import("@metaplex-foundation/umi-web3js-adapters");

        const umi = createUmi(rpcUrl).use(mplCore());
        // UMI needs *some* valid identity/payer to build instructions
        // with, even though nothing is actually signed through UMI here
        // (the buyer signs the raw web3.js Transaction directly below,
        // and the platform co-signs server-side).
        umi.use(signerIdentity(createNoopSigner(umiPk(buyerWallet))));

        const delegateSigner = createNoopSigner(umiPk(delegate_wallet));

        // Fetch the full asset (not just its pubkey) — the transfer()
        // builder needs its actual on-chain state (collection membership
        // etc.) to assemble the right accounts.
        const assetData = await fetchAsset(umi, umiPk(nft.mint_address));

        const transferInstructions = transfer(umi, {
          asset:     assetData,
          newOwner:  umiPk(buyerWallet),
          authority: delegateSigner,
        }).getInstructions();

        transferInstructions.map(toWeb3JsInstruction).forEach((ix) => tx.add(ix));

      } else {
        // legacy_token_metadata — plain SPL Token, delegated transfer.
        const {
          getAssociatedTokenAddress,
          createAssociatedTokenAccountInstruction,
          createTransferInstruction,
          TOKEN_PROGRAM_ID,
          TOKEN_2022_PROGRAM_ID,
        } = await import("@solana/spl-token");

        const mintPk     = new PublicKey(nft.mint_address);
        const sellerPk   = new PublicKey(seller_wallet);
        const delegatePk = new PublicKey(delegate_wallet);

        const nftMintInfo = await connection.getAccountInfo(mintPk);
        if (!nftMintInfo) {
          throw new Error("Could not read this NFT's mint account. Please try again.");
        }
        const nftTokenProgramId = nftMintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)
          ? TOKEN_2022_PROGRAM_ID
          : TOKEN_PROGRAM_ID;

        const sellerAta = await getAssociatedTokenAddress(mintPk, sellerPk, false, nftTokenProgramId);
        const buyerAta  = await getAssociatedTokenAddress(mintPk, buyerPubkey, false, nftTokenProgramId);

        const buyerAtaInfo = await connection.getAccountInfo(buyerAta);
        if (!buyerAtaInfo) {
          tx.add(createAssociatedTokenAccountInstruction(
            buyerPubkey, buyerAta, buyerPubkey, mintPk, nftTokenProgramId
          ));
        }

        tx.add(createTransferInstruction(
          sellerAta, buyerAta, delegatePk, 1, [], nftTokenProgramId
        ));
      }

      const { blockhash } = await connection.getLatestBlockhash("confirmed");
      tx.recentBlockhash  = blockhash;
      tx.feePayer         = buyerPubkey;

      // Buyer signs their part only — the platform's signature slot
      // (for the NFT-transfer instruction's authority) stays empty
      // until the backend fills it in.
      const signedTx = await signTransaction(tx);
      const base64Tx = uint8ToBase64(signedTx.serialize({ requireAllSignatures: false }));

      setStep("verifying");

      // Backend co-signs (as delegate) + broadcasts + verifies payment +
      // updates ownership — all in this one call.
      const confirmRes = await fetch(`${API_URL}/buy/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nft_id:           nft.id,
          buyer_wallet:     buyerWallet,
          signed_tx:        base64Tx,
          payment_currency: selected, // "sol" | "spump" | "usdc" — backend recomputes every amount itself
        }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmData.success) throw new Error(confirmData.message);

      setTxSig(confirmData.data?.transaction_sig || "");
      setStep("done");
      onSuccess && onSuccess(confirmData.data);

    } catch (err) {
      console.error("Buy error:", err);
      const raw = err?.message || "";
      let msg   = raw || "Something went wrong. Please try again.";
      if (raw.includes("Attempt to debit") || raw.includes("insufficient funds") || raw.includes("Insufficient funds"))
        msg = `Insufficient ${selected.toUpperCase()} balance. Please add more ${selected.toUpperCase()} tokens.`;
      else if (raw.includes("User rejected") || raw.includes("User declined")) msg = "Transaction was cancelled.";
      else if (raw.includes("Transport") || raw.includes("transport"))          msg = "Wallet connection issue. Please refresh and reconnect.";
      else if (raw.includes("blockhash"))                                        msg = "Network is busy. Please try again.";
      else if (raw.includes("Simulation failed"))                               msg = "Transaction failed. Please check your balance.";
      else if (raw.includes("not confirmed") || raw.includes("timeout"))        msg = "Transaction taking longer than expected. Check your wallet.";
      else if (raw.includes("Invalid public key"))                               msg = "Invalid wallet address. Please check and try again.";
      else if (raw.includes("TokenAccountNotFound") || raw.includes("token account")) msg = "Token account not found. Make sure you have the right tokens.";
      setError(msg);
      setStep("error");
    }
  }

  if (!nft) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-primary-bg border border-white/10 rounded-2xl w-full max-w-md p-6 relative">
        {step !== "paying" && step !== "verifying" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition"
            aria-label="Close"
          >
            ✕
          </button>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          {nft.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={nft.image_url} alt={nft.name} className="w-14 h-14 rounded-lg object-cover border border-white/10" />
          )}
          <div className="min-w-0">
            <p className="text-white font-semibold truncate">{nft.name}</p>
            <p className="text-white/40 text-xs truncate">{nft.mint_address}</p>
          </div>
        </div>

        {(step === "confirm" || step === "error") && (
          <>
            {/* Currency selector */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {CURRENCIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelected(c.id)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border py-2 text-sm font-semibold transition",
                    selected === c.id
                      ? "border-primary bg-primary/10 text-white"
                      : "border-white/10 text-white/50 hover:border-white/25"
                  )}
                >
                  <span className="text-lg leading-none">{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="bg-white/5 rounded-xl p-4 space-y-2 mb-5 text-sm">
              <Row label="Price" value={`${formatAmount(displayTotal)} ${selected.toUpperCase()}`} />
              {isDiscountEligible && buyerDiscountPct > 0 && (
                <Row label={`Buyer discount (${buyerDiscountPct}%)`} value="Applied" muted />
              )}
              {isResale && displayRoyalty > 0 && (
                <Row label="Creator royalty" value={`${formatAmount(displayRoyalty)} ${selected.toUpperCase()}`} muted />
              )}
              {displayFee > 0 && (
                <Row label="Platform fee" value={`${formatAmount(displayFee)} ${selected.toUpperCase()}`} muted />
              )}
              <div className="border-t border-white/10 pt-2">
                <Row label="Seller receives" value={`${formatAmount(displaySeller)} ${selected.toUpperCase()}`} />
              </div>
              {selected !== listCurrency && (
                <p className="text-white/30 text-xs pt-1">
                  {rateLoading && !rates
                    ? "Loading live rate…"
                    : `Listed at ${formatAmount(priceAfterDiscount)} ${listCurrency.toUpperCase()}, converted at the current rate.`}
                </p>
              )}
            </div>

            {step === "error" && error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-3 mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleBuy}
              disabled={!buyerWallet || rateLoading}
              className="w-full py-3 rounded-xl bg-primary text-black font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === "error" ? "Try Again" : `Buy for ${formatAmount(displayTotal)} ${selected.toUpperCase()}`}
            </button>
            <button onClick={onClose} className="w-full py-2 mt-2 text-white/50 text-sm hover:text-white transition">
              Cancel
            </button>
          </>
        )}

        {step === "paying" && (
          <StatusScreen title="Confirm in your wallet" subtitle="Approve the transaction to continue." spinner />
        )}

        {step === "verifying" && (
          <StatusScreen title="Verifying payment…" subtitle="This usually takes a few seconds." spinner />
        )}

        {step === "done" && (
          <div className="text-center py-4">
            <div className="text-5xl mb-3">🎉</div>
            <p className="text-white font-semibold mb-1">Purchase complete!</p>
            <p className="text-white/50 text-sm mb-5">{nft.name} is now in your wallet.</p>
            {txSig && (
              <a
                href={`https://explorer.solana.com/tx/${txSig}${(process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet") === "mainnet-beta" ? "" : "?cluster=devnet"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm underline block mb-5"
              >
                View transaction
              </a>
            )}
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-primary text-black font-bold hover:opacity-90 transition">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, muted }) {
  return (
    <div className="flex items-center justify-between">
      <span className={muted ? "text-white/40" : "text-white/70"}>{label}</span>
      <span className={muted ? "text-white/50" : "text-white font-semibold"}>{value}</span>
    </div>
  );
}

function StatusScreen({ title, subtitle, spinner }) {
  return (
    <div className="text-center py-8">
      {spinner && (
        <div className="w-10 h-10 mx-auto mb-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      )}
      <p className="text-white font-semibold mb-1">{title}</p>
      <p className="text-white/50 text-sm">{subtitle}</p>
    </div>
  );
}
