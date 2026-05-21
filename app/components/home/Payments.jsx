import { Wallet, ShoppingBag, TrendingUp } from "lucide-react";
import buyerImg from "@/public/assets/buyer.png";
import creatorImg from "@/public/assets/creator.png";
import Image from "next/image";

export default function Payments() {
  const paymentFeatures = [
    {
      img: creatorImg,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M386.9 258.4L386.9 359.8L358.6 359.8L358.6 480.3L281.5 480.3L281.5 359.9L253.2 359.9L253.2 258.4C253.2 254 254.8 250.2 257.8 247.1C260.9 244 264.7 242.4 269.1 242.4L371 242.4C375.1 242.4 378.8 244 382.1 247.1C385.2 250.3 386.9 254 386.9 258.4zM354.4 193.9C354.6 213 339.4 228.6 320.3 228.8C301.2 229 285.6 213.8 285.4 194.7C285.2 175.6 300.4 160 319.5 159.8C338.6 159.6 354.2 174.8 354.4 193.9zM319.6 72C461.4 72 568 182.1 568 320C568 467.1 449.5 568 319.6 568C185.6 568 72 458.5 72 320C72 187.1 176.7 72 319.6 72zM320.4 116.7C202.2 116.7 116.7 214.6 116.7 320C116.7 429.8 207.9 522.8 320.4 522.8C423.6 522.8 523.2 441.7 523.2 320C523.3 206.2 433 116.7 320.4 116.7z"/></svg>',
      title: "Creators can:",
      description:
        "Accept payments for goods and content and paid securely using SPUMP",
    },
    {
      img: buyerImg,
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
            <div key={index} className="flex items-start gap-4 md:gap-6 group">
              <Image
                width={1000}
                height={1000}
                src={feature.img}
                alt={feature.title}
                className="shrink-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center"
              />

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
          <p className="text-sm md:text-base text-primary italic">
            Scotty <span className="font-semibold">(SPUMP)</span> is a utility
            payment token used online for buying/selling on the marketplace
          </p>
        </div>
      </div>
    </section>
  );
}
