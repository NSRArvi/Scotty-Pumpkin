import CollectionsListClient from "./CollectionsListClient";

export const metadata = {
  title: "Collections",
  description: "Browse every NFT collection on Scotty Pumpkin — discover creators, floor prices, and available editions.",
  openGraph: {
    title: "Collections | Scotty Pumpkin",
    description: "Browse every NFT collection on Scotty Pumpkin — discover creators, floor prices, and available editions.",
    type: "website",
  },
};

export default function Page() {
  return <CollectionsListClient />;
}
