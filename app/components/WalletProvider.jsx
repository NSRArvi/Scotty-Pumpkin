"use client";

import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function SolanaWalletProvider({ children }) {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";

  // IMPORTANT: always prefer NEXT_PUBLIC_SOLANA_RPC_URL (e.g. a dedicated
  // Helius/QuickNode endpoint) when it's set. Falling straight to the
  // public api.devnet.solana.com/api.mainnet-beta.solana.com endpoints —
  // which is what this did before — ignores that dedicated RPC entirely
  // and sends every single request (including every getAccountInfo call
  // in the buy/mint flows) through Solana's public, heavily rate-limited
  // RPC, which is exactly what was producing the repeated
  // "429: Connection rate limits exceeded" errors even after a paid RPC
  // endpoint was configured.
  const endpoint = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || (
    network === "mainnet-beta"
      ? "https://api.mainnet-beta.solana.com"
      : "https://api.devnet.solana.com"
  );

  const wallets = useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
    // new TorusWalletAdapter(),
    // new LedgerWalletAdapter(),
  ], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
