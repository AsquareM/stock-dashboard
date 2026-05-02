export interface VolumeShocker {
  $id: string;
  symbol: string;
  name: string;
  price: number;
  multiplier: number;
  sector: string;
}

export interface InvestorHolding {
  $id: string;
  investor_name: string;
  company_name: string;
  current_qtr_pct: number;
  prev_qtr_pct: number;
  is_increase: boolean;
}

export interface InsiderTrade {
  $id: string;
  ticker: string;
  insider_title: string;
  trade_type: string;
  value_usd: number;
}
