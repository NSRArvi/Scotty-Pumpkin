export default function HighRiskWarning() {
  return (
    <section className="relative z-10 px-4 py-6 md:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="ui-card border-amber-400/35 bg-amber-500/10 px-5 py-4 md:px-6 md:py-5 text-center">
          <h3 className="text-amber-300 font-bold tracking-wide">⚠️ HIGH RISK WARNING</h3>
          <p className="mt-3 text-sm md:text-base text-white/80 leading-relaxed">
            Cryptocurrencies are volatile and high-risk. You may lose all of your investment.
          </p>
          <p className="mt-2 text-sm md:text-base text-white/80 leading-relaxed">
            Only purchase digital assets if you fully understand the risks and can afford the loss.
          </p>
        </div>
      </div>
    </section>
  );
}
