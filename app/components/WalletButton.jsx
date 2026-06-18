"use client";

import { useSolanaWallet } from "../../hooks/useWallet"

export default function WalletButton() {
  const { connected, walletAddress, walletName, walletIcon, connect, disconnect } = useSolanaWallet();

  if (connected) {
    return (
      <div className="flex items-center gap-3">
        {/* Wallet info */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          {walletIcon && (
            <img src={walletIcon} alt={walletName} className="w-4 h-4 rounded-full" />
          )}
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-emerald-400 text-xs font-mono">
            {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </span>
          <span className="text-white/20 text-[10px]">{walletName}</span>
        </div>

        {/* Disconnect */}
        <button
          onClick={disconnect}
          className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/8 text-white/60 hover:bg-white/12 border border-white/10 transition-all cursor-pointer"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="px-4 py-2 rounded-xl text-sm font-semibold bg-orange-500 text-white hover:bg-orange-400 shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
    >
      Connect Wallet
    </button>
  );
}
