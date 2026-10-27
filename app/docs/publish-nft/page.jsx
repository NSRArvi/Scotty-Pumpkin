import DocLayout, { DocSection, DocStepBlock, DocNote } from "../../components/docs/DocLayout";

export const metadata = {
  title: "Publish NFT Guide — Docs | Scotty Pumpkin",
  description:
    "A simple, step-by-step guide to listing your unlisted NFTs for sale on Scotty Pumpkin.",
};

export default function PublishNftGuidePage() {
  return (
    <DocLayout
      title="Publish your"
      accent="NFT"
      subtitle="Set a price and list any of your unlisted NFTs. Listing is free — pay only on sale."
      backHref="/publish-nft"
      backLabel="Marketplace"
    >
      <DocSection title="What You'll See">
        <p className="text-black/60 text-sm leading-relaxed">
          After connecting your wallet, every NFT you own that isn't listed yet shows up as a row —
          thumbnail, name, and shortened mint address on the left; a currency toggle, price field,
          and Publish button on the right.
        </p>
      </DocSection>

      <DocSection title="Listing an NFT">
        <DocStepBlock number="1" title="Connect your wallet">
          Your connected wallet address appears near the top. If it's not connected yet, connect it
          first — the page can't show your NFTs without it.
        </DocStepBlock>

        <DocStepBlock number="2" title="Find the NFT you want to list">
          Scroll the list to the NFT you want to sell. Only NFTs that aren't already listed appear here.
        </DocStepBlock>

        <DocStepBlock number="3" title="Choose a currency">
          Pick <span className="font-semibold text-black/80">SPUMP</span> or{" "}
          <span className="font-semibold text-black/80">USDC</span> as the price currency for this listing.
        </DocStepBlock>

        <DocStepBlock number="4" title="Enter your price">
          Type the amount you want to sell it for in the price field (e.g. 5000).
        </DocStepBlock>

        <DocStepBlock number="5" title="Click Publish">
          Your wallet will ask you to approve the listing. Once approved, the NFT appears on the
          Marketplace at the price and currency you set.
        </DocStepBlock>
      </DocSection>

      <DocNote tone="info">
        Listing is free. A fee only applies when the NFT actually sells, so there's no cost to list
        and no risk in trying a price.
      </DocNote>
    </DocLayout>
  );
}
