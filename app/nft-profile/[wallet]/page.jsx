"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Container from "../../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />;
}

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-white/8 bg-white/3 p-5 text-center">
      <p className="text-3xl font-black text-white">{value}</p>
      {sub && <p className="text-orange-400 text-sm font-semibold mt-0.5">{sub}</p>}
      <p className="text-white/30 text-xs mt-1">{label}</p>
    </div>
  );
}

function NftCard({ nft }) {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
  const cluster = network === "mainnet-beta" ? "" : "?cluster=devnet";
  return (
    <a href={`/nft-marketplace/${nft.mint_address}`} className="group rounded-2xl border border-white/8 bg-white/3 hover:border-white/15 transition-all overflow-hidden flex flex-col cursor-pointer">
      <div className="relative aspect-square bg-white/4 overflow-hidden">
        {nft.image_url ? (
          <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} /></svg>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 rounded-full bg-black/50 text-white/50 text-[10px] font-semibold capitalize">{nft.category}</span>
        </div>
        {nft.is_listed && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">Listed</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-white font-semibold text-sm truncate">{nft.name}</p>
        <p className="text-white/30 text-xs font-mono truncate">{nft.mint_address?.slice(0,8)}...{nft.mint_address?.slice(-4)}</p>
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-white/5">
          <p className="text-orange-400 font-bold text-sm font-mono">
            {nft.is_listed ? `${parseFloat(nft.list_price).toFixed(3)} SOL` : "—"}
          </p>
          <span className="text-white/20 text-[10px]">{nft.royalty}% royalty</span>
        </div>
      </div>
    </a>
  );
}

export default function ProfilePage() {
  const params                       = useParams();
  const urlWallet                    = params?.wallet;
  const { connected, walletAddress } = useSolanaWallet();

  // Profile wallet — URL  connected wallet
  const profileWallet = urlWallet || walletAddress;
  const isOwnProfile  = profileWallet === walletAddress;

  const [nfts, setNfts]           = useState([]);
  const [soldNfts, setSoldNfts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("owned");
  const [solBalance, setSolBalance] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!profileWallet) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/nft/list/${profileWallet}`);
      const data = await res.json();
      if (data.success) {
        const all  = data.data || [];
        setNfts(all);
        setSoldNfts(all.filter((n) => n.sold_to));
      }
    } catch (_) {}
    finally { setLoading(false); }
  }, [profileWallet]);

  // SOL balance
  useEffect(() => {
    if (!profileWallet) return;
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta"
      ? "https://api.mainnet-beta.solana.com"
      : "https://api.devnet.solana.com";
    fetch(rpcUrl, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getBalance", params: [profileWallet] }),
    }).then(r => r.json()).then(d => {
      const lamports = d?.result?.value || 0;
      setSolBalance((lamports / 1_000_000_000).toFixed(4));
    }).catch(() => {});
  }, [profileWallet]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const listedNfts   = nfts.filter((n) => n.is_listed);
  const unlistedNfts = nfts.filter((n) => !n.is_listed);
  const totalValue   = listedNfts.reduce((sum, n) => sum + parseFloat(n.list_price || 0), 0);

  const tabNfts = activeTab === "owned" ? nfts : activeTab === "listed" ? listedNfts : soldNfts;

  if (!profileWallet && !connected) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-white/40 text-lg">Connect your wallet to view your profile</p>
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/4 blur-3xl" />
        <div className="absolute bottom-0 -right-60 w-[500px] h-[500px] rounded-full bg-purple-600/4 blur-3xl" />
      </div>

      <div className="relative">
        <Container>
          <div className="pt-12 pb-24">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-px w-8 bg-orange-500/40" />
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-500">
                    {isOwnProfile ? "My Profile" : "Creator Profile"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                  {profileWallet?.slice(0, 6)}...{profileWallet?.slice(-6)}
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-mono">{profileWallet}</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(profileWallet); }}
                    className="text-white/30 hover:text-white transition-colors cursor-pointer"
                    title="Copy address"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isOwnProfile && <WalletButton />}
                <a
                  href={`https://explorer.solana.com/address/${profileWallet}${process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta" ? "" : "?cluster=devnet"}`}
                  target="_blank" rel="noreferrer"
                  className="px-4 py-2 rounded-xl border border-white/10 text-white/40 text-sm hover:bg-white/8 hover:text-white transition-all"
                >
                  Explorer ↗
                </a>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <StatCard label="Total NFTs"    value={nfts.length}         />
              <StatCard label="Listed"        value={listedNfts.length}   sub={listedNfts.length > 0 ? `${totalValue.toFixed(3)} SOL` : null} />
              <StatCard label="Sold"          value={soldNfts.length}     />
              <StatCard label="SOL Balance"   value={solBalance ?? "—"}   sub="SOL" />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-white/4 border border-white/8 w-fit mb-8">
              {[
                { key: "owned",  label: `All NFTs (${nfts.length})` },
                { key: "listed", label: `Listed (${listedNfts.length})` },
                { key: "sold",   label: `Sold (${soldNfts.length})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.key ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-white/40 hover:text-white"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* NFT Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-white/8 bg-white/3 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-white/5" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-white/5 rounded w-3/4" />
                      <div className="h-3 bg-white/5 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tabNfts.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="text-5xl">🎨</div>
                <p className="text-white/40 text-lg font-medium">
                  {activeTab === "owned"  && "No NFTs yet"}
                  {activeTab === "listed" && "No listed NFTs"}
                  {activeTab === "sold"   && "No sales yet"}
                </p>
                {isOwnProfile && activeTab === "owned" && (
                  <a href="/nft-studio" className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors">
                    Mint your first NFT →
                  </a>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tabNfts.map((nft) => <NftCard key={nft.id} nft={nft} />)}
              </div>
            )}

          </div>
        </Container>
      </div>
    </div>
  );
}
