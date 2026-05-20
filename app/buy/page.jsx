"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import heroImg from "@/public/assets/hero.png";
import Image from "next/image";
import centralized from "@/public/assets/buy/centralized.png";
import dex from "@/public/assets/buy/dex.png";
import Link from "next/link";
import {
  BadgeDollarSign,
  CircleCheck,
  LockKeyhole,
  Music4,
  Sparkles,
} from "lucide-react";
import Container from "../components/shared/Container";

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

  function renderModal({
    isOpen,
    onClose,
    title,
    subtitle,
    items,
    extraContent,
  }) {
    if (!isOpen || typeof window === "undefined") return null;

    return createPortal(
      <div
        className="fixed inset-0 overflow-y-auto p-3 sm:p-4 z-2147483647"
        onClick={onClose}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
        <div className="relative z-10 flex min-h-full items-start sm:items-center justify-center">
          <div
            className="w-full max-w-2xl rounded-2xl border border-purple-500/35 bg-white p-5 md:p-7 max-h-[88vh] overflow-y-auto"
            onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-secondary">
                  {title}
                </h3>
                <p className="mt-1 text-sm md:text-base text-secondary/80">
                  {subtitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg border border-secondary/15 px-3 py-1.5 text-secondary/80 hover:bg-primary hover:text-white transition duration-300 cursor-pointer">
                Close
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-purple-500/30 bg-white/5 p-4 md:p-5">
                  <h4 className="text-lg font-bold text-primary">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-sm md:text-base text-secondary/80">
                    {item.description}
                  </p>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex bg-primary/90 text-white rounded-lg border border-purple-400/45 px-4 py-2 text-sm font-semibold hover:bg-primary">
                    Open Link
                  </Link>
                </div>
              ))}
              {extraContent}
            </div>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  return (
    <div className="bg-primary-bg">
      <Container>
        <section className="relative z-10 py-12 md:py-16 lg:py-24">
          <div className="space-y-12 md:space-y-16">
            {/* ── Hero Banner ── */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="w-full md:w-4/5 relative flex items-center justify-center">
                {/* Main Image */}
                <div className="relative z-10">
                  <Image
                    width={1000}
                    height={1000}
                    src={heroImg}
                    alt="Pumpkin Dog"
                    className="w-full h-auto object-contain drop-shadow-[0_25px_40px_rgba(241,112,5,0.28)]"
                  />
                </div>

                {/* Circle Line */}
                <div className="absolute h-107.5 w-107.5 rounded-full border border-primary/15" />

                {/* Floating Icon Left Top */}
                <div className="absolute left-2 top-14 animate-float-slow">
                  <div className="icon-card rotate-[-14deg]">
                    <LockKeyhole size={26} strokeWidth={2.2} />
                  </div>
                </div>

                {/* Floating Icon Right */}
                <div className="absolute right-0 top-24 animate-float-medium">
                  <div className="icon-card rotate-12">
                    <Music4 size={26} strokeWidth={2.2} />
                  </div>
                </div>

                {/* Floating Icon Bottom */}
                <div className="absolute bottom-20 left-10 animate-float-fast">
                  <div className="icon-card rotate-[8deg]">
                    <BadgeDollarSign size={26} strokeWidth={2.2} />
                  </div>
                </div>

                {/* Glow Stars */}
                <Sparkles className="absolute left-24 top-4 text-primary animate-pulse" />
                <Sparkles className="absolute right-16 bottom-20 text-primary animate-pulse" />
              </div>

              <div className="space-y-5 order-2 md:order-2 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-secondary">
                  Buy Scotty (SPUMP)
                </h1>

                <p className="text-secondary/80 text-base md:text-lg leading-relaxed">
                  Use Scotty to pay creators and participate in{" "}
                  <span className="font-bold text-primary">
                    the Scotty Pumpkin
                  </span>{" "}
                  marketplace.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 justify-center md:justify-start">
                  <Link
                    href="/coming-soon"
                    target="_blank"
                    className="px-4 py-2 text-base  bg-primary hover:bg-primary/80 transition duration-300 rounded-lg">
                    🟡 Buy on Official Exchange (CEX)
                  </Link>
                  <button
                    onClick={() => setIsTokenDetailsOpen(true)}
                    className="text-secondary border border-secondary hover:text-white hover:bg-secondary transition duration-500 rounded-lg px-4 py-2 text-base">
                    View Token Details
                  </button>
                </div>
              </div>
            </div>

            {/* ── Token Info ── */}
            <p className="text-secondary text-sm md:text-base text-center leading-relaxed">
              Scotty (SPUMP) is a utility payment token used inside the{" "}
              <span className="font-bold text-primary">Scotty Pumpkin</span>{" "}
              platform.
            </p>

            <div className="sp-divider" />

            {/* ── CEX Card ── */}
            <div className="space-y-5">
              <div className=" bg-white/80 rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-2xl">🏛️</span>
                      <h2 className="text-xl md:text-2xl font-bold text-primary">
                        Buy on Centralized Exchange{" "}
                        <span className="text-secondary font-normal text-base">
                          (Recommended)
                        </span>
                      </h2>
                    </div>
                    <p className="text-secondary/80 text-sm md:text-base">
                      We list Scotty (SPUMP) on{" "}
                      <span className="font-bold text-secondary">approved</span>{" "}
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
                          className="flex items-center gap-2 text-secondary/80 text-sm md:text-base">
                          <span className="sp-check ">
                            <CircleCheck className="text-primary" />
                          </span>
                          {item}
                        </p>
                      ))}
                    </div>
                    <Link
                      href="/coming-soon"
                      className="bg-primary/90 hover:bg-primary transition duration-300 px-8 py-3.5 rounded-xl font-bold text-base text-white mt-2 flex w-fit">
                      Visit Official Exchange
                    </Link>
                  </div>

                  <div
                    className="hidden sm:flex size-48 items-center justify-center rounded-2xl shrink-0"
                    style={{
                      background: "rgba(245,158,11,0.07)",
                      border: "1px solid rgba(245,158,11,0.15)",
                    }}>
                    <Image
                      src={centralized}
                      alt="centralized exchange"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              {/* ── DEX Card ── */}
              <div className="bg-white/80 rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-2xl">🔄</span>
                      <h2 className="text-xl md:text-2xl font-bold text-primary">
                        DEX Listing{" "}
                        <span className="text-secondary/90 font-normal text-base">
                          (Price Reference &amp; Limited Liquidity)
                        </span>
                      </h2>
                    </div>
                    <p className="text-secondary text-sm md:text-base">
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
                          className="flex items-center gap-2 text-secondary/80 text-sm md:text-base">
                          <span className="sp-check">
                            <CircleCheck className="text-primary" />
                          </span>
                          {item}
                        </p>
                      ))}
                    </div>
                    <button
                      onClick={() => setIsDexListingOpen(true)}
                      className="bg-primary/90 hover:bg-primary transition duration-300 px-8 py-3.5 rounded-xl font-bold text-base text-white mt-2 flex w-fit">
                      View DEX Listing
                    </button>
                  </div>

                  <div
                    className="hidden sm:flex size-48 items-center justify-center rounded-2xl shrink-0"
                    style={{
                      background: "rgba(168,85,247,0.07)",
                      border: "1px solid rgba(168,85,247,0.15)",
                    }}>
                    <Image src={dex} alt="DEX" className="object-contain" />
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-6 md:p-8">
                <div className="flex items-start gap-6">
                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-2xl">🔐</span>
                      <h2 className="text-xl md:text-2xl font-bold text-primary">
                        Private Sale
                      </h2>
                    </div>
                    <p className="text-secondary/90 text-sm md:text-base">
                      Join the private sale with flexible payment methods.
                      Choose online crypto payment or complete your purchase via
                      bank transfer.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Link
                        href="/online-purchase"
                        className="px-4 py-2 text-base text-center bg-primary hover:bg-primary/80 transition duration-300 rounded-lg">
                        Pay with USDC / USDT / SOL
                      </Link>
                      <Link
                        href="/bank-purchase"
                        className="text-secondary text-center border border-secondary hover:text-white hover:bg-secondary transition duration-500 rounded-lg px-4 py-2 text-base">
                        Bank Transfer
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer note ── */}
            <div className="sp-divider" />
            <p className="text-center text-sm text-secondary/80 pb-4">
              <span className="font-bold text-secondary/90">Scotty</span>{" "}
              (SPUMP) is a utility payment token used exclusively within the
              Scotty Pumpkin platform.
            </p>

            <div className="pt-1 pb-2">
              <div className="bg-white/80 px-8 py-6 rounded-2xl">
                <h3 className="text-secondary font-semibold">
                  Crypto risk warning
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setRiskTab("en")}
                    className={`px-3 py-1.5 ${riskTab === "en" ? "active text-white bg-primary border-primary border rounded-lg" : "text-secondary border-secondary border rounded-lg"}`}>
                    English
                  </button>
                  <button
                    type="button"
                    onClick={() => setRiskTab("fr")}
                    className={`px-3 py-1.5 ${riskTab === "fr" ? "active text-white border-primary bg-primary border rounded-lg" : "text-secondary border-secondary border rounded-lg"}`}>
                    France
                  </button>
                </div>

                <div
                  id="crypto-risk-warning"
                  className="sp-risk-panel text-sm leading-relaxed space-y-4">
                  {riskTab === "en" ? (
                    <div className="space-y-2">
                      <h4 className="text-primary font-bold">
                        Risk Warning (UK)
                      </h4>
                      <p className="text-secondary/80">
                        Investing in cryptoassets involves a high degree of
                        risk. The value of cryptoassets can go down as well as
                        up, and you may lose all of your investment.
                      </p>
                      <p className="text-secondary/80">
                        Cryptoassets are not regulated financial products in the
                        United Kingdom and are not covered by the Financial
                        Services Compensation Scheme (FSCS) or the Financial
                        Ombudsman Service (FOS).
                      </p>
                      <p className="text-secondary/80">
                        You should carefully consider whether you understand how
                        cryptoassets work before purchasing or using them.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h4 className="text-primary font-bold">
                        🇪🇺 Risk warning — EU / FRANCE
                      </h4>
                      <p className="text-secondary font-semibold">
                        Avertissement sur les risques
                      </p>
                      <p className="text-secondary/80">
                        Les crypto-actifs sont volatils et présentent un risque
                        élevé. Vous pouvez perdre tout ou partie de votre
                        investissement.
                      </p>
                      <p className="text-secondary/80">
                        Les crypto-actifs ne bénéficient pas nécessairement de
                        protections réglementaires équivalentes aux instruments
                        financiers traditionnels.
                      </p>
                      <p className="text-secondary/80">
                        L&apos;utilisateur doit s&apos;assurer qu&apos;il
                        comprend les risques avant toute utilisation.
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
                <h4 className="text-base md:text-lg font-bold text-secondary">
                  Other Popular Aggregators
                </h4>
              </div>
              {otherPopularAggregators.map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-purple-500/30 bg-white/5 p-4 md:p-5">
                  <h4 className="text-lg font-bold text-primary">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-sm md:text-base text-secondary/80">
                    {item.description}
                  </p>
                  <Link
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex rounded-lg border border-purple-400/45 px-4 py-2 text-sm font-semibold text-white bg-primary/90 hover:bg-primary">
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
      </Container>
    </div>
  );
}
