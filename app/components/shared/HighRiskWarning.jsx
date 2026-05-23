import Container from "./Container";

export default function HighRiskWarning() {
  return (
    <section className="relative z-10 py-6 lg:px-16 bg-primary-bg">
      <Container>
        <div className="ui-card border-primary bg- px-5 py-4 md:px-6 md:py-5 text-center">
          <h3 className="text-primary font-bold tracking-wide">
            SPUMP Utility & Ecosystem Notice
          </h3>
          <div className="mt-3 text-sm text-center  text-secondary/80 leading-relaxed">
            <p>
              SPUMP is a peer-to-peer digital utility token intended for use
              within the Scotty Pumpkin ecosystem. SPUMP is not a share,
              security, financial instrument, investment contract, or guaranteed
              return product. Users may acquire, hold, send, receive, swap,
              sell, or use SPUMP to pay between participating users and
              ecosystem members for selected goods, services, marketplace
              activity, digital commerce, advertising services, SPUMP
              Marketplace activities, SPUMP Shop Creator services, and other
              ecosystem-related services, where permitted under applicable laws
              and regulations.
            </p>
            <p className="mt-4">
              Users paying with SPUMP for selected SPUMP ecosystem services may
              benefit from discounts of up to 30% on selected spump services.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
