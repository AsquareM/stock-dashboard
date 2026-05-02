export interface VolumeShocker {
  $id: string;
  $createdAt?: string;
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
  $id?: string;
  investor_name: string;
  company_name: string;
  current_qtr_pct: number;
  prev_qtr_pct: number;
  is_increase: boolean;
}

export interface InsiderTrade {
  $id: string;
  insider_name?: string;
  ticker: string;
  insider_title: string;
  trade_type: string;
  shares?: number;
  value_usd: number;
  trade_date: string;
}
