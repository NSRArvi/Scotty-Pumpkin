import EcoSystemImg from "@/public/assets/eco_img.png";
import { Globe, House, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { BsLeafFill } from "react-icons/bs";
import { IoIosPricetag } from "react-icons/io";
import { RiNftLine } from "react-icons/ri";

export default function Ecosystem() {
  const lists = [
    {
      icon: House,
      title: "All Types of Goods",
      text: "fashion to property, services. dgital & more.",
    },
    {
      icon: RiNftLine,
      title: "Art & NFTs Included",
      text: "Create, mint, and sell original art and NFTs.",
    },
    {
      icon: Globe,
      title: "Web2 + Web3 Ready",
      text: "Seamless integration for everyone",
    },
    {
      icon: IoIosPricetag,
      title: "Free Marketplace Ads",
      text: "Post free ads and get discovered by buyers.",
    },
    {
      icon: ShieldCheck,
      title: "No Middlemen",
      text: "You own your store. your brand, your profit.",
    },
  ];
  return (
    <>
      <section className="relative z-10 px-4 py-16 md:py-24 lg:py-32 lg:px-16">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12 md:mb-16 lg:mb-20">
            <div className="flex items-center justify-center gap-2 md:gap-3 mb-4">
              <span
                className="text-3xl md:text-4xl lg:text-5xl"
                style={{ animation: "eco-float 4s ease-in-out infinite" }}>
                🌍
              </span>
              <h2 className=" text-secondary text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black">
                Our Eco-Cycle
              </h2>
            </div>
          </div>

          <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{ zIndex: 2 }}>
            <Image
              // src={EcosystemImage}
              src={EcoSystemImg}
              alt="Ecosystem Diagram"
              className="w-full h-full rounded-2xl"
              priority
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 border border-primary/10 rounded-2xl overflow-hidden mt-10 bg-white shadow-sm">
            {lists.map((list, i) => {
              const Icon = list?.icon;

              return (
                <div key={i} className="relative flex items-center gap-3 p-5">
                  {i !== lists.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-14 bg-primary/30" />
                  )}

                  {Icon && (
                    <div className="shrink-0">
                      <Icon className="w-10 h-10 text-primary" />
                    </div>
                  )}

                  <div>
                    <h3 className="text-secondary font-semibold text-xs leading-tight">
                      {list?.title}
                    </h3>

                    <p className="text-secondary/70 text-xs mt-1 leading-relaxed">
                      {list?.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Bottom Text */}
          <div className="text-center mt-12 md:mt-16 lg:mt-24 space-y-3 md:space-y-4 px-4">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-secondary">
              A self-sustained creator & business economy.
            </p>
            <p className="flex gap-1 items-center justify-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary">
              <span className="">
                <BsLeafFill className="text-primary" />
              </span>{" "}
              No middlemen. Built for independent growth.
              <span className="rotate-90">
                <BsLeafFill className="text-primary" />
              </span>{" "}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
