"use client";

import Container from "@/app/components/shared/Container";
import { useState, useEffect, useRef } from "react";

const SEGMENTS = [
  { pct: 60, color: "#22c55e", label: "Ecosystem Growth & Innovation" },
  { pct: 10, color: "#a78bfa", label: "Reserves" },
  { pct: 10, color: "#60a5fa", label: "Operating Costs" },
  { pct: 10, color: "#f59e0b", label: "Community Welfare" },
  { pct: 10, color: "#ec4899", label: "Other" },
];

function DonutChart() {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setAnimated(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const cx = 100,
    cy = 100,
    r = 70,
    innerR = 44;
  const circumference = 2 * Math.PI * r;

  const slices = SEGMENTS.reduce(
    (acc, seg) => {
      const dash = (seg.pct / 100) * circumference;
      const gap = circumference - dash;
      // Offset rotates segment start based on the cumulative percentage before this segment.
      const offset = -(acc.cumulative / 100) * circumference;
      acc.items.push({ ...seg, dash, gap, offset });
      return { items: acc.items, cumulative: acc.cumulative + seg.pct };
    },
    { items: [], cumulative: 0 },
  ).items;

  return (
    <div ref={ref} className="relative flex items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="w-56 h-56 md:w-64 md:h-64 -rotate-90">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="26"
        />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="26"
            strokeDasharray={
              animated ? `${s.dash} ${s.gap}` : `0 ${circumference}`
            }
            strokeDashoffset={s.offset}
            style={{
              transition: `stroke-dasharray 1.2s ease ${i * 0.15}s`,
            }}
          />
        ))}
        <circle cx={cx} cy={cy} r={innerR} fill="#0d0d1a" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl">💰</span>
        <span className="text-white font-black text-sm mt-0.5 tracking-tight">
          SPUMP
        </span>
        <span className="text-white/40 text-xs">Income</span>
      </div>
    </div>
  );
}

