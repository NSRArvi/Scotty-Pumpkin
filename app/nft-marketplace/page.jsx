
import MarketplaceClient from "./MarketplaceClient";

export const metadata = {
  title: "Marketplace",
  description: "Buy and sell NFTs on Scotty Pumpkin — pay in SPUMP or USDC. List free, Pay only on sale.",
  openGraph: {
    title: "Marketplace | Scotty Pumpkin",
    description: "Buy and sell NFTs on Scotty Pumpkin — pay in SPUMP or USDC. List free, Pay only on sale.",
    type: "website",
  },
};

export default function Page() {
  return <MarketplaceClient />;
}
