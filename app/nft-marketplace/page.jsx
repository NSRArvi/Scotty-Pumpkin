
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Container from "../components/shared/Container";
// import { useSolanaWallet } from "@/hooks/useWallet";
// import WalletButton from "@/app/components/WalletButton";
// import BuyModal from "@/app/components/BuyModal";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
// const CATEGORIES = ['art', 'music', 'gaming', 'sports',
//         'photography', 'collectible', 'utility', 'other',
//         'fashion', 'jewelry', 'video', 'digital'];
// const formatSolPrice = (price) => {
//     return Number(price).toLocaleString(undefined, {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 9,
//     });
//   };

// // ── On-chain: marketplace transfer delegate ──────────────────────────────
// // Listing an NFT here is free, but a sale later needs to move the actual
// // on-chain asset — and that requires the platform to be an approved
// // "TransferDelegate" on this specific asset (the owner can't be online to
// // sign at the exact moment someone buys it). So listing does ONE on-chain
// // step first: the seller approves the platform's delegate wallet as
// // TransferDelegate authority, signed with the seller's own wallet. The
// // platform only gets to use that authority later, inside an atomic
// // transaction that also carries the buyer's payment — never on its own.
// // Retries a Umi instruction builder on transient "blockhash not found"
// // failures (the blockhash can expire — ~60-90s — while the user is still
// // looking at the wallet approval popup, or an RPC node can lag behind).
// // Each retry calls buildFn() again so a FRESH blockhash gets fetched,
// // rather than re-sending the same now-stale transaction.
// async function sendWithBlockhashRetry(buildFn, umi, attempts = 3) {
//   let lastErr;
//   for (let i = 0; i < attempts; i++) {
//     try {
//       return await buildFn().sendAndConfirm(umi, { confirm: { commitment: "confirmed" } });
//     } catch (err) {
//       lastErr = err;
//       // Covers two related but differently-worded transient failures:
//       // 1. "Blockhash not found" — the blockhash expired before the tx
//       //    was even accepted (e.g. wallet approval took too long).
//       // 2. "TransactionExpiredBlockheightExceededError" / "block height
//       //    exceeded" — the tx WAS submitted, but confirmation polling
//       //    didn't see it land before its blockhash's valid block height
//       //    passed (common on a slow/unreliable public RPC's WebSocket).
//       //    The tx may well have actually landed — rebuilding and
//       //    resending is safe here because addPlugin's PluginAlreadyExists
//       //    recovery path above already handles "it actually succeeded".
//       const message = err?.message || "";
//       const isRetryableTiming = /blockhash/i.test(message) || /block ?height exceeded/i.test(message) || /TransactionExpired/i.test(message);
//       if (!isRetryableTiming || i === attempts - 1) throw err;
//       await new Promise((r) => setTimeout(r, 500 * (i + 1)));
//     }
//   }
//   throw lastErr;
// }

// async function grantTransferDelegate({ mintAddress, walletAddress, signTransaction, signAllTransactions, delegateWallet, rpcUrl }) {
//   const { createUmi }             = await import("@metaplex-foundation/umi-bundle-defaults");
//   const { walletAdapterIdentity } = await import("@metaplex-foundation/umi-signer-wallet-adapters");
//   const { mplCore, addPlugin, approvePluginAuthority, revokePluginAuthority, fetchAsset } = await import("@metaplex-foundation/mpl-core");
//   const { publicKey: umiPk } = await import("@metaplex-foundation/umi");
//   const { PublicKey }        = await import("@solana/web3.js");

//   const umi = createUmi(rpcUrl).use(mplCore());
//   umi.use(walletAdapterIdentity({
//     publicKey:           new PublicKey(walletAddress),
//     signTransaction:     (tx)  => signTransaction(tx),
//     signAllTransactions: (txs) => signAllTransactions ? signAllTransactions(txs) : Promise.all(txs.map(signTransaction)),
//   }));

//   // IMPORTANT: addPlugin() itself calls pluginAuthorityPairV2() internally to
//   // wrap whatever `plugin` we pass. It expects a FLAT descriptor here
//   // ({ type, authority }) — NOT the result of pluginAuthorityPair()/
//   // addressPluginAuthority(), which pre-wraps it into { plugin, authority }.
//   // Pre-wrapping it caused a double-wrap: pluginAuthorityPairV2() then read
//   // `type`/`authority` off the WRONG (already-wrapped) shape, silently
//   // failing to set the Address authority — the plugin got added but never
//   // actually delegated to the platform wallet, which is exactly why
//   // transfer() later failed on-chain with "NoApprovals" (0x1a).
//   const plugin = {
//     type:      "TransferDelegate",
//     authority: { type: "Address", address: umiPk(delegateWallet) },
//   };

//   try {
//     await sendWithBlockhashRetry(
//       () => addPlugin(umi, { asset: umiPk(mintAddress), plugin }),
//       umi
//     );
//   } catch (err) {
//     // "PluginAlreadyExists" (mpl-core error code 0xf) means a
//     // TransferDelegate plugin is already sitting on this asset — most
//     // often because an EARLIER attempt actually landed on-chain even
//     // though the client saw a timeout/"Blockhash not found" error (a
//     // known false-negative: the tx can still confirm after the client
//     // gives up waiting on it). Simply re-running addPlugin will always
//     // fail in that case, leaving the user stuck retrying forever.
//     const message = err?.message || "";
//     const isPluginAlreadyExists = /already exist/i.test(message) || /\b0xf\b/i.test(message) || /PluginAlreadyExists/i.test(message);
//     if (!isPluginAlreadyExists) throw err;

