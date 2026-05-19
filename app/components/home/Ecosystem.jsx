"use client";

import { useRef, useState, useEffect } from "react";
import EcosystemImage from "@/public/assets/eco sys (1).png";
import EcoSystemImg from "@/public/assets/eco_system.png";
import Image from "next/image";

export default function Ecosystem() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const rafRef = useRef(null);

  function handleMouseMove(e) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2); // -1 to 1
    const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1

    const glowX = ((e.clientX - rect.left) / rect.width) * 100;
    const glowY = ((e.clientY - rect.top) / rect.height) * 100;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setTilt({ x: dy * -7, y: dx * 7 }); // max 7deg tilt
      setGlowPos({ x: glowX, y: glowY });
    });
  }

  function handleMouseLeave() {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
  }

  const orbs = [
    {
      size: 180,
      left: "8%",
      top: "15%",
      color: "rgba(168,85,247,0.18)",
      dur: "6s",
      delay: "0s",
    },
    {
      size: 120,
      left: "75%",
      top: "10%",
      color: "rgba(99,102,241,0.16)",
      dur: "8s",
      delay: "1.5s",
    },
    {
      size: 90,
      left: "85%",
      top: "65%",
      color: "rgba(236,72,153,0.14)",
      dur: "7s",
      delay: "0.8s",
    },
    {
      size: 140,
      left: "5%",
      top: "60%",
      color: "rgba(245,158,11,0.14)",
      dur: "9s",
      delay: "2s",
    },
    {
      size: 70,
      left: "50%",
      top: "80%",
      color: "rgba(16,185,129,0.16)",
      dur: "5s",
      delay: "1s",
    },
  ];

  const particles = Array.from({ length: 16 }, (_, i) => i);

  return (
    <>
      <style>{`
        @keyframes eco-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50%       { transform: translateY(-16px) scale(1.04); }
        }
        @keyframes eco-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes eco-spin-rev {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes eco-pulse-ring {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.7; transform: scale(1.04); }
        }
        @keyframes eco-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes eco-particle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.6); }
        }
        @keyframes eco-text-glow {
          0%, 100% { text-shadow: 0 0 20px rgba(74,222,128,0.4); }
          50%       { text-shadow: 0 0 40px rgba(74,222,128,0.8), 0 0 80px rgba(74,222,128,0.3); }
        }

        .eco-card {
          transform-style: preserve-3d;
          transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
          transition: transform 0.08s linear, box-shadow 0.4s ease;
        }
        .eco-card.tilting {
          transition: none;
        }
        .eco-img {
          transition: transform 0.08s linear, filter 0.4s ease;
        }
        .eco-card:hover .eco-img {
          filter: brightness(1.08) saturate(1.15) contrast(1.04);
        }
        .eco-glow-layer {
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .eco-green-text {
          animation: eco-text-glow 2.5s ease-in-out infinite;
        }
        .eco-shimmer-text {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.6) 0%,
            rgba(255,255,255,1) 30%,
            rgba(255,255,255,0.6) 60%,
            rgba(255,255,255,1) 90%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: eco-shimmer 4s linear infinite;
        }
      `}</style>

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

          {/* <div
            ref={cardRef}
            className={`eco-card relative rounded-2xl cursor-pointer select-none ${isHovered ? "tilting" : ""}`}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              boxShadow: isHovered
                ? `0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(139,92,246,0.35), 0 0 120px rgba(139,92,246,0.15)`
                : `0 12px 40px rgba(0,0,0,0.4), 0 0 30px rgba(139,92,246,0.15)`,
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}>
            <div
              className="absolute rounded-2xl pointer-events-none"
              style={{
                inset: "-3px",
                border: "1.5px solid rgba(168,85,247,0.4)",
                borderRadius: "18px",
                animation: "eco-pulse-ring 3s ease-in-out infinite",
              }}
            />
            <div
              className="absolute rounded-2xl pointer-events-none"
              style={{
                inset: "-7px",
                border: "1px solid rgba(168,85,247,0.18)",
                borderRadius: "22px",
                animation: "eco-pulse-ring 3s ease-in-out infinite",
                animationDelay: "1.5s",
              }}
            />

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: "18px",
                animation: "eco-spin-slow 18s linear infinite",
              }}>
              {particles.map((_, i) => {
                const angle = (i / particles.length) * 360;
                return (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full"
                    style={{
                      background:
                        i % 3 === 0
                          ? "#a78bfa"
                          : i % 3 === 1
                            ? "#f472b6"
                            : "#fbbf24",
                      top: "50%",
                      left: "50%",
                      transform: `rotate(${angle}deg) translateX(calc(50% + 12px)) translateY(-50%)`,
                      transformOrigin: "left center",
                      animation: `eco-particle ${1.5 + (i % 4) * 0.4}s ease-in-out infinite`,
                      animationDelay: `${i * 0.12}s`,
                      filter: "blur(0.5px)",
                    }}
                  />
                );
              })}
            </div>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                borderRadius: "18px",
                animation: "eco-spin-rev 25s linear infinite",
              }}>
              {particles
                .filter((_, i) => i % 2 === 0)
                .map((_, i) => {
                  const angle = (i / 8) * 360 + 22.5;
                  return (
                    <div
                      key={i}
                      className="absolute w-1 h-1 rounded-full"
                      style={{
                        background: "#34d399",
                        top: "50%",
                        left: "50%",
                        transform: `rotate(${angle}deg) translateX(calc(50% + 22px)) translateY(-50%)`,
                        transformOrigin: "left center",
                        animation: `eco-particle 2s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                      }}
                    />
                  );
                })}
            </div>

            {orbs.map((orb, i) => (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: orb.size,
                  height: orb.size,
                  left: orb.left,
                  top: orb.top,
                  background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
                  filter: "blur(24px)",
                  animation: `eco-float ${orb.dur} ease-in-out infinite`,
                  animationDelay: orb.delay,
                  transform: "translateZ(0)",
                }}
              />
            ))}

            <div
              className="relative w-full overflow-hidden rounded-2xl"
              style={{ zIndex: 2 }}>
              <Image
                // src={EcosystemImage}
                src={EcoSystemImg}
                alt="Ecosystem Diagram"
                className="eco-img w-full h-full rounded-2xl"
                style={{
                  transform: `
                    scale(${isHovered ? 1.025 : 1})
                    translateX(${tilt.y * 0.4}px)
                    translateY(${tilt.x * 0.4}px)
                  `,
                  display: "block",
                }}
                priority
              />

              <div
                className="eco-glow-layer absolute inset-0 rounded-2xl"
                style={{
                  opacity: isHovered ? 1 : 0,
                  background: `radial-gradient(circle 280px at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.08), transparent 70%)`,
                }}
              />

              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 60px rgba(139,92,246,0.25)",
                  opacity: isHovered ? 1 : 0.4,
                  transition: "opacity 0.4s ease",
                  animation: "eco-pulse-ring 3s ease-in-out infinite",
                }}
              />
            </div>

            <div
              className="absolute inset-0 pointer-events-none rounded-2xl overflow-hidden"
              style={{ zIndex: 3 }}>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background:
                    "linear-gradient(90deg, transparent, rgba(168,85,247,0.6), rgba(251,191,36,0.6), transparent)",
                  filter: "blur(1px)",
                  animation: "eco-shimmer 3s linear infinite",
                  backgroundSize: "200% auto",
                }}
              />
            </div>
          </div> */}

          <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{ zIndex: 2 }}>
            <Image
              // src={EcosystemImage}
              src={EcoSystemImg}
              alt="Ecosystem Diagram"
              className="eco-img w-full h-full rounded-2xl"
              style={{
                transform: `
                    scale(${isHovered ? 1.025 : 1})
                    translateX(${tilt.y * 0.4}px)
                    translateY(${tilt.x * 0.4}px)
                  `,
                display: "block",
              }}
              priority
            />
          </div>

          {/* Bottom Text */}
          <div className="text-center mt-12 md:mt-16 lg:mt-24 space-y-3 md:space-y-4 px-4">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-secondary">
              A self-sustained creator economy.
            </p>
            <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-secondary">
              No investors.{" "}
              <span className="eco-green-text text-primary">No middlemen.</span>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
