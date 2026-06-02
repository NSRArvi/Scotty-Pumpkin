import Container from "../../shared/Container";

const steps = [
  { icon: "🤝", label: "Both parties agree" },
  { icon: "🔒", label: "Payment held" },
  { icon: "📄", label: "Verification" },
  { icon: "✅", label: "Funds released" },
];

const pills = [
  { icon: "📦", label: "Goods" },
  { icon: "🔧", label: "Services" },
  { icon: "🏠", label: "Rentals" },
  { icon: "💾", label: "Digital products" },
  { icon: "📢", label: "Advertising" },
  { icon: "📅", label: "Bookings" },
];

const paragraphs = [
  "The SPUMP Escrow Payment System is an optional peer-to-peer marketplace transaction assistance feature designed to help protect participating buyers and sellers within the Scotty Pumpkin ecosystem.",
  "Where both parties voluntarily agree to use the procedure, SPUMP payments may be temporarily held within the SPUMP Marketplace transaction protection system pending delivery confirmation, service completion, booking verification, or other agreed transaction fulfillment procedures.",
  "The system is intended to assist participating users during selected marketplace activities including goods, services, rentals, digital products, advertising services, bookings, and ecosystem-related commerce.",
  "Participating buyers and sellers may be requested to provide supporting verification information including shipment tracking, photographs, booking confirmations, communication records, screenshots, proof of service completion, or other reasonable supporting documentation depending on the transaction type.",
  "Once sufficient confirmation is received in accordance with the marketplace procedure, the SPUMP payment may be released to the seller's designated wallet address.",
  "The SPUMP Escrow Payment System is intended solely as an optional ecosystem transaction assistance and verification feature and does not constitute banking, insurance, investment, fiduciary, custody, or regulated financial services.",
  "SPUMP is a peer-to-peer digital utility token intended for use within the Scotty Pumpkin ecosystem. SPUMP is not a share, security, financial instrument, investment contract, or guaranteed return product.",
];

export default function EscrowPaymentSystem() {
  return (
    <section className="bg-primary-bg py-10">
      <Container>
        <div className="flex items-start gap-5 mb-12 pb-8 border-b border-secondary/10">
          <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
            💳
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
              Scotty Pumpkin Ecosystem
            </p>
            <h1 className="text-5xl md:text-7xl text-secondary font-black leading-none tracking-tight mb-5">
              SPUMP Escrow <p className="italic text-primary">Payment System</p>
            </h1>
          </div>
        </div>

        <div className="flex mb-10">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center text-center relative">
              {i < steps.length - 1 && (
                <div className="absolute top-4 left-[60%] right-[-40%] h-px bg-secondary/10" />
              )}
              <div className="relative z-10 w-8 h-8 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-sm mb-2.5">
                {step.icon}
              </div>
              <span className="text-[11px] text-secondary/70 leading-snug max-w-20">
                {step.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[11px] font-medium tracking-widest uppercase text-primary mb-4">
          Overview
        </p>
        <div className="space-y-4 mb-8 text-[15px] leading-[1.75] text-secondary/90 font-light">
          <p className="text-lg font-semibold text-secondary">
            Marketplace Transactions &amp; Payment Protection Notice
          </p>
          <p>
            Transactions and exchanges between participating buyers and sellers
            on the SPUMP Marketplace may be conducted freely and directly
            between the participating parties using traditional fiat payment
            systems or other agreed payment methods, under the sole
            responsibility of the buyer and seller.
          </p>
          <p>
            As an optional alternative, SPUMP offers the SPUMP Escrow Payment
            &amp; Transaction Verification System, designed to assist
            participating users by helping protect both buyers and sellers
            during selected peer-to-peer marketplace transactions within the
            ecosystem.
          </p>
          <p>
            Where both participating parties voluntarily agree to use the SPUMP
            protection procedure, SPUMP payments may be temporarily held within
            the marketplace protection system pending reasonable delivery,
            completion, booking, or transaction verification procedures.
          </p>
          <p>
            Once the transaction is satisfactorily completed between the
            participating parties in accordance with the marketplace procedure,
            the SPUMP payment may be released to the seller&apos;s designated
            wallet address. Participating users may then choose, where permitted
            and available, to hold, transfer, swap, exchange, or convert SPUMP
            into supported digital assets such as USDT /USDC /or client crypto
            selection or USFF, or withdraw through supported external services
            subject to applicable laws, platform availability, and local
            regulations relating to digital asset and token usage within their
            jurisdiction.
          </p>
          <p>
            Participation in the SPUMP protection system remains entirely
            optional and requires agreement from both the buyer and seller.
          </p>
        </div>

        <div>
          {paragraphs.map((text, i) => (
            <div
              key={i}
              className={`flex gap-5 py-6 items-start ${
                i < paragraphs.length - 1
                  ? "border-b border-secondary/[0.07]"
                  : ""
              }`}>
              <span className="shrink-0 text-[11px] font-medium text-primary/80 tracking-wide pt-0.5 w-6 text-right">
                0{i + 1}
              </span>
              <p className="flex-1 text-[15px] leading-[1.75] text-secondary/90 font-light m-0">
                {text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-8 mb-8">
          {pills.map((pill, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-secondary/80">
              {pill.icon} {pill.label}
            </span>
          ))}
        </div>

        <div className="flex gap-3.5 items-start px-6 py-5 bg-primary/5 border border-primary/15 border-l-2 border-l-primary rounded-lg">
          <span className="shrink-0 text-base mt-0.5">ℹ️</span>
          <p className="m-0 text-[13px] text-secondary/70 leading-relaxed">
            This system is optional and voluntary. It does not constitute
            regulated financial services of any kind. Participation requires
            agreement from both buyer and seller.
          </p>
        </div>
      </Container>
    </section>
  );
}