//     // mpl-core refuses to redelegate a plugin that already has an Address
//     // authority in one step ("cannot redelegate a delegated plugin
//     // without revoking first" — error 0x1b) — approvePluginAuthority()
//     // alone isn't enough here. First check whether it's already
//     // delegated to the right wallet (common case: this exact earlier
//     // attempt already succeeded) so we can skip straight to done without
//     // asking for another wallet signature; only revoke + re-approve when
//     // it's actually pointing somewhere else.
//     let alreadyCorrect = false;
//     try {
//       const asset = await fetchAsset(umi, umiPk(mintAddress));
//       const currentAddress = asset?.transferDelegate?.authority?.address;
//       if (currentAddress && String(currentAddress) === String(umiPk(delegateWallet))) {
//         alreadyCorrect = true;
//       }
//     } catch (_) {
//       // Couldn't read current plugin state — fall through and just
//       // revoke + re-approve unconditionally below; that's safe either way.
//     }

//     if (alreadyCorrect) return;

//     await sendWithBlockhashRetry(
//       () => revokePluginAuthority(umi, { asset: umiPk(mintAddress), plugin: { type: "TransferDelegate" } }),
//       umi
//     );
//     await sendWithBlockhashRetry(
//       () => approvePluginAuthority(umi, {
//         asset:  umiPk(mintAddress),
//         plugin: { type: "TransferDelegate" },
//         newAuthority: { type: "Address", address: umiPk(delegateWallet) },
//       }),
//       umi
//     );
//   }
// }

// // Unlisting revokes that same authority — once you pull a listing, the
// // platform should no longer be able to move this NFT.
// async function revokeTransferDelegate({ mintAddress, walletAddress, signTransaction, signAllTransactions, rpcUrl }) {
//   const { createUmi }             = await import("@metaplex-foundation/umi-bundle-defaults");
//   const { walletAdapterIdentity } = await import("@metaplex-foundation/umi-signer-wallet-adapters");
//   const { mplCore, removePlugin } = await import("@metaplex-foundation/mpl-core");
//   const { publicKey: umiPk }      = await import("@metaplex-foundation/umi");
//   const { PublicKey }             = await import("@solana/web3.js");

//   const umi = createUmi(rpcUrl).use(mplCore());
//   umi.use(walletAdapterIdentity({
//     publicKey:           new PublicKey(walletAddress),
//     signTransaction:     (tx)  => signTransaction(tx),
//     signAllTransactions: (txs) => signAllTransactions ? signAllTransactions(txs) : Promise.all(txs.map(signTransaction)),
//   }));

//   try {
//     await sendWithBlockhashRetry(
//       () => removePlugin(umi, { asset: umiPk(mintAddress), plugin: { type: "TransferDelegate" } }),
//       umi
//     );
//   } catch (err) {
//     // If the plugin is already gone (e.g. an earlier unlist attempt landed
//     // on-chain despite a client-side timeout, same false-negative as
//     // above), there's nothing left to revoke — that's already the state
//     // we wanted, so treat it as success rather than blocking the user.
//     const message = err?.message || "";
//     const isAlreadyGone = /doesn.?t exist|not found|PluginNotFound/i.test(message);
//     if (!isAlreadyGone) throw err;
//   }
// }

// // Same idea, for legacy-standard (imported) NFTs — plain SPL Token
// // `approve`/`revoke` instead of an mpl-core plugin. The seller signs
// // this themselves; the platform only gets to use the delegated
// // authority later, inside the atomic buy transaction.
// async function grantSplTokenDelegate({ mintAddress, walletAddress, signTransaction, delegateWallet, rpcUrl }) {
//   const { Connection, PublicKey, Transaction } = await import("@solana/web3.js");
//   const { getAssociatedTokenAddress, createApproveInstruction, TOKEN_PROGRAM_ID } = await import("@solana/spl-token");

//   const connection = new Connection(rpcUrl, "confirmed");
//   const mint     = new PublicKey(mintAddress);
//   const owner    = new PublicKey(walletAddress);
//   const delegate = new PublicKey(delegateWallet);
//   const ownerAta = await getAssociatedTokenAddress(mint, owner);

//   const tx = new Transaction().add(
//     createApproveInstruction(ownerAta, delegate, owner, 1, [], TOKEN_PROGRAM_ID)
//   );

//   const { blockhash } = await connection.getLatestBlockhash("confirmed");
//   tx.recentBlockhash = blockhash;
//   tx.feePayer = owner;

//   const signedTx = await signTransaction(tx);
//   const signature = await connection.sendRawTransaction(signedTx.serialize(), {
//     skipPreflight: false, preflightCommitment: "confirmed",
//   });
//   await connection.confirmTransaction(signature, "confirmed");
//   return signature;
// }

// async function revokeSplTokenDelegate({ mintAddress, walletAddress, signTransaction, rpcUrl }) {
//   const { Connection, PublicKey, Transaction } = await import("@solana/web3.js");
//   const { getAssociatedTokenAddress, createRevokeInstruction, TOKEN_PROGRAM_ID } = await import("@solana/spl-token");

