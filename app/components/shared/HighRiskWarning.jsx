import Container from "./Container";

export default function HighRiskWarning() {
  return (
    <section className="relative z-10 py-6 lg:px-16 bg-primary-bg">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="ui-card border-primary bg- px-5 py-4 md:px-6 md:py-5 text-center">
            <h3 className="text-primary font-bold tracking-wide">
              ⚠️ HIGH RISK WARNING
            </h3>
            <div className="mt-3 text-sm  text-secondary/80 leading-relaxed text-justify">
              <p>
                SPUMP is a utility token intended for use within the Scotty
                Pumpkin ecosystem, where users may use SPUMP to pay for selected
                Scotty Pumpkin goods, services, marketplace features, shop
                creator plans, advertising, and ecosystem utilities, with
                discounts of up to 30% on selected services.
              </p>
              <p className="mt-2">
                Users may also pay via bank transfer or supported fiat payment
                systems. SPUMP is intended to be used only where permitted under
                applicable laws and country regulations.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
