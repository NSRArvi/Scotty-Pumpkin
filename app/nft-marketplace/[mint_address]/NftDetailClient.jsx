"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Container from "../../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";
import BuyModal from "@/app/components/BuyModal";
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
  const { connected, walletAddress }  = useSolanaWallet();

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
                        IPFS Metadata ↗
                      </a>
                    )}
                  </div>

                  {/* External links — website / Discord / Twitter / Sosay, each optional */}
                  {(nft.external_website || nft.external_discord || nft.external_twitter || nft.external_sosay) && (
                    <div className="flex gap-2 flex-wrap">
                      {nft.external_website && (
                        <a href={nft.external_website} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 bg-white text-black/60 text-xs font-semibold hover:bg-black/5 hover:text-black transition-all">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="9" strokeWidth={1.5} /><path strokeLinecap="round" strokeWidth={1.5} d="M3 12h18M12 3a14 14 0 010 18 14 14 0 010-18z" /></svg>
                          Website
                        </a>
                      )}
                      {nft.external_discord && (
                        <a href={nft.external_discord} target="_blank" rel="noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/10 bg-white text-black/60 text-xs font-semibold hover:bg-black/5 hover:text-black transition-all">
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.056 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.073.073 0 01.078.009c.12.099.246.198.373.292a.077.077 0 01-.006.127c-.598.35-1.22.645-1.873.892a.076.076 0 00-.04.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.84 19.84 0 006.002-3.03.077.077 0 00.032-.055c.5-5.177-.838-9.674-3.549-13.66a.06.06 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.955 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.176 1.094 2.157 2.418 0 1.334-.947 2.419-2.157 2.419z" /></svg>
                          Discord
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
