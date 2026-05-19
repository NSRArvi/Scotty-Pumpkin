import Container from "../components/shared/Container";

export default function RiskWarningPage() {
  return (
    <section className="bg-primary-bg relative z-10 py-10 md:py-14 lg:py-20 ">
      <Container>
        <div className="space-y-6">
          <div className="ui-card border-amber-400/35 bg-white/80 p-5 md:p-7">
            <p className="text-xs md:text-sm text-primary font-semibold tracking-wide">
              SPUMP & USFF
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-secondary mt-1">
              Crypto Risk Warning
            </h1>
            <p className="text-secondary/80 text-sm md:text-base mt-2">
              Please read this section carefully before purchasing or using
              SPUMP or USFF.
            </p>
          </div>

          <div className="ui-card bg-white/80 p-5 md:p-7 space-y-6 text-sm md:text-base leading-relaxed text-secondary/80">
            <div className="rounded-xl border border-amber-400/30 bg-white/80 p-4 md:p-5">
              <h2 className="text-primary font-bold">HIGH RISK WARNING</h2>
              <p className="mt-2">
                Cryptocurrencies are volatile and high-risk digital assets.
              </p>
              <p>
                The value of SPUMP, USFF, and other digital assets may increase
                or decrease rapidly. You may lose part or all of your
                investment.
              </p>
              <p>
                You should only purchase or use cryptocurrencies if you fully
                understand the risks involved and can afford to bear potential
                losses.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-bold">
                UK and international RISK DISCLOSURE
              </h2>
              <p className="mt-2">
                Investing in cryptoassets involves a high degree of risk and is
                not suitable for all investors.
              </p>
              <p>
                Cryptoassets are not regulated financial products in the United
                Kingdom and are not covered by the Financial Services
                Compensation Scheme (FSCS) or the Financial Ombudsman Service
                (FOS).
              </p>
              <p>
                You should carefully consider whether you understand how
                cryptoassets work before purchasing or using them.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-bold">
                EU / FRANCE / FRENCH / RISK DISCLOSURE
              </h2>
              <p className="mt-2">
                Les crypto-actifs sont volatils et présentent un risque élevé.
                Vous pouvez perdre tout ou partie de votre investissement.
              </p>
              <p>
                Les crypto-actifs ne bénéficient pas nécessairement des
                protections réglementaires applicables aux instruments
                financiers traditionnels.
              </p>
              <p>
                Avant toute utilisation, vous devez vous assurer que vous
                comprenez pleinement les risques associés.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-bold">USER RESPONSIBILITY</h2>
              <p className="mt-2">You are solely responsible for:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Securing your wallet and private keys</li>
                <li>Protecting access to your accounts and devices</li>
                <li>Verifying all transaction details before confirmation</li>
              </ul>
              <p className="mt-2">
                Loss of private keys, unauthorized access, or incorrect
                transactions may result in permanent loss of funds.
              </p>
            </div>

            <div>
              <h2 className="text-primary font-bold">TRANSACTION RISKS</h2>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Blockchain transactions are final and irreversible</li>
                <li>Transactions cannot be cancelled once confirmed</li>
                <li>Incorrect transfers may result in permanent loss</li>
              </ul>
            </div>

            <div>
              <h2 className="text-primary font-bold">
                NO GUARANTEES OR ENTITLEMENT
              </h2>
              <p className="mt-2">
                SPUMP and USFF are digital assets intended for use within a
                digital ecosystem and do not represent any form of ownership,
                equity, or entitlement.
              </p>
              <p>
                There are no guarantees associated with the value, performance,
                or future utility of these digital assets.
              </p>
              <p>
                By purchasing, holding, or using SPUMP or USFF, you acknowledge
                and agree that:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  These digital assets are not bank deposits and are not insured
                  or protected by any financial authority.
                </li>
                <li>
                  They are not legal tender and are not backed by any government
                  or central bank.
                </li>
                <li>
                  They do not represent shares, ownership rights, dividends, or
                  any claim on assets or revenues.
                </li>
                <li>
                  There is no guarantee of value, liquidity, or future adoption.
                </li>
                <li>
                  The platform does not promise or provide any financial return
                  or profit.
                </li>
              </ul>
              <p className="mt-2">
                The value of SPUMP and USFF may fluctuate significantly and may
                become worthless. Users assume full responsibility for any
                financial loss.
              </p>
              <p>
                All use of these digital assets is at the sole risk of the user.
                The platform provides technology and services only and does not
                act as a financial institution, broker, or investment advisor.
              </p>
              <p>
                By proceeding, you confirm that you understand and accept that
                no guarantees or entitlements are provided.
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 text-white/55 text-xs md:text-sm">
              Scotty Pumpkin Ecosystem | SPUMP & USFF
              <br />
              This document forms part of the platform compliance and legal
              framework.
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
