import WalletProfileClient from "./WalletProfileClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Unlike /nft-profile (the connected-wallet dashboard), a public wallet
// profile is genuinely shareable content — a creator's page, worth
// showing up in search and previewing properly when linked on
// Discord/Twitter. So this one gets real per-wallet metadata instead of
// noindex.
export async function generateMetadata({ params }) {
  const { wallet } = await params;
  const shortWallet = `${wallet.slice(0, 6)}...${wallet.slice(-6)}`;

  try {
    const res  = await fetch(`${API_URL}/nft/list/${wallet}`, { next: { revalidate: 120 } });
    const data = await res.json();
    const nfts = data?.data || [];
    // Explicit NFTs are excluded from the preview image pool — a shared
    // profile-link preview shouldn't risk surfacing sensitive content
    // in a Discord/Twitter unfurl card.
    const previewNft = nfts.find((n) => n.image_url && !n.is_explicit);

    const title = `${shortWallet}'s NFT Collection`;
    const description = nfts.length > 0
      ? `${nfts.length} NFT${nfts.length === 1 ? "" : "s"} by ${shortWallet} on Scotty Pumpkin.`
      : `${shortWallet}'s creator profile on Scotty Pumpkin.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: previewNft ? [{ url: previewNft.image_url, width: 1200, height: 1200, alt: title }] : undefined,
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: previewNft ? [previewNft.image_url] : undefined,
      },
    };
  } catch (_) {
    return { title: `${shortWallet}'s NFT Collection` };
  }
}

export default function Page() {
  return <WalletProfileClient />;
}