//   const connection = new Connection(rpcUrl, "confirmed");
//   const mint  = new PublicKey(mintAddress);
//   const owner = new PublicKey(walletAddress);
//   const ownerAta = await getAssociatedTokenAddress(mint, owner);

//   const tx = new Transaction().add(
//     createRevokeInstruction(ownerAta, owner, [], TOKEN_PROGRAM_ID)
//   );

//   const { blockhash } = await connection.getLatestBlockhash("confirmed");
//   tx.recentBlockhash = blockhash;
//   tx.feePayer = owner;

//   const signedTx = await signTransaction(tx);
//   const signature = await connection.sendRawTransaction(signedTx.serialize(), {
//     skipPreflight: false, preflightCommitment: "confirmed",
//   });
//   await connection.confirmTransaction(signature, "confirmed");
//   return signature;
// }

// // ── Reusable ─────────────────────────────────────────────────────────────

// function Badge({ children, color = "orange" }) {
//   const colors = {
//     orange: "bg-orange-500/15 text-orange-500 border-orange-500/20",
//     green:  "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
//     gray:   "bg-black/6 text-black/40 border-black/10",
//   };
//   return (
//     <span className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold uppercase tracking-wider ${colors[color]}`}>
//       {children}
//     </span>
//   );
// }

// function Spinner() {
//   return <div className="w-5 h-5 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />;
// }



// // ── NFT Card ─────────────────────────────────────────────────────────────

// // ── Shows every currently-listed copy of one edition, each linking to its
// // own purchase page — for when a grouped marketplace card's "X available"
// // badge is clicked and the buyer wants to see/pick among all of them
// // instead of only the cheapest one the card itself links to. ──────────────
// function EditionListingsModal({ editionGroupId, fallbackName, onClose }) {
//   const [listings, setListings] = useState(null); // null = loading
//   const [error, setError]       = useState("");

//   useEffect(() => {
//     if (!editionGroupId) { setError("This item has no edition to show."); return; }
//     let cancelled = false;
//     fetch(`${API_URL}/marketplace/edition/${editionGroupId}/listings`)
//       .then((r) => r.json())
//       .then((d) => {
//         if (cancelled) return;
//         if (d.success) setListings(d.data || []);
//         else setError(d.message || "Couldn't load listings.");
//       })
//       .catch(() => { if (!cancelled) setError("Couldn't load listings."); });
//     return () => { cancelled = true; };
//   }, [editionGroupId]);

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
//       <div
//         className="w-full max-w-md max-h-[80vh] rounded-2xl border border-black/10 bg-white shadow-xl p-6 flex flex-col gap-4"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <p className="text-black font-bold text-lg">Available Copies</p>
//             <p className="text-black/40 text-sm mt-0.5 truncate">{fallbackName}</p>
//           </div>
//           <button onClick={onClose} className="shrink-0 w-8 h-8 rounded-full hover:bg-black/5 flex items-center justify-center text-black/40 cursor-pointer">
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
//           </button>
//         </div>

//         {error && <p className="text-red-500 text-sm">{error}</p>}

//         {!error && listings === null && (
//           <div className="flex items-center justify-center py-10"><Spinner /></div>
//         )}

//         {!error && listings && (
//           <div className="overflow-y-auto flex flex-col gap-2 -mx-1 px-1">
//             {listings.map((l) => (
//               <Link
//                 key={l.id}
//                 href={`/purchase/${l.mint_address}`}
//                 className="flex items-center justify-between gap-3 p-3 rounded-xl border border-black/8 hover:border-orange-500/40 hover:bg-orange-500/5 transition-all"
//               >
//                 <span className="text-black/50 text-xs font-semibold">
//                   Edition #{l.edition_number || "?"} of {l.total_supply || listings.length}
//                 </span>
//                 <span className="text-orange-500 font-bold text-sm font-mono">
//                   {Number(l.list_price).toLocaleString()} {(l.list_currency || "spump").toUpperCase()}
//                 </span>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function NftCard({ nft, walletAddress, onList, onUnlist, myNftsMode, onBuySuccess }) {
//   const [showListModal, setShowListModal]     = useState(false);
//   const [showBuyModal, setShowBuyModal]       = useState(false);
//   const [showEditionModal, setShowEditionModal] = useState(false);
//   const [listPrice, setListPrice]         = useState(nft.list_price || "");
//   const [listCurrency, setListCurrency]   = useState(nft.list_currency || "spump");
//   const [loading, setLoading]             = useState(false);
//   const isOwner = nft.wallet_address === walletAddress;

//   const LIST_CURRENCIES = [
//     { id: "spump", label: "SPUMP" },
//     { id: "usdc",  label: "USDC" },
//   ];

//   // No conversion here — the backend stores list_price EXACTLY as given,
//   // denominated in list_currency (spump or usdc). Whatever the seller
//   // types and picks is exactly what gets sent and stored.
//   async function handleList() {
//     if (!listPrice || parseFloat(listPrice) < 0) return;
//     setLoading(true);
//     await onList(nft, parseFloat(listPrice), listCurrency);
//     setLoading(false);
//     setShowListModal(false);
//   }

