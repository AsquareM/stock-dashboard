import * as fs from 'fs';
import * as path from 'path';
import { IRepository } from '../../application/interfaces';
import { VolumeShocker, InvestorHolding, InsiderTrade } from '../../domain/entities';

/**
 * Local CSV repository for testing.
 * Writes scraped data to CSV files in the current working directory.
 */
export class CSVRepository implements IRepository {
  private baseDir: string;

  constructor(baseDir: string = process.cwd()) {
    this.baseDir = baseDir;
  }

  async saveVolumeShockers(records: VolumeShocker[]): Promise<void> {
    const filePath = path.join(this.baseDir, 'volume_shockers.csv');
    const headers = ['symbol', 'name', 'price', 'pct_change', 'volume', 'avg_volume', 'multiplier', 'sector'];
    
    const rows = records.map(r => [
      r.symbol,
      `"${r.name}"`,
      r.price,
      r.pct_change,
      r.volume,
      r.avg_volume,
      r.multiplier,
      r.sector,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    fs.writeFileSync(filePath, csvContent, 'utf-8');
    console.log(`✓ Saved ${records.length} Volume Shockers to ${filePath}`);
  }

  async saveInvestorHoldings(records: InvestorHolding[]): Promise<void> {
    const filePath = path.join(this.baseDir, 'investor_holdings.csv');
    const headers = ['investor_name', 'company_name', 'mcap_cr', 'current_qtr_pct', 'prev_qtr_pct', 'is_increase', 'report_date'];
    
    const rows = records.map(r => [
      `"${r.investor_name}"`,
      `"${r.company_name}"`,
      r.mcap_cr,
      r.current_qtr_pct,
      r.prev_qtr_pct,
      r.is_increase ? 'yes' : 'no',
      r.report_date,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    fs.writeFileSync(filePath, csvContent, 'utf-8');
    console.log(`✓ Saved ${records.length} Investor Holdings to ${filePath}`);
  }

  async saveInsiderTrades(records: InsiderTrade[]): Promise<void> {
    const filePath = path.join(this.baseDir, 'insider_trades.csv');
    const headers = ['ticker', 'insider_name', 'insider_title', 'trade_type', 'shares', 'value_usd', 'trade_date'];
    
    const rows = records.map(r => [
      r.ticker,
      `"${r.insider_name || ''}"`,
      `"${r.insider_title}"`,
      r.trade_type,
      r.shares,
      r.value_usd,
      r.trade_date,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    fs.writeFileSync(filePath, csvContent, 'utf-8');
    console.log(`✓ Saved ${records.length} Insider Trades to ${filePath}`);
  }
}
