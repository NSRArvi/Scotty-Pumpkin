"use client";
import Container from "../components/shared/Container";
import { Copy, ExternalLink, ShieldCheck, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { TbCopyCheck } from "react-icons/tb";

export default function SpumpIdentificationNumber() {
  const [textToCopy, setTextToCopy] = useState(
    "AKdCs.QH9LKCpu3n2.Qc.M.S3.BK8yQTWDcSDpujLr8Ujey.NT",
  );
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const lists = [
    { icon: ExternalLink, title: "Solscan" },
    { icon: ExternalLink, title: "Solana Explorer" },
    { icon: ExternalLink, title: "Birdeye" },
    { icon: ExternalLink, title: "DexScreener" },
    { icon: ExternalLink, title: "Jupiter" },
  ];

  return (
    <section className="bg-primary-bg py-20">
      <Container>
        <div className="flex items-start gap-5 mb-12 pb-8 border-b border-secondary/10">
          <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
            <ShieldCheck size={22} className="text-primary" />
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
              Scotty Pumpkin Ecosystem
            </p>
            <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-5 text-secondary">
              SPUMP Identification <p className="italic text-primary">Number</p>
            </h1>
          </div>
          <div className="ml-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-xl">
            <ShieldCheck size={15} className="text-white" />
            <span className="text-white text-xs font-medium">Official</span>
          </div>
        </div>

        <p className="text-[11px] font-medium tracking-widest uppercase text-primary mb-4">
          Contract Address
        </p>

        <div className="flex gap-5 py-6 items-start border-b border-secondary/[0.07]">
          <span className="shrink-0 text-[11px] font-medium text-primary/70 tracking-wide pt-0.5 w-6 text-right">
            01
          </span>
          <div className="flex-1">
            <p className="text-[13px] text-secondary/80 mb-3 font-light">
              Contract Address (CA) · Solana mainnet
            </p>
            <div className="bg-white rounded-xl py-5 px-5 flex items-center justify-between gap-4 border border-secondary/[0.07]">
              <p className="text-secondary/70 text-sm font-mono break-all">
                {textToCopy}
              </p>
              <button
                onClick={handleCopy}
                className="shrink-0 flex gap-1.5 items-center cursor-pointer text-sm text-secondary/50 hover:text-primary transition-colors">
                {isCopied ? (
                  <>
                    <TbCopyCheck size={18} className="text-primary" />
                    <span className="text-primary">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={18} className="text-primary" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-5 py-6 items-start border-b border-secondary/[0.07]">
          <span className="shrink-0 text-[11px] font-medium text-primary/70 tracking-wide pt-0.5 w-6 text-right">
            02
          </span>
          <div className="flex-1">
            <div className="flex gap-3.5 items-start px-5 py-5 bg-primary/5 border border-primary/15 border-l-2 border-l-primary rounded-lg">
              <TriangleAlert
                size={18}
                className="text-primary shrink-0 mt-0.5"
              />
              <p className="m-0 text-[13px] text-secondary/80 leading-relaxed">
                Always verify this address before trading. Scammers create fake
                tokens with identical names and symbols. The official contract
                address above is the only legitimate one. Cross-check on any
                explorer below.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-5 py-6 items-start">
          <span className="shrink-0 text-[11px] font-medium text-primary/70 tracking-wide pt-0.5 w-6 text-right">
            03
          </span>
          <div className="flex-1">
            <p className="text-[13px] text-secondary/70 mb-4 font-light">
              Verify on Explorer
            </p>
            <div className="flex items-center flex-wrap gap-2 mb-5">
              {lists.map((list, i) => {
                const Icon = list.icon;
                return (
                  <div
                    key={i}
                    className="flex gap-1.5 items-center px-3 py-1.5 bg-white border border-secondary/15 text-secondary/80 rounded-lg text-xs hover:border-primary/30 hover:text-primary transition-colors cursor-pointer">
                    <Icon size={13} />
                    <span>{list.title}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[13px] text-secondary/80 leading-relaxed font-light">
              Open any link above and confirm the mint address matches exactly —
              all 44 characters. If the address shown on the explorer differs
              even by one character, it is a counterfeit token.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
