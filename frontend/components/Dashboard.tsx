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
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-bold tracking-tight">Financial Pulse</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Live market intelligence</p>
      </header>

      {/* Tab bar */}
      <nav className="flex border-b border-zinc-800 px-4 mt-4">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`mr-6 pb-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-b-2 border-blue-500 text-white"
                : "text-zinc-500 hover:text-zinc-300"
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
