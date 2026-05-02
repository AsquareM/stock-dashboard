/**
 * Domain Entities — pure TypeScript interfaces with zero external dependencies.
 * These represent the core business objects of the Stock Dashboard.
 */

export interface VolumeShocker {
  symbol: string;
  name: string;
  price: number;
  pct_change: number;
  volume: number;
  avg_volume: number;
  multiplier: number;
  sector: string;
}

export interface InvestorHolding {
  investor_name: string;
  company_name: string;
  mcap_cr: number;
  current_qtr_pct: number;
  prev_qtr_pct: number;
  is_increase: boolean;
  report_date?: string; // ISO 8601 datetime string — optional per schema
}

export interface InsiderTrade {
  ticker: string;
  insider_name?: string; // optional per schema
  insider_title: string;
  trade_type: string;
  shares: number;
  value_usd: number;
  trade_date: string; // ISO 8601 datetime string
}
