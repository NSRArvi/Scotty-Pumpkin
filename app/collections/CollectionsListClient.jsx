"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Container from "../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const CURRENCY_ICON = { spump: "🎃", usdc: "💵" };

const formatSolPrice = (price) => {
  return Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
};

// Renders a { spump: 1200, usdc: 5.5 } map as one line per currency
// that actually has a value — never adds SPUMP and USDC together.
function CurrencyAmounts({ map, className }) {
  const entries = Object.entries(map || {}).filter(([, amt]) => amt > 0);
  if (entries.length === 0) return <span className={className}>—</span>;
  return (
    <>
      {entries.map(([cur, amt]) => (
        <p key={cur} className={className}>
          {CURRENCY_ICON[cur] || ""} {formatSolPrice(amt)} {cur.toUpperCase()}
        </p>
      ))}
    </>
  );
}

function Spinner() {
  return <div className="w-6 h-6 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />;
}

// ── Collection Card ───────────────────────────────────────────────────────
function CollectionCard({ col }) {
  const previews = col.preview_images || [];

  return (
    <Link href={`/collections/${col.id}`}>
      <div className="group rounded-2xl border border-black/8 bg-white shadow-sm hover:shadow-md hover:border-black/15 transition-all overflow-hidden cursor-pointer">

        {/* Preview Grid — ৪টা NFT image mosaic */}
        <div className="grid grid-cols-2 gap-0.5 bg-black/5 aspect-[4/3] overflow-hidden">
          {[0,1,2,3].map((i) => (
            <div key={i} className="bg-black/5 overflow-hidden">
              {previews[i] ? (
                <img
                  src={previews[i]}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-black/10">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-black font-bold text-sm truncate">{col.name}</p>
              {col.symbol && (
                <p className="text-black/35 text-xs font-mono">{col.symbol}</p>
              )}
            </div>
            <span className="px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-semibold shrink-0">
              {col.nfts_count} NFT{col.nfts_count !== 1 ? "s" : ""}
            </span>
          </div>

          {col.description && (
            <p className="text-black/40 text-xs font-light leading-relaxed line-clamp-2">{col.description}</p>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-black/5">
            <div className="text-center">
              <p className="text-black/30 text-[10px] uppercase tracking-wider">Floor</p>
              <CurrencyAmounts map={col.floor_prices} className="text-orange-500 font-bold text-xs font-mono" />
            </div>
            <div className="text-center">
              <p className="text-black/30 text-[10px] uppercase tracking-wider">Listed</p>
              <p className="text-black/70 font-bold text-xs">{col.listed_count ?? 0}</p>
            </div>
            <div className="text-center">
              <p className="text-black/30 text-[10px] uppercase tracking-wider">Volume</p>
              <CurrencyAmounts map={col.volumes} className="text-black/70 font-bold text-xs font-mono" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function CollectionsListClient() {
  const { connected, walletAddress } = useSolanaWallet();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
  const [search, setSearch]           = useState("");
  const [tab, setTab]                 = useState("all"); // all | mine
  const [page, setPage]               = useState(1);
  const [lastPage, setLastPage]       = useState(1);

  const fetchCollections = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page });
      if (search)              params.append("search", search);
      if (tab === "mine" && walletAddress) params.append("wallet", walletAddress);
      const res  = await fetch(`${API_URL}/collections?${params}`);
      const data = await res.json();
      if (data.success) {
        setCollections(data.data.data || []);
        setLastPage(data.data.last_page || 1);
      }
    } catch { setError("Failed to load collections."); }
    finally { setLoading(false); }
  }, [page, search, tab, walletAddress]);

  useEffect(() => { fetchCollections(); }, [fetchCollections]);

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-black">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/4 blur-3xl" />
        <div className="absolute bottom-0 -right-60 w-[500px] h-[500px] rounded-full bg-purple-600/4 blur-3xl" />
      </div>

      <div className="relative">
        <Container>
          <div className="pt-16 pb-24">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-px w-8 bg-orange-500/40" />
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-500">Scotty Pumpkin Ecosystem</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                  Collec<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">tions</span>
                </h1>
                <p className="text-black/40 text-sm mt-3">Browse NFT collections — buy with <span className="text-amber-500 font-medium">🎃 SPUMP</span> or <span className="text-sky-500 font-medium">💵 USDC</span></p>
              </div>
              <div className="flex items-center gap-3">
                <WalletButton />
                <Link
                  href="/nft-studio"
                  className="px-4 py-2 rounded-xl border border-orange-500/30 text-orange-500 text-sm font-semibold hover:bg-orange-500/10 transition-colors"
                >
                  + Create NFT
                </Link>
              </div>
            </div>

            {/* Tabs + Search */}
            <div className="flex flex-wrap gap-3 items-center mb-8">
              <div className="flex gap-1 p-1 rounded-xl bg-white border border-black/8 shadow-sm">
                {[
                  { key: "all",  label: "All Collections" },
                  { key: "mine", label: "My Collections" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => { setTab(t.key); setPage(1); }}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${tab === t.key ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-black/40 hover:text-black"}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 min-w-[200px]">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/25" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-black/10 text-black text-sm placeholder:text-black/30 outline-none focus:border-orange-500/60 transition-all"
                />
              </div>
            </div>

            {/* My Collections — wallet prompt */}
            {tab === "mine" && !connected && (
              <div className="text-center py-20 space-y-4">
                <p className="text-black/40 text-lg">Connect your wallet to see your collections</p>
                <WalletButton />
              </div>
            )}

            {/* Grid */}
            {(tab === "all" || connected) && (
              <>
                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <Spinner />
                      <p className="text-black/40 text-sm">Loading collections...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                ) : collections.length === 0 ? (
                  <div className="text-center py-20 space-y-3">
                    <div className="text-5xl">🗂️</div>
                    <p className="text-black/50 text-lg font-medium">
                      {tab === "mine" ? "You haven't created any collections" : "No collections yet"}
                    </p>
                    <p className="text-black/30 text-sm">Create an NFT with a collection to get started</p>
                    <Link href="/nft-studio" className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors">
                      Go to NFT Studio →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {collections.map((col) => (
                      <CollectionCard key={col.id} col={col} />
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
              </>
            )}

          </div>
        </Container>
      </div>
    </div>
  );
}
