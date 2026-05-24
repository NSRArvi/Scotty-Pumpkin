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
      label: "Marketplace Payment Protection Procedure",
      index: "01",
      content: <MarketplacePaymentProtectionProcedure />,
    },
    {
      id: "tab2",
      label: "Conditions Of Use",
      index: "02",
      content: <ConditionsOfUse />,
    },
    {
      id: "tab3",
      label: "Escrow Payment System",
      index: "03",
      content: <EscrowPaymentSystem />,
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
        <div className="grid grid-cols-12 min-h-screen">
          <div className="sticky z-50 top-0 md:col-span-3 border-r border-secondary/10 py-20 pr-6">
            <nav className="flex flex-col gap-1">
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

          <main className="col-span-9 pl-10 overflow-y-auto">
            <div>{tabs.find((tab) => tab.id === activeTab)?.content}</div>
          </main>
        </div>
      </Container>
    </section>
  );
}
