"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Container from "../../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";
import BuyModal from "@/app/components/BuyModal";
import StorageRenewalCard from "@/app/components/StorageRenewalCard";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const formatSolPrice = (price) => {
  return Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
};
function Skeleton({ className }) {
  return <div className={`animate-pulse bg-black/5 rounded-xl ${className}`} />;
}

export default function NftDetailClient() {
  const params                        = useParams();
  const mintAddress                   = params?.mint_address;
  const { connected, walletAddress, signTransaction } = useSolanaWallet();

  const [nft, setNft]               = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [toast, setToast]           = useState("");
  const [editionListings, setEditionListings] = useState(null); // other copies of the same edition currently for sale
  const [explicitRevealed, setExplicitRevealed] = useState(false);

  useEffect(() => {
    if (!mintAddress) return;
    setEditionListings(null);
    const url = walletAddress
      ? `${API_URL}/nft/${mintAddress}?viewer_wallet=${walletAddress}`
      : `${API_URL}/nft/${mintAddress}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => { if (d.success) setNft(d.data); else setError("NFT not found."); })
      .catch(() => setError("Failed to load NFT."))
      .finally(() => setLoading(false));
  }, [mintAddress, walletAddress]);

  // Once we know the NFT (and it belongs to an edition), fetch every other
  // copy of that same edition that's currently listed — so a buyer looking
  // at one copy's page can see & pick among all available copies.
  useEffect(() => {
    if (!nft?.edition_group_id) return;
    let cancelled = false;
    fetch(`${API_URL}/marketplace/edition/${nft.edition_group_id}/listings`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (d.success) setEditionListings((d.data || []).filter((l) => l.mint_address !== nft.mint_address));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [nft?.edition_group_id, nft?.mint_address]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  const isOwner = nft?.wallet_address === walletAddress;
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
  const explorerBase = network === "mainnet-beta" ? "" : "?cluster=devnet";

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-black">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/4 blur-3xl" />
        <div className="absolute bottom-0 -right-60 w-[500px] h-[500px] rounded-full bg-purple-600/4 blur-3xl" />
      </div>

      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}

      <div className="relative">
        <Container>
          <div className="pt-12 pb-24">

            {/* Back */}
            <a href="/nft-marketplace" className="inline-flex items-center gap-2 text-black/40 text-sm hover:text-black transition-colors mb-8">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Marketplace
            </a>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm mb-8">{error}</div>
            )}

            {loading ? (
              <div className="grid lg:grid-cols-2 gap-10">
                <Skeleton className="aspect-square" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-14 w-full" />
                </div>
              </div>
            ) : nft ? (
              <div className="grid lg:grid-cols-2 gap-10">

                {/* Left — Image */}
                <div className="space-y-4">
                  <div className="rounded-2xl overflow-hidden border border-black/8 bg-white shadow-sm aspect-square relative">
                    {nft.image_url ? (
                      <img src={nft.image_url} alt={nft.name} className={`w-full h-full object-cover transition-all ${nft.is_explicit && !explicitRevealed ? "blur-2xl scale-110" : ""}`} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/15">
                        <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} /><path strokeLinecap="round" strokeWidth={1} d="M3 16l5-5 4 4 3-3 6 6" /></svg>
                      </div>
                    )}
                    {nft.is_explicit && !explicitRevealed && (
                      <button
                        onClick={() => setExplicitRevealed(true)}
                        className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 text-white cursor-pointer"
                      >
                        <span className="text-3xl">🔞</span>
                        <span className="text-sm font-semibold">Sensitive Content</span>
                        <span className="text-xs text-white/70 underline">Click to view</span>
                      </button>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex gap-3">
                    <a href={`https://explorer.solana.com/address/${nft.mint_address}${explorerBase}`} target="_blank" rel="noreferrer"
                      className="flex-1 py-2.5 rounded-xl border border-black/10 bg-white text-black/50 text-xs font-semibold text-center hover:bg-black/5 hover:text-black transition-all">
                      Solana Explorer ↗
                    </a>
                    {nft.metadata_uri && (
                      <a href={nft.metadata_uri} target="_blank" rel="noreferrer"
                        className="flex-1 py-2.5 rounded-xl border border-black/10 bg-white text-black/50 text-xs font-semibold text-center hover:bg-black/5 hover:text-black transition-all">
                        NFT Metadata ↗
                      </a>
                    )}
                  </div>

                  {/* External links — website / Discord / Twitter / Sosay, each optional */}
                  {(nft.external_website || nft.external_social || nft.external_twitter || nft.external_sosay || nft.external_telegram || nft.external_whatsapp) && (
                    <div className="flex gap-2 flex-wrap">
                      {nft.external_website && (
                        <a href={nft.external_website} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 bg-white text-black/60 text-xs font-semibold hover:bg-black/5 hover:text-black transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="9" strokeWidth={1.5} /><path strokeLinecap="round" strokeWidth={1.5} d="M3 12h18M12 3a14 14 0 010 18 14 14 0 010-18z" /></svg>
                          Website
                        </a>
                      )}
                      {nft.external_social && (
                        <a
                          href={nft.external_social}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 bg-white text-black/60 text-xs font-semibold hover:bg-black/5 hover:text-black transition-all"
                        >
                          {/* Social Media Icon */}
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <circle cx="8.5" cy="10" r="1" fill="currentColor" stroke="none" />
                            <circle cx="15.5" cy="10" r="1" fill="currentColor" stroke="none" />
                            <path d="M7.5 14.5c1.2 1.2 2.7 1.8 4.5 1.8s3.3-.6 4.5-1.8" />
                          </svg>

                          Social Media
                        </a>
                      )}
                      {nft.external_twitter && (
                        <a href={nft.external_twitter} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 bg-white text-black/60 text-xs font-semibold hover:bg-black/5 hover:text-black transition-all">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                          Twitter
                        </a>
                      )}
                      {nft.external_sosay && (
                        <a href={nft.external_sosay} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 bg-white text-black/60 text-xs font-semibold hover:bg-black/5 hover:text-black transition-all">
                          {/* Sosay's own live favicon — same Scotty Pumpkin ecosystem, so its real
                              icon renders directly rather than a generic placeholder glyph. */}
                          <img src="https://sosay.org/favicon.ico" alt="" className="w-3.5 h-3.5 rounded-sm" />
                          Sosay
                        </a>
                      )}

                      {nft.external_whatsapp && (
                        <a
                          href={`https://wa.me/${String(nft.external_whatsapp).replace(/\D/g, '').replace(/^0/, '880')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 bg-white text-black/60 text-xs font-semibold hover:bg-black/5 hover:text-black transition-all"
                        >
                          {/* WhatsApp Icon */}
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.5 0 .16 5.34.16 11.91c0 2.1.55 4.15 1.6 5.96L.05 24l6.27-1.64a11.9 11.9 0 005.74 1.47h.01c6.56 0 11.9-5.34 11.9-11.91 0-3.18-1.24-6.17-3.45-8.44zM12.07 21.8a9.87 9.87 0 01-5.03-1.38l-.36-.21-3.72.97.99-3.63-.23-.37a9.84 9.84 0 01-1.51-5.27c0-5.45 4.44-9.89 9.9-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 012.9 7c0 5.45-4.44 9.88-9.93 9.88zm5.42-7.4c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15-.2.3-.77.98-.94 1.18-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.08 4.5.71.31 1.27.49 1.7.63.71.23 1.35.2 1.86.12.57-.08 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.07-.12-.27-.2-.57-.35z" />
                          </svg>

                          WhatsApp
                        </a>
                      )}
                      {nft.external_telegram && (
                        <a
                          href={nft.external_telegram}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 bg-white text-black/60 text-xs font-semibold hover:bg-black/5 hover:text-black transition-all"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21.8 3.2L18.6 20c-.24 1.19-.88 1.48-1.78.92l-4.9-3.61-2.36 2.27c-.26.26-.48.48-.98.48l.35-4.99 9.08-8.2c.4-.35-.09-.55-.62-.2L6.16 13.85 1.3 12.33c-1.06-.33-1.08-1.06.22-1.57L20.5 3.3c.89-.33 1.67.21 1.3-.1z" />
                          </svg>
                          Telegram
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Right — Info */}
                <div className="space-y-6">

                  {/* Title & category */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/6 border border-black/10 text-black/50 text-[10px] font-semibold uppercase tracking-wider">{nft.category}</span>
                      {nft.is_listed && <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 text-[10px] font-semibold uppercase tracking-wider">Listed</span>}
                      {nft.edition_type === "limited" && <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/20 text-orange-500 text-[10px] font-semibold uppercase tracking-wider">Limited</span>}
                      {nft.total_supply > 1 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-black/6 border border-black/10 text-black/50 text-[10px] font-semibold uppercase tracking-wider">
                          Edition #{nft.edition_number || "?"} of {nft.total_supply}
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">{nft.name}</h1>
                    {nft.symbol && <p className="text-black/40 font-mono text-sm mt-1">{nft.symbol}</p>}
                  </div>

                  {/* Description */}
                  {nft.description && (
                    <p className="text-black/60 text-sm leading-relaxed">{nft.description}</p>
                  )}

                  {/* Price */}
                  <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-5 space-y-4">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-black/40 text-xs uppercase tracking-wider mb-1">
                          {nft.is_listed ? "Current Price" : "Not Listed"}
                        </p>
                        <p className="text-orange-500 font-black text-4xl font-mono">
                          {nft.is_listed ? `${formatSolPrice(nft.list_price)} ${(nft.list_currency || "spump").toUpperCase()}` : "—"}
                        </p>
                      </div>
                      {nft.royalty > 0 && (
                        <div className="text-right">
                          <p className="text-black/30 text-xs">Creator Royalty</p>
                          <p className="text-black/60 text-sm font-semibold">{nft.royalty}%</p>
                        </div>
                      )}
                    </div>

                    {/* Buy / Connect */}
                    {nft.is_listed && !isOwner && (
                      connected ? (
                        
                        <Link
                          href={`/purchase/${nft.mint_address}`}
                          className="flex items-center justify-center w-full py-4 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-colors cursor-pointer shadow-xl shadow-orange-500/20"
                        >
                          Buy Now — {formatSolPrice(nft.list_price)} {(nft.list_currency || "spump").toUpperCase()}
                        </Link>
                        
                      ) : (
                        <div className="space-y-2">
                          <p className="text-black/40 text-xs text-center">Connect wallet to buy</p>
                          <WalletButton />
                        </div>
                      )
                    )}
                    {isOwner && (
                      <div className="py-3 rounded-xl border border-black/8 text-center text-black/40 text-sm">
                        You own this NFT
                        {!nft.is_listed && (
                          <a href="/nft-marketplace" className="ml-2 text-orange-500 underline text-xs">List it for sale →</a>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Storage — shows whether this NFT's asset (image/metadata on
                      IPFS) is healthy, expiring soon, or lapsed. Only the current
                      owner (nft.wallet_address, kept in sync on every sale — see
                      BuyController) sees the renew action; everyone else sees the
                      status read-only, which doubles as a trust signal for buyers. */}
                  <StorageRenewalCard
                    nft={nft}
                    walletAddress={walletAddress}
                    signTransaction={signTransaction}
                    onRenewed={(updated) => setNft((prev) => ({ ...prev, storage_paid_until: updated.storage_paid_until, storage_status: "active" }))}
                  />

                  {/* Other copies of this edition currently for sale */}
                  {editionListings && editionListings.length > 0 && (
                    <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-5">
                      <p className="text-black/50 text-xs font-semibold uppercase tracking-wider mb-4">
                        Other Available Copies ({editionListings.length})
                      </p>
                      <div className="space-y-2 max-h-64 overflow-y-auto -mx-1 px-1">
                        {editionListings.map((l) => (
                          <Link
                            key={l.id}
                            href={`/nft-marketplace/${l.mint_address}`}
                            className="flex items-center justify-between gap-3 p-3 rounded-xl border border-black/8 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all"
                          >
                            <span className="text-black/50 text-xs font-semibold">
                              Edition #{l.edition_number || "?"} of {l.total_supply || nft.total_supply}
                            </span>
                            <span className="text-orange-500 font-bold text-sm font-mono">
                              {formatSolPrice(l.list_price)} {(l.list_currency || "spump").toUpperCase()}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-5 space-y-3">
                    <p className="text-black/50 text-xs font-semibold uppercase tracking-wider mb-4">Details</p>
                    {[
                      { label: "Mint Address",  value: `${nft.mint_address?.slice(0,8)}...${nft.mint_address?.slice(-6)}`, mono: true },
                      { label: "Owner",         value: `${nft.wallet_address?.slice(0,8)}...${nft.wallet_address?.slice(-6)}`, mono: true },
                      { label: "Edition",       value: nft.edition_type === "limited" ? `Limited — ${nft.total_supply} copies` : "Unlimited" },
                      { label: "Collection",    value: nft.collection?.name || "None" },
                      { label: "Minted",        value: nft.minted_at ? new Date(nft.minted_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—" },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between items-center text-sm py-2 border-b border-black/6 last:border-0">
                        <span className="text-black/40">{row.label}</span>
                        <span className={`text-black/80 ${row.mono ? "font-mono text-xs" : ""}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Unlockable Content — backend only ever includes this field
                      when ?viewer_wallet= matched the current owner, so no
                      extra ownership check is needed here. */}
                  {nft.unlockable_content && (
                    <div className="rounded-2xl border border-amber-400/30 bg-amber-500/6 shadow-sm p-5 space-y-2">
                      <p className="text-amber-600 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        🔓 Unlockable Content
                      </p>
                      <p className="text-black/70 text-sm whitespace-pre-wrap break-words">{nft.unlockable_content}</p>
                      <p className="text-black/30 text-[11px] italic">Only visible to you, the current owner.</p>
                    </div>
                  )}

                  {/* Traits */}
                  {nft.attributes?.length > 0 && (
                    <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-5">
                      <p className="text-black/50 text-xs font-semibold uppercase tracking-wider mb-4">Traits</p>
                      <div className="grid grid-cols-2 gap-2">
                        {nft.attributes.map((attr, i) => (
                          <div key={i} className="px-3 py-2.5 rounded-xl bg-orange-500/8 border border-orange-500/15 text-center">
                            <p className="text-orange-500/70 text-[10px] uppercase tracking-wider mb-0.5">{attr.trait_type}</p>
                            <p className="text-black/80 text-sm font-semibold">{attr.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

          </div>
        </Container>
      </div>

      {/* Buy Modal */}
      {showBuyModal && nft && (
        <BuyModal
          nft={nft}
          buyerWallet={walletAddress}
          onClose={() => setShowBuyModal(false)}
          onSuccess={() => {
            setShowBuyModal(false);
            showToast("NFT purchased! 🎉");
            // Refresh NFT data
            fetch(`${API_URL}/nft/${mintAddress}`).then(r => r.json()).then(d => { if (d.success) setNft(d.data); });
          }}
        />
      )}
    </div>
  );
}
