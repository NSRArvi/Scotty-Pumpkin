// import "./globals.css";
// import { Inter } from "next/font/google";
// import AppShell from "./components/shared/AppShell";
// import SolanaWalletProvider from "./components/WalletProvider";

// const inter = Inter({ 
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700", "800"],
//   variable: "--font-inter",
//   display: "swap",
// });

// export const metadata = {
//   title: "Scotty Pumpkin - Web3 Creator Marketplace",
//   description:
//     "Create and sell fashion, accessories, jewelry, art, NFTs and goods. Build your own Web3 online store on Scotty Marketplace.",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} min-h-screen text-white relative overflow-x-hidden antialiased`}>
//         <SolanaWalletProvider>
//           <AppShell>{children}</AppShell>
//         </SolanaWalletProvider>
//       </body>
//     </html>
//   );
// }


import "./globals.css";
import { Inter } from "next/font/google";
import AppShell from "./components/shared/AppShell";
import SolanaWalletProvider from "./components/WalletProvider";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

// ── SEO defaults ──────────────────────────────────────────────────────────
// metadataBase turns every relative URL used in metadata (og:image,
// canonical links, etc. — including the ones individual pages set via
// generateMetadata) into an absolute one. Without it, Next.js falls back
// to localhost in production, which breaks Open Graph previews on
// Discord/Twitter/iMessage entirely (they can't resolve a localhost URL).
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://scottypumpkin.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Scotty Pumpkin - Web3 Creator Marketplace",
    // Individual pages (NFT details, collections) set their own title via
    // generateMetadata; this template applies whenever they do, so search
    // results/browser tabs show "NFT Name | Scotty Pumpkin" instead of
    // just the NFT name with no site context.
    template: "%s | Scotty Pumpkin",
  },
  description:
    "Create and sell fashion, accessories, jewelry, art, NFTs and goods. Build your own Web3 online store on Scotty Marketplace.",
  keywords: ["NFT marketplace", "Solana NFT", "Web3 marketplace", "SPUMP", "digital art", "creator economy"],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "Scotty Pumpkin",
    title: "Scotty Pumpkin - Web3 Creator Marketplace",
    description:
      "Create and sell fashion, accessories, jewelry, art, NFTs and goods. Build your own Web3 online store on Scotty Marketplace.",
    url: SITE_URL,
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Scotty Pumpkin" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Scotty Pumpkin - Web3 Creator Marketplace",
    description:
      "Create and sell fashion, accessories, jewelry, art, NFTs and goods. Build your own Web3 online store on Scotty Marketplace.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen text-white relative overflow-x-hidden antialiased`}>
        <SolanaWalletProvider>
          <AppShell>{children}</AppShell>
        </SolanaWalletProvider>
      </body>
    </html>
  );
}

