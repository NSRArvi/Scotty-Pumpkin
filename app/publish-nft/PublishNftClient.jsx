"use client";

import { useState, useEffect, useCallback } from "react";
import Container from "../components/shared/Container";
import { useSolanaWallet } from "@/hooks/useWallet";
import WalletButton from "@/app/components/WalletButton";
import DocsButton from "../components/shared/DocsButton";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const LIST_CURRENCIES = [
  { id: "spump", label: "SPUMP" },
  { id: "usdc", label: "USDC" },
];

function Spinner() {
  return <div className="w-5 h-5 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />;
}

// ── Same on-chain delegate helpers as the marketplace page ──────────────
// (kept identical so behaviour/error-handling matches exactly)
async function sendWithBlockhashRetry(buildFn, umi, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await buildFn().sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });
    } catch (err) {
      lastErr = err;
      const message = err?.message || "";
      const isRetryableTiming = /blockhash/i.test(message) || /block ?height exceeded/i.test(message) || /TransactionExpired/i.test(message);
      if (!isRetryableTiming || i === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw lastErr;
}

async function grantTransferDelegate({ mintAddress, walletAddress, signTransaction, signAllTransactions, delegateWallet, rpcUrl }) {
  const { createUmi } = await import("@metaplex-foundation/umi-bundle-defaults");
  const { walletAdapterIdentity } = await import("@metaplex-foundation/umi-signer-wallet-adapters");
  const { mplCore, addPlugin, approvePluginAuthority, revokePluginAuthority, fetchAsset } = await import("@metaplex-foundation/mpl-core");
  const { publicKey: umiPk } = await import("@metaplex-foundation/umi");
  const { PublicKey } = await import("@solana/web3.js");

  const umi = createUmi(rpcUrl).use(mplCore());
  umi.use(walletAdapterIdentity({
    publicKey: new PublicKey(walletAddress),
    signTransaction: (tx) => signTransaction(tx),
    signAllTransactions: (txs) => signAllTransactions ? signAllTransactions(txs) : Promise.all(txs.map(signTransaction)),
  }));

  const plugin = {
    type: "TransferDelegate",
    authority: { type: "Address", address: umiPk(delegateWallet) },
  };

  try {
    await sendWithBlockhashRetry(
      () => addPlugin(umi, { asset: umiPk(mintAddress), plugin }),
      umi
    );
  } catch (err) {
    const message = err?.message || "";
    const isPluginAlreadyExists = /already exist/i.test(message) || /\b0xf\b/i.test(message) || /PluginAlreadyExists/i.test(message);
    if (!isPluginAlreadyExists) throw err;

    let alreadyCorrect = false;
    try {
      const asset = await fetchAsset(umi, umiPk(mintAddress));
      const currentAddress = asset?.transferDelegate?.authority?.address;
      if (currentAddress && String(currentAddress) === String(umiPk(delegateWallet))) {
        alreadyCorrect = true;
      }
    } catch (_) {}

    if (alreadyCorrect) return;

    await sendWithBlockhashRetry(
      () => revokePluginAuthority(umi, { asset: umiPk(mintAddress), plugin: { type: "TransferDelegate" } }),
      umi
    );
    await sendWithBlockhashRetry(
      () => approvePluginAuthority(umi, {
        asset: umiPk(mintAddress),
        plugin: { type: "TransferDelegate" },
        newAuthority: { type: "Address", address: umiPk(delegateWallet) },
      }),
      umi
    );
  }
}

async function grantSplTokenDelegate({ mintAddress, walletAddress, signTransaction, delegateWallet, rpcUrl }) {
  const { Connection, PublicKey, Transaction } = await import("@solana/web3.js");
  const { getAssociatedTokenAddress, createApproveInstruction, TOKEN_PROGRAM_ID } = await import("@solana/spl-token");

  const connection = new Connection(rpcUrl, "confirmed");
  const mint = new PublicKey(mintAddress);
  const owner = new PublicKey(walletAddress);
  const delegate = new PublicKey(delegateWallet);
  const ownerAta = await getAssociatedTokenAddress(mint, owner);

  const tx = new Transaction().add(
    createApproveInstruction(ownerAta, delegate, owner, 1, [], TOKEN_PROGRAM_ID)
  );

  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  tx.recentBlockhash = blockhash;
  tx.feePayer = owner;

  const signedTx = await signTransaction(tx);
  const signature = await connection.sendRawTransaction(signedTx.serialize(), {
    skipPreflight: false, preflightCommitment: "confirmed",
  });
  await connection.confirmTransaction(signature, "confirmed");
  return signature;
}

// ── Row for one unlisted NFT with an inline publish form ────────────────
function PublishRow({ nft, walletAddress, delegateWallet, signTransaction, signAllTransactions, onPublished }) {
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("spump");
  const [loading, setLoading] = useState(false);
  const [rowError, setRowError] = useState("");

  async function handlePublish() {
    setRowError("");
    if (!price || parseFloat(price) <= 0) {
      setRowError("Enter a valid price.");
      return;
    }
    if (!delegateWallet) {
      setRowError("Marketplace isn't fully configured yet. Please contact support.");
      return;
    }
    if (!nft.mint_address) {
      setRowError("This NFT is missing its on-chain mint address and can't be listed.");
      return;
    }

    setLoading(true);
    try {
      const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
      const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL
        || (network === "mainnet-beta"
            ? "https://api.mainnet-beta.solana.com"
            : "https://api.devnet.solana.com");

      const tokenStandard = nft.token_standard || "mpl_core";

      if (tokenStandard === "mpl_core") {
        await grantTransferDelegate({
          mintAddress: nft.mint_address,
          walletAddress,
          signTransaction,
          signAllTransactions,
          delegateWallet,
          rpcUrl,
        });
      } else {
        await grantSplTokenDelegate({
          mintAddress: nft.mint_address,
          walletAddress,
          signTransaction,
          delegateWallet,
          rpcUrl,
        });
      }

      const res = await fetch(`${API_URL}/marketplace/list`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          nft_id: nft.id,
          wallet_address: walletAddress,
          list_price: parseFloat(price),
          list_currency: currency,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onPublished(nft.id);
      } else {
        setRowError(data.message || "Failed to publish.");
      }
    } catch (e) {
      console.error("Publish error:", e);
      const msg = e?.message || "";
      if (msg.includes("User rejected") || msg.includes("User declined")) {
        setRowError("Cancelled — you declined the wallet approval.");
      } else {
        setRowError("Failed to publish NFT. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-black/8 bg-white shadow-sm">
      <div className="w-16 h-16 rounded-xl bg-black/4 overflow-hidden shrink-0">
        {nft.image_hash ? (
          <img src={`${API_URL}/image/hash/${nft.image_hash}`} alt={nft.name} className="w-full h-full object-cover" />
        ) : null}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-black font-semibold text-sm truncate">{nft.name}</p>
        <p className="text-black/35 text-xs font-mono truncate mt-0.5">
          {nft.mint_address ? `${nft.mint_address.slice(0, 6)}...${nft.mint_address.slice(-4)}` : "—"}
        </p>
        {rowError && <p className="text-red-500 text-xs mt-1">{rowError}</p>}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex gap-1 p-1 rounded-lg bg-black/5 border border-black/10">
          {LIST_CURRENCIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCurrency(c.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                currency === c.id ? "bg-orange-500 text-white" : "text-black/40 hover:text-black/60"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
        <input
          type="number" min="0" step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={currency === "spump" ? "e.g. 5000" : "e.g. 25"}
          className="w-28 px-3 py-2 rounded-lg bg-black/5 border border-black/10 text-black text-sm placeholder:text-black/30 outline-none focus:border-orange-500/60 transition-all"
        />
        <button
          onClick={handlePublish}
          disabled={loading || !price}
          className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {loading ? <Spinner /> : "Publish →"}
        </button>
      </div>
    </div>
  );
}

export default function PublishNftClient() {
  const {
    connected,
    walletAddress,
    connect,
    signTransaction,
    signAllTransactions,
  } = useSolanaWallet();

  const [delegateWallet, setDelegateWallet] = useState("");
  const [myNfts, setMyNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const fetchMyNfts = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/marketplace/my-nfts/${walletAddress}`);
      const data = await res.json();
      if (data.success) setMyNfts(data.data || []);
      else setError(data.message || "Failed to load your NFTs.");
    } catch (e) {
      setError("Failed to load your NFTs.");
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetch(`${API_URL}/config`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setDelegateWallet(d.data.delegate_wallet || ""); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (connected && walletAddress) fetchMyNfts();
    else setLoading(false);
  }, [connected, walletAddress, fetchMyNfts]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function handlePublished(nftId) {
    showToast("NFT published to marketplace! 🎉");
    setMyNfts((prev) => prev.filter((n) => n.id !== nftId));
  }

  const unlisted = myNfts.filter((n) => !n.is_listed);

  return (
    <div className="min-h-screen bg-[#F3EFE6] text-black">
      {toast && (
        <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 text-sm font-medium shadow-xl">
          {toast}
        </div>
      )}

      <Container>
        <div className="pt-16 pb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px w-8 bg-orange-500/40" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-500">Scotty Pumpkin Ecosystem</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
                Publish your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">NFT</span>
              </h1>
              <p className="text-black/40 text-sm mt-3">Set a price and list any of your unlisted NFTs. Listing is free — pay only on sale.</p>
            </div>
            <div className="flex items-center gap-3">
              <WalletButton />
              <Link
                href="/nft-marketplace"
                className="px-4 py-2 rounded-xl border border-black/10 text-black/60 text-sm font-semibold hover:bg-black/5 transition-all whitespace-nowrap"
              >
                ← Marketplace
              </Link>
              <DocsButton href="/docs/publish-nft" />
            </div>
          </div>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm">
              {error}
            </div>
          )}

          {!connected ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-black/40 text-lg">Connect your wallet to publish an NFT</p>
              <WalletButton />
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : unlisted.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="text-5xl">🎨</div>
              <p className="text-black/50 text-lg font-medium">No unlisted NFTs to publish</p>
              <p className="text-black/30 text-sm">Mint one in NFT Studio, or import an existing NFT first.</p>
              <div className="flex items-center justify-center gap-3 mt-3">
                <a href="/nft-studio" className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors">
                  Go to NFT Studio →
                </a>
                <Link href="/nft-import" className="px-5 py-2.5 rounded-xl border border-black/10 text-black/60 text-sm font-semibold hover:bg-black/5 transition-all">
                  + Import NFT
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {unlisted.map((nft) => (
                <PublishRow
                  key={nft.id}
                  nft={nft}
                  walletAddress={walletAddress}
                  delegateWallet={delegateWallet}
                  signTransaction={signTransaction}
                  signAllTransactions={signAllTransactions}
                  onPublished={handlePublished}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}