//   async function handleUnlist() {
//     setLoading(true);
//     await onUnlist(nft);
//     setLoading(false);
//   }
//   //export default function NftCard({ nft })

  
//   return (
//     <>
//       <div className="group rounded-2xl border border-black/8 bg-white shadow-sm hover:border-black/15 hover:shadow-md transition-all overflow-hidden flex flex-col">
//         <Link href={`/nft-marketplace/${nft.mint_address || nft.id}`}>
//         {/* Image */}
//         <div className="relative aspect-square bg-black/4 overflow-hidden">
//           {nft.image_url ? (
//             <img src={`https://ipfs.io/ipfs/${nft.image_hash}`} alt={nft.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//           ) : (
//             <div className="w-full h-full flex items-center justify-center text-black/15">
//               <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1} />
//                 <path strokeLinecap="round" strokeWidth={1} d="M3 16l5-5 4 4 3-3 6 6" />
//               </svg>
//             </div>
//           )}
//           <div className="absolute top-2 left-2"><Badge color="gray">{nft.category}</Badge></div>
//           {nft.is_listed && <div className="absolute top-2 right-2"><Badge color="green">Listed</Badge></div>}
//         </div>
//         </Link>
//         {/* Info */}
//         <div className="p-4 flex flex-col gap-3 flex-1">
//           <div>
//             {/* NFT name → single page link */}
//             <Link href={`/nft-marketplace/${nft.mint_address || nft.id}`}>
//               <p className="text-black font-semibold text-sm truncate">{nft.name}</p>
//             </Link>
//             <p className="text-black/35 text-xs font-mono truncate mt-0.5">
//               {nft.mint_address ? `${nft.mint_address.slice(0,6)}...${nft.mint_address.slice(-4)}` : "—"}
//             </p>
//             {nft.total_supply > 1 && (
//               <p className="text-orange-500/80 text-[10px] font-semibold mt-1">
//                 Edition #{nft.edition_number || "?"} of {nft.total_supply}
//               </p>
//             )}
//           </div>

//           <div className="flex items-end justify-between">
//             <div>
//               <p className="text-black/35 text-[10px] uppercase tracking-wider mb-0.5">
//                 {nft.listed_copies_count > 1 ? "Price (from)" : "Price"}
//               </p>
//               <p className="text-orange-500 font-bold text-lg font-mono">
//                 {nft.is_listed ? `${Number(nft.list_price).toLocaleString()} ${(nft.list_currency || "spump").toUpperCase()}` : "—"}
//               </p>
//             </div>
//             {nft.listed_copies_count > 1 ? (
//               <button
//                 type="button"
//                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEditionModal(true); }}
//                 className="cursor-pointer"
//               >
//                 <Badge color="orange">{nft.listed_copies_count} available</Badge>
//               </button>
//             ) : (
//               nft.royalty > 0 && <p className="text-black/30 text-[10px]">{nft.royalty}% royalty</p>
//             )}
//           </div>

//           <div className="mt-auto pt-2 border-t border-black/6 space-y-2">
//             {isOwner || myNftsMode ? (
//               nft.is_listed ? (
//                 <button
//                   onClick={handleUnlist}
//                   disabled={loading}
//                   className="w-full py-2 rounded-xl border border-black/10 text-black/50 text-xs font-semibold hover:bg-black/5 hover:text-black transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
//                 >
//                   {loading ? <Spinner /> : "Unlist from Marketplace"}
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => setShowListModal(true)}
//                   disabled={loading}
//                   className="w-full py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
//                 >
//                   {loading ? <Spinner /> : "List for Sale →"}
//                 </button>
//               )
//             ) : 
//             // (
//             //   <button
//             //     onClick={() => setShowBuyModal(true)}
//             //     className="w-full py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold hover:bg-orange-400 transition-colors cursor-pointer"
//             //   >
//             //     Buy Now
//             //   </button>
//             // )

//             nft.is_listed ? (
//               // ── Buy Now → deferant Purchase page ──
//               <Link
//                 href={`/purchase/${nft.mint_address}`}
//                 className="block w-full py-2 rounded-xl bg-orange-500 text-white text-xs font-semibold text-center hover:bg-orange-400 transition-colors cursor-pointer"
//               >
//                 Buy Now
//               </Link>
//             ) : (
//               <div className="w-full py-2 rounded-xl border border-black/8 text-black/25 text-xs font-medium text-center">
//                 Not for sale
//               </div>
//             )}

//             {nft.mint_address && (
//               <a
//                 href={`https://explorer.solana.com/address/${nft.mint_address}?cluster=devnet`}
//                 target="_blank" rel="noreferrer"
//                 className="block text-center text-black/30 text-[10px] hover:text-black/60 transition-colors"
//               >
//                 View on Explorer ↗
//               </a>
              
//             )}
//           </div>
//         </div>
//       </div>

