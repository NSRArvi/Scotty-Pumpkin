"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Container from "../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";
import StorageRenewalCard from "@/app/components/StorageRenewalCard";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Priority order for the backend's authoritative storage_status field
// (see Nft::getStorageStatusAttribute — computed fresh server-side from
// storage_paid_until + the admin's grace period setting, so this never
// needs to be re-derived from raw dates on the frontend). Lower number
// = more urgent; "active" and null (pre-feature NFTs, never tracked)
// sort last.
const STORAGE_URGENCY = { hidden: 0, grace_period: 1, expiring_soon: 2 };
function storageUrgency(status) {
  return STORAGE_URGENCY[status] ?? 99;
}

function sortByUrgency(a, b) {
  return storageUrgency(a.storage_status) - storageUrgency(b.storage_status);
}

export default function NftStoragePage() {
  const { connected, walletAddress, signTransaction } = useSolanaWallet();

  const [nfts, setNfts]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all"); // all | expiring | expired

  const load = useCallback(() => {
    if (!walletAddress) { setNfts([]); setLoading(false); return; }
    setLoading(true);
    fetch(`${API_URL}/nft/list/${walletAddress}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setNfts([...d.data].sort(sortByUrgency)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [walletAddress]);

  useEffect(() => { load(); }, [load]);

  function handleRenewed(updated) {
    // storage_status is a server-computed accessor, not part of the
    // renew endpoint's response (only storage_paid_until/
    // renewal_fee_spump come back) — a freshly-paid year is never
    // immediately within the warning window again, so "active" is a
    // safe optimistic value until the next full refetch.
    setNfts((prev) =>
      prev
        .map((n) => (n.id === updated.id ? { ...n, storage_paid_until: updated.storage_paid_until, storage_status: "active" } : n))
        .sort(sortByUrgency)
    );
  }

  // "expiring" bucket groups expiring_soon + grace_period together (both
  // are "acting soon, but the asset is still up"); "expired" is the
  // fully-hidden state where the marketplace no longer shows it at all.
  const counts = useMemo(() => {
    let expiring = 0, expired = 0;
    for (const n of nfts) {
      if (n.storage_status === "expiring_soon" || n.storage_status === "grace_period") expiring++;
      else if (n.storage_status === "hidden") expired++;
    }
    return { expiring, expired };
  }, [nfts]);

  const visible = nfts.filter((n) => {
    if (filter === "all") return true;
    if (filter === "expired")  return n.storage_status === "hidden";
    if (filter === "expiring") return n.storage_status === "expiring_soon" || n.storage_status === "grace_period";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-black">
      <Container>
        <div className="pt-16 pb-24">

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px flex-1 max-w-[40px] bg-orange-500/40" />
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-500">Scotty Pumpkin Ecosystem</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-none mb-4">
              Storage<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Manager</span>
            </h1>
            <p className="text-black/50 text-base font-light max-w-xl leading-relaxed">
              Every minted NFT's artwork is hosted on IPFS for 1 year at a time. Whoever owns an NFT is responsible
              for renewing its storage before it lapses — this page shows every NFT in your wallet and its status.
            </p>
          </div>

          {!connected ? (
            <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-10 text-center space-y-4">
              <p className="text-black/50 text-sm">Connect your wallet to see your NFTs' storage status.</p>
              <div className="flex justify-center"><WalletButton /></div>
            </div>
          ) : (
            <>
              {(counts.expired > 0 || counts.expiring > 0) && (
                <div className="mb-6 flex flex-wrap gap-3">
                  {counts.expired > 0 && (
                    <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm font-medium">
                      {counts.expired} NFT{counts.expired > 1 ? "s" : ""} hidden from marketplace — storage unpaid past grace period
                    </div>
                  )}
                  {counts.expiring > 0 && (
                    <div className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-sm font-medium">
                      {counts.expiring} NFT{counts.expiring > 1 ? "s" : ""} expiring soon or in grace period
                    </div>
                  )}
                </div>
              )}

              <div className="mb-6 flex gap-2">
                {[
                  { id: "all",      label: `All (${nfts.length})` },
                  { id: "expiring", label: `Expiring soon (${counts.expiring})` },
                  { id: "expired",  label: `Hidden (${counts.expired})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      filter === f.id ? "bg-orange-500 text-white" : "bg-white border border-black/10 text-black/50 hover:bg-black/5"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 rounded-xl border border-black/8 bg-white animate-pulse" />
                  ))}
                </div>
              ) : visible.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {visible.map((nft) => (
                    <StorageRenewalCard
                      key={nft.id}
                      nft={nft}
                      walletAddress={walletAddress}
                      signTransaction={signTransaction}
                      onRenewed={handleRenewed}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-black/25 text-sm">
                  {filter === "all" ? "No minted NFTs found in this wallet." : "Nothing in this category right now. 🎉"}
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
}
