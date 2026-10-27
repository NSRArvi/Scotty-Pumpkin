"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";
import StorageRenewalCard from "@/app/components/StorageRenewalCard";
import { Country } from "country-state-city";

const CATEGORIES = ['art', 'music', 'gaming', 'sports',
        'photography', 'collectible', 'utility', 'other',
        'fashion', 'jewelry', 'video', 'digital'];
// Full ISO 3166-1 country list — see NftStudioClient.jsx for details.
const COUNTRIES = Country.getAllCountries();
const countryLabel = (isoCode) => {
  const c = Country.getCountryByCode(isoCode);
  return c ? `${c.flag} ${c.name}` : isoCode;
};

const API_URL          = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const SPUMP_MINT       = process.env.NEXT_PUBLIC_SPUMP_MINT_ADDRESS;
const USDC_MINT        = process.env.NEXT_PUBLIC_USDC_MINT_ADDRESS;
const SOLANA_RPC_URL   = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
  || (process.env.NEXT_PUBLIC_SOLANA_NETWORK === "mainnet-beta"
      ? "https://api.mainnet-beta.solana.com"
      : "https://api.devnet.solana.com");

// SPL token balance (SPUMP/USDC) for a wallet — sums every token account
// the wallet holds for that mint, since a wallet can technically have
// more than one associated token account for the same mint.
async function fetchSplBalance(walletAddress, mintAddress) {
  if (!walletAddress || !mintAddress) return null;
  try {
    const res = await fetch(SOLANA_RPC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0", id: 1,
        method: "getTokenAccountsByOwner",
        params: [walletAddress, { mint: mintAddress }, { encoding: "jsonParsed" }],
      }),
    });
    const data = await res.json();
    const accounts = data?.result?.value || [];
    return accounts.reduce(
      (sum, acc) => sum + (acc.account?.data?.parsed?.info?.tokenAmount?.uiAmount || 0),
      0
    );
  } catch { return null; }
}

const formatSolPrice = (price) => {
  return Number(price).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 6,
  });
};

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-black/5 rounded-xl ${className}`} />;
}

// Same threshold as StorageRenewalCard's own badge logic — an NFT
// "needs attention" once it's within 30 days of its storage renewal
// date, or already past it.
function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
}

// Links this wallet to the email the owner logs into Sosay with, so
// NFTs minted by this wallet can be matched to their Sosay account and
// shown under Sosay's NFT marketplace category. Own-profile only.
// NOTE: this does not verify wallet-signature or email ownership — see
// WalletController::linkEmail for what's still needed before this
// should drive anything sensitive.
function SosayEmailCard({ walletAddress }) {
  const [email, setEmail]     = useState("");
  const [saved, setSaved]     = useState(null); // last-saved value, for "unsaved changes" state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [msg, setMsg]         = useState("");

  useEffect(() => {
    if (!walletAddress) return;
    fetch(`${API_URL}/wallet/email/${walletAddress}`)
      .then((r) => r.json())
      .then((d) => {
        const e = d?.data?.email || "";
        setEmail(e);
        setSaved(e);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [walletAddress]);

  async function handleSave() {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch(`${API_URL}/wallet/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_address: walletAddress, email: email || null }),
      });
      const data = await res.json();
      if (data.success) {
        setSaved(email);
        setMsg(email ? "Email linked." : "Email removed.");
      } else {
        setMsg(data.message || "Could not save.");
      }
    } catch {
      setMsg("Could not save.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  }

  const dirty = email !== saved;

  return (
    <div className="mb-10 rounded-2xl border border-black/8 bg-white shadow-sm p-5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🔗</span>
        <p className="text-black font-semibold text-sm">Link Sosay Email</p>
      </div>
      <p className="text-black/40 text-xs mb-3">
        Enter the email you log into Sosay with so your NFTs can show up under the NFT category on sosay.org/spump-market.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || saving}
          placeholder="you@example.com"
          className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/4 border border-black/10 text-black text-sm outline-none focus:border-orange-500/60 disabled:opacity-50"
        />
        <button
          onClick={handleSave}
          disabled={loading || saving || !dirty}
          className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
      {msg && <p className="text-black/40 text-xs mt-2">{msg}</p>}
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-5 text-center">
      <p className="text-3xl font-black text-black">{value}</p>
      {sub && <p className="text-orange-500 text-sm font-semibold mt-0.5">{sub}</p>}
      <p className="text-black/40 text-xs mt-1">{label}</p>
    </div>
  );
}

