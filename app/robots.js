const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scottypumpkin.com";

// Next.js App Router convention: app/robots.js is automatically served
// at /robots.txt.
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",         // admin dashboard — never index
          "/purchase/",     // checkout flow — no SEO value, and shows a
                             // live price/wallet UI that shouldn't be a
                             // search-result landing page
          "/api/",          // JSON endpoints, not pages
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
