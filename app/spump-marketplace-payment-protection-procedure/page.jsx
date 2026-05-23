import Container from "../components/shared/Container";
import Image from "next/image";
import protectionImage from "@/public/assets/protection_procedure.png";
import protectionImageMobile from "@/public/assets/protection_procedure_mobile.png";

export default function paage() {
  return (
    <section className="bg-primary-bg">
      <Container>
        <div className="">
          <div className="space-y-6 text-secondary/80">
            <p className="pt-6">
              The SPUMP Marketplace payment protection system is an optional
              ecosystem service intended to assist participating buyers and
              sellers during selected SPUMP transactions within the Scotty
              Pumpkin ecosystem.
            </p>
            <p>
              Where a buyer wishes to use the payment protection service, the
              buyer should first inform the seller and confirm that both parties
              agree to use the SPUMP Marketplace payment protection procedure.
            </p>
            <p>
              The buyer may then send the agreed SPUMP payment to the designated
              SPUMP Marketplace protection wallet and submit the transaction
              details through the Sosay payment protection section or by email,
              together with:
            </p>
            <p>
              the transaction reference,
              <br />
              a copy or PDF of the advertisement or listing,
              <br />
              the wallet transaction reference,
              <br />
              and the participating buyer and seller details requested by the
              system.
            </p>
            <p>
              Upon receipt confirmation, the SPUMP Marketplace protection
              service may notify the participating seller that the payment has
              been received and is being temporarily held pending transaction
              completion.
            </p>
            <p>
              Participating sellers using this service may be requested to
              provide their public wallet address either during transaction
              setup or before payment release procedures are completed.
            </p>
            <p>
              Once both participating parties provide reasonable confirmation of
              delivery, completion, or service fulfillment in accordance with
              the marketplace procedures, the held SPUMP may be released to the
              seller’s designated wallet address.
            </p>
            <p>
              This optional protection procedure is intended solely as an
              ecosystem transaction assistance feature and does not create
              banking, custodial, financial guarantee, insurance, or regulated
              escrow services. SPUMP is not a share, security, financial
              instrument, investment contract, or guaranteed return product.
              Cryptocurrency asset values may rise or fall over time
            </p>
          </div>
          <div className="py-20">
            <Image
              src={protectionImageMobile}
              alt=""
              width={1000}
              height={1000}
              className="md:hidden w-full h-auto rounded-2xl"
            />
            <Image
              src={protectionImage}
              alt=""
              width={1000}
              height={1000}
              className="hidden md:flex w-full h-auto rounded-2xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
