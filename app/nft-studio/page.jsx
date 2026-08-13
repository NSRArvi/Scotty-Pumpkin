import NftStudioClient from "./NftStudioClient";

export const metadata = {
  title: "NFT Studio — Create & Mint Your NFT",
  description:
    "Mint art, fashion, jewelry, video, and digital goods as NFTs on Solana. List for free — pay only 3% when it sells. Powered by SPUMP & USDC.",
  keywords: ["mint NFT", "create NFT", "Solana NFT minting", "free NFT listing", "SPUMP", "NFT studio"],
  openGraph: {
    title: "NFT Studio — Create & Mint Your NFT | Scotty Pumpkin",
    description:
      "Mint art, fashion, jewelry, video, and digital goods as NFTs on Solana. List for free — pay only 3% when it sells.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NFT Studio — Create & Mint Your NFT | Scotty Pumpkin",
    description:
      "Mint art, fashion, jewelry, video, and digital goods as NFTs on Solana. List for free — pay only 3% when it sells.",
  },
};

export default function Page() {
  return <NftStudioClient />;
}
