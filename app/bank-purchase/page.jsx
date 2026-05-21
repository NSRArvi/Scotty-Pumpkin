"use client";
import { useState } from "react";
import BankPurchase from "./BankPurchase";
import BankPurchaseHelpGuide from "./BankPurchaseHelpGuide";
import Container from "../components/shared/Container";

export default function page() {
  const [activeTab, setActiveTab] = useState("experienced");

  return (
    <div className="bg-primary-bg">
      <Container>
        {/* Tab Navigation */}
        <div className="max-w-2xl mx-auto  md:px-10">
          <div className="flex justify-center gap-2 py-4">
            <button
              onClick={() => setActiveTab("experienced")}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
                activeTab === "experienced"
                  ? "bg-primary border border-emerald-400/35 text-white"
                  : "bg-secondary/80 border border-white/10 text-white hover:bg-primary"
              }`}>
              ⚡ Experienced User
            </button>

            <button
              onClick={() => setActiveTab("firsttime")}
              className={`px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
                activeTab === "firsttime"
                  ? "bg-primary border border-amber-400/35 text-white"
                  : "bg-secondary/80 border border-white/10 text-white hover:bg-primary"
              }`}>
              📚 First Time Here?
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "firsttime" && <BankPurchaseHelpGuide />}
          {activeTab === "experienced" && <BankPurchase />}
        </div>
      </Container>
    </div>
  );
}
