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
    <>
      <style>{`
        .wf-card {
          position: relative;
          border-radius: 20px;
          /* glass base */
          background: rgba(255, 255, 255, 0.04);
          // backdrop-filter: blur(18px);
          // -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgb(241, 112, 5);
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.35s ease,
                      border-color 0.35s ease;
          box-shadow: 0 8px 32px rgba(241, 112, 5, 0.3),
                      inset 0 1px 0 rgba(255,255,255,0.07);
        }

        /* Gradient border via pseudo-element — only visible on hover */
        .wf-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 1.5px;
          background: var(--card-gradient);
          -webkit-mask:
            linear-gradient(#fff 0 0) content-box,
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
          z-index: 1;
        }

        .wf-card:hover::before {
          opacity: 1;
        }

        .wf-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5),
                      0 0 40px var(--card-glow),
                      inset 0 1px 0 rgba(255,255,255,0.12);
          border-color: transparent;
          background: rgba(255, 255, 255, 0.07);
        }

        /* image container */
        .wf-img-wrap {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          overflow: hidden;
          border-radius: 16px 16px 0 0;
        }

        .wf-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 40%,
            rgb(15, 32, 39, 0) 100%
          );
        }

        .wf-img-wrap img {
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .wf-card:hover .wf-img-wrap img {
          transform: scale(1.06);
        }

        /* subtle inner shimmer on hover */
        .wf-card::after {
          content: '';
          position: absolute;
          top: 0; left: -75%;
          width: 50%; height: 100%;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255,255,255,0.06) 50%,
            transparent 100%
          );
          transform: skewX(-20deg);
          transition: left 0.6s ease;
          pointer-events: none;
          z-index: 2;
        }

        .wf-card:hover::after {
          left: 150%;
        }

        .wf-body {
          position: relative;
          z-index: 3;
          padding: 20px 22px 24px;
        }

        .wf-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.01em;
          margin-bottom: 10px;
          line-height: 1.25;
        }

        .wf-subtitle {
          font-size: 0.95rem;
          font-weight: 500;
          color: rgba(255,255,255,0.65);
          display: block;
          margin-top: 2px;
        }

        .wf-desc-highlight {
          font-size: 0.88rem;
          font-weight: 600;
          color: #fff;
          line-height: 1.5;
        }

        .wf-desc-normal {
          font-size: 0.84rem;
          color: rgba(200, 185, 240, 0.8);
          line-height: 1.55;
        }

        .wf-desc-list {
          font-size: 0.84rem;
          color: rgba(200, 185, 240, 0.8);
          line-height: 1.7;
        }

        /* divider accent line */
        .wf-divider {
          height: 1px;
          margin: 12px 0;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255,255,255,0.12) 30%,
            rgba(255,255,255,0.12) 70%,
            transparent
          );
        }
      `}</style>

      <Container>
        <section className="relative z-10 py-12 md:py-16">
          <div className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="wf-card"
                  style={{
                    "--card-gradient": `linear-gradient(135deg, ${card.gradient
                      .replace(/from-|via-|to-|\//g, "")
                      .split(" ")
                      .join(", ")})`,
                    "--card-glow": card.glowColor,
                    // We compute the gradient string properly below
                  }}>
                  {/* Gradient border pseudo override via inline style */}
                  <style>{`
                  .wf-card:nth-child(${index + 1})::before {
                    background: linear-gradient(135deg, ${
                      index === 0
                        ? "rgba(168,85,247,0.9), rgba(99,102,241,0.9), rgba(168,85,247,0.9)"
                        : index === 1
                          ? "rgba(236,72,153,0.9), rgba(168,85,247,0.9), rgba(236,72,153,0.9)"
                          : index === 2
                            ? "rgba(99,102,241,0.9), rgba(59,130,246,0.9), rgba(99,102,241,0.9)"
                            : "rgba(245,158,11,0.9), rgba(234,179,8,0.9), rgba(245,158,11,0.9)"
                    });
                  }
                `}</style>

                  {/* Full-width image */}
                  <div className="wf-img-wrap">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover"
                      style={{ objectFit: "cover" }}
                    />
                  </div>

                  {/* Content */}
                  <div className="wf-body">
                    <h3 className="text-secondary font-bold text-lg leading-tight">
                      {card.title}
                      {card.subtitle && (
                        <span className="font-semibold text-secondary text-base block">
                          {card.subtitle}
                        </span>
                      )}
                    </h3>

                    <div className="wf-divider" />

                    <div className="space-y-1">
                      {card.description.map((line, lineIndex) => (
                        <p
                          key={lineIndex}
                          className={`font-semibold text-sm text-secondary/80
                          
                        `}>
                          {line.text}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </>
  );
}