//       {/* List Modal */}
//       {showListModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
//           <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-white shadow-xl p-6 space-y-5">
//             <div>
//               <p className="text-black font-bold text-lg">List NFT for Sale</p>
//               <p className="text-black/40 text-sm mt-1 truncate">{nft.name}</p>
//             </div>
//             {nft.image_url && <img src={nft.image_url} alt={nft.name} className="w-full h-40 object-cover rounded-xl" />}
//             <div className="space-y-2">
//               <label className="text-[11px] font-medium text-black/40 uppercase tracking-wider">Currency</label>
//               <div className="flex gap-2">
//                 {LIST_CURRENCIES.map((c) => (
//                   <button
//                     key={c.id}
//                     onClick={() => setListCurrency(c.id)}
//                     className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
//                       listCurrency === c.id
//                         ? "bg-orange-500/15 border-orange-500/40 text-orange-500"
//                         : "bg-black/5 border-black/10 text-black/40 hover:text-black/60"
//                     }`}
//                   >
//                     {c.label}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div className="space-y-2">
//               <label className="text-[11px] font-medium text-black/40 uppercase tracking-wider">Listing Price</label>
//               <div className="flex items-center gap-2">
//                 <input
//                   type="number" min="0" step="0.01"
//                   value={listPrice}
//                   onChange={(e) => setListPrice(e.target.value)}
//                   placeholder={listCurrency === "spump" ? "e.g. 5000" : "e.g. 25"}
//                   className="flex-1 px-3.5 py-2.5 rounded-lg bg-black/5 border border-black/10 text-black text-sm placeholder:text-black/30 outline-none focus:border-orange-500/60 transition-all"
//                 />
//                 <span className="text-black/40 text-sm">{listCurrency.toUpperCase()}</span>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button onClick={() => setShowListModal(false)} className="flex-1 py-2.5 rounded-xl border border-black/10 text-black/50 text-sm font-semibold hover:bg-black/5 transition-all cursor-pointer">Cancel</button>
//               <button
//                 onClick={handleList}
//                 disabled={loading || !listPrice}
//                 className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
//               >
//                 {loading ? <Spinner /> : "Confirm Listing"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Buy Modal */}
//       {showBuyModal && (
//         <BuyModal
//           nft={nft}
//           buyerWallet={walletAddress}
//           onClose={() => setShowBuyModal(false)}
//           onSuccess={(data) => {
//             setShowBuyModal(false);
//             onBuySuccess && onBuySuccess();
//           }}
//         />
//       )}

//       {/* Edition Listings Modal — every copy of this edition currently for sale */}
//       {showEditionModal && (
//         <EditionListingsModal
//           editionGroupId={nft.edition_group_id}
//           fallbackName={nft.name}
//           onClose={() => setShowEditionModal(false)}
//         />
//       )}
//     </>
//   );
// }

// // ── Newly Minted NFT Banner ──────────────────────────────────────
// // NFT Studio to redirect  banner 
// function NewlyMintedBanner({ mintAddress, onDismiss }) {
//   return (
//     <div className="mb-8 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-4 flex-wrap">
//       <div className="flex items-center gap-3">
//         <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
//           <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
//           </svg>
//         </div>
//         <div>
//           <p className="text-emerald-600 font-semibold text-sm">NFT minted successfully!</p>
//           <p className="text-black/35 text-xs font-mono truncate max-w-xs">{mintAddress}</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-3">
//         <Link
//           href={`/nft-marketplace/${mintAddress}`}
//           className="px-4 py-2 rounded-xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-400 transition-colors"
//         >
//           View NFT →
//         </Link>
//         <button
//           onClick={onDismiss}
//           className="text-black/30 hover:text-black/60 transition-colors text-lg leading-none"
//         >
//           ✕
//         </button>
//       </div>
//     </div>
//   );
// }

// // ── Main Page ────────────────────────────────────────────────────────────
// // ── Content protection ──────────────────────────────────────────────────
// // Blocks the right-click context menu and common DevTools/Inspect
// // keyboard shortcuts on this page. Note: this only deters casual
// // copying — it cannot stop someone determined (browser menu → More
// // Tools → Developer Tools still works, as does disabling JS). Real
// // protection for the underlying image happens server-side (watermark).
// function useContentProtection() {
//   useEffect(() => {
//     function blockContextMenu(e) { e.preventDefault(); }
//     function blockDevToolsKeys(e) {
//       const key = e.key?.toLowerCase();
//       const blocked =
//         e.key === "F12" ||
//         (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) || // Ctrl+Shift+I/J/C
//         (e.metaKey && e.altKey && ["i", "j", "c"].includes(key)) ||   // Cmd+Opt+I/J/C (Mac)
//         ((e.ctrlKey || e.metaKey) && key === "u");                    // Ctrl/Cmd+U (view source)
//       if (blocked) e.preventDefault();
//     }
//     document.addEventListener("contextmenu", blockContextMenu);
//     document.addEventListener("keydown", blockDevToolsKeys);
//     return () => {
//       document.removeEventListener("contextmenu", blockContextMenu);
//       document.removeEventListener("keydown", blockDevToolsKeys);
//     };
//   }, []);
// }

// export default function MarketplacePage() {
//   useContentProtection();

//   const {
//     connected,
//     walletAddress,
//     walletIcon,
//     connect,
//     signTransaction,
//     signAllTransactions,
//   } = useSolanaWallet();

//   const [delegateWallet, setDelegateWallet] = useState("");

//   const [activeTab, setActiveTab] = useState("marketplace");

//   const [nfts, setNfts]         = useState([]);
//   const [myNfts, setMyNfts]     = useState([]);
//   const [loading, setLoading]   = useState(true);
//   const [error, setError]       = useState("");
//   const [toast, setToast]       = useState("");

