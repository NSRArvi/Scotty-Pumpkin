"use client";

import Link from "next/link";
import Container from "./components/shared/Container";

export default function MaintenancePage() {
  return (
    <>
      <style>{`
        @keyframes sp-float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50%       { transform: translateY(-18px) rotate(3deg); }
        }
        @keyframes sp-glow-pulse {
          0%, 100% { opacity: 0.5; text-shadow: 0 0 40px rgba(245,158,11,0.4), 0 0 80px rgba(245,158,11,0.2); }
          50%       { opacity: 1;   text-shadow: 0 0 60px rgba(245,158,11,0.9), 0 0 120px rgba(245,158,11,0.5), 0 0 200px rgba(245,158,11,0.2); }
        }
        @keyframes sp-star-twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.4); }
        }
        @keyframes sp-fade-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sp-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes sp-orbit {
          from { transform: rotate(0deg) translateX(110px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(110px) rotate(-360deg); }
        }
        @keyframes sp-orbit-rev {
          from { transform: rotate(0deg) translateX(75px) rotate(0deg); }
          to   { transform: rotate(-360deg) translateX(75px) rotate(360deg); }
        }
        @keyframes sp-progress {
          0%   { width: 0%; }
          60%  { width: 72%; }
          80%  { width: 78%; }
          100% { width: 82%; }
        }
        @keyframes sp-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes sp-wrench {
          0%, 100% { transform: rotate(-15deg); }
          50%       { transform: rotate(15deg); }
        }
      `}</style>

      <section className="bg-primary-bg">
        <Container>
          <div className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
            {/* ── Background stars ── */}
            {[
              {
                size: 2,
                top: "8%",
                left: "12%",
                delay: "0s",
                duration: "2.8s",
              },
              {
                size: 1,
                top: "15%",
                left: "78%",
                delay: "0.5s",
                duration: "3.5s",
              },
              {
                size: 3,
                top: "22%",
                left: "45%",
                delay: "1s",
                duration: "2.2s",
              },
              {
                size: 1,
                top: "35%",
                left: "5%",
                delay: "1.5s",
                duration: "4s",
              },
              {
                size: 2,
                top: "55%",
                left: "90%",
                delay: "0.3s",
                duration: "3.1s",
              },
              {
                size: 1,
                top: "70%",
                left: "25%",
                delay: "0.8s",
                duration: "2.6s",
              },
              {
                size: 2,
                top: "80%",
                left: "65%",
                delay: "1.2s",
                duration: "3.8s",
              },
              {
                size: 1,
                top: "90%",
                left: "40%",
                delay: "0.6s",
                duration: "2.4s",
              },
              {
                size: 3,
                top: "5%",
                left: "55%",
                delay: "1.8s",
                duration: "3.3s",
              },
              {
                size: 1,
                top: "45%",
                left: "95%",
                delay: "0.2s",
                duration: "4.2s",
              },
              {
                size: 2,
                top: "62%",
                left: "3%",
                delay: "1.4s",
                duration: "2.9s",
              },
              {
                size: 1,
                top: "28%",
                left: "88%",
                delay: "0.9s",
                duration: "3.6s",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="nf-star"
                style={{
                  width: s.size,
                  height: s.size,
                  top: s.top,
                  left: s.left,
                  animation: `sp-star-twinkle ${s.duration} ${s.delay} ease-in-out infinite`,
                }}
              />
            ))}

            {/* ── Ambient glows ── */}
            <div
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)",
              }}
            />

            {/* ── Main content ── */}
            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto space-y-8">
              {/* Orbiting pumpkin system */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: 240,
                  height: 240,
                  animation: "sp-fade-up 0.6s ease both",
                }}>
                <div
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    border: "1px dashed rgba(245,158,11,0.2)",
                    animation: "sp-spin-slow 20s linear infinite",
                  }}
                />
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 150,
                    height: 150,
                    top: "50%",
                    left: "50%",
                    marginTop: -75,
                    marginLeft: -75,
                    border: "1px dashed rgba(168,85,247,0.15)",
                    animation: "sp-spin-slow 14s linear infinite reverse",
                  }}
                />

                {/* Orbiting wrench */}
                <div
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    marginTop: -12,
                    marginLeft: -12,
                  }}>
                  <div style={{ animation: "sp-orbit 8s linear infinite" }}>
                    <span style={{ fontSize: 22 }}>🔧</span>
                  </div>
                </div>

                {/* Orbiting gear */}
                <div
                  className="absolute"
                  style={{
                    top: "50%",
                    left: "50%",
                    marginTop: -10,
                    marginLeft: -10,
                  }}>
                  <div style={{ animation: "sp-orbit-rev 5s linear infinite" }}>
                    <span style={{ fontSize: 16 }}>⚙️</span>
                  </div>
                </div>

                {/* Central pumpkin */}
                <div
                  style={{
                    fontSize: 90,
                    animation: "sp-float 5s ease-in-out infinite",
                    filter: "drop-shadow(0 0 30px rgba(245,158,11,0.5))",
                  }}>
                  🎃
                </div>
              </div>

              {/* Heading */}
              <div
                className="space-y-3"
                style={{ animation: "sp-fade-up 0.7s ease 0.15s both" }}>
                <div className="flex items-center justify-center gap-3">
                  <span className="sp-wrench text-2xl">🔧</span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black  text-primary">
                    Coming Soon
                  </h1>
                  <span
                    className="sp-wrench text-2xl"
                    style={{ animationDelay: "0.6s" }}>
                    🔧
                  </span>
                </div>
                <p className="text-secondary/80 text-base md:text-lg leading-relaxed max-w-md mx-auto">
                  Something amazing is brewing! Get ready for an incredible
                  experience. We&apos;ll be here very soon!
                </p>
              </div>

              {/* Status badge */}
              <div style={{ animation: "sp-fade-up 0.7s ease 0.25s both" }}>
                <div
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2"
                  style={{
                    background: "rgba(245,158,11,0.1)",
                    border: "1px solid rgba(245,158,11,0.3)",
                  }}>
                  <div className="nf-status-dot" />
                  <span className="text-primary text-xs font-bold uppercase tracking-widest">
                    Live Very Soon
                  </span>
                </div>
              </div>

              <div
                className="nf-divider w-full"
                style={{ animation: "sp-fade-up 0.7s ease 0.3s both" }}
              />

              {/* Progress bar */}
              <div
                className="w-full space-y-3"
                style={{ animation: "sp-fade-up 0.7s ease 0.35s both" }}>
                <div className="flex justify-between items-center">
                  <span className="text-secondary/80 text-xs font-semibold uppercase tracking-wider">
                    Launch Progress
                  </span>
                  <span className="text-primary text-xs font-black">
                    Almost there...
                  </span>
                </div>
                <div className="nf-progress-track">
                  <div className="nf-progress-fill" />
                </div>
              </div>

              {/* Info cards */}
              <div
                className="grid sm:grid-cols-3 gap-3 w-full"
                style={{ animation: "sp-fade-up 0.7s ease 0.4s both" }}>
                {[
                  { icon: "🛒", label: "Marketplace", status: "Coming Soon" },
                  { icon: "💎", label: "SPUMP Token", status: "Ready" },
                  { icon: "🌐", label: "Web3 Payments", status: "In Progress" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="nf-card rounded-xl px-4 py-4 text-center space-y-1.5">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="text-secondary/80 text-xs font-bold">
                      {item.label}
                    </p>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block"
                      style={
                        item.status === "Ready"
                          ? {
                              background: "rgba(74,222,128,0.1)",
                              border: "1px solid rgba(74,222,128,0.3)",
                              color: "#4ade80",
                            }
                          : item.status === "In Progress"
                            ? {
                                background: "rgba(99,102,241,0.12)",
                                border: "1px solid rgba(99,102,241,0.3)",
                                color: "#a5b4fc",
                              }
                            : {
                                background: "rgba(245,158,11,0.12)",
                                border: "1px solid rgba(245,158,11,0.3)",
                                color: "#fbbf24",
                              }
                      }>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
                style={{ animation: "sp-fade-up 0.7s ease 0.5s both" }}>
                <Link
                  href="/contact"
                  className="nf-notify-btn px-8 py-3.5 rounded-xl font-bold text-base text-white text-center">
                  ✉️ Contact Us
                </Link>
                <Link
                  href="https://x.com/SpumpCoin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nf-social-btn px-8 py-3.5 rounded-xl font-semibold text-base text-secondary text-center">
                  🐦 Follow for Updates
                </Link>
              </div>

              {/* Footer */}
              <p
                className="text-white/25 text-xs pb-4"
                style={{ animation: "sp-fade-up 0.7s ease 0.6s both" }}>
                support@scottypumpkin.com · Scotty Pumpkin Eco Market System
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
