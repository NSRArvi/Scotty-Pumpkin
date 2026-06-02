import heroImg from "@/public/assets/hero.png";
import Image from "next/image";
import Link from "next/link";
import Container from "../shared/Container";

import { BadgeDollarSign, LockKeyhole, Music4, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <Container>
      <section className="relative z-10 py-12 md:py-16 lg:pt-24 pb-12">
        <div className="">
          <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-center">
            {/* Hero Image */}

            <div className="w-4/5 relative flex items-center justify-center">
              {/* Main Image */}
              <div className="relative z-10">
                <Image
                  width={1000}
                  height={1000}
                  src={heroImg}
                  alt="Pumpkin Dog"
                  className="w-90 object-contain drop-shadow-[0_25px_40px_rgba(241,112,5,0.28)]"
                />
              </div>

              {/* Circle Line */}
              <div className="absolute h-95 md:h-107.5 w-90 md:w-107.5 rounded-full border border-primary/15" />

              {/* Floating Icon Left Top */}
              <div className="absolute left-2 top-14 animate-float-slow">
                <div className="icon-card rotate-[-14deg]">
                  <LockKeyhole size={26} strokeWidth={2.2} />
                </div>
              </div>

              {/* Floating Icon Right */}
              <div className="absolute right-0 top-24 animate-float-medium">
                <div className="icon-card rotate-12">
                  <Music4 size={26} strokeWidth={2.2} />
                </div>
              </div>

              {/* Floating Icon Bottom */}
              <div className="absolute bottom-20 left-10 animate-float-fast">
                <div className="icon-card rotate-[8deg]">
                  <BadgeDollarSign size={26} strokeWidth={2.2} />
                </div>
              </div>

              {/* Glow Stars */}
              <Sparkles className="absolute left-24 top-4 text-primary animate-pulse" />
              <Sparkles className="absolute right-16 bottom-20 text-primary animate-pulse" />
            </div>

            {/* Hero Content */}
            <div className="w-full space-y-4 md:space-y-6 order-2 md:order-2 text-center md:text-left">
              <h1 className="text-3xl text-secondary sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight">
                Web3 Creator Marketplace
              </h1>

              <h2 className="text-primary text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-linear-to-r from-purple-200 to-pink-200 bg-clip-text">
                Create. Sell. Get paid.
              </h2>

              <p className="text-base text-secondary/70 sm:text-lg md:text-xl lg:text-2xl leading-relaxed max-w-2xl mx-auto md:mx-0">
                Create and sell fashion, accessories, jewelry, art, NFTs and
                goods. Build your own Web3 online store and sell digital content
                or physical creations on the{" "}
                <span className="font-semibold text-primary">
                  Scotty Marketplace
                </span>
                .
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4 md:pt-6 justify-center md:justify-start">
                <Link
                  href="https://bfinit.com/bfinit-ecomerce-platform"
                  target="_blank"
                  className="px-4 py-2 text-base  bg-primary hover:bg-primary/80 transition duration-300 rounded-lg">
                  Join the Eco Online Shop
                </Link>
                <Link
                  href="https://sosay.org/spump-market"
                  target="_blank"
                  className="text-secondary border border-secondary hover:text-white hover:bg-secondary transition duration-500 rounded-lg px-4 py-2 text-base">
                  Discover Scotty Marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
