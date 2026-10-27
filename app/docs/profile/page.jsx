import DocLayout, { DocSection, DocStepBlock, DocNote } from "../../components/docs/DocLayout";

export const metadata = {
  title: "Profile Guide — Docs | Scotty Pumpkin",
  description:
    "A simple, step-by-step guide to your NFT Profile page — stats, tabs, editing NFT details, and storage renewal.",
};

const CAN_DO = [
  "See every NFT tied to your wallet, split into All NFTs, Listed, and Sold",
  "Track your SPUMP and USDC balances at a glance",
  "Edit an NFT's Collection, Category, and Country right from its card",
  "Renew storage before an NFT's hosting expires",
];

export default function ProfileGuidePage() {
  return (
    <DocLayout
      title="Profile"
      subtitle="Written in simple language so that anyone can understand it without any technical knowledge."
      backHref="/nft-profile"
      backLabel="Profile"
    >
      <DocSection title="What You Can Do on Your Profile">
        <ul className="space-y-2">
          {CAN_DO.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-black/60">
              <span className="w-5 h-5 mt-0.5 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[10px] text-orange-500 font-bold shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </DocSection>

      <DocSection title="1. Your Stats & Tabs">
        <p className="text-black/60 text-sm leading-relaxed mb-4">
          At the top of your profile you'll see five numbers: Total NFTs, Listed, Sold, SPUMP
          Balance, and USDC Balance. Below that are three tabs to filter what you're looking at.
        </p>
        <ol className="space-y-1.5 text-sm text-black/60 list-decimal list-inside">
          <li><span className="font-semibold text-black/80">All NFTs</span> — everything you currently own.</li>
          <li><span className="font-semibold text-black/80">Listed</span> — the ones you've put up for sale.</li>
          <li><span className="font-semibold text-black/80">Sold</span> — the ones you've sold to someone else.</li>
        </ol>
      </DocSection>

      <DocSection title="2. Editing an NFT's Details">
        <p className="text-black/60 text-sm leading-relaxed mb-4">
          On your own profile, every NFT card has three dropdowns built right into it — no separate
          edit page needed.
        </p>

        <DocStepBlock number="1" title="Find the dropdowns on the card">
          Below the price, each card shows three dropdowns: Collection, Category, and Country.
        </DocStepBlock>

        <DocStepBlock number="2" title="Pick a new value">
          <ul className="space-y-1 list-disc list-inside">
            <li><span className="font-semibold text-black/80">Collection</span> — move the NFT into one of your collections, or back to &ldquo;No collection&rdquo;.</li>
            <li><span className="font-semibold text-black/80">Category</span> — Art, Music, Gaming, Fashion, and so on.</li>
            <li><span className="font-semibold text-black/80">Country</span> — the country tag shown on the card.</li>
          </ul>
        </DocStepBlock>

        <DocStepBlock number="3" title="It saves automatically">
          There's no Save button — changing a dropdown updates the NFT right away.
        </DocStepBlock>

        <DocNote tone="info">
          Only the current owner can edit an NFT this way — once it's sold, the new owner controls
          these fields, not you. For a limited edition, editing one copy updates every copy of that
          same edition that you still own; copies you've already sold to someone else are theirs to
          edit, not yours.
        </DocNote>
      </DocSection>

      <DocSection title="3. Renewing Storage">
        <p className="text-black/60 text-sm leading-relaxed mb-3">
          Each NFT's image and metadata are hosted for a fixed period after minting. If one of your
          NFTs is expiring within 30 days (or has already lapsed), it shows up under &ldquo;Storage
          Needs Attention&rdquo; at the top of your profile so you can renew it before it goes offline.
        </p>
        <DocNote tone="warning">
          Storage renewal only appears on your own profile, and only for NFTs you currently own.
          Ownership and the renewal responsibility both transfer together when an NFT is sold.
        </DocNote>
      </DocSection>

      <DocSection title="Viewing Someone Else's Profile">
        <p className="text-black/60 text-sm leading-relaxed">
          Visiting another wallet's profile shows the same stats and NFT tabs, but without your
          wallet controls, storage alerts, or the edit dropdowns — it's a read-only view of what
          that wallet owns, has listed, and has sold.
        </p>
      </DocSection>
    </DocLayout>
  );
}
