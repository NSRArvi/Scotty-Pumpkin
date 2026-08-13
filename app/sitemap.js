const API_URL  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scottypumpkin.com";

// Next.js App Router convention: app/sitemap.js exporting a default
// function returning an array of { url, lastModified, changeFrequency,
// priority } is automatically served at /sitemap.xml.
export default async function sitemap() {
  const staticRoutes = [
    { url: `${SITE_URL}/`,                changeFrequency: "daily",   priority: 1.0 },
    { url: `${SITE_URL}/nft-marketplace`,  changeFrequency: "hourly",  priority: 0.9 },
    { url: `${SITE_URL}/collections`,      changeFrequency: "hourly",  priority: 0.8 },
    { url: `${SITE_URL}/nft-studio`,       changeFrequency: "weekly",  priority: 0.6 },
  ];

  let nftRoutes = [];
  let collectionRoutes = [];

  // Best-effort — if the API is briefly unavailable at build/request
  // time, still return the static routes rather than failing the whole
  // sitemap (and therefore all SEO discovery) outright.
  try {
    // is_explicit NFTs are deliberately excluded here (sensitive content
    // shouldn't be actively submitted to search engines) — the backend
    // would need a way to filter these out; if /marketplace doesn't
    // support that yet, filter client-side below as a stopgap.
    const res  = await fetch(`${API_URL}/marketplace?per_page=200`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const nfts = (data?.data?.data || []).filter((n) => !n.is_explicit);
    nftRoutes = nfts.map((n) => ({
      url: `${SITE_URL}/nft-marketplace/${n.mint_address}`,
      lastModified: n.updated_at ? new Date(n.updated_at) : undefined,
      changeFrequency: "daily",
      priority: 0.7,
    }));
  } catch (_) {
    // swallow — static routes still get returned below
  }

  try {
    const res  = await fetch(`${API_URL}/collections?per_page=200`, { next: { revalidate: 3600 } });
    const data = await res.json();
    const cols = data?.data?.data || [];
    collectionRoutes = cols.map((c) => ({
      url: `${SITE_URL}/collections/${c.id}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : undefined,
      changeFrequency: "daily",
      priority: 0.6,
    }));
  } catch (_) {}

  return [...staticRoutes, ...nftRoutes, ...collectionRoutes];
}
