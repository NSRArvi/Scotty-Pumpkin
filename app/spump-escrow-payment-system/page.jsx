"use client";
import { useState } from "react";
import Container from "../components/shared/Container";
import { Copy, ExternalLink, ShieldCheck, TriangleAlert } from "lucide-react";
import { TbCopyCheck } from "react-icons/tb";

export default function EscrowPaymentSystem() {
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
        <div className="space-y-6 text-secondary/80">
          <p className="pt-6">
            The SPUMP Escrow Payment System is an optional peer-to-peer
            marketplace transaction assistance feature designed to help protect
            participating buyers and sellers within the Scotty Pumpkin
            ecosystem.
          </p>
          <p>
            Where both parties voluntarily agree to use the procedure, SPUMP
            payments may be temporarily held within the SPUMP Marketplace
            transaction protection system pending delivery confirmation, service
            completion, booking verification, or other agreed transaction
            fulfillment procedures.
          </p>
          <p>
            The system is intended to assist participating users during selected
            marketplace activities including goods, services, rentals, digital
            products, advertising services, bookings, and ecosystem-related
            commerce.
          </p>
          <p>
            Participating buyers and sellers may be requested to provide
            supporting verification information including shipment tracking,
            photographs, booking confirmations, communication records,
            screenshots, proof of service completion, or other reasonable
            supporting documentation depending on the transaction type.
          </p>
          <p>
            Once sufficient confirmation is received in accordance with the
            marketplace procedure, the SPUMP payment may be released to the
            seller’s designated wallet address.
          </p>
          <p>
            The SPUMP Escrow Payment System is intended solely as an optional
            ecosystem transaction assistance and verification feature and does
            not constitute banking, insurance, investment, fiduciary, custody,
            or regulated financial services.
          </p>
          <p>
            SPUMP is a peer-to-peer digital utility token intended for use
            within the Scotty Pumpkin ecosystem. SPUMP is not a share, security,
            financial instrument, investment contract, or guaranteed return
            product.
          </p>
        </div>
        <div className="pb-20 pt-20">
          <div className="flex items-center justify-between">
            <p></p>
            <p className="flex items-center justify-center gap-1 px-2 py-1.5 bg-secondary/90 rounded-xl">
              <ShieldCheck size={18} className="text-white" />
              <span className="text-white text-xs">Official</span>
            </p>
            <p className="text-secondary">Solana mainnet</p>
          </div>
          <p className="text-sm text-secondary/80 mb-2">
            Contract Address (CA)
          </p>
          <div className="bg-white text-secondary/80 rounded-xl py-6 flex items-center justify-between px-4">
            <p>{textToCopy}</p>
            <button
              onClick={handleCopy}
              className="flex gap-1 items-center cursor-pointer">
              {isCopied ? (
                <>
                  <TbCopyCheck size={18} stroke="#f17005" /> Copied
                </>
              ) : (
                <>
                  {" "}
                  <Copy size={18} stroke="#f17005" /> Copy
                </>
              )}
            </button>
          </div>
          <div className="bg-white text-red-500 mt-8 rounded-xl py-6 px-4">
            <p className="max-w-4xl mx-auto text-center">
              <TriangleAlert
                size={25}
                className="text-3xl text-primary text-center mb-2 mx-auto"
              />
              Always verify this address before trading. Scammers create fake
              tokens with identical names and symbols. The official contract
              address above is the only legitimate one. Cross-check on any
              explorer below.
            </p>
          </div>
          <div className="border border-b-primary h-px w-full my-10" />
          <div className="bg-white px-4 py-6 rounded-xl">
            <p className="mt-6 text-secondary font-medium mb-3">
              Verify On Explorer
            </p>
            <div>
              <div className="flex items-center justify-start gap-8">
                {lists.map((list, i) => {
                  const Icon = list.icon;
                  return (
                    <div
                      key={i}
                      className="flex gap-1 items-center px-2 py-1.5 border border-secondary text-secondary/80 rounded-lg text-sm">
                      <span>
                        <Icon size={16} />
                      </span>
                      <span>{list.title}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-sm mt-4 text-secondary/80 w-4/5">
                Open any link above and confirm the mint address matches exactly
                — all 44 characters. If the address shown on the explorer
                differs even by one character, it is a counterfeit token.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
