import "./globals.css";
import { Inter } from "next/font/google";
import Background from "./components/shared/Background";
import Footer from "./components/shared/Footer";
import HighRiskWarning from "./components/shared/HighRiskWarning";
import Navbar from "./components/shared/Navbar";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Scotty Pumpkin - Web3 Creator Marketplace",
  description:
    "Create and sell fashion, accessories, jewelry, art, NFTs and goods. Build your own Web3 online store on Scotty Marketplace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen text-white relative overflow-x-hidden antialiased`}>
        {/* Background with starfield - fixed position */}
        <Background />
        {/* Navigation */}
        <Navbar />
        {/* Main content with relative positioning */}
        <div className="relative z-10">{children}</div>
        <HighRiskWarning />
        {/* Footer */}
        <Footer/>
      </body>
    </html>
  );
}