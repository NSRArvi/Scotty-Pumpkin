"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import heroImg from "@/public/assets/hero.png";
import Image from "next/image";
import centralized from "@/public/assets/buy/centralized.png";
import dex from "@/public/assets/buy/dex.png";
import Link from "next/link";

const WALLET_ADDRESS = "8HVXp9...9peL6s";
const WALLET_FULL = "8HVXp9ABCDEFGHIJKLMNOPQRSTUVWXYZabcd9peL6s";

export default function Page() {
  const [copied, setCopied] = useState(false);
  const [isTokenDetailsOpen, setIsTokenDetailsOpen] = useState(false);
  const [isDexListingOpen, setIsDexListingOpen] = useState(false);
  const [riskTab, setRiskTab] = useState("en");

  const tokenDetails = [
    {
      title: "COINGECHO",
      description:
        "Tracks live price, volume, and market cap of SPUMP via GeckoTerminal",
      href: "https://www.geckoterminal.com/solana/pools/2gkymgcngo7ZVJD4899cHkJ1B91fkHv3ZnohCuxsU67n",
    },
    {
      title: "COIN MARKET CAP",
      description:
        "Analyze the market, track rankings, and calculate the total valuation of SPUMP via COIN MARKET CAP",
      href: "https://dex.coinmarketcap.com/token/solana/AKdCsQHoLKCpu3n2QcMS3BK8vQTWDcSDpujLr8UjeyNT",
    },
  ];

  const otherPopularAggregators = [
    {
      title: "Photon-SOL",
      description:
        "Offers a web-based, user-friendly interface with features like real-time price feeds and one-click transaction capabilities.",
      href: "https://photon-sol.tinyastro.io/en/lp/2gkymgcngo7ZVJD4899cHkJ1B91fkHv3ZnohCuxsU67n",
    },
    {
      title: "DEX Tools",
      description:
        "DEXTools is a leading analytics platform and trading interface for decentralized finance (DeFi) traders, offering real-time data, price charting, and insights into decentralized exchanges (DEXs).",
      href: "https://www.dextools.io/app/solana/pair-explorer/2gkymgcngo7ZVJD4899cHkJ1B91fkHv3ZnohCuxsU67n",
    },
  ];

  const dexListings = [
    {
      title: "RADIUM SWAP",
      description:
        "Swap your tokens to SPUMP directly from your wallets, such as Phantom, without needing a centralized intermediary.",
      href: "https://raydium.io/swap/?inputMint=AKdCsQHoLKCpu3n2QcMS3BK8vQTWDcSDpujLr8UjeyNT&outputMint=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    },
    {
      title: "JUPITER SWAP",
      description:
        "Swap your crypto coin to SPUMP at low slippage and cheap transaction fees at JUPITER.",
      href: "https://jup.ag/?buy=AKdCsQHoLKCpu3n2QcMS3BK8vQTWDcSDpujLr8UjeyNT",
    },
  ];

  function handleCopy() {
    navigator.clipboard.writeText(WALLET_FULL).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  useEffect(() => {
    if (isTokenDetailsOpen || isDexListingOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isTokenDetailsOpen, isDexListingOpen]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setIsTokenDetailsOpen(false);
        setIsDexListingOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function renderModal({ isOpen, onClose, title, subtitle, items, extraContent }) {
    if (!isOpen || typeof window === "undefined") return null;

    return createPortal(
      <div
        className="fixed inset-0 overflow-y-auto p-3 sm:p-4"
        style={{ zIndex: 2147483647 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative z-10 flex min-h-full items-start sm:items-center justify-center">
          <div
            className="w-full max-w-2xl rounded-2xl border border-purple-500/35 bg-[#12061f]/95 p-5 md:p-7 shadow-2xl max-h-[88vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
                <p className="mt-1 text-sm md:text-base text-white/65">{subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-white/80 hover:bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-purple-500/30 bg-white/5 p-4 md:p-5"
                >
                  <h4 className="text-lg font-bold text-amber-300">{item.title}</h4>
                  <p className="mt-1 text-sm md:text-base text-white/70">
                    {item.description}
                  </p>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex rounded-lg border border-purple-400/45 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500/20"
                  >
                    Open Link
                  </Link>
                </div>
              ))}
              {extraContent}
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return (
    <>
      <section className="relative z-10 px-4 py-12 md:py-16 lg:py-24 lg:px-16">
        <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
          {/* ── Hero Banner ── */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="flex justify-center order-1 md:order-1">
              <div
                className="w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72"
                style={{ animation: "sp-float 4s ease-in-out infinite" }}
              >
                <Image
                  src={heroImg}
                  alt="Scotty"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            <div className="space-y-5 order-2 md:order-2 text-center md:text-left">
              <div className="text-3xl sm:text-4xl md:text-5xl">🎃</div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold sp-shimmer-heading">
                Buy Scotty (SPUMP)
              </h1>

              <p className="text-purple-200 text-base md:text-lg leading-relaxed">
                Use Scotty to pay creators and participate in{" "}
                <span className="font-bold text-white">the Scotty Pumpkin</span>{" "}
                marketplace.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/coming-soon"
                  className="sp-gradient-btn ui-btn ui-btn-success px-7 py-3.5 rounded-xl font-bold text-base text-white flex items-center justify-center gap-2"
                >
                  <span>🟡</span> Buy on Official Exchange (CEX)
                </Link>
                <button
                  onClick={() => setIsTokenDetailsOpen(true)}
                  className="sp-outline-btn ui-btn ui-btn-secondary px-7 py-3.5 rounded-xl font-semibold text-base text-white flex items-center justify-center gap-2"
                >
                  View Token Details
                </button>
              </div>
            </div>
          </div>

          {/* ── Token Info ── */}
          <p className="text-white/60 text-sm md:text-base text-center leading-relaxed">
            Scotty (SPUMP) is a utility payment token used inside the{" "}
            <span className="font-bold text-white">Scotty Pumpkin</span>{" "}
            platform.
          </p>

          <div className="sp-divider" />

          {/* ── CEX Card ── */}
          <div className="space-y-5">
            <div className="sp-cex-card rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-6">
                <div className="flex-1 min-w-0 space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-2xl">🏛️</span>
                    <h2 className="text-xl md:text-2xl font-bold text-amber-400">
                      Buy on Centralized Exchange{" "}
                      <span className="text-white/55 font-normal text-base">
                        (Recommended)
                      </span>
                    </h2>
                  </div>
                  <p className="text-white/75 text-sm md:text-base">
                    We list Scotty (SPUMP) on{" "}
                    <span className="font-bold text-white">approved</span>{" "}
                    centralized exchanges to ensure:
                  </p>
                  <div className="space-y-2">
                    {[
                      "Better liquidity",
                      "Regulated onboarding (KYC where required)",
                      "Safer user experience",
                      "Simplified buying process",
                    ].map((item) => (
                      <p
                        key={item}
                        className="flex items-center gap-2 text-white/80 text-sm md:text-base"
                      >
                        <span className="sp-check">✓</span>
                        {item}
                      </p>
                    ))}
                  </div>
                  <Link
                    href="/coming-soon"
                    className="sp-gradient-btn ui-btn ui-btn-success px-8 py-3.5 rounded-xl font-bold text-base text-white mt-2 flex w-fit"
                  >
                    Visit Official Exchange
                  </Link>
                </div>

                <div
                  className="hidden sm:flex size-48 items-center justify-center rounded-2xl shrink-0"
                  style={{
                    background: "rgba(245,158,11,0.07)",
                    border: "1px solid rgba(245,158,11,0.15)",
                  }}
                >
                  <Image
                    src={centralized}
                    alt="centralized exchange"
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            {/* ── DEX Card ── */}
            <div className="sp-dex-card rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-6">
                <div className="flex-1 min-w-0 space-y-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-2xl">🔄</span>
                    <h2 className="text-xl md:text-2xl font-bold text-white">
                      DEX Listing{" "}
                      <span className="text-purple-300 font-normal text-base">
                        (Price Reference &amp; Limited Liquidity)
                      </span>
                    </h2>
                  </div>
                  <p className="text-white/75 text-sm md:text-base">
                    Scotty (SPUMP) may also be available on Solana DEX
                    platforms.
                  </p>
                  <div className="space-y-2">
                    {[
                      "Liquidity is intentionally limited",
                      "Used mainly for price discovery",
                      "Not the preferred method for large purchases",
                    ].map((item) => (
                      <p
                        key={item}
                        className="flex items-center gap-2 text-white/80 text-sm md:text-base"
                      >
                        <span className="sp-check">✓</span>
                        {item}
                      </p>
                    ))}
                  </div>
                  <button
                    onClick={() => setIsDexListingOpen(true)}
                    className="sp-dex-btn ui-btn ui-btn-primary px-8 py-3.5 rounded-xl font-bold text-base text-white mt-2"
                  >
                    View DEX Listing
                  </button>
                </div>

                <div
                  className="hidden sm:flex size-48 items-center justify-center rounded-2xl shrink-0"
                  style={{
                    background: "rgba(168,85,247,0.07)",
                    border: "1px solid rgba(168,85,247,0.15)",
                  }}
                >
                  <Image src={dex} alt="DEX" className="object-contain" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Footer note ── */}
          <div className="sp-divider" />
          <p className="text-center text-white/35 text-sm pb-4">
            <span className="font-bold text-white/50">Scotty</span> (SPUMP) is a
            utility payment token used exclusively within the Scotty Pumpkin
            platform.
          </p>

          <div className="pt-1 pb-2">
            <div className="sp-risk-wrap">
              <h3 className="text-white font-semibold">Crypto risk warning</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setRiskTab("en")}
                  className={`sp-risk-tab ${riskTab === "en" ? "active" : ""}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setRiskTab("fr")}
                  className={`sp-risk-tab ${riskTab === "fr" ? "active" : ""}`}
                >
                  France
                </button>
              </div>

              <div id="crypto-risk-warning" className="sp-risk-panel text-sm leading-relaxed space-y-4">
                {riskTab === "en" ? (
                  <div className="space-y-2">
                    <h4 className="text-amber-300 font-bold">Risk Warning (UK)</h4>
                    <p className="text-white/75">
                      Investing in cryptoassets involves a high degree of risk. The value of cryptoassets can go down as well as up, and you may lose all of your investment.
                    </p>
                    <p className="text-white/75">
                      Cryptoassets are not regulated financial products in the United Kingdom and are not covered by the Financial Services Compensation Scheme (FSCS) or the Financial Ombudsman Service (FOS).
                    </p>
                    <p className="text-white/75">
                      You should carefully consider whether you understand how cryptoassets work before purchasing or using them.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h4 className="text-amber-300 font-bold">🇪🇺 Risk warning — EU / FRANCE</h4>
                    <p className="text-white font-semibold">Avertissement sur les risques</p>
                    <p className="text-white/75">
                      Les crypto-actifs sont volatils et présentent un risque élevé. Vous pouvez perdre tout ou partie de votre investissement.
                    </p>
                    <p className="text-white/75">
                      Les crypto-actifs ne bénéficient pas nécessairement de protections réglementaires équivalentes aux instruments financiers traditionnels.
                    </p>
                    <p className="text-white/75">
                      L&apos;utilisateur doit s&apos;assurer qu&apos;il comprend les risques avant toute utilisation.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {renderModal({
        isOpen: isTokenDetailsOpen,
        onClose: () => setIsTokenDetailsOpen(false),
        title: "Token Details",
        subtitle: "Explore trusted market tracking links for SPUMP.",
        items: tokenDetails,
        extraContent: (
          <>
            <div className="pt-2">
              <h4 className="text-base md:text-lg font-bold text-purple-200">
                Other Popular Aggregators
              </h4>
            </div>
            {otherPopularAggregators.map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-purple-500/30 bg-white/5 p-4 md:p-5"
              >
                <h4 className="text-lg font-bold text-amber-300">{item.title}</h4>
                <p className="mt-1 text-sm md:text-base text-white/70">
                  {item.description}
                </p>
                <Link
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-lg border border-purple-400/45 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500/20"
                >
                  Open Link
                </Link>
              </div>
            ))}
          </>
        ),
      })}

      {renderModal({
        isOpen: isDexListingOpen,
        onClose: () => setIsDexListingOpen(false),
        title: "DEX Listing",
        subtitle: "Trade SPUMP through decentralized swap interfaces.",
        items: dexListings,
      })}
    </>
  );
}
