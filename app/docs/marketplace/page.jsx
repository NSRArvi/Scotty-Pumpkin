"use client";

import Link from "next/link";
import Container from "../../components/shared/Container";

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-6 md:p-8 space-y-3">
      <h2 className="text-black font-bold text-lg">{title}</h2>
      <div className="text-black/60 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function MarketplaceHelpClient() {
  return (
    <div className="min-h-screen bg-[#F3EFE6] text-black">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/4 blur-3xl" />
        <div className="absolute bottom-0 -right-60 w-[500px] h-[500px] rounded-full bg-purple-600/4 blur-3xl" />
      </div>

      <div className="relative">
        <Container>
          <div className="pt-12 pb-24 max-w-3xl mx-auto space-y-8">

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px w-8 bg-orange-500/40" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-500">
                  Help Guide
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                How the Marketplace Works
              </h1>
              <p className="text-black/50 mt-3">
                How to browse, filter, buy, and list NFTs on the{" "}
                <Link href="/nft-marketplace" className="text-orange-500 underline hover:text-orange-400">
                  Marketplace
                </Link>.
              </p>
            </div>

            {/* Browsing */}
            <Section title="Browsing & Filtering">
              <p>
                The <strong>Marketplace</strong> tab shows every NFT currently listed for sale. Use the
                filter bar to narrow it down:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Search</strong> — find NFTs by name</li>
                <li><strong>Category</strong> — Art, Music, Gaming, Photography, and more</li>
                <li><strong>Country</strong> — filter by the NFT's tagged country</li>
                <li><strong>Collection</strong> — show only NFTs from one collection</li>
                <li><strong>Sort</strong> — order by price, low to high or high to low</li>
              </ul>
            </Section>

            {/* Buying */}
            <Section title="Buying an NFT">
              <p>
                Connect your wallet, then click <strong>Buy Now</strong> on any listed NFT. You'll pay
                in whichever currency the seller listed it in — <strong>🎃 SPUMP</strong> or{" "}
                <strong>💵 USDC</strong>. Approve the transaction in your wallet to complete the purchase.
              </p>
              <p>
                Purchases go through escrow for buyer protection — see{" "}
                <a
                  href="https://scottypumpkin.com/spump-escrow"
                  target="_blank" rel="noreferrer"
                  className="text-orange-500 underline"
                >
                  How to buy? →
                </a>{" "}
                for details on how that works.
              </p>
              <p>
                Once bought, the NFT moves to your{" "}
                <Link href="/nft-marketplace" className="text-orange-500 underline">My NFTs</Link> tab and
                your{" "}
                <Link href="/nft-profile" className="text-orange-500 underline">profile page</Link>.
              </p>
            </Section>

            {/* Selling */}
            <Section title="Listing Your Own NFT for Sale">
              <p>
                Go to the <strong>My NFTs</strong> tab to see NFTs you own. On any unlisted NFT, click{" "}
                <strong>List for Sale →</strong>, then:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Choose a <strong>currency</strong> — SPUMP or USDC</li>
                <li>Enter your <strong>listing price</strong></li>
                <li>Click <strong>Confirm Listing</strong> and approve the transaction in your wallet</li>
              </ul>
              <p className="text-black/40 text-xs">
                A small amount of SOL is needed in your wallet to cover the Solana network fee for the
                listing transaction. Listing itself is free — you only pay a fee when it sells.
              </p>
            </Section>

            {/* Unlisting */}
            <Section title="Unlisting">
              <p>
                Changed your mind? On any of your listed NFTs, click{" "}
                <strong>Unlist from Marketplace</strong> to pull it off sale. It stays yours — you can
                re-list it anytime.
              </p>
            </Section>

            {/* Import */}
            <Section title="Importing an NFT">
              <p>
                Already own an NFT minted somewhere else? From the <strong>My NFTs</strong> tab, click{" "}
                <strong>+ Import NFT</strong> to bring it into the marketplace so you can list it here.
              </p>
            </Section>

            {/* FAQ */}
            <Section title="Common Questions">
              <div className="space-y-4">
                <div>
                  <p className="text-black font-semibold text-sm">What happens to my listing if I unlist it?</p>
                  <p>Nothing — the NFT stays in your wallet, just no longer visible on the marketplace. List it again whenever you like.</p>
                </div>
                <div>
                  <p className="text-black font-semibold text-sm">Can I change the price after listing?</p>
                  <p>Unlist first, then list it again at the new price.</p>
                </div>
                <div>
                  <p className="text-black font-semibold text-sm">Which currency should I list in?</p>
                  <p>Either works — buyers can pay in whichever currency you choose when you list. SPUMP is the platform's native token; USDC is a stable, dollar-pegged option.</p>
                </div>
              </div>
            </Section>

            <div className="text-center pt-4">
              <Link
                href="/nft-marketplace"
                className="inline-block px-6 py-3 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors"
              >
                Go to Marketplace →
              </Link>
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}
