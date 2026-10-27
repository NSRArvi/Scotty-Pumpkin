"use client";

import Link from "next/link";
import Container from "../../components/shared/Container";

function Section({ step, title, children }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white shadow-sm p-6 md:p-8 space-y-3">
      <div className="flex items-center gap-3">
        {step && (
          <span className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold flex items-center justify-center shrink-0">
            {step}
          </span>
        )}
        <h2 className="text-black font-bold text-lg">{title}</h2>
      </div>
      <div className="text-black/60 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

function Field({ name, required, children }) {
  return (
    <div className="flex gap-2">
      <span className="shrink-0 mt-0.5 text-black font-semibold text-sm">
        {name}{required && <span className="text-orange-500"> *</span>}
      </span>
      <span className="text-black/55 text-sm">— {children}</span>
    </div>
  );
}

export default function NftStudioHelpClient() {
  return (
    <div className="min-h-screen bg-[#F3EFE6] text-black">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-orange-500/4 blur-3xl" />
        <div className="absolute bottom-0 -right-60 w-[500px] h-[500px] rounded-full bg-purple-600/4 blur-3xl" />
      </div>

      <div className="relative">
        <Container>
          <div className="pt-12 pb-24 max-w-3xl mx-auto space-y-8">

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="h-px w-8 bg-orange-500/40" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-orange-500">
                  Help Guide
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">How to Mint an NFT</h1>
              <p className="text-black/50 mt-3">
                Step-by-step guide to creating and minting your NFT in{" "}
                <Link href="/nft-studio" className="text-orange-500 underline hover:text-orange-400">
                  NFT Studio
                </Link>.
              </p>
            </div>

            {/* Step 1 */}
            <Section step="1" title="Connect Your Wallet">
              <p>
                Open <Link href="/nft-studio" className="text-orange-500 underline">NFT Studio</Link> and
                click <strong>Connect Wallet</strong> at the top. You'll need a Solana wallet (like Phantom
                or Solflare) with enough SPUMP or USDC to cover the mint and storage fees.
              </p>
            </Section>

            {/* Step 2 */}
            <Section step="2" title="Upload Your Artwork">
              <p>
                Drag and drop your image, or click to browse. Accepted formats: <strong>PNG, JPG, GIF, WEBP</strong>.
              </p>
              <p>
                Once uploaded, you'll see an estimated <strong>storage fee</strong> based on the file
                size — this covers one year of hosting for your NFT's image and metadata.
              </p>
            </Section>

            {/* Step 3 */}
            <Section step="3" title="Fill in NFT Details">
              <div className="space-y-2.5">
                <Field name="Title" required>the name of your NFT (e.g. "Cosmic Pumpkin")</Field>
                <Field name="Symbol">a short ticker-style code, like "CPMP" (optional)</Field>
                <Field name="Description" required>tell buyers what this NFT is about</Field>
                <Field name="Collection">
                  group this NFT under an existing collection, or leave as{" "}
                  <em>— No collection —</em>. You can add or change this later from your{" "}
                  <Link href="/nft-profile" className="text-orange-500 underline">profile page</Link>.
                </Field>
                <Field name="Category" required>
                  pick the category that best fits (Art, Music, Gaming, Photography, etc.) —
                  buyers use this to filter the marketplace.
                </Field>
                <Field name="Edition" required>
                  <strong>Unlimited</strong> — no cap on copies. <strong>Limited</strong> — you set a
                  fixed <em>Total Supply</em>; once minted out, no more copies can ever be made.
                </Field>
                <Field name="Country">
                  optionally tag the NFT's country of origin — also editable later from your profile.
                </Field>
                <Field name="Royalty" required>
                  the percentage you earn every time this NFT resells (0–50%).
                </Field>
                <Field name="Traits / Attributes">
                  optional key–value tags (e.g. "Background: Purple") that add rarity and detail —
                  click <strong>Add trait</strong> for each one.
                </Field>
              </div>
            </Section>

            {/* Step 4 */}
            <Section step="4" title="Add Links & Extras (optional)">
              <p>
                Under <strong>Links & Extras</strong> you can add your Website, Social Media, WhatsApp,
                Twitter/X, and Sosay profile links — these show up on the NFT's detail page.
              </p>
              <div className="space-y-2.5 mt-3">
                <Field name="Unlockable Content">
                  a download link, redeem code, or private message that's shown <strong>only to
                  whoever owns the NFT</strong> — never shown publicly.
                </Field>
                <Field name="Explicit content toggle">
                  check this if the artwork is sensitive/NSFW — it'll be blurred with a warning on the
                  marketplace until a viewer clicks to reveal it.
                </Field>
              </div>
            </Section>

            {/* Step 5 */}
            <Section step="5" title="Choose How You'll Pay">
              <p>
                Pick <strong>🎃 SPUMP</strong> or <strong>💵 USDC</strong> under <em>Pay With</em>. The{" "}
                <strong>Cost Breakdown</strong> panel updates live and shows:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Mint price (and any active discount)</li>
                <li>Storage fee — one year of hosting, included automatically</li>
                <li>Total you'll pay, per copy if minting a limited edition</li>
              </ul>
              <p className="text-black/40 text-xs">
                Network, transaction, and Metaplex Core costs are fixed by Solana and shown separately.
              </p>
            </Section>

            {/* Step 6 */}
            <Section step="6" title="Mint">
              <p>
                Once everything looks right, click <strong>Mint NFT →</strong>. Approve the transaction(s)
                in your wallet when prompted. Minting can take a few moments — you'll see live status
                text while it processes.
              </p>
              <p>
                After minting, your NFT appears on your{" "}
                <Link href="/nft-profile" className="text-orange-500 underline">profile page</Link> and
                becomes visible on the{" "}
                <Link href="/nft-marketplace" className="text-orange-500 underline">marketplace</Link>.
              </p>
            </Section>

            {/* After minting */}
            <Section title="After Minting">
              <p>Things you can still do from your profile page after your NFT is minted:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Add, change, or remove its <strong>Collection</strong></li>
                <li>Change its <strong>Category</strong></li>
                <li>Add or change its <strong>Country</strong></li>
                <li>List it for sale, or renew storage before it expires</li>
              </ul>
              <p className="text-black/40 text-xs">
                Note: the artwork, title, and description are permanent once minted — only
                collection, category, and country can be updated afterward.
              </p>
            </Section>

            {/* FAQ
            <Section title="Common Questions">
              <div className="space-y-4">
                <div>
                  <p className="text-black font-semibold text-sm">What happens if my storage runs out?</p>
                  <p>You'll get a reminder to renew before it expires — renewing keeps your NFT's image and metadata hosted for another year.</p>
                </div>
                <div>
                  <p className="text-black font-semibold text-sm">Can I edit my NFT after minting?</p>
                  <p>Collection, category, and country can be changed anytime from your profile. The artwork, title, description, and royalty are locked in at mint time.</p>
                </div>
                <div>
                  <p className="text-black font-semibold text-sm">What's the difference between Unlimited and Limited editions?</p>
                  <p>Unlimited has no cap on copies minted. Limited has a fixed supply you set upfront — once all copies are minted, no more can ever be created.</p>
                </div>
              </div>
            </Section> */}

            <div className="text-center pt-4">
              <Link
                href="/nft-studio"
                className="inline-block px-6 py-3 rounded-xl bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors"
              >
                Go to NFT Studio →
              </Link>
            </div>

          </div>
        </Container>
      </div>
    </div>
  );
}
