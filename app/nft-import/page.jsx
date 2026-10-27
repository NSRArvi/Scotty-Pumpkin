"use client";

import { useState, useEffect } from "react";
import Container from "../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";
import Link from "next/link";
import { Country } from "country-state-city";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const CATEGORIES = [
  "art", "music", "gaming", "sports",
  "photography", "collectible", "utility", "other",
  "fashion", "jewelry", "video", "digital",
];

// Full ISO 3166-1 country list — see NftStudioClient.jsx for details.
const COUNTRIES = Country.getAllCountries();

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

function Badge({ children, color = "orange" }) {
  const colors = {
    orange: "bg-orange-500/10 text-orange-600",
    gray:   "bg-black/5 text-black/50",
    green:  "bg-emerald-500/10 text-emerald-600",
  };
  return (
    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${colors[color]}`}>
      {children}
    </span>
  );
}

export default function ImportNftPage() {
  const { connected, walletAddress } = useSolanaWallet();

  const [mintAddress, setMintAddress] = useState("");
  const [category, setCategory]       = useState("other");
  const [country, setCountry]         = useState("");
  const [collectionId, setCollectionId] = useState("");
  const [collections, setCollections] = useState([]);

  const [step, setStep]         = useState("idle"); // idle | previewing | preview | importing | done | error
  const [preview, setPreview]   = useState(null);
  const [error, setError]       = useState("");

  // Collection dropdown options — same source as NFT Studio / Profile.
  useEffect(() => {
    fetch(`${API_URL}/collections?per_page=100`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setCollections(d.data?.data || d.data || []); })
      .catch(() => {});
  }, []);

  function reset() {
    setStep("idle");
    setPreview(null);
    setError("");
  }

  async function handlePreview() {
    setError("");
    if (!connected || !walletAddress) return setError("Please connect your wallet first.");
    if (!mintAddress.trim())          return setError("Please enter a mint address.");

    setStep("previewing");
    try {
      const res  = await fetch(`${API_URL}/nft/import/preview`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ mint_address: mintAddress.trim(), wallet_address: walletAddress }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Could not find this NFT.");
      setPreview(data.data);
      setStep("preview");
    } catch (e) {
      setError(e.message || "Failed to look up this NFT.");
      setStep("idle");
    }
  }

  async function handleImport() {
    setError("");
    setStep("importing");
    try {
      const res  = await fetch(`${API_URL}/nft/import`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          mint_address:   mintAddress.trim(),
          wallet_address: walletAddress,
          category,
          country: country || undefined,
          collection_id: collectionId || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Import failed.");
      setStep("done");
    } catch (e) {
      setError(e.message || "Failed to import this NFT.");
      setStep("preview");
    }
  }

  return (
    <Container>
      <div className="max-w-lg mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-black">Import an NFT</h1>
            <p className="text-black/40 text-sm mt-1">
              Bring an NFT you already own on Solana onto this platform so you can list it here.
            </p>
          </div>
          <WalletButton />
        </div>

        {!connected && (
          <div className="rounded-2xl border border-black/8 bg-black/[0.02] p-6 text-center text-black/40 text-sm">
            Connect your wallet to import an NFT.
          </div>
        )}

        {connected && step !== "done" && (
          <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-6 space-y-4">
            <div>
              <label className="text-black/40 text-[10px] uppercase tracking-wider">Mint Address</label>
              <input
                type="text"
                value={mintAddress}
                onChange={(e) => { setMintAddress(e.target.value); if (preview) reset(); }}
                placeholder="e.g. 2bVypXfQxQ4mA6oN1mQY9nJxvYgk3jvR8W8j6qJQx4rN"
                className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-mono text-black bg-white placeholder:text-black/30 focus:outline-none focus:border-orange-400"
              />
              <p className="text-black/30 text-xs mt-1">
                Find this on the NFT's page on the marketplace it's currently listed on (sometimes called "Mint Address", "Token Address", or "Contract Address").
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/8 border border-red-500/15 text-red-600 text-xs px-3 py-2.5">
                {error}
              </div>
            )}

            {step === "preview" && preview && (
              <div className="rounded-2xl border border-black/8 overflow-hidden">
                <div className="aspect-square bg-black/4">
                  {preview.image_url ? (
                    <img src={preview.image_url} alt={preview.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-black/15 text-xs">No image</div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-black text-sm truncate">{preview.name}</p>
                    <Badge color={preview.token_standard === "mpl_core" ? "orange" : "gray"}>
                      {preview.token_standard === "mpl_core" ? "mpl-core" : "legacy standard"}
                    </Badge>
                  </div>
                  {preview.description && (
                    <p className="text-black/40 text-xs line-clamp-2">{preview.description}</p>
                  )}
                  <p className="text-black/30 text-[11px]">
                    Royalty: {((preview.seller_fee_basis_points || 0) / 100).toFixed(2)}%
                  </p>
                  <p className="text-black/30 text-[11px] font-mono truncate">
                    Owner verified: {preview.current_owner?.slice(0, 6)}...{preview.current_owner?.slice(-4)}
                  </p>
                </div>
              </div>
            )}

            {step === "preview" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-black/40 text-[10px] uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm text-black bg-white capitalize focus:outline-none focus:border-orange-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} className="capitalize">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-black/40 text-[10px] uppercase tracking-wider">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={{ colorScheme: "light" }}
                    className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm text-black bg-white focus:outline-none focus:border-orange-400"
                  >
                    <option value="">— No country —</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-black/40 text-[10px] uppercase tracking-wider">Collection</label>
                  <select
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    style={{ colorScheme: "light" }}
                    className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm text-black bg-white focus:outline-none focus:border-orange-400"
                  >
                    <option value="">— No collection —</option>
                    {collections.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  {collections.length === 0 && (
                    <p className="text-black/30 text-[11px] mt-1">No collections exist yet.</p>
                  )}
                </div>
              </div>
            )}

            {step !== "preview" ? (
              <button
                onClick={handlePreview}
                disabled={step === "previewing"}
                className="w-full py-3 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {step === "previewing" ? <Spinner /> : null}
                {step === "previewing" ? "Looking up NFT..." : "Look Up NFT"}
              </button>
            ) : (
              <button
                onClick={handleImport}
                disabled={step === "importing"}
                className="w-full py-3 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {step === "importing" ? <Spinner /> : null}
                {step === "importing" ? "Importing..." : "Import This NFT"}
              </button>
            )}
          </div>
        )}

        {step === "done" && (
          <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <div>
              <p className="font-semibold text-black">Imported successfully</p>
              <p className="text-black/40 text-sm mt-1">You can now list it on the marketplace.</p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/nft-marketplace?tab=my-nfts"
                className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-all text-center"
              >
                Go to My NFTs
              </Link>
              <button
                onClick={() => { setMintAddress(""); setCategory("other"); setCountry(""); setCollectionId(""); reset(); }}
                className="flex-1 py-2.5 rounded-xl border border-black/10 text-black/50 text-sm font-semibold hover:bg-black/5 transition-all"
              >
                Import Another
              </button>
            </div>
          </div>
        )}

        {/* Note about what's supported */}
        <div className="mt-6 rounded-xl bg-black/[0.02] border border-black/6 p-4 text-black/40 text-xs space-y-1">
          <p>• Only NFTs on <strong>Solana</strong> can be imported — NFTs from Ethereum, Polygon, or other chains aren't supported.</p>
          <p>• You must currently hold the NFT in the wallet you're connected with.</p>
          <p>• Each NFT can only be imported once, and only by its current holder.</p>
        </div>
      </div>
    </Container>
  );
}
