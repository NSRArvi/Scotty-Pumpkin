"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Container from "../../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";
import BuyModal from "@/app/components/BuyModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-black/5 rounded-xl ${className}`} />;
}

export default function NftDetailPage() {
  const params                        = useParams();
  const mintAddress                   = params?.mint_address;
  const { connected, walletAddress }  = useSolanaWallet();

  const [nft, setNft]               = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [toast, setToast]           = useState("");

  useEffect(() => {
    if (!mintAddress) return;
    fetch(`${API_URL}/nft/${mintAddress}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setNft(d.data); else setError("NFT not found."); })
      .catch(() => setError("Failed to load NFT."))
      .finally(() => setLoading(false));
  }, [mintAddress]);

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
                  <div className="rounded-2xl overflow-hidden border border-black/8 bg-white shadow-sm aspect-square">
                    {nft.image_url ? (
                      <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-black/15">
                        <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} /><path strokeLinecap="round" strokeWidth={1} d="M3 16l5-5 4 4 3-3 6 6" /></svg>
                      </div>
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
                </div>

                {/* Right — Info */}
                <div className="space-y-6">

                  {/* Title & category */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-black/6 border border-black/10 text-black/50 text-[10px] font-semibold uppercase tracking-wider">{nft.category}</span>
                      {nft.is_listed && <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 text-[10px] font-semibold uppercase tracking-wider">Listed</span>}
                      {nft.edition_type === "limited" && <span className="px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-500/20 text-orange-500 text-[10px] font-semibold uppercase tracking-wider">Limited</span>}
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
                          {nft.is_listed ? `${parseFloat(nft.list_price).toFixed(3)} SOL` : "—"}
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
                        <button
                          onClick={() => setShowBuyModal(true)}
                          className="w-full py-4 rounded-xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-400 transition-colors cursor-pointer shadow-xl shadow-orange-500/20"
                        >
                          Buy Now — {parseFloat(nft.list_price).toFixed(3)} SOL
                        </button>
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
