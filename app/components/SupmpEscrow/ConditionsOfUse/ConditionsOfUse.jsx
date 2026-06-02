import Container from "../../shared/Container";

export default function ConditionsOfUse() {
  const sections = [
    {
      number: "01",
      title: "Optional Ecosystem Service",
      content:
        "The SPUMP Marketplace Payment Protection system is an optional transaction assistance feature available within the Scotty Pumpkin ecosystem for participating buyers and sellers who voluntarily agree to use the procedure.",
    },
    {
      number: "02",
      title: "Peer-to-Peer Marketplace",
      content:
        "Transactions occurring through the SPUMP Marketplace are conducted directly between participating users. SPUMP Marketplace acts solely as a technical ecosystem platform and optional payment holding facilitator within the described procedure.",
    },
    {
      number: "04",
      title: "Buyer Responsibilities",
      content: null,
      list: [
        "verifying the seller identity where applicable",
        "reviewing advertisements and listings",
        "confirming product or service details",
        "ensuring legality within their jurisdiction",
        "sending the correct SPUMP amount to the designated marketplace wallet",
        "and providing requested supporting information and proof",
      ],
      prefix: "The buyer remains responsible for:",
    },
    {
      number: "05",
      title: "Seller Responsibilities",
      content: null,
      list: [
        "providing accurate listings and descriptions",
        "delivering the agreed goods or services",
        "providing reasonable proof of delivery or completion",
        "supplying a valid public wallet address",
        "and complying with applicable laws and marketplace rules",
      ],
      prefix: "The seller remains responsible for:",
    },
    {
      number: "06",
      title: "Proof of Delivery or Completion",
      content: null,
      list: [
        "shipment tracking",
        "signed receipts",
        "photographs or videos",
        "service completion confirmation",
        "accommodation check-in proof",
        "booking confirmations",
        "communication records",
        "identity confirmation",
        "or other reasonable supporting documentation",
      ],
      prefix:
        "Depending on the transaction type, participating parties may be requested to provide supporting evidence including:",
    },
    {
      number: "07",
      title: "Release of SPUMP",
      content:
        "SPUMP payments temporarily held under the payment protection procedure may be released once sufficient confirmation of delivery, completion, or transaction fulfillment has been received in accordance with the marketplace procedure.",
    },
    {
      number: "08",
      title: "Refused or Suspicious Transactions",
      content: null,
      list: [
        "fraud",
        "illegal activity",
        "false listings",
        "impersonation",
        "prohibited goods or services",
        "misleading information",
        "abusive conduct",
        "or suspicious transaction behavior",
      ],
      prefix:
        "The platform reserves the right to delay, refuse, suspend, investigate, or cancel participation in transactions suspected of:",
    },
    {
      number: "09",
      title: "No Banking or Regulated Escrow Service",
      content: null,
      list: [
        "banking services",
        "regulated escrow services",
        "custody services",
        "insurance services",
        "investment services",
        "fiduciary services",
        "financial guarantees",
        "or regulated financial activity",
      ],
      prefix:
        "The SPUMP Marketplace payment protection procedure is an optional ecosystem transaction assistance feature and does not constitute:",
    },
    {
      number: "10",
      title: "No Guarantee",
      content: null,
      list: [
        "delivery",
        "product authenticity",
        "service quality",
        "legality",
        "seller or buyer behavior",
        "transaction outcome",
        "or financial recovery",
      ],
      prefix: "SPUMP Marketplace does not guarantee:",
      suffix:
        "Users participate at their own discretion and remain responsible for conducting reasonable due diligence before engaging in transactions.",
    },
    {
      number: "11",
      title: "Digital Asset Notice",
      content:
        "SPUMP is a peer-to-peer digital utility token intended for use within the Scotty Pumpkin ecosystem. SPUMP is not a share, security, financial instrument, investment contract, or guaranteed return product. Cryptocurrency asset values may rise or fall over time.",
    },
    {
      number: "12",
      title: "Applicable Laws",
      content:
        "Users may use SPUMP and associated ecosystem services only where permitted under applicable local laws, regulations, and jurisdictional requirements.",
    },
    {
      number: "13",
      title: "Service Fees",
      content:
        "The SPUMP Marketplace payment protection procedure may require a low fixed ecosystem administration fee, currently anticipated at approximately 1 SPUMP token per protected transaction, in order to assist with operational, communication, verification, security, and ecosystem maintenance costs associated with the service. The platform reserves the right to modify, waive, reduce, or update applicable service fees within future marketplace procedures, ecosystem notices, or service conditions.",
    },
  ];
  return (
    <div className="min-h-screen w-full font-sans bg-primary-bg text-secondary">
      <Container>
        <div className=" pt-10 pb-10">
          <div className="flex items-start gap-5 mb-12 pb-8 border-b border-secondary/10">
            <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
              🔐
            </div>
            <div>
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
                SPUMP Marketplace
              </p>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-4 text-secondary">
                Payment <br />
                <span className="text-primary italic">Protection</span>
              </h1>
            </div>
          </div>

          <p className="text-base md:text-lg font-medium mb-10 text-secondary/70">
            Conditions of Use — Ecosystem Transaction Assistance
          </p>

          <div className="flex flex-wrap gap-3">
            {[
              "Peer-to-Peer",
              "Optional Feature",
              "1 SPUMP Fee",
              "Ecosystem Native",
            ].map((label) => (
              <span
                key={label}
                className="text-xs font-semibold px-4 py-2 rounded-full border border-secondary/60 text-secondary/60">
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="w-full h-px bg-secondary/12" />
        <div className="py-10 space-y-0">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="flex gap-6 md:gap-10 py-8 border-b border-secondary/10">
              <div className="shrink-0 w-10 pt-0.5">
                <span className="text-xs font-bold tracking-widest text-primary">
                  {section.number}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold mb-3 text-secondary">
                  {section.title}
                </h2>

                {section.prefix && (
                  <p className="text-sm mb-3 text-secondary/60">
                    {section.prefix}
                  </p>
                )}

                {section.content && (
                  <p className="text-sm leading-relaxed text-secondary/70">
                    {section.content}
                  </p>
                )}

                {section.list && (
                  <ul className="space-y-2">
                    {section.list.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm text-secondary/70">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full shrink-0 bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.suffix && (
                  <p className="text-sm mt-4 leading-relaxed text-secondary/70">
                    {section.suffix}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="py-10">
          <div className="w-full h-px mb-8 bg-primary/30" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <p className="text-xs font-semibold text-primary">
              SPUMP Marketplace · Payment Protection
            </p>

            <p className="text-xs text-secondary/40">
              SPUMP is not a regulated financial product. Participate at your
              own discretion.
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
