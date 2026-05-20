import EcoSystemImg from "@/public/assets/eco_system.png";
import Image from "next/image";

export default function Ecosystem() {
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

          {/* Bottom Text */}
          <div className="text-center mt-12 md:mt-16 lg:mt-24 space-y-3 md:space-y-4 px-4">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-secondary">
              A self-sustained creator economy.
            </p>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-secondary">
              No investors. <span className="text-primary">No middlemen.</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
