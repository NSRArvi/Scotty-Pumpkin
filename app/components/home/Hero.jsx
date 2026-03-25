import heroImg from "@/public/assets/hero.png";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative z-10 px-4 py-12 md:py-16 lg:py-24 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Hero Image */}
          <div className="flex justify-center order-1 md:order-1">
            <div className="relative">
              <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-96 lg:h-96 relative">
                {/* Pumpkin Character */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src={heroImg} alt="Hero Image" />
                </div>
                {/* Glow effect */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-yellow-500/30 blur-3xl rounded-full animate-pulse"></div> */}
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="space-y-4 md:space-y-6 order-2 md:order-2 text-center md:text-left">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4 justify-center md:justify-start">
              <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-2xl md:text-4xl shadow-lg">
                🎃
              </div>
              <h2 className="text-xl md:text-2xl font-bold">Scotty Pumpkin</h2>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              Web3 Creator Marketplace
            </h1>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
              Create. Sell. Get paid.
            </h2>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-purple-200 leading-relaxed max-w-2xl mx-auto md:mx-0">
              Create and sell fashion, accessories, jewelry, art, NFTs and
              goods. Build your own Web3 online store and sell digital content
              or physical creations on the{" "}
              <span className="font-semibold text-white">
                Scotty Marketplace
              </span>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 justify-center md:justify-start">
              <Link href="https://bfinit.com/bfinit-ecomerce-platform" target="_blank" className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-green-700 to-green-900 rounded-lg hover:from-green-600 hover:to-green-800 transition-all font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95">
                Join the Eco Online Shop
              </Link>
              <Link href="https://sosay.org/spump-market" target="_blank" className="px-6 md:px-8 py-3 md:py-4 border-2 border-purple-400 rounded-lg hover:bg-purple-800/50 transition-all font-semibold text-base md:text-lg hover:border-purple-300">
                Discover Scotty Marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