//   const [search, setSearch]     = useState("");
//   const [category, setCategory] = useState("all");
//   const [collectionId, setCollectionId] = useState("all");
//   const [collections, setCollections]   = useState([]);
//   const [sort, setSort]         = useState("latest");
//   const [page, setPage]         = useState(1);
//   const [lastPage, setLastPage] = useState(1);

//   // Collection dropdown options — fetched once, independent of the
//   // marketplace pagination/filters above.
//   useEffect(() => {
//     fetch(`${API_URL}/collections?per_page=100`)
//       .then((r) => r.json())
//       .then((d) => { if (d.success) setCollections(d.data.data || []); })
//       .catch(() => {});
//   }, []);

//   // ── Fetch Marketplace ──────────────────────────────
//   const fetchMarketplace = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const params = new URLSearchParams({ page, sort });
//       if (search) params.append("search", search);
//       if (category !== "all") params.append("category", category);
//       if (collectionId !== "all") params.append("collection_id", collectionId);
//       const res  = await fetch(`${API_URL}/marketplace?${params}`);
//       const data = await res.json();
//       if (data.success) {
//         setNfts(data.data.data || []);
//         setLastPage(data.data.last_page || 1);
//       }
//     } catch (e) { setError("Failed to load marketplace."); }
//     finally { setLoading(false); }
//   }, [page, search, category, collectionId, sort]);

//   // ── Fetch My NFTs ──────────────────────────────
//   const fetchMyNfts = useCallback(async () => {
//     if (!walletAddress) return;
//     setLoading(true);
//     try {
//       const res  = await fetch(`${API_URL}/marketplace/my-nfts/${walletAddress}`);
//       const data = await res.json();
//       if (data.success) setMyNfts(data.data || []);
//     } catch (e) { setError("Failed to load your NFTs."); }
//     finally { setLoading(false); }
//   }, [walletAddress]);

//   useEffect(() => {
//     if (activeTab === "marketplace") fetchMarketplace();
//     else if (activeTab === "my-nfts" && walletAddress) fetchMyNfts();
//   }, [activeTab, fetchMarketplace, fetchMyNfts, walletAddress]);

//   // ── Platform delegate wallet (needed to list) ──────────────
//   useEffect(() => {
//     fetch(`${API_URL}/config`)
//       .then(r => r.json())
//       .then(d => { if (d.success) setDelegateWallet(d.data.delegate_wallet || ""); })
//       .catch(() => {});
//   }, []);

//   // ── List ──────────────────────────────
//   async function handleList(nft, price, currency) {
//     try {
//       if (!delegateWallet) {
//         setError("Marketplace isn't fully configured yet (missing delegate wallet). Please contact support.");
//         return;
//       }
//       if (!nft.mint_address) {
//         setError("This NFT is missing its on-chain mint address and can't be listed.");
//         return;
//       }

//       const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
//       // Always prefer a configured dedicated RPC (NEXT_PUBLIC_SOLANA_RPC_URL)
//       // over the public endpoint — see SolanaWalletProvider for why.
//       const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || (
//         network === "mainnet-beta"
//           ? "https://api.mainnet-beta.solana.com"
//           : "https://api.devnet.solana.com"
//       );

//       // On-chain step first: approve the platform as this asset's
//       // transfer delegate, so a sale later can actually move
//       // ownership. You sign this now with your own wallet — the
//       // platform can't touch your NFT until someone actually buys it
//       // and pays. Which instruction this needs depends on how the NFT
//       // was minted (this platform's own Studio = mpl-core; imported
//       // NFTs are usually the older/most common Solana standard).
//       const tokenStandard = nft.token_standard || "mpl_core";

//       if (tokenStandard === "mpl_core") {
//         await grantTransferDelegate({
//           mintAddress: nft.mint_address,
//           walletAddress,
//           signTransaction,
//           signAllTransactions,
//           delegateWallet,
//           rpcUrl,
//         });
//       } else {
//         await grantSplTokenDelegate({
//           mintAddress: nft.mint_address,
//           walletAddress,
//           signTransaction,
//           delegateWallet,
//           rpcUrl,
//         });
//       }

//       // list_price is stored EXACTLY as entered, denominated in
//       // list_currency (spump or usdc) — no SOL conversion, no implicit
//       // rate involved at listing time.
//       const res  = await fetch(`${API_URL}/marketplace/list`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json", "Accept": "application/json" },
//         body: JSON.stringify({
//           nft_id: nft.id,
//           wallet_address: walletAddress,
//           list_price: price,
//           list_currency: currency || "spump",
//         }),
//       });
//       const data = await res.json();
//       if (data.success) { showToast("NFT listed successfully! 🎉"); fetchMyNfts(); fetchMarketplace(); }
//       else setError(data.message);
//     } catch (e) {
//       console.error("List error:", e);
//       const msg = e?.message || "";
//       if (msg.includes("User rejected") || msg.includes("User declined")) {
//         setError("Listing cancelled — you declined the wallet approval.");
//       } else {
//         setError("Failed to list NFT. Please try again.");
//       }
//     }
//   }

//   // ── Unlist ──────────────────────────────
//   async function handleUnlist(nft) {
//     try {
//       const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";
//       // Always prefer a configured dedicated RPC (NEXT_PUBLIC_SOLANA_RPC_URL)
//       // over the public endpoint — see SolanaWalletProvider for why.
//       const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || (
//         network === "mainnet-beta"
//           ? "https://api.mainnet-beta.solana.com"
//           : "https://api.devnet.solana.com"
//       );

