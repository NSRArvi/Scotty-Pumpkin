// Add ONE entry here for every page that gets its own doc.
// slug -> the doc lives at /docs/<slug>/page.jsx
// pageHref -> the actual site page this doc explains (for the "Back to X" button)
const DOCS_REGISTRY = [
  {
    slug: "nft-studio",
    title: "NFT Studio",
    description: "How minting works — steps, fees, and payment.",
    pageHref: "/nft-studio",
  },
  {
    slug: "marketplace",
    title: "NFT Marketplace",
    description: "How to create a wallet, connect it, and buy an NFT.",
    pageHref: "/nft-marketplace",
  },
  {
    slug: "publish-nft",
    title: "Publish NFT",
    description: "How to set a price and list an unlisted NFT for sale.",
    pageHref: "/publish-nft",
  },
];

export default DOCS_REGISTRY;
