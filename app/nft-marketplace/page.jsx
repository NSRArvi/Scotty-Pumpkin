"use client";

import { useState, useEffect, useCallback } from "react";
import Container from "../components/shared/Container";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const CATEGORIES = ["all", "art", "fashion", "jewelry", "music", "video", "digital"];

// ── Reusable ──────────────────────────────────────────────────────────────

function Badge({ children, color = "orange" }) {
  const colors = {
    orange: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    green:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    gray:   "bg-white/8 text-white/40 border-white/10",
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

// ── NFT Card ──────────────────────────────────────────────────────────────

function NftCard({ nft, walletAddress, onList, onUnlist, myNftsMode }) {
  const [showListModal, setShowListModal] = useState(false);
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
      <div className="group rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all overflow-hidden flex flex-col">
        {/* Image */}
        <div className="relative aspect-square bg-white/4 overflow-hidden">
          {nft.image_url ? (
            <img
              src={nft.image_url}
              alt={nft.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} />
                <path strokeLinecap="round" strokeWidth={1} d="M3 16l5-5 4 4 3-3 6 6" />
              </svg>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-2 left-2">
            <Badge color="gray">{nft.category}</Badge>
          </div>
          {/* Listed badge */}
          {nft.is_listed && (
            <div className="absolute top-2 right-2">
              <Badge color="green">Listed</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <p className="text-white font-semibold text-sm truncate">{nft.name}</p>
            <p className="text-white/30 text-xs font-mono truncate mt-0.5">
              {nft.mint_address ? `${nft.mint_address.slice(0, 6)}...${nft.mint_address.slice(-4)}` : "—"}
            </p>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Price</p>
              <p className="text-orange-400 font-bold text-lg font-mono">
                {nft.is_listed ? `${parseFloat(nft.list_price).toFixed(3)} SOL` : "—"}
              </p>
            </div>
            {nft.royalty > 0 && (
              <p className="text-white/20 text-[10px]">{nft.royalty}% royalty</p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto pt-2 border-t border-white/5 space-y-2">
            {isOwner || myNftsMode ? (
              nft.is_listed ? (
                <button
                  onClick={handleUnlist}
                  disabled={loading}
                  className="w-full py-2 rounded-xl border border-white/10 text-white/50 text-xs font-semibold hover:bg-white/8 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
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
            ) : (
              <button className="w-full py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 transition-colors cursor-pointer">
                Buy Now
              </button>
            )}

            {nft.mint_address && (
              <a
                href={`https://explorer.solana.com/address/${nft.mint_address}?cluster=devnet`}
                target="_blank"
                rel="noreferrer"
                className="block text-center text-white/25 text-[10px] hover:text-white/50 transition-colors"
              >
                View on Explorer ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* List Modal */}
      {showListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111] p-6 space-y-5">
            <div>
              <p className="text-white font-bold text-lg">List NFT for Sale</p>
              <p className="text-white/40 text-sm mt-1 truncate">{nft.name}</p>
            </div>

            {nft.image_url && (
              <img src={nft.image_url} alt={nft.name} className="w-full h-40 object-cover rounded-xl" />
            )}

            <div className="space-y-2">
              <label className="text-[11px] font-medium text-white/40 uppercase tracking-wider">Listing Price (SOL)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.001"
                  value={listPrice}
                  onChange={(e) => setListPrice(e.target.value)}
                  placeholder="e.g. 0.5"
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 outline-none focus:border-orange-500/60 transition-all"
                />
                <span className="text-white/40 text-sm">SOL</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowListModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/50 text-sm font-semibold hover:bg-white/8 transition-all cursor-pointer"
              >
                Cancel
              </button>
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
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [connected, setConnected]         = useState(false);
  const [activeTab, setActiveTab]         = useState("marketplace"); // marketplace | my-nfts

  const [nfts, setNfts]           = useState([]);
  const [myNfts, setMyNfts]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [toast, setToast]         = useState("");

  const [search, setSearch]       = useState("");
  const [category, setCategory]   = useState("all");
  const [sort, setSort]           = useState("latest");
  const [page, setPage]           = useState(1);
  const [lastPage, setLastPage]   = useState(1);

  // ── Wallet ────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && window.solana?.isConnected) {
      window.solana.connect({ onlyIfTrusted: true })
        .then((r) => { setWalletAddress(r.publicKey.toString()); setConnected(true); })
        .catch(() => {});
    }
  }, []);

  async function connectWallet() {
    try {
      if (!window.solana) { alert("Install Phantom Wallet from https://phantom.app"); return; }
      const r = await window.solana.connect();
      setWalletAddress(r.publicKey.toString());
      setConnected(true);
    } catch (e) { setError(e.message); }
  }

  async function disconnectWallet() {
    if (window.solana) await window.solana.disconnect();
    setConnected(false);
    setWalletAddress("");
  }

  // ── Fetch Marketplace NFTs ─────────────────────────
  const fetchMarketplace = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, sort });
      if (search)   params.append("search", search);
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

  // ── Fetch My NFTs ──────────────────────────────────
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

  // ── List for Sale ──────────────────────────────────
  async function handleList(nftId, price) {
    try {
      const res  = await fetch(`${API_URL}/marketplace/list`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ nft_id: nftId, wallet_address: walletAddress, list_price: price }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("NFT listed successfully! 🎉");
        fetchMyNfts();
        fetchMarketplace();
      } else {
        setError(data.message);
      }
    } catch (e) { setError(e.message); }
  }

  // ── Unlist ─────────────────────────────────────────
  async function handleUnlist(nftId) {
    try {
      const res  = await fetch(`${API_URL}/marketplace/unlist`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ nft_id: nftId, wallet_address: walletAddress }),
      });
      const data = await res.json();
      if (data.success) {
        showToast("NFT unlisted.");
        fetchMyNfts();
        fetchMarketplace();
      } else {
        setError(data.message);
      }
    } catch (e) { setError(e.message); }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const displayNfts = activeTab === "my-nfts" ? myNfts : nfts;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/4 blur-3xl" />
        <div className="absolute bottom-0 -right-60 w-[500px] h-[500px] rounded-full bg-purple-600/4 blur-3xl" />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm font-medium shadow-xl animate-fade-in">
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
                <p className="text-white/30 text-sm mt-3">Buy & sell NFTs. List free — pay 3% only on sale.</p>
              </div>

              {/* Wallet */}
              <div className="flex items-center gap-3">
                {connected && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span className="text-emerald-400 text-xs font-mono">{walletAddress.slice(0,4)}...{walletAddress.slice(-4)}</span>
                  </div>
                )}
                <button
                  onClick={connected ? disconnectWallet : connectWallet}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${connected ? "bg-white/8 text-white/60 hover:bg-white/12 border border-white/10" : "bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-500/20"}`}
                >
                  {connected ? "Disconnect" : "Connect Phantom"}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                {error}
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8 w-fit mb-8">
              {[
                { key: "marketplace", label: "Marketplace" },
                { key: "my-nfts",    label: "My NFTs" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => { setActiveTab(tab.key); setError(""); }}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.key ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-white/40 hover:text-white"}`}
                >
                  {tab.label}
                  {tab.key === "my-nfts" && myNfts.length > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 rounded-full bg-white/10 text-[10px] text-white/60">{myNfts.length}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Filters — only on marketplace tab */}
            {activeTab === "marketplace" && (
              <div className="flex flex-wrap gap-3 mb-8">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
                  <input
                    type="text"
                    placeholder="Search NFTs..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 outline-none focus:border-orange-500/60 transition-all"
                  />
                </div>

                {/* Category filter */}
                <div className="flex gap-1 flex-wrap">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setCategory(c); setPage(1); }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${category === c ? "bg-orange-500 text-white" : "bg-white/5 border border-white/8 text-white/40 hover:text-white hover:border-white/20"}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm outline-none focus:border-orange-500/60 cursor-pointer appearance-none"
                >
                  <option value="latest">Latest</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                </select>
              </div>
            )}

            {/* My NFTs connect prompt */}
            {activeTab === "my-nfts" && !connected && (
              <div className="text-center py-20 space-y-4">
                <p className="text-white/30 text-lg">Connect your wallet to see your NFTs</p>
                <button
                  onClick={connectWallet}
                  className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-400 transition-colors cursor-pointer"
                >
                  Connect Phantom
                </button>
              </div>
            )}

            {/* NFT Grid */}
            {(activeTab === "marketplace" || connected) && (
              <>
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
                      <p className="text-white/30 text-sm">Loading NFTs...</p>
                    </div>
                  </div>
                ) : displayNfts.length === 0 ? (
                  <div className="text-center py-20 space-y-3">
                    <div className="text-5xl">🎨</div>
                    <p className="text-white/40 text-lg font-medium">
                      {activeTab === "my-nfts" ? "You haven't minted any NFTs yet" : "No NFTs listed yet"}
                    </p>
                    <p className="text-white/20 text-sm">
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
                      />
                    ))}
                  </div>
                )}

                {/* Pagination — marketplace only */}
                {activeTab === "marketplace" && lastPage > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-xl border border-white/10 text-white/40 text-sm hover:bg-white/8 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
                    >
                      ← Prev
                    </button>
                    <span className="text-white/30 text-sm px-3">
                      Page {page} / {lastPage}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                      disabled={page === lastPage}
                      className="px-4 py-2 rounded-xl border border-white/10 text-white/40 text-sm hover:bg-white/8 hover:text-white transition-all disabled:opacity-30 cursor-pointer"
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