//       // Revoke the platform's transfer authority on-chain first — once
//       // you unlist, the platform shouldn't be able to move this NFT
//       // anymore. If there's nothing to revoke (e.g. it was never
//       // granted), don't block unlisting on that — just log it.
//       if (nft.mint_address) {
//         try {
//           const tokenStandard = nft.token_standard || "mpl_core";
//           if (tokenStandard === "mpl_core") {
//             await revokeTransferDelegate({
//               mintAddress: nft.mint_address,
//               walletAddress,
//               signTransaction,
//               signAllTransactions,
//               rpcUrl,
//             });
//           } else {
//             await revokeSplTokenDelegate({
//               mintAddress: nft.mint_address,
//               walletAddress,
//               signTransaction,
//               rpcUrl,
//             });
//           }
//         } catch (revokeErr) {
//           console.warn("Revoke transfer delegate warning:", revokeErr);
//         }
//       }

//       const res  = await fetch(`${API_URL}/marketplace/unlist`, {
//         method:  "POST",
//         headers: { "Content-Type": "application/json", "Accept": "application/json" },
//         body: JSON.stringify({ nft_id: nft.id, wallet_address: walletAddress }),
//       });
//       const data = await res.json();
//       if (data.success) { showToast("NFT unlisted."); fetchMyNfts(); fetchMarketplace(); }
//       else setError(data.message);
//     } catch (e) { setError(e.message); }
//   }

//   function showToast(msg) {
//     setToast(msg);
//     setTimeout(() => setToast(""), 3000);
//   }

//   const displayNfts = activeTab === "my-nfts" ? myNfts : nfts;

//   return (
//     <div className="min-h-screen bg-[#F3EFE6] text-black">
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/4 blur-3xl" />
//         <div className="absolute bottom-0 -right-60 w-[500px] h-[500px] rounded-full bg-purple-600/4 blur-3xl" />
//       </div>

//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-6 right-6 z-50 px-5 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 text-sm font-medium shadow-xl">
//           {toast}
//         </div>
//       )}

//       <div className="relative">
//         <Container>
//           <div className="pt-16 pb-24">

//             {/* Header */}
//             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
//               <div>
//                 <div className="flex items-center gap-2 mb-3">
//                   <span className="h-px w-8 bg-orange-500/40" />
//                   <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-500">Scotty Pumpkin Ecosystem</span>
//                 </div>
//                 <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
//                   Market<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">place</span>
//                 </h1>
//                 <p className="text-black/40 text-sm mt-3">Buy & sell NFTs. List free — pay 3% only on sale.</p>
//               </div>

//               {/* WalletButton —  wallet support */}
//               <div className="flex items-center gap-3">
//                 {connected && walletIcon && (
//                   <img src={walletIcon} alt="wallet" className="w-5 h-5 rounded-full" />
//                 )}
//                 <WalletButton />
//               </div>
//             </div>

//             {/* Error */}
//             {error && (
//               <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-sm flex items-center gap-2">
//                 <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
//                 {error}
//               </div>
//             )}

//             {/* Tabs */}
//             <div className="flex items-center justify-between mb-8">
//               <div className="flex gap-1 p-1 rounded-xl bg-white border border-black/8 shadow-sm w-fit">
//                 {[
//                   { key: "marketplace", label: "Marketplace" },
//                   { key: "my-nfts",    label: "My NFTs" },
//                 ].map((tab) => (
//                   <button
//                     key={tab.key}
//                     onClick={() => { setActiveTab(tab.key); setError(""); }}
//                     className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${activeTab === tab.key ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-black/40 hover:text-black"}`}
//                   >
//                     {tab.label}
//                     {tab.key === "my-nfts" && myNfts.length > 0 && (
//                       <span className="ml-2 px-1.5 py-0.5 rounded-full bg-black/8 text-[10px] text-black/60">{myNfts.length}</span>
//                     )}
//                   </button>
//                 ))}
//               </div>

//               {activeTab === "my-nfts" && connected && (
//                 <Link
//                   href="/nft-import"
//                   className="px-4 py-2 rounded-xl border border-black/10 text-black/60 text-sm font-semibold hover:bg-black/5 transition-all"
//                 >
//                   + Import NFT
//                 </Link>
//               )}
//             </div>

//             {/* Filters */}
//             {activeTab === "marketplace" && (
//               <div className="flex flex-wrap gap-3 mb-8">
//                 <div className="relative flex-1 min-w-[200px]">
//                   <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/25" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" /></svg>
//                   <input
//                     type="text" placeholder="Search NFTs..."
//                     value={search}
//                     onChange={(e) => { setSearch(e.target.value); setPage(1); }}
//                     className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-black/10 text-black text-sm placeholder:text-black/30 outline-none focus:border-orange-500/60 transition-all"
//                   />
//                 </div>
//                 {/* <div className="flex gap-1 flex-wrap">
//                   {CATEGORIES.map((c) => (
//                     <button
//                       key={c}
//                       onClick={() => { setCategory(c); setPage(1); }}
//                       className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${category === c ? "bg-orange-500 text-white" : "bg-white border border-black/8 text-black/40 hover:text-black hover:border-black/20"}`}
//                     >
//                       {c}
//                     </button>
//                   ))}
//                 </div> */}
//                 <select
//                   value={category}
//                   onChange={(e) => {
//                     setCategory(e.target.value);
//                     setPage(1);
//                   }}
//                   className="px-3.5 py-2.5 rounded-xl bg-white border border-black/10 text-black/60 text-sm outline-none focus:border-orange-500/60 cursor-pointer appearance-none max-w-[180px"
//                 >
//                   <option value="all">All Categories</option>

