import PublishNftClient from "./PublishNftClient";

export const metadata = {
  title: "Publish your NFT",
  description: "List your NFT for sale on the Scotty Pumpkin Marketplace — pay in SPUMP or USDC. List free, pay only on sale.",
  openGraph: {
    title: "Publish your NFT | Scotty Pumpkin",
    description: "List your NFT for sale on the Scotty Pumpkin Marketplace — pay in SPUMP or USDC. List free, pay only on sale.",
    type: "website",
  },
};

export default function Page() {
  return <PublishNftClient />;
}