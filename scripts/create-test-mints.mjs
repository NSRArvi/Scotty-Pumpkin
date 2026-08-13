// Creates two devnet SPL token mints (SPUMP and USDC test tokens) and
// mints test supply into your own wallet — no Solana CLI / Rust needed,
// just Node.js + the packages already in this project.
//
// Usage:
//   node create-test-mints.mjs
//
// What it does:
//   1. Generates a fresh keypair to act as mint authority + payer
//      (or loads one from ./devnet-authority.json if it already exists —
//      run this script twice and it reuses the same authority/mints).
//   2. Airdrops devnet SOL to that keypair (needed to pay network fees).
//   3. Creates two mints (6 decimals each, matching what the backend/
//      frontend already assume).
//   4. Mints 1,000,000 of each into the authority's own token account.
//   5. Prints the two mint addresses to paste into your .env files.
//
// Install deps first (from your project root, or a scratch folder):
//   npm install @solana/web3.js @solana/spl-token

import {
  Connection, Keypair, clusterApiUrl, LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createMint, getOrCreateAssociatedTokenAccount, mintTo,
} from "@solana/spl-token";
import fs from "fs";

const RPC_URL = process.env.SOLANA_RPC_URL || clusterApiUrl("devnet");
// ^ Set SOLANA_RPC_URL to your Helius devnet URL if the public devnet
//   RPC is slow/rate-limited, e.g.:
//   SOLANA_RPC_URL="https://devnet.helius-rpc.com/?api-key=..." node create-test-mints.mjs

const AUTHORITY_FILE = "./devnet-authority.json";
const DECIMALS = 6;
const MINT_SUPPLY = 1_000_000; // whole tokens, pre-decimals

async function main() {
  const connection = new Connection(RPC_URL, "confirmed");

  // ── Authority keypair (reused across runs) ──────────────────────
  let authority;
  if (fs.existsSync(AUTHORITY_FILE)) {
    const secret = JSON.parse(fs.readFileSync(AUTHORITY_FILE, "utf8"));
    authority = Keypair.fromSecretKey(Uint8Array.from(secret));
    console.log("Loaded existing authority:", authority.publicKey.toBase58());
  } else {
    authority = Keypair.generate();
    fs.writeFileSync(AUTHORITY_FILE, JSON.stringify(Array.from(authority.secretKey)));
    console.log("Generated new authority:", authority.publicKey.toBase58());
    console.log("Saved to", AUTHORITY_FILE, "— keep this file, you'll need it again.");
  }

  // ── Airdrop (devnet only — fails/rate-limits sometimes, just retry) ──
  // requestAirdrop is routed through the OFFICIAL public devnet RPC
  // specifically, even if RPC_URL points at Helius/another provider —
  // most third-party RPC providers disable the airdrop method entirely,
  // so retrying against RPC_URL would keep failing no matter the balance.
  const airdropConnection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const balance = await connection.getBalance(authority.publicKey);
  if (balance < 0.5 * LAMPORTS_PER_SOL) {
    console.log("Requesting devnet airdrop (via api.devnet.solana.com)...");
    try {
      const sig = await airdropConnection.requestAirdrop(authority.publicKey, 2 * LAMPORTS_PER_SOL);
      await airdropConnection.confirmTransaction(sig, "confirmed");
      console.log("Airdrop confirmed.");
    } catch (e) {
      console.warn("Airdrop failed:", e.message || e);
      console.warn("The public faucet is often rate-limited per IP (a few requests/day).");
      console.warn("Manually fund this address instead, then re-run:", authority.publicKey.toBase58());
      console.warn("Try: https://faucet.solana.com  (select Devnet, paste the address above)");
      process.exit(1);
    }
  } else {
    console.log("Authority already has", (balance / LAMPORTS_PER_SOL).toFixed(3), "SOL — skipping airdrop.");
  }

  // ── Create + mint both test tokens ──────────────────────────────
  async function createTestToken(label) {
    console.log(`\nCreating ${label} mint...`);
    const mint = await createMint(
      connection,
      authority,          // payer
      authority.publicKey, // mint authority
      authority.publicKey, // freeze authority (fine to reuse for a test token)
      DECIMALS
    );
    console.log(`${label} mint address:`, mint.toBase58());

    const ata = await getOrCreateAssociatedTokenAccount(connection, authority, mint, authority.publicKey);
    await mintTo(connection, authority, mint, ata.address, authority, MINT_SUPPLY * 10 ** DECIMALS);
    console.log(`Minted ${MINT_SUPPLY.toLocaleString()} ${label} into`, ata.address.toBase58());

    return mint.toBase58();
  }

  const spumpMint = await createTestToken("SPUMP");
  const usdcMint  = await createTestToken("USDC");

  console.log("\n──────────────────────────────────────────────");
  console.log("Done. Paste these into your .env files:\n");
  console.log("# backend .env");
  console.log(`SPUMP_MINT_ADDRESS=${spumpMint}`);
  console.log(`USDC_MINT_ADDRESS=${usdcMint}`);
  console.log("\n# frontend .env.local");
  console.log(`NEXT_PUBLIC_SPUMP_MINT=${spumpMint}`);
  console.log(`NEXT_PUBLIC_SPUMP_MINT_ADDRESS=${spumpMint}`);
  console.log(`NEXT_PUBLIC_USDC_MINT_ADDRESS=${usdcMint}`);
  console.log("──────────────────────────────────────────────");
  console.log("\nYour test wallet (holds 1,000,000 of each token):", authority.publicKey.toBase58());
  console.log("Its secret key is saved in", AUTHORITY_FILE, "— if you want to test buying/selling");
  console.log("from your actual Phantom/Solflare wallet instead, send some tokens there:");
  console.log(`  spl-token transfer ${spumpMint} <amount> <your-wallet-address>`);
  console.log("(or just use this script's own keypair as your test buyer/seller wallet).");
}

main().catch((e) => { console.error(e); process.exit(1); });
