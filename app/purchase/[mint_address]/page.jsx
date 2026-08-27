"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/app/components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";

const API_URL    = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const SPUMP_MINT = process.env.NEXT_PUBLIC_SPUMP_MINT || "AKdCsQHoLKCpu3n2QcMS3BK8vQTWDcSDpujLr8UjeyNT";
// Real Solana-native USDC — devnet's USDC test-mint differs from mainnet's.
// Prefer whatever the backend resolves (config('services.tokens.usdc_mint')),
// fetched into `usdcMint` state below; this is just the initial fallback.
const USDC_MINT_FALLBACK =
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet") === "mainnet-beta"
    ? "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    : "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

const formatPrice = (price) => {
  return Number(price || 0).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
};

// Encode raw transaction bytes to base64 without relying on a global
// Buffer polyfill being present in the browser bundle.
function uint8ToBase64(bytes) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

// Live SPUMP/USDC rate — the only exchange rate this page needs now that
// SOL isn't a payment currency. `spump_per_usdc` = how many SPUMP equal
// 1 USDC; used to convert between the two whenever list_currency and the
// buyer's chosen payment_currency differ.
async function fetchSpumpPerUsdc() {
  try {
    const res  = await fetch(`${API_URL}/buy/spump-price`);
    const data = await res.json();
    if (data?.success && data.spump_per_usdc > 0) {
      return { spumpPerUsdc: data.spump_per_usdc, decimals: data.decimals ?? 6, usdcDecimals: data.usdc_decimals ?? 6, source: data.source ?? null, error: null };
    }
    return { spumpPerUsdc: null, error: data?.message || "Rate temporarily unavailable." };
  } catch (_) {
    return { spumpPerUsdc: null, error: "Could not reach the pricing service. Check your connection." };
  }
}

const PAYMENT_METHODS = [
  {
    id: "spump", bold: "SPUMP", icon: "🎃", unit: "SPUMP", active: true,
    border: "border-amber-400/40", bg: "bg-amber-500/8",
    activeBg: "bg-amber-500/12", activeBorder: "border-amber-400/60",
    accentText: "text-amber-500", iconBg: "bg-amber-500/10 border-amber-400/40",
  },
  {
    id: "usdc", bold: "USDC", icon: "💵", unit: "USDC", active: true,
    border: "border-blue-400/40", bg: "bg-blue-500/6",
    activeBg: "bg-blue-500/12", activeBorder: "border-blue-400/60",
    accentText: "text-blue-500", iconBg: "bg-blue-500/10 border-blue-400/40",
  },
];

