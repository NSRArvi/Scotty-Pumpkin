
"use client";

import { useState, useEffect, useCallback } from "react";
import Container from "../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";
import BuyModal from "@/app/components/BuyModal";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const CATEGORIES = ["all", "art", "fashion", "jewelry", "music", "video", "digital"];

// ── Reusable ─────────────────────────────────────────────────────────────

function Badge({ children, color = "orange" }) {
  const colors = {
    orange: "bg-orange-500/15 text-orange-500 border-orange-500/20",
    green:  "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
    gray:   "bg-black/6 text-black/40 border-black/10",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${colors[color]}`}>
      {children}
    </span>
  );
}

function Spinner() {
  return <div className="w-5 h-5 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />;
}

// ── NFT Card ─────────────────────────────────────────────────────────────

function NftCard({ nft, walletAddress, onList, onUnlist, myNftsMode, onBuySuccess }) {
  const [showListModal, setShowListModal] = useState(false);
  const [showBuyModal, setShowBuyModal]   = useState(false);
  const [listPrice, setListPrice]         = useState(nft.list_price || "");
  const [loading, setLoading]             = useState(false);
  const isOwner = nft.wallet_address === walletAddress;

  async function handleList() {
    if (!listPrice || parseFloat(listPrice) < 0) return;
    setLoading(true);
    await onList(nft.id, parseFloat(listPrice));
    setLoading(false);
    setShowListModal(false);
  }

  async function handleUnlist() {
    setLoading(true);
    await onUnlist(nft.id);
    setLoading(false);
  }

  return (
    <>
      <div className="group rounded-2xl border border-black/8 bg-white shadow-sm hover:border-black/15 hover:shadow-md transition-all overflow-hidden flex flex-col">
        <Link href={`/nft-marketplace/${nft.mint_address || nft.id}`}>
        {/* Image */}
        <div className="relative aspect-square bg-black/4 overflow-hidden">
          {nft.image_url ? (
            <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-black/15">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} />
                <path strokeLinecap="round" strokeWidth={1} d="M3 16l5-5 4 4 3-3 6 6" />
              </svg>
            </div>
          )}
          <div className="absolute top-2 left-2"><Badge color="gray">{nft.category}</Badge></div>
          {nft.is_listed && <div className="absolute top-2 right-2"><Badge color="green">Listed</Badge></div>}
        </div>
        </Link>
        {/* Info */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            {/* NFT name → single page link */}
            <Link href={`/nft-marketplace/${nft.mint_address || nft.id}`}>
              <p className="text-black font-semibold text-sm truncate">{nft.name}</p>
            </Link>
            <p className="text-black/35 text-xs font-mono truncate mt-0.5">
              {nft.mint_address ? `${nft.mint_address.slice(0,6)}...${nft.mint_address.slice(-4)}` : "—"}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-black/35 text-[10px] uppercase tracking-wider mb-0.5">Price</p>
              <p className="text-orange-500 font-bold text-lg font-mono">
                {nft.is_listed ? `${parseFloat(nft.list_price).toFixed(3)} SOL` : "—"}
              </p>
            </div>
            {nft.royalty > 0 && <p className="text-black/30 text-[10px]">{nft.royalty}% royalty</p>}
          </div>

          <div className="mt-auto pt-2 border-t border-black/6 space-y-2">
            {isOwner || myNftsMode ? (
              nft.is_listed ? (
                <button
                  onClick={handleUnlist}
                  disabled={loading}
                  className="w-full py-2 rounded-xl border border-black/10 text-black/50 text-xs font-semibold hover:bg-black/5 hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {loading ? <Spinner /> : "Unlist from Marketplace"}
                </button>
              ) : (
                <button
                  onClick={() => setShowListModal(true)}
                  disabled={loading}
                  className="w-full py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
                >
                  {loading ? <Spinner /> : "List for Sale →"}
                </button>
              )
            ) : 
            // (
            //   <button
            //     onClick={() => setShowBuyModal(true)}
            //     className="w-full py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 transition-colors cursor-pointer"
            //   >
            //     Buy Now
            //   </button>
            // )

            nft.is_listed ? (
              // ── Buy Now → deferant Purchase page ──
              <Link
                href={`/purchase/${nft.mint_address}`}
                className="block w-full py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold text-center hover:bg-orange-400 transition-colors cursor-pointer"
              >
                Buy Now
              </Link>
            ) : (
              <div className="w-full py-2 rounded-xl border border-black/8 text-black/25 text-xs font-medium text-center">
                Not for sale
              </div>
            )}

            {nft.mint_address && (
              <a
                href={`https://explorer.solana.com/address/${nft.mint_address}?cluster=devnet`}
                target="_blank" rel="noreferrer"
                className="block text-center text-black/30 text-[10px] hover:text-black/60 transition-colors"
              >
                View on Explorer ↗
              </a>
              
            )}
          </div>
        </div>
      </div>

      {/* List Modal */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-white shadow-xl p-6 space-y-5">
            <div>
              <p className="text-black font-bold text-lg">List NFT for Sale</p>
              <p className="text-black/40 text-sm mt-1 truncate">{nft.name}</p>
            </div>
            {nft.image_url && <img src={nft.image_url} alt={nft.name} className="w-full h-40 object-cover rounded-xl" />}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-black/40 uppercase tracking-wider">Listing Price (SOL)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number" min="0" step="0.001"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder="e.g. 0.5"
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-black/5 border border-black/10 text-black text-sm placeholder:text-black/30 outline-none focus:border-orange-500/60 transition-all"
                />
                <span className="text-black/40 text-sm">SOL</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowListModal(false)} className="flex-1 py-2.5 rounded-xl border border-black/10 text-black/50 text-sm font-semibold hover:bg-black/5 transition-all cursor-pointer">Cancel</button>
              <button
                onClick={handleList}
                disabled={loading || !listPrice}
                className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
              >
                {loading ? <Spinner /> : "Confirm Listing"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buy Modal */}
      {showBuyModal && (
        <BuyModal
          nft={nft}
          buyerWallet={walletAddress}
          onClose={() => setShowBuyModal(false)}
          onSuccess={(data) => {
            setShowBuyModal(false);
            onBuySuccess && onBuySuccess();
          }}
        />
      )}
    </>
  );
}

