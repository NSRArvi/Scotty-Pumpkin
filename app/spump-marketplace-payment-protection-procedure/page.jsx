import Container from "../components/shared/Container";
import Image from "next/image";
import protectionImage from "@/public/assets/protection_procedure.png";
import protectionImageMobile from "@/public/assets/protection_procedure_mobile.png";

export default function Page() {
  const lists1 = [
    {
      num: "01",
      label: "Overview",
      text: "The SPUMP Marketplace payment protection system is an optional ecosystem service intended to assist participating buyers and sellers during selected SPUMP transactions within the Scotty Pumpkin ecosystem.",
    },
    {
      num: "02",
      label: "Buyer Agreement",
      text: "Where a buyer wishes to use the payment protection service, the buyer should first inform the seller and confirm that both parties agree to use the SPUMP Marketplace payment protection procedure.",
    },
    {
      num: "03",
      label: "Sending Payment",
      text: "The buyer may then send the agreed SPUMP payment to the designated SPUMP Marketplace protection wallet and submit the transaction details through the Sosay payment protection section or by email, together with:",
    },
  ];
  const lists2 = [
    {
      num: "04",
      label: "Receipt Confirmation",
      text: "Upon receipt confirmation, the SPUMP Marketplace protection service may notify the participating seller that the payment has been received and is being temporarily held pending transaction completion.",
    },
    {
      num: "05",
      label: "Seller Wallet",
      text: "Participating sellers using this service may be requested to provide their public wallet address either during transaction setup or before payment release procedures are completed.",
    },
    {
      num: "06",
      label: "Release of Funds",
      text: "Once both participating parties provide reasonable confirmation of delivery, completion, or service fulfillment in accordance with the marketplace procedures, the held SPUMP may be released to the seller's designated wallet address.",
    },
  ];
  return (
    <section className="bg-primary-bg">
      <Container>
        <div className="py-10">
          <div className="mb-10">
            <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-3 flex items-center gap-2 before:content-[''] before:inline-block before:w-6 before:h-px before:bg-secondary/30">
              SPUMP Marketplace
            </p>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-4 text-secondary">
              Payment Protection
              <br />
              <span className="text-primary italic">Procedure</span>
            </h1>
            <div className="w-10 h-0.5 bg-secondary/10 mt-4" />
          </div>

          <div className="divide-y divide-secondary/10 border-t border-secondary/10">
            {lists1.map(({ num, label, text }) => (
              <div key={num} className="grid grid-cols-[48px_1fr] gap-x-5 py-6">
                <span className="text-[13px] text-secondary/60 pt-0.5 text-right">
                  {num}
                </span>
                <div>
                  <span className="block text-[11px] font-medium tracking-[0.09em] uppercase text-secondary/70 mb-1.5">
                    {label}
                  </span>
                  <p className="text-[15px] leading-7 text-secondary/80">
                    {text}
                  </p>
                </div>
              </div>
            ))}

            <div className="grid grid-cols-[48px_1fr] py-6">
              <span />
              <div className="bg-white/80 rounded-xl px-5 py-4 text-[15px] leading-7 text-secondary/80 space-y-1">
                <p>the transaction reference,</p>
                <p>a copy or PDF of the advertisement or listing,</p>
                <p>the wallet transaction reference,</p>
                <p>
                  and the participating buyer and seller details requested by
                  the system.
                </p>
              </div>
            </div>

            {lists2.map(({ num, label, text }) => (
              <div key={num} className="grid grid-cols-[48px_1fr] gap-x-5 py-6">
                <span className="text-[13px] text-secondary/60 pt-0.5 text-right">
                  {num}
                </span>
                <div>
                  <span className="block text-[11px] font-medium tracking-[0.09em] uppercase text-secondary/70 mb-1.5">
                    {label}
                  </span>
                  <p className="text-[15px] leading-7 text-secondary/80">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-l-2 border-secondary/20 pl-5">
            <p className="text-[13px] leading-7 text-secondary/75">
              This optional protection procedure is intended solely as an
              ecosystem transaction assistance feature and does not create
              banking, custodial, financial guarantee, insurance, or regulated
              escrow services. SPUMP is not a share, security, financial
              instrument, investment contract, or guaranteed return product.
              Cryptocurrency asset values may rise or fall over time.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-secondary/10 bg-secondary/3 p-5">
            <p className="text-[11px] font-medium tracking-widest uppercase text-secondary/80 mb-4">
              Protection Procedure Diagram
            </p>
            <Image
              src={protectionImageMobile}
              alt=""
              width={1000}
              height={1000}
              className="md:hidden w-full h-auto rounded-xl"
            />
            <Image
              src={protectionImage}
              alt=""
              width={1000}
              height={1000}
              className="hidden md:flex w-full h-auto rounded-xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
