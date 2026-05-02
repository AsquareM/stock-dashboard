import { InsiderTrade, InvestorHolding, VolumeShocker } from '../domain/entities';

export interface IScraper {
  scrapeInsiders(): Promise<InsiderTrade[]>;
  scrapeVolumeShockers(): Promise<VolumeShocker[]>;
  scrapeInvestorHoldings(): Promise<InvestorHolding[]>;
}

export interface IRepository {
  saveInsiderTrades(records: InsiderTrade[]): Promise<void>;
  saveVolumeShockers(records: VolumeShocker[]): Promise<void>;
  saveInvestorHoldings(records: InvestorHolding[]): Promise<void>;
}

export interface ILogger {
  log(message: string): void;
  error(message: string): void;
}
