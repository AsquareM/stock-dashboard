"use client";

import { useState } from "react";
import { VolumeShockersTab } from "@/components/VolumeShockersTab";
import { InvestorHoldingsTab } from "@/components/InvestorHoldingsTab";
import { InsiderTradesTab } from "@/components/InsiderTradesTab";
import { VolumeShocker, InvestorHolding, InsiderTrade } from "@/lib/types";

type Tab = "volume" | "holdings" | "insider";

interface Props {
  volumeShockers: VolumeShocker[];
  investorHoldings: InvestorHolding[];
  insiderTrades: InsiderTrade[];
}

const TABS: { id: Tab; label: string }[] = [
  { id: "volume", label: "Volume Shockers" },
  { id: "holdings", label: "Key Changes" },
  { id: "insider", label: "Insider Trades" },
];

export function Dashboard({ volumeShockers, investorHoldings, insiderTrades }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("volume");

  return (
    <div className="min-h-screen bg-[#f4f6f9] text-slate-900">
      {/* Header */}
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Financial Pulse</h1>
        <p className="text-xs text-slate-400 mt-0.5">Live market intelligence</p>
      </header>

      {/* Tab bar */}
      <nav className="flex border-b border-slate-200 px-4 mt-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`mr-6 pb-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <main className="mt-2">
        {activeTab === "volume" && <VolumeShockersTab data={volumeShockers} />}
        {activeTab === "holdings" && <InvestorHoldingsTab data={investorHoldings} />}
        {activeTab === "insider" && <InsiderTradesTab data={insiderTrades} />}
      </main>
    </div>
  );
}
