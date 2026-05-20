import Image from "next/image";
import createImg from "@/public/assets/features/create.png";
import brandImg from "@/public/assets/features/brand.png";
import storeImg from "@/public/assets/features/store.png";
import paidImg from "@/public/assets/features/paid.png";
import Container from "../shared/Container";

const cards = [
  {
    title: "Create",
    gradient: "from-purple-500/60 via-indigo-500/40 to-purple-600/60",
    glowColor: "rgba(168,85,247,0.5)",
    description: [
      {
        text: "Create NFTs, digital art, or physical creations",
        highlight: true,
      },
      { text: "Fashion, jewelry, accessories, art & more", highlight: false },
    ],
    image: createImg,
  },
  {
    title: "Brand",
    gradient: "from-pink-500/60 via-purple-500/40 to-pink-600/60",
    glowColor: "rgba(236,72,153,0.5)",
    description: [
      { text: "Brand your artist name or fashion label", highlight: true },
      { text: "Create collections & limited editions", highlight: false },
    ],
    image: brandImg,
  },
  {
    title: "Your Web3 Store",
    gradient: "from-indigo-500/60 via-blue-500/40 to-indigo-600/60",
    glowColor: "rgba(99,102,241,0.5)",
    description: [
      { text: "Your own Web3 shop", highlight: true },
      { text: "Sell goods, fashion items and content", highlight: false },
    ],
    image: storeImg,
  },
  {
    title: "Get Paid",
    subtitle: "with Scotty ⭐",
    gradient: "from-amber-500/60 via-yellow-500/40 to-amber-600/60",
    glowColor: "rgba(245,158,11,0.5)",
    description: [
      { text: "Use Scotty (SPUMP) to:", highlight: true },
      { text: "✓ Accept payments", highlight: false },
      { text: "✓ Pay creators", highlight: false },
      { text: "✓ Buy & sell on the marketplace", highlight: false },
    ],
    image: paidImg,
  },
];

export default function WorkflowCards() {
  return (
    <Container>
      <section className="relative z-10 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className="group wf-card border border-primary bg-white/80 p-6 rounded-lg relative overflow-hidden transition-all duration-300">
              {/* Full-width image wrapper with original 4:3 aspect ratio and fade overlay */}
              <div className="wf-img-wrap w-full relative overflow-hidden aspect-4/3 rounded-t-2xl">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-[1.06]"
                />
                {/* Overlay gradient from style tag */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-[rgba(15,32,39,0)] via-transparent/40" />
              </div>

              {/* Content body */}
              <div className="wf-body mt-4">
                <h3 className="text-secondary font-bold text-lg leading-tight">
                  {card.title}
                  {card.subtitle && (
                    <span className="font-semibold text-secondary text-base block mt-0.5">
                      {card.subtitle}
                    </span>
                  )}
                </h3>

                {/* Divider Line */}
                <div className="wf-divider my-3 h-px bg-secondary/10" />

                <div className="space-y-1">
                  {card.description.map((line, lineIndex) => (
                    <p
                      key={lineIndex}
                      className={`font-semibold text-sm text-secondary/80 ${
                        line.highlight ? "text-secondary font-bold" : ""
                      }`}>
                      {line.text}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
