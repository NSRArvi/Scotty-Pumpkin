import NftDetailClient from "./NftDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// generateMetadata runs on the SERVER, before any client-side JS — this
// is what actually fixes the SEO/social-preview problem: a crawler (or
// Discord/Twitter unfurling a shared link) sees this NFT's real name,
// description, and image in the initial HTML <head>, instead of the
// site-wide default title/description every page previously shared.
//
// is_explicit NFTs get noindex here — sensitive content shouldn't be
// actively served to search engines, independent of whatever appears
// in the sitemap.
export async function generateMetadata({ params }) {
  const { mint_address } = await params;

  try {
    const res  = await fetch(`${API_URL}/nft/${mint_address}`, { next: { revalidate: 60 } });
    const data = await res.json();

    if (!data.success) {
      return { title: "NFT Not Found" };
    }

    const nft = data.data;
    const priceText = nft.is_listed
      ? `${Number(nft.list_price).toLocaleString()} ${(nft.list_currency || "spump").toUpperCase()}`
      : "Not currently listed";
    const description = nft.description
      ? nft.description.slice(0, 160)
      : `${nft.name} — ${priceText} on Scotty Pumpkin.`;

    return {
      title: nft.name,
      description,
      ...(nft.is_explicit ? { robots: { index: false, follow: true } } : {}),
      openGraph: {
        title: nft.name,
        description,
        images: nft.image_url ? [{ url: nft.image_url, width: 1200, height: 1200, alt: nft.name }] : undefined,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: nft.name,
        description,
        images: nft.image_url ? [nft.image_url] : undefined,
      },
    };
  } catch (_) {
    // API unreachable at request time — fall back to the site-wide
    // default from the root layout rather than breaking the page.
    return {};
  }
}

export default function Page() {
  return <NftDetailClient />;
}