function CountUp({ to, duration = 1500 }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round(p * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return <span>{val}</span>;
}

export default function SpumpEconomicEnginePage() {
  return (
    <section className="bg-primary-bg relative z-10py-12 md:py-16 lg:py-24 ">
      <Container>
        <div className="max-w-5xl mx-auto space-y-12 md:space-y-16">
          {/* ── Hero ── */}
          <div
            className="bg-white/80 rounded-2xl p-6 md:p-9 text-center space-y-4"
            style={{ animation: "sp-fade-up 0.7s ease both" }}>
            <div className="sp-hero-kicker mx-auto">
              <span className="text-primary">Scotty Pumpkin Ecosystem</span>
            </div>
            <div className="flex items-center justify-center gap-1 md:gap-2">
              <span className="text-xl md:text-4xl">⚙️</span>
              <h1 className="text-xl sm:text-4xl md:text-5xl font-black text-primary leading-tight">
                SPUMP Economic Engine
              </h1>
            </div>
            <p className="text-secondary/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Scotty Pumpkin’s approach to revenue inflows is focused on
              developing the ecosystem and supporting long-term sustainability
              through platform growth, technological innovation, AI integration,
              and advanced system development.
            </p>
          </div>

          <div className="sp-divider" />

          {/* ── Income Flow ── */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary">
              How Income Flows
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "🛒",
                  label: "First Sales",
                  sub: "Platform marketplace transactions",
                  color: "#f59e0b",
                },
                {
                  icon: "⚡",
                  label: "1% Admin Fee",
                  sub: "Applied after tax on all admin transactions",
                  color: "#a78bfa",
                },
                {
                  icon: "🏦",
                  label: "SPUMP Income Pool",
                  sub: "Collected and distributed across allocations",
                  color: "#22c55e",
                },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="bg-white/80 rounded-2xl p-5 text-center">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl"
                      style={{
                        background: `${item.color}18`,
                        border: `1px solid ${item.color}40`,
                      }}>
                      {item.icon}
                    </div>
                    <p className="font-bold text-primary text-base">
                      {item.label}
                    </p>
                    <p className="text-secondary/80 text-xs mt-1">{item.sub}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-4">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none">
                        <path
                          d="M2 8h10M8 4l4 4-4 4"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="sp-divider" />

          {/* ── Fund Allocation ── */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary">
              Fund Allocation
            </h2>

            <div className="grid lg:grid-cols-5 gap-6 items-start">
              {/* Donut + legend */}
              <div className="lg:col-span-2 flex flex-col items-center gap-6">
                <DonutChart />
                <div className="w-full space-y-2">
                  {SEGMENTS.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          background: s.color,
                        }}
                      />
                      <span className="text-secondary/80 text-sm flex-1">
                        {s.label}
                      </span>
                      <span className="font-bold text-secondary/80 text-sm">
                        {s.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allocation cards */}
              <div className="lg:col-span-3 space-y-4">
                {[
                  {
                    pct: 60,
                    label: "Ecosystem Growth & Innovation",
                    desc: "Focused on expanding the ecosystem through continuous development, liquidity enhancement, AI-driven systems, and advanced technologies to support long-term scalability and stability.",
                    icon: "🏛️",
                    color: "#22c55e",
                  },
                  {
                    pct: 10,
                    label: "SPUMP Reserves",
                    desc: "Liquidity held in secure investment accounts for platform stability.",
                    icon: "🔐",
                    color: "#a78bfa",
                  },
                  {
                    pct: 10,
                    label: "SPUMP Operating Costs",
                    desc: "Infrastructure, administration, security, and ongoing support.",
                    icon: "⚙️",
                    color: "#60a5fa",
                    points: [
                      "Infrastructure",
                      "Administration",
                      "Security & support",
                    ],
                  },
                  {
                    pct: 10,
                    label: "Social & Community Welfare",
                    desc: "Invested into community projects and creator support programs.",
                    icon: "🌟",
                    color: "#f59e0b",
                  },
                  {
                    pct: 10,
                    label: "Other Ecosystem Growth",
                    desc: "Flexible allocation for new partnerships and platform expansion.",
                    icon: "🚀",
                    color: "#ec4899",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="sp-alloc-card rounded-2xl p-5"
                    style={{ borderColor: `${item.color}30` }}>
                    <div className="flex items-center gap-4">
                      {/* Icon badge */}
                      <div
                        className="shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5"
                        style={{
                          background: `${item.color}15`,
                          border: `1px solid ${item.color}40`,
                        }}>
                        <span className="text-xl">{item.icon}</span>
                        <span
                          className="font-black  text-xs"
                          style={{ color: item.color }}>
                          <CountUp to={item.pct} />%
                        </span>
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-bold text-base mb-1"
                          style={{ color: item.color }}>
                          {item.label}
                        </h3>
                        <p className="text-secondary/80 text-sm">{item.desc}</p>
                        {item.points && (
                          <div className="flex flex-wrap gap-x-4 mt-1.5">
                            {item.points.map((p) => (
                              <span
                                key={p}
                                className="text-secondary/60 text-xs flex items-center gap-1">
                                <span style={{ color: item.color }}>✓</span> {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Progress bar */}
                      <div className="hidden md:flex flex-col items-end gap-1 shrink-0 w-20">
                        <span className="text-secondary/50 text-xs">
                          {item.pct}%
                        </span>
                        <div className="w-full h-2 bg-secondary/20 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${item.pct}%`,
                              background: item.color,

                              transition: "width 1.5s ease",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sp-divider" />

          {/* ── Principles ── */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary">
              Our Principles
            </h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: "🏗️",
                  title: "Stable",
                  desc: "60% in low-risk government securities ensures long-term platform stability.",
                },
                {
                  icon: "🔍",
                  title: "Transparent",
                  desc: "All allocations are publicly defined and tracked on-chain.",
                },
                {
                  icon: "🤝",
                  title: "Beneficial",
                  desc: "Designed to benefit every participant in the Scotty Pumpkin ecosystem.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="bg-white/80 rounded-2xl p-6 text-center space-y-3">
                  <div className="text-3xl">{item.icon}</div>
                  <h3 className="font-black text-secondary text-lg">
                    {item.title}
                  </h3>
                  <p className="text-secondary/80 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Footer note ── */}
          <div className="sp-divider" />
          <p className="text-center text-secondary/50 text-sm pb-4">
            Funds are carefully invested and distributed. The model is designed
            to be{" "}
            <span className="text-secondary/80 font-semibold">stable</span>,{" "}
            <span className="text-secondary/80 font-semibold">transparent</span>
            , and{" "}
            <span className="text-secondary/80 font-semibold">beneficial</span>{" "}
            for the entire Scotty Pumpkin ecosystem.
          </p>
        </div>
      </Container>
    </section>
  );
}