// ── Newly Minted NFT Banner ──────────────────────────────────────
// NFT Studio থেকে redirect হলে এই banner দেখাবে
function NewlyMintedBanner({ mintAddress, onDismiss }) {
  return (
    <div className="mb-8 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-emerald-600 font-semibold text-sm">NFT minted successfully!</p>
          <p className="text-black/35 text-xs font-mono truncate max-w-xs">{mintAddress}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href={`/nft-marketplace/${mintAddress}`}
          className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-400 transition-colors"
        >
          View NFT →
        </Link>
        <button
          onClick={onDismiss}
          className="text-black/30 hover:text-black/60 transition-colors text-lg leading-none"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const {
    connected,
    walletAddress,
    walletIcon,
    connect,
  } = useSolanaWallet();

  const [activeTab, setActiveTab] = useState("marketplace");

  const [nfts, setNfts]         = useState([]);
  const [myNfts, setMyNfts]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [toast, setToast]       = useState("");

  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort]         = useState("latest");
  const [page, setPage]         = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // ── Fetch Marketplace ──────────────────────────────
  const fetchMarketplace = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, sort });
      if (search) params.append("search", search);
      if (category !== "all") params.append("category", category);
      const res  = await fetch(`${API_URL}/marketplace?${params}`);
      const data = await res.json();
      if (data.success) {
        setNfts(data.data.data || []);
        setLastPage(data.data.last_page || 1);
      }
    } catch (e) { setError("Failed to load marketplace."); }
    finally { setLoading(false); }
  }, [page, search, category, sort]);

  // ── Fetch My NFTs ──────────────────────────────
  const fetchMyNfts = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/marketplace/my-nfts/${walletAddress}`);
      const data = await res.json();
      if (data.success) setMyNfts(data.data || []);
    } catch (e) { setError("Failed to load your NFTs."); }
    finally { setLoading(false); }
  }, [walletAddress]);

  useEffect(() => {
    if (activeTab === "marketplace") fetchMarketplace();
    else if (activeTab === "my-nfts" && walletAddress) fetchMyNfts();
  }, [activeTab, fetchMarketplace, fetchMyNfts, walletAddress]);

  // ── List ──────────────────────────────
  async function handleList(nftId, price) {
    try {
      const res  = await fetch(`${API_URL}/marketplace/list`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ nft_id: nftId, wallet_address: walletAddress, list_price: price }),
      });
      const data = await res.json();
      if (data.success) { showToast("NFT listed successfully! 🎉"); fetchMyNfts(); fetchMarketplace(); }
      else setError(data.message);
    } catch (e) { setError(e.message); }
  }

  // ── Unlist ──────────────────────────────
  async function handleUnlist(nftId) {
    try {
      const res  = await fetch(`${API_URL}/marketplace/unlist`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ nft_id: nftId, wallet_address: walletAddress }),
      });
      const data = await res.json();
      if (data.success) { showToast("NFT unlisted."); fetchMyNfts(); fetchMarketplace(); }
      else setError(data.message);
    } catch (e) { setError(e.message); }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const displayNfts = activeTab === "my-nfts" ? myNfts : nfts;

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-black">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/4 blur-3xl" />
        <div className="absolute bottom-0 -right-60 w-[500px] h-[500px] rounded-full bg-purple-600/4 blur-3xl" />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}

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
                  Market<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">place</span>
                </h1>
                <p className="text-black/40 text-sm mt-3">Buy & sell NFTs. List free — pay 3% only on sale.</p>
              </div>

              {/* WalletButton —  wallet support */}
              <div className="flex items-center gap-3">
                {connected && walletIcon && (
                  <img src={walletIcon} alt="wallet" className="w-5 h-5 rounded-full" />
                )}
                <WalletButton />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                {error}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-white border border-black/8 shadow-sm w-fit mb-8">
              {[
                { key: "marketplace", label: "Marketplace" },
                { key: "my-nfts",    label: "My NFTs" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setError(""); }}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.key ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-black/40 hover:text-black"}`}
                >
                  {tab.label}
                  {tab.key === "my-nfts" && myNfts.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-black/8 text-[10px] text-black/60">{myNfts.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Filters */}
            {activeTab === "marketplace" && (
              <div className="flex flex-wrap gap-3 mb-8">
                <div className="relative flex-1 min-w-[200px]">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/25" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
                  <input
                    type="text" placeholder="Search NFTs..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-black/10 text-black text-sm placeholder:text-black/30 outline-none focus:border-orange-500/60 transition-all"
                  />
                </div>
                <div className="flex gap-1 flex-wrap">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCategory(c); setPage(1); }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${category === c ? "bg-orange-500 text-white" : "bg-white border border-black/8 text-black/40 hover:text-black hover:border-black/20"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
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
            )}

            {/* My NFTs — wallet connect prompt */}
            {activeTab === "my-nfts" && !connected && (
              <div className="text-center py-20 space-y-4">
                <p className="text-black/40 text-lg">Connect your wallet to see your NFTs</p>
                <WalletButton />
              </div>
            )}

            {/* NFT Grid */}
            {(activeTab === "marketplace" || connected) && (
              <>
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
                      <p className="text-black/40 text-sm">Loading NFTs...</p>
                    </div>
                  </div>
                ) : displayNfts.length === 0 ? (
                  <div className="text-center py-20 space-y-3">
                    <div className="text-5xl">🎨</div>
                    <p className="text-black/50 text-lg font-medium">
                      {activeTab === "my-nfts" ? "You haven't minted any NFTs yet" : "No NFTs listed yet"}
                    </p>
                    <p className="text-black/30 text-sm">
                      {activeTab === "my-nfts" ? "Go to NFT Studio to mint your first NFT" : "Be the first to list!"}
                    </p>
                    {activeTab === "my-nfts" && (
                      <a href="/nft-studio" className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors">
                        Go to NFT Studio →
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayNfts.map((nft) => (
                      <NftCard
                        key={nft.id}
                        nft={nft}
                        walletAddress={walletAddress}
                        onList={handleList}
                        onUnlist={handleUnlist}
                        myNftsMode={activeTab === "my-nfts"}
                        onBuySuccess={() => { showToast("NFT purchased! 🎉"); fetchMarketplace(); }}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {activeTab === "marketplace" && lastPage > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl border border-black/10 bg-white text-black/40 text-sm hover:bg-black/5 hover:text-black transition-all disabled:opacity-30 cursor-pointer"
                    >
                      ← Prev
                    </button>
                    <span className="text-black/40 text-sm px-3">Page {page} / {lastPage}</span>
                    <button
                      onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                      disabled={page === lastPage}
                      className="px-4 py-2 rounded-xl border border-black/10 bg-white text-black/40 text-sm hover:bg-black/5 hover:text-black transition-all disabled:opacity-30 cursor-pointer"
                    >
                      Next →
                    </button>
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
