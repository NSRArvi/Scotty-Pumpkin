import {
  Sparkles,
  Store,
  ShoppingBag,
  ShoppingCart,
  Coins,
} from "lucide-react";
import Container from "../shared/Container";
import { PiExportBold } from "react-icons/pi";
import { IoDiamondOutline } from "react-icons/io5";
import { LuWallet } from "react-icons/lu";
import { BsFillTagFill } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";

export default function Features() {
  const features = [
    {
      icon: FaCheckCircle,
      text: "Create or sell fashion, accessories, jewelry, art, NFTs and goods.",
    },
    {
      icon: FaCheckCircle,
      text: "Build your own Web3 online store and sell digital content",
    },
    {
      icon: FaCheckCircle,
      text: "Create your own Web3 online store",
    },
    {
      icon: FaCheckCircle,
      text: "Sell goods and digital content in one place",
    },
    {
      icon: FaCheckCircle,
      text: "Pay or get paid using Scotty (SPUMP) - your friendly Web3 payment",
    },
  ];

  const tags = [
    { icon: PiExportBold, title: "Create" },
    { icon: BsFillTagFill, title: "Sell" },
    { icon: IoDiamondOutline, title: "Brand" },
    { icon: LuWallet, title: "Get Paid" },
  ];

  return (
    <Container>
      <section className="relative z-10 py-12 md:py-16 ">
        <div className="flex items-center w-full ">
          <div className="flex-1 h-px bg-gray-300"></div>
          <div className="mx-4 w-5 h-5 rounded-full border-4 border-primary bg-white"></div>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <div className="flex items-center justify-around my-16">
          {tags.map((tag, idx) => {
            const Icon = tag.icon;
            return (
              <div className="flex items-center gap-2" key={idx}>
                <span className="inline-block">
                  <Icon size={36} className="text-primary" />
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center leading-tight text-secondary">
                  {tag.title}
                </h2>
              </div>
            );
          })}
        </div>
        <div className="shadow-sm bg-white/65 p-8 border border-gray-300 rounded-xl pt-8">
          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-center mb-8 md:mb-12 leading-tight text-secondary">
            Create • Sell • Brand • Get Paid
          </h2>
          {/* Features List */}
          <div className=" mb-8 md:mb-12 grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-start gap-2 text-base">
                  <div className="shrink-0 w-5 h-5  bg-primary rounded-full flex items-center justify-center mt-1 shadow-lg">
                    <Icon size={14} className="text-white " />
                  </div>
                  <p className="text-secondary leading-relaxed text-base">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
          {/* Tagline */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-center font-semibold mb-12 md:mb-16 px-4 text-secondary">
            No investors. No middlemen.{" "}
            <span className="text-primary">Just creators and buyers.</span>
          </p>
        </div>
      </section>
    </Container>
  );
}
