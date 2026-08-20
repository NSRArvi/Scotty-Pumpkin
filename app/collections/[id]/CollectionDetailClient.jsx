"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Container from "../../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";
import BuyModal from "@/app/components/BuyModal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const CURRENCY_ICON = { spump: "🎃", usdc: "💵" };

const formatSolPrice = (price) => {
  return Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
};

function Spinner() {
  return <div className="w-5 h-5 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />;
}

// ── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, subColor = "text-orange-500" }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-5 text-center">
      <p className="text-2xl font-black text-black">{value ?? "—"}</p>
      {sub && <p className={`text-sm font-semibold mt-0.5 ${subColor}`}>{sub}</p>}
      <p className="text-black/35 text-xs mt-1">{label}</p>
    </div>
  );
}

// Same card, but for a { spump: 1200, usdc: 5.5 } amount map — shows
// one line per currency instead of a single (possibly-wrong) number.
function CurrencyStatCard({ label, map, color = "text-black" }) {
  const entries = Object.entries(map || {}).filter(([, amt]) => amt > 0);
  return (
    <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-5 text-center">
      {entries.length === 0 ? (
        <p className="text-2xl font-black text-black">—</p>
      ) : (
        entries.map(([cur, amt]) => (
          <p key={cur} className={`text-lg font-black font-mono ${color}`}>
            {CURRENCY_ICON[cur] || ""} {formatSolPrice(amt)} {cur.toUpperCase()}
          </p>
        ))
      )}
      <p className="text-black/35 text-xs mt-1">{label}</p>
    </div>
  );
}

