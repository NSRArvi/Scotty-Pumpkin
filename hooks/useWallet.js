
"use client";

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

export function useSolanaWallet() {
  const { publicKey, connected, disconnect, wallet, signTransaction, signAllTransactions } = useWallet();
  const { connection } = useConnection();
  const { setVisible } = useWalletModal();

  return {
    // Wallet info
    connected,
    walletAddress: publicKey?.toString() || "",
    walletName:    wallet?.adapter?.name || "",
    walletIcon:    wallet?.adapter?.icon || "",

    // Actions
    connect:     () => setVisible(true),   // Modal খুলবে — user wallet select করবে
    disconnect,
    connection,

    // Sign 
    signTransaction,
    signAllTransactions,
    publicKey,
  };
}
