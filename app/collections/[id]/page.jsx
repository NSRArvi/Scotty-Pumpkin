import CollectionDetailClient from "./CollectionDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Same reasoning as the NFT details page's generateMetadata — a crawler
// or a shared link's preview card should see THIS collection's real
// name/description/image, not the site-wide default.
export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const res  = await fetch(`${API_URL}/collections/${id}`, { next: { revalidate: 300 } });
    const data = await res.json();

    if (!data.success) {
      return { title: "Collection Not Found" };
    }

    const collection = data.data.collection;
    const stats       = data.data.stats;
    const description = collection.description
      ? collection.description.slice(0, 160)
      : `${collection.name} — ${stats?.total_nfts ?? 0} NFTs on Scotty Pumpkin.`;

    return {
      title: collection.name,
      description,
      openGraph: {
        title: collection.name,
        description,
        images: collection.image_url ? [{ url: collection.image_url, width: 1200, height: 1200, alt: collection.name }] : undefined,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: collection.name,
        description,
        images: collection.image_url ? [collection.image_url] : undefined,
      },
    };
  } catch (_) {
    return {};
  }
}

export default function Page() {
  return <CollectionDetailClient />;
}
