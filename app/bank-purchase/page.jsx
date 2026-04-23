"use client";
import { useState } from "react";
import BankPurchase from "./BankPurchase";
import BankPurchaseHelpGuide from "./BankPurchaseHelpGuide";

export default function page() {
  const [activeTab, setActiveTab] = useState("experienced");

  return (
    <div>
      {/* Tab Navigation */}
      <div className="max-w-2xl mx-auto px-4 md:px-10">
        <div className="flex justify-center gap-2 py-4">
          <button
            onClick={() => setActiveTab("experienced")}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
              activeTab === "experienced"
                ? "bg-emerald-400/20 border border-emerald-400/35 text-emerald-300"
                : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
            }`}
          >
            ⚡ Experienced User
          </button>

          <button
            onClick={() => setActiveTab("firsttime")}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide transition-all ${
              activeTab === "firsttime"
                ? "bg-amber-400/20 border border-amber-400/35 text-amber-300"
                : "bg-white/5 border border-white/10 text-white/60 hover:bg-white/10"
            }`}
          >
            📚 First Time Here?
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "firsttime" && <BankPurchaseHelpGuide />}
        {activeTab === "experienced" && <BankPurchase />}
      </div>
    </div>
  );
}