//                   {CATEGORIES.map((c) => (
//                     <option key={c} value={c}>
//                       {c.charAt(0).toUpperCase() + c.slice(1)}
//                     </option>
//                   ))}
//                 </select>
//                 <select
//                   value={collectionId}
//                   onChange={(e) => { setCollectionId(e.target.value); setPage(1); }}
//                   style={{ colorScheme: "light" }}
//                   className="px-3.5 py-2.5 rounded-xl bg-white border border-black/10 text-black/60 text-sm outline-none focus:border-orange-500/60 cursor-pointer appearance-none max-w-[180px]"
//                 >
//                   <option value="all">All Collections</option>
//                   {collections.map((col) => (
//                     <option key={col.id} value={col.id}>{col.name}</option>
//                   ))}
//                 </select>
//                 <select
//                   value={sort}
//                   onChange={(e) => setSort(e.target.value)}
//                   style={{ colorScheme: "light" }}
//                   className="px-3.5 py-2.5 rounded-xl bg-white border border-black/10 text-black/60 text-sm outline-none focus:border-orange-500/60 cursor-pointer appearance-none"
//                 >
//                   <option value="latest">Latest</option>
//                   <option value="price_asc">Price: Low → High</option>
//                   <option value="price_desc">Price: High → Low</option>
//                 </select>
//               </div>
//             )}

//             {/* My NFTs — wallet connect prompt */}
//             {activeTab === "my-nfts" && !connected && (
//               <div className="text-center py-20 space-y-4">
//                 <p className="text-black/40 text-lg">Connect your wallet to see your NFTs</p>
//                 <WalletButton />
//               </div>
//             )}

//             {/* NFT Grid */}
//             {(activeTab === "marketplace" || connected) && (
//               <>
//                 {loading ? (
//                   <div className="flex items-center justify-center py-20">
//                     <div className="flex flex-col items-center gap-4">
//                       <div className="w-8 h-8 rounded-full border-2 border-orange-400 border-t-transparent animate-spin" />
//                       <p className="text-black/40 text-sm">Loading NFTs...</p>
//                     </div>
//                   </div>
//                 ) : displayNfts.length === 0 ? (
//                   <div className="text-center py-20 space-y-3">
//                     <div className="text-5xl">🎨</div>
//                     <p className="text-black/50 text-lg font-medium">
//                       {activeTab === "my-nfts" ? "You haven't minted any NFTs yet" : "No NFTs listed yet"}
//                     </p>
//                     <p className="text-black/30 text-sm">
//                       {activeTab === "my-nfts" ? "Go to NFT Studio to mint your first NFT" : "Be the first to list!"}
//                     </p>
//                     {activeTab === "my-nfts" && (
//                       <a href="/nft-studio" className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors">
//                         Go to NFT Studio →
//                       </a>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                     {displayNfts.map((nft) => (
//                       <NftCard
//                         key={nft.id}
//                         nft={nft}
//                         walletAddress={walletAddress}
//                         onList={handleList}
//                         onUnlist={handleUnlist}
//                         myNftsMode={activeTab === "my-nfts"}
//                         onBuySuccess={() => { showToast("NFT purchased! 🎉"); fetchMarketplace(); }}
//                       />
//                     ))}
//                   </div>
//                 )}

//                 {/* Pagination */}
//                 {activeTab === "marketplace" && lastPage > 1 && (
//                   <div className="flex items-center justify-center gap-2 mt-12">
//                     <button
//                       onClick={() => setPage((p) => Math.max(1, p - 1))}
//                       disabled={page === 1}
//                       className="px-4 py-2 rounded-xl border border-black/10 bg-white text-black/40 text-sm hover:bg-black/5 hover:text-black transition-all disabled:opacity-30 cursor-pointer"
//                     >
//                       ← Prev
//                     </button>
//                     <span className="text-black/40 text-sm px-3">Page {page} / {lastPage}</span>
//                     <button
//                       onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
//                       disabled={page === lastPage}
//                       className="px-4 py-2 rounded-xl border border-black/10 bg-white text-black/40 text-sm hover:bg-black/5 hover:text-black transition-all disabled:opacity-30 cursor-pointer"
//                     >
//                       Next →
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}

//           </div>
//         </Container>
//       </div>
//     </div>
//   );
// }

import MarketplaceClient from "./MarketplaceClient";

export const metadata = {
  title: "Marketplace",
  description: "Buy and sell NFTs on Scotty Pumpkin — pay in SPUMP or USDC. List free, 3% fee only on sale.",
  openGraph: {
    title: "Marketplace | Scotty Pumpkin",
    description: "Buy and sell NFTs on Scotty Pumpkin — pay in SPUMP or USDC. List free, 3% fee only on sale.",
    type: "website",
  },
};

export default function Page() {
  return <MarketplaceClient />;
}