// ── NFT Card ─────────────────────────────────────────────────────────────
function NftCard({ nft, walletAddress, onBuySuccess }) {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const isOwner = nft.wallet_address === walletAddress;

  return (
    <>
      <div className="group rounded-2xl border border-black/8 bg-white shadow-sm hover:shadow-md hover:border-black/15 transition-all overflow-hidden flex flex-col">

        <Link href={`/nft-marketplace/${nft.mint_address || nft.id}`}>
          <div className="relative aspect-square bg-black/4 overflow-hidden cursor-pointer">
            {nft.image_url ? (
              <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-black/10">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} />
                </svg>
              </div>
            )}
            <div className="absolute top-2 left-2">
              <span className="px-2 py-0.5 rounded-full bg-black/50 text-white/70 text-[10px] font-semibold capitalize">{nft.category}</span>
            </div>
            {nft.is_listed && (
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 text-[10px] font-semibold">Listed</span>
              </div>
            )}
          </div>
        </Link>

        <div className="p-4 flex flex-col gap-2 flex-1">
          <Link href={`/nft-marketplace/${nft.mint_address || nft.id}`}>
            <p className="text-black font-semibold text-sm truncate hover:text-orange-500 transition-colors cursor-pointer">{nft.name}</p>
          </Link>
          <p className="text-black/30 text-xs font-mono truncate">
            {nft.mint_address ? `${nft.mint_address.slice(0,6)}...${nft.mint_address.slice(-4)}` : "—"}
          </p>

          {/* Price — in the NFT's actual listed currency (SPUMP/USDC) */}
          <div className="mt-auto pt-2 border-t border-black/5">
            {nft.is_listed ? (
              <div className="mb-2">
                <p className="text-orange-500 font-bold text-base font-mono">
                  {CURRENCY_ICON[nft.list_currency || "spump"]} {formatSolPrice(nft.list_price)} {(nft.list_currency || "spump").toUpperCase()}
                </p>
              </div>
            ) : (
              <p className="text-black/25 text-sm mb-2">Not listed</p>
            )}

            {!isOwner && nft.is_listed && (
              // ── Buy Now → deferant Purchase page ──
              <Link
                href={`/purchase/${nft.mint_address}`}
                className="block w-full py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold text-center hover:bg-orange-400 transition-colors cursor-pointer"
              >
                Buy Now
              </Link>
            )}
            {nft.mint_address && (
              <a
                href={`https://explorer.solana.com/address/${nft.mint_address}?cluster=devnet`}
                target="_blank" rel="noreferrer"
                className="block text-center text-black/25 text-[10px] hover:text-black/50 transition-colors mt-1"
              >
                View on Explorer ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {showBuyModal && (
        <BuyModal
          nft={nft}
          buyerWallet={walletAddress}
          onClose={() => setShowBuyModal(false)}
          onSuccess={() => { setShowBuyModal(false); onBuySuccess?.(); }}
        />
      )}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function CollectionDetailClient() {
  const params    = useParams();
  const id        = params?.id;
  const { connected, walletAddress } = useSolanaWallet();

  const [collection, setCollection] = useState(null);
  const [nfts, setNfts]             = useState([]);
  const [stats, setStats]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [toast, setToast]           = useState("");

  const [category, setCategory] = useState("all");
  const [listed, setListed]     = useState(false);
  const [sort, setSort]         = useState("latest");
  const [page, setPage]         = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const fetchCollection = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, sort });
      if (category !== "all") params.append("category", category);
      if (listed) params.append("listed", "true");
      const res  = await fetch(`${API_URL}/collections/${id}?${params}`);
      const data = await res.json();
      if (data.success) {
        setCollection(data.data.collection);
        setNfts(data.data.nfts.data || []);
        setLastPage(data.data.nfts.last_page || 1);
        setStats(data.data.stats);
      } else {
        setError("Collection not found.");
      }
    } catch { setError("Failed to load collection."); }
    finally { setLoading(false); }
  }, [id, page, sort, category, listed]);

  useEffect(() => { fetchCollection(); }, [fetchCollection]);

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  if (loading && !collection) {
    return (
      <div className="min-h-screen bg-[#F3EFE6] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error && !collection) {
    return (
      <div className="min-h-screen bg-[#F3EFE6] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-black/40 text-lg">{error}</p>
          <Link href="/collections" className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors inline-block">
            ← Back to Collections
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = collection?.wallet_address === walletAddress;

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-black">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/4 blur-3xl" />
      </div>

      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}

      <div className="relative">
        <Container>
          <div className="pt-12 pb-24">

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-black/35 mb-8">
              <Link href="/nft-marketplace" className="hover:text-black transition-colors">Marketplace</Link>
              <span>/</span>
              <Link href="/collections" className="hover:text-black transition-colors">Collections</Link>
              <span>/</span>
              <span className="text-black/60 truncate max-w-[200px]">{collection?.name}</span>
            </div>

            {/* Collection Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="flex items-start gap-4">
                {/* Collection avatar */}
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                  {collection?.image_url
                    ? <img src={collection.image_url} alt={collection.name} className="w-full h-full object-cover" />
                    : "🗂️"
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight">{collection?.name}</h1>
                    {collection?.symbol && (
                      <span className="px-2 py-0.5 rounded-full bg-black/8 text-black/40 text-xs font-mono">{collection.symbol}</span>
                    )}
                  </div>
                  {collection?.description && (
                    <p className="text-black/45 text-sm font-light max-w-xl">{collection.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-black/30 text-xs font-mono">
                      by {collection?.wallet_address?.slice(0,6)}...{collection?.wallet_address?.slice(-4)}
                    </span>
                    {isOwner && (
                      <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-semibold">You</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <WalletButton />
                <Link href="/nft-studio" className="px-4 py-2 rounded-xl border border-orange-500/30 text-orange-500 text-sm font-semibold hover:bg-orange-500/10 transition-colors">
                  + Add NFT
                </Link>
              </div>
            </div>

            {/* Stats — SPUMP / USDC */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
                <StatCard label="Total NFTs"  value={stats.total_nfts} />
                <StatCard label="Listed"      value={stats.listed_count} />
                <CurrencyStatCard label="Floor Price"   map={stats.floor_prices} color="text-amber-500" />
                <CurrencyStatCard label="Total Volume"  map={stats.volumes} />
                <StatCard label="Owners" value={stats.owners} />
              </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-8">
              {/* Listed toggle */}
              <button
                onClick={() => { setListed((v) => !v); setPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${listed ? "bg-emerald-500 text-white" : "bg-white border border-black/8 text-black/40 hover:text-black"}`}
              >
                {listed ? "✓ Listed Only" : "All NFTs"}
              </button>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{ colorScheme: "light" }}
                className="px-3.5 py-2.5 rounded-xl bg-white border border-black/10 text-black/60 text-sm outline-none focus:border-orange-500/60 cursor-pointer appearance-none"
              >
                <option value="latest">Latest</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
              </select>
            </div>

            {/* NFT Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <Spinner />
                  <p className="text-black/40 text-sm">Loading NFTs...</p>
                </div>
              </div>
            ) : nfts.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="text-5xl">🎨</div>
                <p className="text-black/50 text-lg font-medium">No NFTs in this collection yet</p>
                <Link href="/nft-studio" className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors">
                  Add NFTs to Collection →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {nfts.map((nft) => (
                  <NftCard
                    key={nft.id}
                    nft={nft}
                    walletAddress={walletAddress}
                    onBuySuccess={() => { showToast("NFT purchased! 🎉"); fetchCollection(); }}
                  />
                ))}
              </div>
            )}

            {lastPage > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border border-black/10 bg-white text-black/40 text-sm hover:bg-black/5 hover:text-black transition-all disabled:opacity-30 cursor-pointer">← Prev</button>
                <span className="text-black/40 text-sm px-3">Page {page} / {lastPage}</span>
                <button onClick={() => setPage((p) => Math.min(lastPage, p + 1))} disabled={page === lastPage} className="px-4 py-2 rounded-xl border border-black/10 bg-white text-black/40 text-sm hover:bg-black/5 hover:text-black transition-all disabled:opacity-30 cursor-pointer">Next →</button>
              </div>
            )}

          </div>
        </Container>
      </div>
    </div>
  );
}
