import { Wallet, ShoppingBag, TrendingUp } from "lucide-react";

export default function Payments() {
  const paymentFeatures = [
    {
      icon: "🎃",
      title: "Creators can:",
      description:
        "Accept payments for goods and content and paid securely using SPUMP",
    },
    {
      icon: "🎃",
      title: "Buyers can:",
      description: "Purchase easily choose favorite brands and artists",
    },
  ];

  return (
    <section className="relative z-10 px-4 py-16 md:py-24 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Main Heading */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-secondary">
            Payments on Scotty Pumpkin
          </h2>
          <p className="text-base sm:text-lg md:text-xl  max-w-2xl mx-auto text-secondary/80">
            Scotty Pumpkin is a utility payment token used online for
            buying/selling on the marketplace
          </p>
        </div>

        {/* Payment Features */}
        <div className="space-y-6 md:space-y-8 mb-12">
          {paymentFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 md:gap-6 group hover:translate-x-2 transition-transform">
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-4xl md:text-5xl group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-secondary">
                  {feature.title}
                </h3>
                <p className="text-base md:text-lg text-secondary/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Decorative Icons */}
              {index === 0 && (
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-300 rounded-lg flex items-center justify-center backdrop-blur-sm border border-purple-500/30">
                    <ShoppingBag className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                  </div>
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-300 rounded-lg flex items-center justify-center backdrop-blur-sm border border-yellow-500/30">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center">
          <p className="text-sm md:text-base text-primary/70 italic">
            Scotty <span className="font-semibold">(SPUMP)</span> is a utility
            payment token used online for buying/selling on the marketplace
          </p>
        </div>
      </div>
    </section>
  );
}
