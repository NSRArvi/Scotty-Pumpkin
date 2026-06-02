import Container from "../components/shared/Container";

const sections = [
  {
    index: "01",
    title: "High Risk",
    content: [
      "Cryptocurrencies are volatile and high-risk digital assets.",
      "The value of SPUMP, USFF, and other digital assets may increase or decrease rapidly. You may lose part or all of your investment.",
      "You should only purchase or use cryptocurrencies if you fully understand the risks involved and can afford to bear potential losses.",
    ],
  },
  {
    index: "02",
    title: "UK and International Risk Disclosure",
    content: [
      "Investing in cryptoassets involves a high degree of risk and is not suitable for all investors.",
      "Cryptoassets are not regulated financial products in the United Kingdom and are not covered by the Financial Services Compensation Scheme (FSCS) or the Financial Ombudsman Service (FOS).",
      "You should carefully consider whether you understand how cryptoassets work before purchasing or using them.",
    ],
  },
  {
    index: "03",
    title: "EU / France / French Risk Disclosure",
    content: [
      "Les crypto-actifs sont volatils et présentent un risque élevé. Vous pouvez perdre tout ou partie de votre investissement.",
      "Les crypto-actifs ne bénéficient pas nécessairement des protections réglementaires applicables aux instruments financiers traditionnels.",
      "Avant toute utilisation, vous devez vous assurer que vous comprenez pleinement les risques associés.",
    ],
  },
  {
    index: "04",
    title: "User Responsibility",
    intro: "You are solely responsible for:",
    bullets: [
      "Securing your wallet and private keys",
      "Protecting access to your accounts and devices",
      "Verifying all transaction details before confirmation",
    ],
    outro:
      "Loss of private keys, unauthorized access, or incorrect transactions may result in permanent loss of funds.",
  },
  {
    index: "05",
    title: "Transaction Risks",
    bullets: [
      "Blockchain transactions are final and irreversible",
      "Transactions cannot be cancelled once confirmed",
      "Incorrect transfers may result in permanent loss",
    ],
  },
  {
    index: "06",
    title: "No Guarantees or Entitlement",
    content: [
      "SPUMP and USFF are digital assets intended for use within a digital ecosystem and do not represent any form of ownership, equity, or entitlement.",
      "There are no guarantees associated with the value, performance, or future utility of these digital assets.",
      "By purchasing, holding, or using SPUMP or USFF, you acknowledge and agree that:",
    ],
    bullets: [
      "These digital assets are not bank deposits and are not insured or protected by any financial authority.",
      "They are not legal tender and are not backed by any government or central bank.",
      "They do not represent shares, ownership rights, dividends, or any claim on assets or revenues.",
      "There is no guarantee of value, liquidity, or future adoption.",
      "The platform does not promise or provide any financial return or profit.",
    ],
    outro:
      "The value of SPUMP and USFF may fluctuate significantly and may become worthless. Users assume full responsibility for any financial loss. All use of these digital assets is at the sole risk of the user. The platform provides technology and services only and does not act as a financial institution, broker, or investment advisor. By proceeding, you confirm that you understand and accept that no guarantees or entitlements are provided.",
  },
];

export default function RiskWarningPage() {
  return (
    <section className="bg-primary-bg py-20">
      <Container>
        <div className="flex items-start gap-5 mb-12 pb-8 border-b border-secondary/10">
          <div className="shrink-0 w-13 h-13 mt-1 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl">
            ⚠️
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-2">
              SPUMP & USFF
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-4 text-secondary">
              General Crypto <br />
              <span className="text-primary italic">Notice</span>
            </h1>
          </div>
        </div>

        <div className="flex gap-3.5 items-start px-5 py-5 bg-primary/5 border border-primary/15 border-l-2 border-l-primary rounded-lg mb-10">
          <span className="shrink-0 text-base mt-0.5">ℹ️</span>
          <p className="m-0 text-[13px] text-secondary/75 leading-relaxed font-light">
            Please read this section carefully before purchasing or using SPUMP
            or USFF.
          </p>
        </div>

        <p className="text-[11px] font-medium tracking-widest uppercase text-primary mb-4">
          Risk Disclosures
        </p>

        <div>
          {sections.map((section, i) => (
            <div
              key={i}
              className={`flex gap-5 py-6 items-start ${
                i < sections.length - 1
                  ? "border-b border-secondary/[0.07]"
                  : ""
              }`}>
              <span className="shrink-0 text-[11px] font-medium text-primary tracking-wide pt-0.5 w-6 text-right">
                {section.index}
              </span>
              <div className="flex-1 space-y-3">
                <p className="text-[13px] font-medium tracking-wide uppercase text-secondary mb-1">
                  {section.title}
                </p>

                {section.content?.map((para, j) => (
                  <p
                    key={j}
                    className="text-[15px] leading-[1.75] text-secondary/80 font-light m-0">
                    {para}
                  </p>
                ))}

                {section.intro && (
                  <p className="text-[15px] leading-[1.75] text-secondary/70 font-light m-0">
                    {section.intro}
                  </p>
                )}

                {section.bullets && (
                  <ul className="space-y-2 pl-1">
                    {section.bullets.map((item, k) => (
                      <li
                        key={k}
                        className="flex items-start gap-2.5 text-[15px] text-secondary/75 font-light leading-relaxed">
                        <span className="shrink-0 mt-2 w-1 h-1 rounded-full bg-primary/50" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.outro && (
                  <p className="text-[15px] leading-[1.75] text-secondary/70 font-light m-0">
                    {section.outro}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-secondary/10 flex items-center justify-between">
          <p className="text-[12px] text-secondary/80 font-light">
            Scotty Pumpkin Ecosystem · SPUMP & USFF
          </p>
          <p className="text-[12px] text-secondary/70 font-light">
            Platform compliance and legal framework
          </p>
        </div>
      </Container>
    </section>
  );
}
