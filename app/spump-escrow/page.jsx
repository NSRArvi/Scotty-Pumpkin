"use client";
import React, { useState } from "react";
import Container from "../components/shared/Container";
import MarketplacePaymentProtectionProcedure from "../components/SupmpEscrow/MarketplacePaymentProtectionProcedure/MarketplacePaymentProtectionProcedure";
import ConditionsOfUse from "../components/SupmpEscrow/ConditionsOfUse/ConditionsOfUse";
import EscrowPaymentSystem from "../components/SupmpEscrow/EscrowPaymentSystem/EscrowPaymentSystem";
import MarketPaymentProcessingForm from "../components/SupmpEscrow/MarketPaymentProcessingForm/MarketPaymentProcessingForm";

export default function SpumpEscrow() {
  const [activeTab, setActiveTab] = useState("tab1");

  const tabs = [
    {
      id: "tab1",
      label: "Escrow Payment System",
      index: "01",
      content: <EscrowPaymentSystem />,
    },
    {
      id: "tab2",
      label: "Marketplace Payment Protection Procedure",
      index: "02",
      content: <MarketplacePaymentProtectionProcedure />,
    },
    {
      id: "tab3",
      label: "Conditions Of Use",
      index: "03",
      content: <ConditionsOfUse />,
    },

    {
      id: "tab4",
      label: "Market Payment Processing Form",
      index: "04",
      content: <MarketPaymentProcessingForm />,
    },
  ];

  return (
    <section className="bg-primary-bg min-h-screen">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
          <div className="sticky top-0 z-50 lg:col-span-3 border-b lg:border-b-0 lg:border-r border-secondary/10 bg-primary-bg/95 backdrop-blur py-4 sm:py-5 lg:py-20 lg:pr-6">
            <div className="lg:hidden space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70">
                  Choose Section
                </p>
                <span className="text-[11px] text-primary font-medium">
                  {tabs.find((tab) => tab.id === activeTab)?.index}
                </span>
              </div>

              <label className="block">
                <span className="sr-only">Select escrow tab</span>
                <select
                  value={activeTab}
                  onChange={(event) => setActiveTab(event.target.value)}
                  className="w-full rounded-xl border border-secondary/10 bg-white px-4 py-3 text-sm text-secondary outline-none focus:border-primary">
                  {tabs.map((tab) => (
                    <option key={tab.id} value={tab.id}>
                      {tab.index} - {tab.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <nav className="hidden lg:flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-start gap-3 px-3 py-3 rounded-lg text-left transition-all duration-150 cursor-pointer
                    ${
                      activeTab === tab.id
                        ? "bg-primary border text-white border-primary/20"
                        : "border border-transparent hover:bg-primary hover:border-secondary/10"
                    }`}>
                  <span
                    className={`text-sm leading-snug transition-colors
                    ${activeTab === tab.id ? "text-white font-medium" : "text-secondary/80 font-light group-hover:text-white"}`}>
                    {tab.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <main className="lg:col-span-9 px-0 lg:pl-10 py-4 sm:py-6 lg:py-0 overflow-y-auto">
            <div className="lg:hidden mb-5 rounded-xl border border-secondary/10 bg-white/70 px-4 py-3">
              <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-secondary/70 mb-1">
                Active Section
              </p>
              <p className="text-sm font-medium text-secondary">
                {tabs.find((tab) => tab.id === activeTab)?.label}
              </p>
            </div>

            <div>{tabs.find((tab) => tab.id === activeTab)?.content}</div>
          </main>
        </div>
      </Container>
    </section>
  );
}