function NftCard({ nft, editable = false, collections = [], walletAddress, onDetailsChanged }) {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
  const cluster = network === "mainnet-beta" ? "" : "?cluster=devnet";
  const [explicitRevealed, setExplicitRevealed] = useState(false);
  const [savingField, setSavingField] = useState(null); // "collection_id" | "category" | "country" | null
  const [detailMsg, setDetailMsg]     = useState("");

  // Edit collection / category / country after minting — for NFTs that
  // were minted without picking one, or to correct one later. Owner-only
  // on the backend (NftController::updateDetails), so this control is
  // only rendered on your own profile (editable prop). One field per
  // call — each select saves itself independently.
  async function handleDetailChange(field, value) {
    setSavingField(field);
    setDetailMsg("");
    try {
      const res = await fetch(`${API_URL}/nft/${nft.id}/details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: walletAddress,
          [field]: value, // "" → clear (collection/country only; category can't be blanked)
        }),
      });
      const data = await res.json();
      if (data.success) {
        onDetailsChanged?.(data.data);
        setDetailMsg("Saved");
      } else {
        setDetailMsg(data.message || "Could not save.");
      }
    } catch {
      setDetailMsg("Could not save.");
    } finally {
      setSavingField(null);
      setTimeout(() => setDetailMsg(""), 2500);
    }
  }
  return (
    <div className="group rounded-2xl border border-black/8 bg-white shadow-sm hover:border-black/15 hover:shadow-md transition-all overflow-hidden flex flex-col">
    <a href={`/nft-marketplace/${nft.mint_address}`} className="flex flex-col flex-1 cursor-pointer">
      <div className="relative aspect-square bg-black/4 overflow-hidden">
        {nft.image_url ? (
          <img src={nft.image_url} alt={nft.name} className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${nft.is_explicit && !explicitRevealed ? "blur-xl scale-110" : ""}`} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-black/15">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} /></svg>
          </div>
        )}
        {nft.is_explicit && !explicitRevealed && (
          <button
            onClick={(e) => { e.preventDefault(); setExplicitRevealed(true); }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/40 text-white cursor-pointer z-10"
          >
            <span className="text-xl">🔞</span>
            <span className="text-[10px] font-semibold">Sensitive</span>
          </button>
        )}
        <div className="absolute top-2 left-2">
          <span className="px-2 py-0.5 rounded-full bg-black/60 text-white/80 text-[10px] font-semibold capitalize">{nft.category}</span>
          {nft.country && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-black/60 text-white/80 text-[10px] font-semibold">{countryLabel(nft.country)}</span>
          )}
        </div>
        {nft.is_listed && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 text-[10px] font-semibold">Listed</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-black font-semibold text-sm truncate">{nft.name}</p>
        <p className="text-black/35 text-xs font-mono truncate">{nft.mint_address?.slice(0,8)}...{nft.mint_address?.slice(-4)}</p>
        <p className="text-black/40 text-[11px] truncate">
          {nft.collection?.name ? `📁 ${nft.collection.name}` : "No collection"}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-black/6">
          <p className="text-orange-500 font-bold text-sm font-mono">
            {nft.is_listed ? `${formatSolPrice(nft.list_price)} ${(nft.list_currency || "spump").toUpperCase()}` : "—"}
          </p>
          <span className="text-black/30 text-[10px]">{nft.royalty}% royalty</span>
        </div>
      </div>
    </a>

      {editable && (
        <div className="px-4 pb-4 -mt-1 space-y-1.5">
          <select
            value={nft.collection_id ?? ""}
            onChange={(e) => handleDetailChange("collection_id", e.target.value)}
            disabled={savingField !== null}
            style={{ colorScheme: "light" }}
            className="w-full px-2.5 py-2 rounded-lg bg-black/4 border border-black/10 text-black/70 text-xs outline-none focus:border-orange-500/60 cursor-pointer disabled:opacity-50"
          >
            <option value="">— No collection —</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {collections.length === 0 && (
            <p className="text-black/30 text-[10px]">No collections exist yet.</p>
          )}

          <select
            value={nft.category ?? ""}
            onChange={(e) => handleDetailChange("category", e.target.value)}
            disabled={savingField !== null}
            style={{ colorScheme: "light" }}
            className="w-full px-2.5 py-2 rounded-lg bg-black/4 border border-black/10 text-black/70 text-xs outline-none focus:border-orange-500/60 cursor-pointer disabled:opacity-50 capitalize"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>

          <select
            value={nft.country ?? ""}
            onChange={(e) => handleDetailChange("country", e.target.value)}
            disabled={savingField !== null}
            style={{ colorScheme: "light" }}
            className="w-full px-2.5 py-2 rounded-lg bg-black/4 border border-black/10 text-black/70 text-xs outline-none focus:border-orange-500/60 cursor-pointer disabled:opacity-50"
          >
            <option value="">— No country —</option>
            {COUNTRIES.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>{c.flag} {c.name}</option>
            ))}
          </select>

          {(savingField || detailMsg) && (
            <p className="text-black/40 text-[10px]">{savingField ? "Saving..." : detailMsg}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function WalletProfileClient() {
  const params                       = useParams();
  const urlWallet                    = params?.wallet;
  const { connected, walletAddress, signTransaction } = useSolanaWallet();

  // Profile wallet — Use the wallet address from the URL if available; otherwise, use the connected wallet.
  const profileWallet = urlWallet || walletAddress;
  const isOwnProfile  = profileWallet === walletAddress;

  const [nfts, setNfts]           = useState([]);
  const [soldNfts, setSoldNfts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("owned");
  const [collections, setCollections]   = useState([]);
  const [spumpBalance, setSpumpBalance] = useState(null);
  const [usdcBalance, setUsdcBalance]   = useState(null);

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

  // SPUMP + USDC balances — the currencies this platform actually
  // transacts in. Native SOL balance isn't shown since the platform
  // never charges or pays out in SOL.
  useEffect(() => {
    if (!profileWallet) return;
    fetchSplBalance(profileWallet, SPUMP_MINT).then(setSpumpBalance);
    fetchSplBalance(profileWallet, USDC_MINT).then(setUsdcBalance);
  }, [profileWallet]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // Collection dropdown options for the per-NFT picker below.
  useEffect(() => {
    if (!isOwnProfile) return;
    fetch(`${API_URL}/collections?per_page=100`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setCollections(d.data?.data || d.data || []); })
      .catch(() => {});
  }, [isOwnProfile]);

  const listedNfts   = nfts.filter((n) => n.is_listed);
  const unlistedNfts = nfts.filter((n) => !n.is_listed);
  const listedValueByCurrency = listedNfts.reduce((acc, n) => {
    const cur = (n.list_currency || "spump").toLowerCase();
    acc[cur] = (acc[cur] || 0) + parseFloat(n.list_price || 0);
    return acc;
  }, {});
  const listedValueLabel = Object.entries(listedValueByCurrency)
    .map(([cur, amt]) => `${formatSolPrice(amt)} ${cur.toUpperCase()}`)
    .join(" + ") || null;

  const tabNfts = activeTab === "owned" ? nfts : activeTab === "listed" ? listedNfts : soldNfts;

  // Storage renewal is owner-only on the backend (NftController::renewStorage
  // checks nft.wallet_address === request wallet), so this banner only makes
  // sense — and only appears — when viewing your OWN profile.
  const storageAlerts = isOwnProfile
    ? nfts
        .filter((n) => { const d = daysUntil(n.storage_paid_until); return d !== null && d <= 30; })
        .sort((a, b) => daysUntil(a.storage_paid_until) - daysUntil(b.storage_paid_until))
    : [];

  // The backend moves every copy of the same edition this wallet still
  // owns, so mirror that here instead of only patching the one card.
  function handleDetailsChanged(updated) {
    setNfts((prev) => prev.map((n) => (
      n.id === updated.id ||
      (updated.edition_group_id && n.edition_group_id === updated.edition_group_id)
        ? { ...n, collection_id: updated.collection_id, collection: updated.collection ?? null,
            category: updated.category, country: updated.country }
        : n
    )));
  }

  function handleStorageRenewed(updated) {
    setNfts((prev) => prev.map((n) => (n.id === updated.id ? { ...n, storage_paid_until: updated.storage_paid_until } : n)));
  }

  if (!profileWallet && !connected) {
    return (
      <div className="min-h-screen bg-[#F3EFE6] text-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-black/50 text-lg">Connect your wallet to view your profile</p>
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-black">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/4 blur-3xl" />
        <div className="absolute bottom-0 -right-60 w-[500px] h-[500px] rounded-full bg-purple-600/4 blur-3xl" />
      </div>

      <div className="relative">

          <div className="pt-12 pb-24 container px-4 md:px-8 mx-auto">

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
                  <span className="px-3 py-1 rounded-full bg-white border border-black/10 text-black/50 text-xs font-mono">{profileWallet}</span>
                  <button
                    onClick={() => { navigator.clipboard.writeText(profileWallet); }}
                    className="text-black/40 hover:text-black transition-colors cursor-pointer"
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
                  className="px-4 py-2 rounded-xl border border-black/10 bg-white text-black/50 text-sm hover:bg-black/5 hover:text-black transition-all"
                >
                  Explorer ↗
                </a>
              </div>
            </div>

            {isOwnProfile && <SosayEmailCard walletAddress={walletAddress} />}

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
              <StatCard label="Total NFTs"    value={nfts.length}         />
              <StatCard label="Listed"        value={listedNfts.length}   sub={listedValueLabel} />
              <StatCard label="Sold"          value={soldNfts.length}     />
              <StatCard label="SPUMP Balance" value={spumpBalance != null ? formatSolPrice(spumpBalance) : "—"} sub="🎃 SPUMP" />
              <StatCard label="USDC Balance"  value={usdcBalance != null ? formatSolPrice(usdcBalance) : "—"}  sub="💵 USDC" />
            </div>

            {/* Storage attention — NFTs you own whose IPFS hosting is expiring
                within 30 days or already lapsed. Owner-only (see storageAlerts
                above), so this never appears when viewing someone else's profile. */}
            {storageAlerts.length > 0 && (
              <div className="mb-8 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-px w-8 bg-orange-500/40" />
                  <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-500">
                    Storage Needs Attention ({storageAlerts.length})
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {storageAlerts.map((n) => (
                    <StorageRenewalCard
                      key={n.id}
                      nft={n}
                      walletAddress={walletAddress}
                      signTransaction={signTransaction}
                      compact
                      onRenewed={handleStorageRenewed}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-white border border-black/8 shadow-sm w-fit mb-8">
              {[
                { key: "owned",  label: `All NFTs (${nfts.length})` },
                { key: "listed", label: `Listed (${listedNfts.length})` },
                { key: "sold",   label: `Sold (${soldNfts.length})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.key ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-black/40 hover:text-black"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* NFT Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="rounded-2xl border border-black/8 bg-white overflow-hidden animate-pulse">
                    <div className="aspect-square bg-black/5" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-black/5 rounded w-3/4" />
                      <div className="h-3 bg-black/5 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tabNfts.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="text-5xl">🎨</div>
                <p className="text-black/50 text-lg font-medium">
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
                {tabNfts.map((nft) => (
                  <NftCard
                    key={nft.id}
                    nft={nft}
                    editable={isOwnProfile}
                    collections={collections}
                    walletAddress={walletAddress}
                    onDetailsChanged={handleDetailsChanged}
                  />
                ))}
              </div>
            )}

          </div>

      </div>
    </div>
  );
}