function Spinner({ className = "w-4 h-4" }) {
  return <div className={`${className} rounded-full border-2 border-white/40 border-t-white animate-spin`} />;
}
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-secondary/8 rounded-xl ${className}`} />;
}
function InfoRow({ icon, label, value, valueClass = "text-secondary font-medium font-mono", border = true }) {
  return (
    <div className={`flex justify-between items-center py-2.5 ${border ? "border-b border-secondary/[0.07]" : ""}`}>
      <span className="text-secondary/60 text-sm font-light flex items-center gap-1.5">
        {icon && <span className="text-xs">{icon}</span>}
        {label}
      </span>
      <span className={`text-sm ${valueClass}`}>{value}</span>
    </div>
  );
}

export default function PurchasePage() {
  const params      = useParams();
  const router      = useRouter();
  const mintAddress = params?.mint_address;
  const { connected, walletAddress, signTransaction } = useSolanaWallet();

  const [nft, setNft]             = useState(null);
  const [loading, setLoading]     = useState(true);
  const [loadError, setLoadError] = useState("");

  // Authoritative pricing (discount/fee/royalty breakdown) comes from
  // the backend — the same calculation the backend will later verify
  // the on-chain payment against. This avoids the frontend showing one
  // number (e.g. "eligible for discount" based on this NFT's own
  // minted_count, which is always 0 or 1) while the backend checks
  // against a different one (collection-wide buyer count).
  const [pricing, setPricing]     = useState(null);
  // Distinguishes "still loading" (pricing === null, priceError === "")
  // from "backend couldn't price this" (priceError set) — without this,
  // a failed /buy/prepare silently left pricing null forever and the UI
  // fell back to a naive, discount/fee-less estimate with no indication
  // anything was wrong.
  const [priceError, setPriceError] = useState("");

  // Platform fee is now a flat SOL amount admin-configures — no longer
  // a percentage, so no state is needed for it here beyond the actual
  // computed amount already carried in `pricing.platform_fee`.
  const [hasBuyerDiscount, setHasBuyerDiscount]         = useState(false);
  const [buyerDiscountPercent, setBuyerDiscountPercent] = useState(0);
  const [buyerDiscountMaxUses, setBuyerDiscountMaxUses] = useState(0);

  const [selected, setSelected]           = useState("spump");
  const [spumpPerUsdc, setSpumpPerUsdc]   = useState(null); // SPUMP units per 1 USDC
  const [rateSource, setRateSource]       = useState(null); // "jupiter" | "raydium" — which source the live rate came from
  const [spumpDecimals, setSpumpDecimals] = useState(6);
  const [usdcDecimals, setUsdcDecimals]   = useState(6);
  const [rateLoading, setRateLoading]     = useState(false);
  const [rateError, setRateError]         = useState("");
  const [usdcMint, setUsdcMint]           = useState(USDC_MINT_FALLBACK);

  const [deliveryMode, setDeliveryMode] = useState("connected");
  const [walletInput, setWalletInput]   = useState("");
  const [confirmed, setConfirmed]       = useState(false);

  const [step, setStep]   = useState("idle");
  const [error, setError] = useState("");
  const [txSig, setTxSig] = useState("");

  // ── Config ────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_URL}/config`)
      .then(r => r.json())
      .then(d => {
        if (!d.success) return;
        if (d.data.usdc_mint) setUsdcMint(d.data.usdc_mint);
      })
      .catch(() => {});
  }, []);

  // ── NFT ───────────────────────────────────────────────────
  useEffect(() => {
    if (!mintAddress) return;
    fetch(`${API_URL}/nft/${mintAddress}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setNft(d.data);
          if (d.data.has_buyer_discount) {
            setHasBuyerDiscount(true);
            setBuyerDiscountPercent(parseFloat(d.data.buyer_discount_percent) || 0);
            setBuyerDiscountMaxUses(d.data.buyer_discount_max_uses || 0);
          }
          if (!d.data.is_listed) setLoadError("This NFT is not currently listed for sale.");
          // Default the payment-method selector to whatever currency this
          // NFT is actually listed in — no conversion needed for the most
          // common case, buyer can still switch.
          if (d.data.list_currency === "usdc") setSelected("usdc");
        } else setLoadError("NFT not found.");
      })
      .catch(() => setLoadError("Failed to load NFT details."))
      .finally(() => setLoading(false));
  }, [mintAddress]);

  // ── Pricing (discount + fee + royalty breakdown, backend-authoritative) ──
  useEffect(() => {
    if (!nft?.id) return;
    fetch(`${API_URL}/buy/prepare/${nft.id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setPricing(d.data);
          setPriceError("");
        } else {
          // Don't silently fall back to the naive (discount/fee-less)
          // estimate below — that showed a plausible-looking but wrong
          // total (e.g. platform fee reading as 0) with no indication
          // the real, backend-computed price couldn't be loaded.
          setPriceError(d.message || "Unable to price this item right now. Please try again shortly.");
        }
      })
      .catch(() => setPriceError("Unable to price this item right now. Please try again shortly."));
  }, [nft?.id]);

  // ── SPUMP/USDC live rate — fetched upfront (not gated on `selected`)
  // since we always need it the moment list_currency and the buyer's
  // chosen currency differ, regardless of which one is picked first.
  // `silent` = true for background polling refreshes, so the "Loading
  // rate..." UI only ever shows on the very first fetch — not every 30s,
  // which would flicker the already-displayed rate for no reason.
  const loadRate = useCallback((silent = false) => {
    if (!silent) setRateLoading(true);
    setRateError("");
    fetchSpumpPerUsdc()
      .then(r => {
        if (r.spumpPerUsdc) {
          setSpumpPerUsdc(r.spumpPerUsdc);
          setSpumpDecimals(r.decimals);
          setUsdcDecimals(r.usdcDecimals);
          setRateSource(r.source);
        } else if (!silent) {
          // Don't blow away an already-good rate with an error just
          // because one background refresh failed — keep showing the
          // last known-good value and try again on the next poll.
          setRateError(r.error || "Rate unavailable.");
        }
      })
      .finally(() => { if (!silent) setRateLoading(false); });
  }, []);

  // Fetch immediately (foreground, shows loading state), then keep
  // polling silently in the background so the displayed rate stays live
  // without the buyer needing to reload the page. 30s matches the
  // backend's own 60s cache — polling faster wouldn't get fresher data,
  // just wasted requests.
  useEffect(() => {
    loadRate(false);
    const intervalId = setInterval(() => loadRate(true), 30000);
    return () => clearInterval(intervalId);
  }, [loadRate]);

  // ── Calculations ──────────────────────────────────────────
  // While `pricing` hasn't loaded yet, fall back to a naive local
  // estimate (no discount/royalty applied) just so the page isn't
  // blank for a moment — it's replaced by the real numbers as soon as
  // /buy/prepare responds.
  const listCurrency = pricing ? pricing.list_currency : (nft?.list_currency || "spump");
  const listPrice  = pricing ? pricing.list_price : (nft ? parseFloat(nft.list_price) : 0);
  const royaltyPct = pricing ? pricing.royalty_percent : (nft ? parseFloat(nft.royalty || 0) : 0);
  const isOwner    = nft?.wallet_address === walletAddress;

  // Buyer discount — eligibility is counted across the whole
  // collection ("first N buyers of the drop"), not this single NFT's
  // own sold state, so it comes straight from the backend.
  const buyersSoFar             = pricing ? pricing.buyers_so_far : 0;
  const isBuyerDiscountEligible = pricing ? pricing.is_discount_eligible : false;
  const buyerDiscountAmount     = pricing ? pricing.buyer_discount_amount : 0;
  const priceAfterBuyerDiscount = pricing ? pricing.price_after_discount : listPrice;

  // Platform fee (backend-calculated, off the discounted price)
  const platformFee = pricing ? pricing.platform_fee : 0;

  // Primary sale নাকি resale
  const creatorWallet = pricing ? pricing.creator_wallet : (nft?.creator_wallet || nft?.creator?.wallet_address || null);
  const sellerWallet  = pricing ? pricing.seller_wallet  : (nft?.wallet_address || null);
  const isResale       = pricing ? pricing.is_resale : false;

  // Royalty শুধু resale এ হবে (backend-calculated, off the discounted price)
  const royaltyAmount = pricing ? pricing.royalty_amount : 0;

  // Seller receives
  const sellerGets = pricing ? pricing.seller_receives : 0;

  // Buyer-discount display values — `pricing` (from /buy/prepare) is the
  // backend-authoritative source, same as buyersSoFar/isBuyerDiscountEligible
  // above. Falling back to the NFT's own has_buyer_discount/percent/max_uses
  // (captured at mint time) only until /buy/prepare responds, so every
  // "X% buyer discount" shown on the page always agrees with each other and
  // with what /buy/confirm will actually verify on-chain.
  const displayBuyerDiscountPercent = pricing ? pricing.buyer_discount_percent : buyerDiscountPercent;
  const displayBuyerDiscountMaxUses = pricing ? pricing.buyer_discount_max_uses : buyerDiscountMaxUses;

  // Total, in list_currency terms
  const totalYouPayListCurrency = priceAfterBuyerDiscount;

  // Convert an amount denominated in `fromCurrency` into `toCurrency`.
  // The only two currencies in the whole app are spump/usdc, so this is
  // just spumpPerUsdc and its inverse.
  function convertCurrency(amount, fromCurrency, toCurrency) {
    if (!amount || fromCurrency === toCurrency) return amount;
    if (!spumpPerUsdc) return null;
    return fromCurrency === "spump"
      ? amount / spumpPerUsdc   // spump -> usdc
      : amount * spumpPerUsdc;  // usdc -> spump
  }

  // For DISPLAY, the raw converted number is shown as-is — no rounding
  // step here at all. formatPrice (up to 9 decimals) renders whatever
  // that number actually is. The 6-decimal rounding SPL tokens require
  // (both SPUMP and USDC use 6 decimals on-chain, matching the
  // backend's round($x, 6)) is only applied where it's actually
  // needed: the real transfer amount built in handlePurchase() below —
  // never here, so display never loses precision the price doesn't
  // actually have.
  const totalYouPay  = convertCurrency(totalYouPayListCurrency, listCurrency, selected);
  const displayTotal = totalYouPay;

  function convertAndRound(amount, fromCurrency, toCurrency) {
    return convertCurrency(amount, fromCurrency, toCurrency);
  }

  // Every row in the Purchase Summary breakdown, converted from
  // list_currency into whatever the buyer actually picked (`selected`) —
  // not just the total. If the buyer picked the same currency the NFT is
  // listed in, these are identical to the raw pricing.* values (no rate
  // needed, no conversion risk).
  const dListPrice              = convertAndRound(listPrice, listCurrency, selected);
  const dBuyerDiscountAmount    = convertAndRound(buyerDiscountAmount, listCurrency, selected);
  const dPriceAfterBuyerDiscount = convertAndRound(priceAfterBuyerDiscount, listCurrency, selected);
  const dPlatformFee            = convertAndRound(platformFee, listCurrency, selected);
  const dRoyaltyAmount          = convertAndRound(royaltyAmount, listCurrency, selected);
  const dSellerGets             = convertAndRound(sellerGets, listCurrency, selected);

  const deliveryWallet        = deliveryMode === "connected" ? walletAddress : walletInput;
  const isValidDeliveryWallet = deliveryWallet && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(deliveryWallet);

  // ── Purchase ──────────────────────────────────────────────
  async function handlePurchase() {
    setError("");
    if (!connected || !walletAddress)           { setError("Please connect your wallet first."); return; }
    if (!confirmed)                             { setError("Please confirm the delivery address is correct."); return; }
    if (!isValidDeliveryWallet)                 { setError("Please enter a valid delivery wallet address."); return; }
    if (isOwner)                                { setError("You cannot buy your own NFT."); return; }
    if (displayTotal == null)                   { setError("Rate not loaded yet. Please wait a moment."); return; }
    if (priceError)                             { setError(priceError); return; }

    setStep("paying");
    try {
      const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
      // Use the configured RPC (Helius etc.) if set — a single purchase
      // makes many calls (mint account reads, ATA lookups, mpl-core
      // asset fetch, blockhash, simulation...) and the public cluster
      // endpoints (api.devnet.solana.com / api.mainnet-beta.solana.com)
      // rate-limit (429) almost immediately under that load.
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
        || (network === "mainnet-beta"
            ? "https://api.mainnet-beta.solana.com"
            : "https://api.devnet.solana.com");

      // Prepare — seller, creator, platform wallet + authoritative pricing.
      // Re-fetched right here (not reusing the page's `pricing` state) so
      // the amounts we actually transfer always match what /buy/confirm
      // will verify on-chain, even if the buyer sat on the page a while
      // and buyers_so_far/rates could have moved.
      const prepRes  = await fetch(`${API_URL}/buy/prepare/${nft.id}`);
      const prepData = await prepRes.json();
      if (!prepData.success) throw new Error(prepData.message);

      const {
        seller_wallet, creator_wallet, platform_wallet,
        price_after_discount, platform_fee, royalty_amount, royalty_percent,
        seller_receives, is_resale, list_currency,
      } = prepData.data;

      const { Connection, PublicKey, Transaction } = await import("@solana/web3.js");
      const connection  = new Connection(rpcUrl, "confirmed");
      const buyerPubkey = new PublicKey(walletAddress);

      function isValidWallet(w) {
        return w && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(w);
      }

      let tx = new Transaction();

      // ── SPL Token Transfer (SPUMP or USDC — the only two payment
      // currencies) ────────────────────────────────────────────────────────────────────
      // All pricing.* amounts above are denominated in `list_currency`
      // (whatever the seller listed in). If the buyer picked the OTHER
      // currency, convert every leg using a freshly-fetched rate right
      // here — not the page's possibly-stale spumpPerUsdc state — so
      // what we actually transfer always matches what /buy/confirm will
      // independently recompute and verify on-chain.
      let rateNow = spumpPerUsdc;
      if (selected !== list_currency) {
        const fresh = await fetchSpumpPerUsdc();
        if (!fresh.spumpPerUsdc) throw new Error(fresh.error || "Unable to fetch the current SPUMP/USDC rate. Please try again.");
        rateNow = fresh.spumpPerUsdc;
      }
      function convertFresh(amount, from, to) {
        if (!amount || from === to) return amount;
        return from === "spump" ? amount / rateNow : amount * rateNow;
      }

      const payMint      = selected === "usdc" ? usdcMint : SPUMP_MINT;
      const payDecimals  = 6; // both SPUMP and USDC use 6 decimals

      // Round to the same 6-decimal precision the backend uses
      // (round($x, 6) in SolanaService/BuyController) — NOT to a whole
      // token. SPUMP list prices under 1 (e.g. 0.92) are valid, and
      // Math.ceil()-ing to the nearest integer here would transfer
      // more than /buy/confirm expects and fail its on-chain
      // verification (or simply overcharge the buyer).
      const roundAmt = (n) => Number(n.toFixed(6));

      const sellerAmount   = roundAmt(convertFresh(seller_receives,       list_currency, selected));
      const feeAmount      = roundAmt(convertFresh(platform_fee,          list_currency, selected));
      const royaltyAmountP = (is_resale && royalty_amount > 0)
        ? roundAmt(convertFresh(royalty_amount, list_currency, selected))
        : 0;
      const totalForConfirm = roundAmt(convertFresh(price_after_discount, list_currency, selected));

      const {
        getAssociatedTokenAddress,
        createAssociatedTokenAccountInstruction,
        createTransferInstruction,
        TOKEN_PROGRAM_ID,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      } = await import("@solana/spl-token");

      const payMintPk = new PublicKey(payMint);

      // SPUMP/USDC on this deployment may be a Token-2022 mint (common
      // for newer/pump.fun-style tokens) rather than the legacy Token
      // program. Hardcoding TOKEN_PROGRAM_ID for a Token-2022 mint is
      // exactly what produced "IncorrectProgramId" in simulation — the
      // ATA derivation, its creation instruction, AND the transfer
      // instruction all need the mint's *actual* owning program, not
      // an assumed one.
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

      const sellerPubkey   = isValidWallet(seller_wallet)   ? new PublicKey(seller_wallet)   : null;
      const creatorPubkey  = isValidWallet(creator_wallet)  ? new PublicKey(creator_wallet)  : null;
      const platformPubkey = isValidWallet(platform_wallet) ? new PublicKey(platform_wallet) : null;

      if (sellerPubkey && sellerAmount > 0) await sendToken(sellerPubkey, sellerAmount);
      if (creatorPubkey && royaltyAmountP > 0 && is_resale) await sendToken(creatorPubkey, royaltyAmountP);
      if (platformPubkey && feeAmount > 0) await sendToken(platformPubkey, feeAmount);

      // ── NFT ownership transfer (delegated) ───────────────────
      // This is what actually moves the NFT on-chain. It's added into
      // the SAME transaction as the payment above, using the platform's
      // delegate wallet as authority (approved when this NFT was
      // listed) — but the platform hasn't signed yet, so its signer
      // slot is left as a placeholder here. The backend adds the
      // platform's real signature and submits it, so payment and
      // ownership transfer succeed or fail together, atomically.
      //
      // Which instruction this needs depends on how the NFT was
      // originally minted: NFTs made in this platform's own Studio are
      // mpl-core assets; imported NFTs are usually the older/most
      // common Solana standard (SPL Token + Token Metadata), which
      // uses a completely different delegate/transfer mechanism.
      const delegateWalletStr = prepData.data.delegate_wallet;
      if (!delegateWalletStr) {
        throw new Error("Marketplace transfer isn't configured yet (missing delegate wallet). Please contact support.");
      }

      const tokenStandard = nft.token_standard || "mpl_core";

      if (tokenStandard === "mpl_core") {
        const { createUmi }        = await import("@metaplex-foundation/umi-bundle-defaults");
        const { publicKey: umiPk, createNoopSigner, signerIdentity } = await import("@metaplex-foundation/umi");
        const { transfer, mplCore, fetchAsset } = await import("@metaplex-foundation/mpl-core");
        const { toWeb3JsInstruction } = await import("@metaplex-foundation/umi-web3js-adapters");

        const umi = createUmi(rpcUrl).use(mplCore());
        // UMI needs *some* valid identity/payer to build instructions
        // with, even though nothing is actually signed through UMI
        // here (the buyer signs the raw web3.js Transaction directly
        // below, and the platform co-signs server-side). A noop signer
        // for the buyer's own pubkey satisfies that without UMI trying
        // to sign anything itself.
        umi.use(signerIdentity(createNoopSigner(umiPk(walletAddress))));

        const delegateSigner = createNoopSigner(umiPk(delegateWalletStr));

        // Fetch the full asset (not just its pubkey) — the transfer()
        // builder needs to know the asset's actual on-chain state
        // (whether it's compressed, whether it belongs to a
        // collection) to assemble the right accounts. Passing a bare
        // pubkey left it guessing and it defaulted into a compressed-
        // asset code path, failing with "Missing compression proof".
        const assetData = await fetchAsset(umi, umiPk(nft.mint_address));

        const transferInstructions = transfer(umi, {
          asset:     assetData,
          newOwner:  umiPk(deliveryWallet),
          authority: delegateSigner,
        }).getInstructions();

        transferInstructions.map(toWeb3JsInstruction).forEach((ix) => tx.add(ix));

      } else {
        // legacy_token_metadata — plain SPL Token, delegated transfer.
        // The platform was approved as delegate (amount 1) when this
        // NFT was listed; createTransferInstruction's "owner" param
        // below is that delegate, which Solana requires to be a
        // signer — same placeholder-signature pattern as above, just
        // filled in by the backend's co-sign step instead of a UMI
        // noop signer.
        const {
          getAssociatedTokenAddress,
          createAssociatedTokenAccountInstruction,
          createTransferInstruction,
          TOKEN_PROGRAM_ID,
          TOKEN_2022_PROGRAM_ID,
        } = await import("@solana/spl-token");

        const mintPk        = new PublicKey(nft.mint_address);
        const sellerPk       = new PublicKey(seller_wallet);
        const delegatePk     = new PublicKey(delegateWalletStr);
        const deliveryPk     = new PublicKey(deliveryWallet);

        // Same reasoning as the SPUMP/USDC payment above: don't assume
        // this NFT's mint is the legacy Token program just because it's
        // not mpl-core — an imported NFT can still be a Token-2022
        // asset, and hardcoding TOKEN_PROGRAM_ID here produces the same
        // "IncorrectProgramId" simulation failure.
        const nftMintInfo = await connection.getAccountInfo(mintPk);
        if (!nftMintInfo) {
          throw new Error("Could not read this NFT's mint account. Please try again.");
        }
        const nftTokenProgramId = nftMintInfo.owner.equals(TOKEN_2022_PROGRAM_ID)
          ? TOKEN_2022_PROGRAM_ID
          : TOKEN_PROGRAM_ID;

        const sellerAta  = await getAssociatedTokenAddress(mintPk, sellerPk, false, nftTokenProgramId);
        const buyerAta   = await getAssociatedTokenAddress(mintPk, deliveryPk, false, nftTokenProgramId);

        const buyerAtaInfo = await connection.getAccountInfo(buyerAta);
        if (!buyerAtaInfo) {
          tx.add(createAssociatedTokenAccountInstruction(
            buyerPubkey, buyerAta, deliveryPk, mintPk,
            nftTokenProgramId
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
      // (for the transfer instruction's authority) stays empty until
      // the backend fills it in.
      const signedTx = await signTransaction(tx);
      const base64Tx = uint8ToBase64(signedTx.serialize({ requireAllSignatures: false }));

      setStep("verifying");

      // Backend co-signs (as delegate) + broadcasts + verifies payment
      // + updates ownership — all in this one call, since submitting
      // and confirming now happens server-side, not from the browser.
      const confirmRes  = await fetch(`${API_URL}/buy/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nft_id:           nft.id,
          buyer_wallet:     deliveryWallet,
          signed_tx:        base64Tx,
          payment_currency: selected, // "spump" | "usdc" — backend recomputes every amount itself
        }),
      });
      const confirmData = await confirmRes.json();
      if (!confirmData.success) throw new Error(confirmData.message);

      setTxSig(confirmData.data?.transaction_sig || "");
      setStep("done");
    } catch (err) {
      console.error("Purchase error:", err);
      const raw = err?.message || "";
      let msg   = "Something went wrong. Please try again.";
      if (raw.includes("Attempt to debit") || raw.includes("insufficient funds") || raw.includes("Insufficient funds"))
        msg = `Insufficient ${selected.toUpperCase()} balance. Please add more ${selected.toUpperCase()} tokens.`;
      else if (raw.includes("User rejected") || raw.includes("User declined")) msg = "Transaction was cancelled.";
      else if (raw.includes("Transport") || raw.includes("transport"))          msg = "Wallet connection issue. Please refresh and reconnect.";
      else if (raw.includes("blockhash"))                                        msg = "Network is busy. Please try again.";
      else if (raw.includes("Simulation failed"))                               msg = "Transaction failed. Please check your balance.";
      else if (raw.includes("not confirmed") || raw.includes("timeout"))        msg = "Transaction taking longer than expected. Check your wallet.";
      else if (raw.includes("Invalid public key"))                               msg = "Invalid wallet address. Please check and try again.";
      else if (raw.includes("TokenAccountNotFound") || raw.includes("token account")) msg = "SPUMP token account not found. Make sure you have SPUMP tokens.";
      setError(msg);
      setStep("error");
    }
  }

  // ── Loading ───────────────────────────────────────────────
  if (loading) {
    return (
      <section className="bg-primary-bg py-20 min-h-screen">
        <Container>
          <div className="grid lg:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <div className="space-y-4"><Skeleton className="h-64" /><Skeleton className="h-48" /></div>
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

  const displayPrice = displayTotal != null
    ? `${formatPrice(displayTotal)} ${selected.toUpperCase()}`
    : "Loading...";

  return (
    <section className="bg-primary-bg py-16 min-h-screen">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* LEFT — plain intro column */}
          <div className="lg:sticky lg:top-16">
            <button onClick={() => router.push("/nft-marketplace")}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/15 text-secondary/60 text-sm font-medium hover:bg-secondary/5 transition-colors cursor-pointer mb-10">
              ← Back to Marketplace
            </button>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-secondary mb-3">
              Complete your purchase
            </h1>
            <p className="text-secondary/50 text-base font-light mb-8">
              Connect your Solana wallet to pay with {selected.toUpperCase()}.
            </p>

            <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-primary/6 border border-primary/15">
              <span className="text-2xl shrink-0">🎃</span>
              <div>
                <p className="text-[11px] font-bold tracking-widest uppercase text-primary mb-1">Scotty Pumpkin Ecosystem</p>
                <p className="text-secondary/60 text-sm leading-relaxed">
                  This NFT is secured on-chain and delivered instantly to your wallet.
                  {isBuyerDiscountEligible && <> Pay now and <span className="font-semibold text-secondary">save {displayBuyerDiscountPercent}%</span> as one of the first {displayBuyerDiscountMaxUses} buyers.</>}
                </p>
              </div>
            </div>

            {loadError && nft && <div className="mt-6 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-600 text-sm">{loadError}</div>}
            {isOwner && <div className="mt-6 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-600 text-sm">You already own this NFT.</div>}

            <div className="hidden lg:flex items-center gap-2 mt-10 text-secondary/40 text-xs">
              <span>🛡️ Secure checkout</span><span>·</span><span>✅ On-chain delivery</span><span>·</span><span>Powered by Scotty Pumpkin</span>
            </div>
          </div>

          {/* RIGHT — single order card */}
          <div className="rounded-3xl border border-secondary/10 bg-white shadow-xl shadow-secondary/5 overflow-hidden">

            {/* Dark header */}
            <div className="bg-[#1a3fcb] from-secondary to-secondary/90 px-6 py-6 text-white">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/50 mb-3">Order Details</p>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center overflow-hidden">
                    {nft?.image_url ? <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" /> : <span className="text-xl">🖼️</span>}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-lg truncate">{nft?.name}</p>
                    <p className="text-white/50 text-xs capitalize">
                      {nft?.category} · {nft?.edition_type === "limited" ? `${nft?.total_supply} editions` : "Unlimited"}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-xl leading-none">
                    {dListPrice != null ? `${formatPrice(dListPrice)}` : "…"}
                  </p>
                  <p className="text-white/50 text-xs mt-1">{selected.toUpperCase()}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-1 border-b border-secondary/[0.07]">
              <div className="flex justify-between items-center py-1.5">
                <span className="text-secondary/50 text-sm">{nft?.edition_type === "limited" ? `1 of ${nft?.total_supply} editions` : "Digital collectible"}</span>
                <span className="text-secondary text-sm font-medium">{dListPrice != null ? `${formatPrice(dListPrice)} ${selected.toUpperCase()}` : "…"}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-secondary font-semibold text-sm">Total</span>
                <span className="text-secondary font-bold text-sm">{dListPrice != null ? `${formatPrice(dListPrice)} ${selected.toUpperCase()}` : "…"}</span>
              </div>

              <div className="mt-3 flex items-center justify-between px-4 py-3.5 rounded-xl bg-primary/6 border border-primary/15">
                <span className="text-[11px] font-bold tracking-widest uppercase text-secondary/50">You Pay</span>
                {rateLoading && (selected === "spump" || selected === "usdc")
                  ? <span className="text-secondary/40 text-sm">Loading...</span>
                  : <span className="text-primary font-extrabold text-xl font-mono">{displayPrice}</span>
                }
              </div>

              <p className="text-secondary/35 text-xs pt-2">
                {connected ? (
                  <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {walletAddress.slice(0,6)}...{walletAddress.slice(-4)} connected</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-secondary/25" /> No wallet connected</span>
                )}
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="px-6 py-5 border-b border-secondary/[0.07]">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-secondary/35 mb-2">Price Breakdown</p>

              {selected !== listCurrency && rateError && !rateLoading && (
                <div className="mb-2 px-3 py-2.5 rounded-lg bg-red-500/8 border border-red-400/20 text-xs text-red-600 flex items-center justify-between gap-3">
                  <span>Rate needed to show these in {selected.toUpperCase()} failed to load: {rateError}</span>
                  <button onClick={loadRate} className="shrink-0 px-2 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 font-semibold cursor-pointer transition-colors">
                    Retry
                  </button>
                </div>
              )}

              <InfoRow icon="🏷️" label="List Price" value={dListPrice != null ? `${formatPrice(dListPrice)} ${selected.toUpperCase()}` : "Loading..."} />

              {isBuyerDiscountEligible && (
                <InfoRow
                  icon="🎉"
                  label={`Buyer Discount (${displayBuyerDiscountPercent}%)`}
                  value={dBuyerDiscountAmount != null ? `−${formatPrice(dBuyerDiscountAmount)} ${selected.toUpperCase()}` : "…"}
                  valueClass="text-emerald-500 font-semibold font-mono"
                />
              )}

              {isBuyerDiscountEligible && (
                <InfoRow icon="🔁" label="After Buyer Discount" value={dPriceAfterBuyerDiscount != null ? `${formatPrice(dPriceAfterBuyerDiscount)} ${selected.toUpperCase()}` : "…"} />
              )}

              <InfoRow
                icon="🔁"
                label="Platform Fee"
                value={dPlatformFee != null ? `${formatPrice(dPlatformFee)} ${selected.toUpperCase()}` : "…"}
                valueClass="text-secondary/50 font-mono"
              />

              {royaltyPct > 0 && isResale && (
                <InfoRow
                  icon="🔗"
                  label={`Creator Royalty (${royaltyPct}%)`}
                  value={dRoyaltyAmount != null ? `${formatPrice(dRoyaltyAmount)} ${selected.toUpperCase()}` : "…"}
                  valueClass="text-purple-500 font-mono"
                />
              )}

              {spumpPerUsdc && (
                <InfoRow
                  icon="🔗"
                  label="Token Rate"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      {`1 USDC ≈ ${spumpPerUsdc.toLocaleString()} SPUMP`}
                      {rateSource && (
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                            rateSource === "jupiter"
                              ? "bg-emerald-500/15 text-emerald-600"
                              : "bg-purple-500/15 text-purple-600"
                          }`}
                          title={rateSource === "jupiter" ? "Live rate from Jupiter" : "Live rate from Raydium (Jupiter unavailable)"}
                        >
                          {rateSource === "jupiter" ? "Jupiter" : "Raydium"}
                        </span>
                      )}
                    </span>
                  }
                  valueClass="text-amber-600 font-mono text-xs"
                />
              )}

              <InfoRow
                icon="💰"
                label="Seller Receives"
                value={dSellerGets != null ? `${formatPrice(dSellerGets)} ${selected.toUpperCase()}` : "…"}
                valueClass="text-secondary/50 font-mono"
                border={false}
              />

              {selected !== listCurrency && (
                <p className="text-secondary/40 text-[11px] italic pt-3">
                  * This NFT is listed at {formatPrice(listPrice)} {listCurrency.toUpperCase()}. Amounts above are converted using the live Jupiter rate.
                </p>
              )}
              {royaltyPct > 0 && (
                <p className="text-secondary/40 text-[11px] italic pt-2">
                  * {royaltyPct}% royalty is automatically sent to the original creator's wallet on every resale.
                </p>
              )}
              {hasBuyerDiscount && displayBuyerDiscountMaxUses > 0 && (
                <div className="mt-3 px-3 py-2 rounded-lg bg-secondary/4 border border-secondary/8 text-xs text-secondary/50">
                  {isBuyerDiscountEligible
                    ? `🎉 ${displayBuyerDiscountPercent}% buyer discount active — ${displayBuyerDiscountMaxUses - buyersSoFar} of ${displayBuyerDiscountMaxUses} spots remaining`
                    : `ℹ️ ${displayBuyerDiscountPercent}% buyer discount was for the first ${displayBuyerDiscountMaxUses} buyers — no longer available`
                  }
                </div>
              )}
              {rateError && !rateLoading && (
                <div className="mt-3 px-3 py-2.5 rounded-lg bg-red-500/8 border border-red-400/20 text-xs text-red-600 flex items-center justify-between gap-3">
                  <span>Couldn't load the live rate: {rateError}</span>
                  <button onClick={loadRate} className="shrink-0 px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500/25 font-semibold cursor-pointer transition-colors">
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Choose Payment Method — styled as selectable "wallet rows" */}
            <div className="px-6 py-5 border-b border-secondary/[0.07]">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-secondary/35 mb-3">Choose Payment Method</p>
              <div className="space-y-2.5">
                {PAYMENT_METHODS.map((m) => {
                  const isActive = selected === m.id;
                  const amt = convertCurrency(totalYouPayListCurrency, listCurrency, m.id);
                  return (
                    <div key={m.id} onClick={() => m.active && setSelected(m.id)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all cursor-pointer ${isActive ? "border-primary/50 bg-primary/5 shadow-sm" : "border-secondary/10 hover:border-secondary/20"}`}>
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-bold shrink-0 ${m.iconBg} border`}>{m.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-secondary text-sm font-semibold">{m.bold}</p>
                        <p className={`text-xs font-light ${m.accentText}`}>
                          {rateLoading ? "Loading rate..." : amt != null ? `≈ ${formatPrice(amt)} ${m.unit}` : "Live rate"}
                        </p>
                      </div>
                      <svg className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-primary" : "text-secondary/25"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isActive ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />}
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Wallet */}
            <div className="px-6 py-5 border-b border-secondary/[0.07] space-y-3">
              <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-secondary/35">NFT Delivery Wallet</p>

              {[
                { mode: "connected", label: "Use Connected Wallet", sub: "(Recommended)" },
              ].map((opt) => (
                <div key={opt.mode} onClick={() => setDeliveryMode(opt.mode)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl border cursor-pointer transition-colors ${deliveryMode === opt.mode ? "bg-primary/6 border-primary/25" : "bg-secondary/3 border-secondary/10 hover:border-secondary/20"}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${deliveryMode === opt.mode ? "border-primary" : "border-secondary/25"}`}>
                    {deliveryMode === opt.mode && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </div>
                  <span className="text-sm text-secondary/70 font-light">
                    {opt.label} {opt.sub && <span className="text-primary/80 text-xs">{opt.sub}</span>}
                  </span>
                </div>
              ))}

              {/* {deliveryMode === "other" && (
                <input
                  className="w-full px-3.5 py-2.5 rounded-xl bg-primary-bg border border-secondary/15 text-secondary text-sm placeholder:text-secondary/30 outline-none focus:border-primary/40 transition-colors"
                  placeholder="Paste Solana wallet address..."
                  value={walletInput}
                  onChange={(e) => setWalletInput(e.target.value)}
                />
              )} */}

              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setConfirmed(v => !v)}>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${confirmed ? "bg-primary border-primary" : "border-secondary/25"}`}>
                  {confirmed && <span className="text-white text-xs font-bold">✓</span>}
                </div>
                <span className="text-secondary/60 text-sm font-light">I confirm this delivery address is correct</span>
              </div>
            </div>

            {/* Connect / Confirm */}
            <div className="px-6 py-5 space-y-3">
              {!connected && (
                <div className="space-y-2">
                  <p className="text-center text-secondary/40 text-xs">Connect a wallet to continue</p>
                  <WalletButton />
                </div>
              )}

              {error && <div className="px-4 py-3 rounded-xl bg-red-500/8 border border-red-400/20 text-red-500 text-xs">{error}</div>}

              {(step === "paying" || step === "verifying") && (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/8 border border-primary/20">
                  <Spinner />
                  <span className="text-primary text-xs font-medium">
                    {step === "paying" ? "Waiting for wallet approval..." : "Confirming on-chain..."}
                  </span>
                </div>
              )}

              {step === "done" ? (
                <div className="space-y-3">
                  <div className="px-4 py-4 rounded-xl bg-green-500/10 border border-green-400/25 text-center space-y-1">
                    <p className="text-green-600 font-bold text-sm">✓ Purchase Complete! 🎉</p>
                    <p className="text-green-600/70 text-xs">The NFT now belongs to your wallet.</p>
                    {royaltyPct > 0 && isResale && (
                        <p className="text-green-600/50 text-xs">
                          {royaltyPct}% royalty sent to creator ✓
                        </p>
                      )}
                  </div>
                  {txSig && (
                    <a href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`} target="_blank" rel="noreferrer"
                      className="block text-center text-primary text-xs underline">
                      View transaction on Solana Explorer ↗
                    </a>
                  )}
                  <button onClick={() => router.push(`/nft-marketplace/${mintAddress}`)}
                    className="w-full py-3.5 rounded-2xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors cursor-pointer">
                    View NFT →
                  </button>
                </div>
              ) : connected ? (
                <>
                <p className="text-black/35 text-[11px] leading-relaxed">
                  *Note: A small amount of SOL is required in the wallet to cover Solana network fees for this purchase.
                </p>
                {priceError && (
                  <p className="text-red-500 text-xs font-medium leading-relaxed">
                    {priceError}
                  </p>
                )}
                <button
                  disabled={step === "paying" || step === "verifying" || isOwner || !nft?.is_listed || displayTotal == null || !!priceError}
                  className={`w-full py-4 rounded-2xl font-semibold text-base text-white tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    (step === "paying" || step === "verifying" || isOwner || !nft?.is_listed || displayTotal == null || !!priceError)
                      ? "bg-secondary/20 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  }`}
                  onClick={handlePurchase}
                >
                  {step === "paying" || step === "verifying" ? (
                    <><Spinner /> Processing...</>
                  ) : priceError ? "Pricing Unavailable"
                    : !nft?.is_listed ? "Not Available"
                    : isOwner ? "You Own This NFT"
                    : displayTotal == null ? "Loading rate..."
                    : `Confirm Purchase — ${displayPrice}`}
                </button>
                </>
              ) : null}

              <p className="text-center text-secondary/35 text-[11px] pt-1">
                🛡️ Secure checkout · ⚡ Instant delivery · Powered by Scotty Pumpkin
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
