// export default function Background() {
//   return (
//     <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 -z-10">
//       {/* Starfield Effect */}
//       <div className="absolute inset-0 opacity-30">
//         {[...Array(100)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
//             style={{
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 3}s`,
//               animationDuration: `${2 + Math.random() * 3}s`
//             }}
//           />
//         ))}
//       </div>

//       {/* Additional glow effects */}
//       <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
//       <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
//     </div>
//   );
// }

export default function Background() {
  const stars = Array.from({ length: 150 }, (_, i) => {
    const s1 = ((i * 9301 + 49297) % 233280) / 233280;
    const s2 = ((i * 4201 + 13297) % 133280) / 133280;
    const s3 = ((i * 6571 + 77777) % 333280) / 333280;
    const s4 = ((i * 3141 + 59265) % 433280) / 433280;
    const s5 = ((i * 2718 + 28182) % 533280) / 533280;

    // Colorful stars like in the image — mostly white, some blue, amber, pink
    const colorRoll = s5;
    const color =
      colorRoll > 0.88
        ? "#fbbf24" // amber/gold
        : colorRoll > 0.76
          ? "#818cf8" // indigo/blue
          : colorRoll > 0.64
            ? "#f472b6" // pink
            : colorRoll > 0.55
              ? "#34d399" // teal (rare)
              : "#ffffff"; // white

    const size = s3 > 0.93 ? 3 : s3 > 0.78 ? 2 : 1.5;

    return { s1, s2, s3, s4, color, size };
  });

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient — very dark navy/indigo like the image */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, #1a0a3c 0%, #0c0520 45%, #050210 100%)",
        }}
      />

      {/* Top-center warm nebula glow (orange/amber — seen behind the top node) */}
      <div
        className="absolute"
        style={{
          top: "-10%",
          left: "25%",
          width: "50%",
          height: "55%",
          background:
            "radial-gradient(ellipse at center, rgba(251,146,60,0.18) 0%, rgba(245,158,11,0.10) 30%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Right-side purple nebula (behind the Sell node) */}
      <div
        className="absolute"
        style={{
          top: "0%",
          right: "-5%",
          width: "45%",
          height: "60%",
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.22) 0%, rgba(109,40,217,0.12) 35%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Left-side blue/indigo nebula (behind the Sell/mint node) */}
      <div
        className="absolute"
        style={{
          top: "20%",
          left: "-5%",
          width: "40%",
          height: "55%",
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.16) 0%, rgba(79,70,229,0.10) 35%, transparent 70%)",
          filter: "blur(45px)",
        }}
      />

      {/* Bottom green nebula (behind the Grow/recycle node) */}
      <div
        className="absolute"
        style={{
          bottom: "-5%",
          left: "30%",
          width: "40%",
          height: "45%",
          background:
            "radial-gradient(ellipse at center, rgba(16,185,129,0.14) 0%, rgba(5,150,105,0.08) 35%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Bottom-right amber nebula (behind the Grow/store node) */}
      <div
        className="absolute"
        style={{
          bottom: "0%",
          right: "5%",
          width: "38%",
          height: "45%",
          background:
            "radial-gradient(ellipse at center, rgba(245,158,11,0.14) 0%, rgba(217,119,6,0.08) 35%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Starfield — deterministic, colorful */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${star.s1 * 100}%`,
              left: `${star.s2 * 100}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              opacity: 0.3 + star.s4 * 0.65,
              boxShadow: star.size >= 2 ? `0 0 ${star.size * 3}px ${star.color}` : "none",
              animation: `twinkle ${2.5 + star.s3 * 3}s ease-in-out infinite`,
              animationDelay: `${star.s4 * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 opacity-30">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Very subtle overall vignette so edges stay dark */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(2,0,10,0.55) 100%)",
        }}
      />
    </div>
  );
}
