import axios from 'axios';
import * as cheerio from 'cheerio';
import { IScraper } from '../../application/interfaces';
import { VolumeShocker, InvestorHolding, InsiderTrade } from '../../domain/entities';

let yahooFinancePromise: Promise<YahooFinanceModule> | null = null;

type YahooFinanceModule = {
  quote(symbol: string): Promise<{
    regularMarketPrice?: number;
    regularMarketChangePercent?: number;
    regularMarketVolume?: number;
    averageDailyVolume3Month?: number;
    averageDailyVolume10Day?: number;
    longName?: string;
    shortName?: string;
  }>;
  quoteSummary(
    symbol: string,
    options: { modules: string[] }
  ): Promise<{ assetProfile?: { sector?: string } }>;
};

async function getYahooFinance(): Promise<YahooFinanceModule> {
  if (!yahooFinancePromise) {
    yahooFinancePromise = import('yahoo-finance2').then((mod) =>
      (mod.default ?? mod) as YahooFinanceModule
    );
  }
  return yahooFinancePromise;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INDIAN_TICKERS: { symbol: string; name: string }[] = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank' },
  { symbol: 'INFY.NS', name: 'Infosys' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever' },
  { symbol: 'SBIN.NS', name: 'State Bank of India' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel' },
  { symbol: 'WIPRO.NS', name: 'Wipro' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors' },
  { symbol: 'ADANIENT.NS', name: 'Adani Enterprises' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies' },
  { symbol: 'TITAN.NS', name: 'Titan Company' },
];

// Minimum multiplier threshold to qualify as a "volume shocker"
const VOLUME_SHOCKER_MIN_MULTIPLIER = 1.5;

// ---------------------------------------------------------------------------
// 1. Volume Shocker Scraper — yahoo-finance2
// ---------------------------------------------------------------------------

export class VolumeShockerScraper implements IScraper<VolumeShocker> {
  async scrape(): Promise<VolumeShocker[]> {
    const results = await Promise.allSettled(
      INDIAN_TICKERS.map((t) => this.fetchTicker(t.symbol, t.name))
    );

    const shockers: VolumeShocker[] = [];
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value !== null) {
        shockers.push(result.value);
      }
    }

    return shockers;
  }

  private async fetchTicker(symbol: string, fallbackName: string): Promise<VolumeShocker | null> {
    const yahooFinance = await getYahooFinance();

    const [quote, summary] = await Promise.all([
      yahooFinance.quote(symbol),
      yahooFinance.quoteSummary(symbol, { modules: ['assetProfile'] }).catch(() => null),
    ]);

    const price = quote.regularMarketPrice ?? 0;
    const pctChange = quote.regularMarketChangePercent ?? 0;
    const volume = quote.regularMarketVolume ?? 0;
    const avgVolume = quote.averageDailyVolume3Month ?? quote.averageDailyVolume10Day ?? 1;

    if (avgVolume === 0) return null;

    const multiplier = parseFloat((volume / avgVolume).toFixed(2));
    if (multiplier < VOLUME_SHOCKER_MIN_MULTIPLIER) return null;

    const sector: string =
      (summary?.assetProfile as { sector?: string } | null | undefined)?.sector ?? 'Unknown';

    return {
      symbol,
      name: quote.longName ?? quote.shortName ?? fallbackName,
      price,
      pct_change: parseFloat(pctChange.toFixed(2)),
      volume,
      avg_volume: avgVolume,
      multiplier,
      sector,
    };
  }
}

// ---------------------------------------------------------------------------
// 2. Indian Investor Holdings Mock Scraper
// ---------------------------------------------------------------------------

export class InvestorHoldingsMockScraper implements IScraper<InvestorHolding> {
  async scrape(): Promise<InvestorHolding[]> {
    // Realistic mock data representative of prominent Indian institutional investors.
    // Replace with a live scrape from Trendlyne / Tickertape when available.
    const today = new Date().toISOString();

    return [
      {
        investor_name: 'Rakesh Jhunjhunwala (Estate)',
        company_name: 'Titan Company Ltd',
        mcap_cr: 285000,
        current_qtr_pct: 5.05,
        prev_qtr_pct: 5.05,
        is_increase: false,
        report_date: today,
      },
      {
        investor_name: 'Dolly Khanna',
        company_name: 'Tamilnadu Petro Products',
        mcap_cr: 2800,
        current_qtr_pct: 3.12,
        prev_qtr_pct: 2.88,
        is_increase: true,
        report_date: today,
      },
      {
        investor_name: 'Dolly Khanna',
        company_name: 'Mangalore Chemicals',
        mcap_cr: 1650,
        current_qtr_pct: 1.74,
        prev_qtr_pct: 1.82,
        is_increase: false,
        report_date: today,
      },
      {
        investor_name: 'Vijay Kedia',
        company_name: 'Tejas Networks',
        mcap_cr: 7200,
        current_qtr_pct: 2.3,
        prev_qtr_pct: 2.1,
        is_increase: true,
        report_date: today,
      },
      {
        investor_name: 'Vijay Kedia',
        company_name: 'Atul Auto',
        mcap_cr: 960,
        current_qtr_pct: 4.5,
        prev_qtr_pct: 4.5,
        is_increase: false,
        report_date: today,
      },
      {
        investor_name: 'Ashish Kacholia',
        company_name: 'Mold-Tek Packaging',
        mcap_cr: 2200,
        current_qtr_pct: 6.78,
        prev_qtr_pct: 6.4,
        is_increase: true,
        report_date: today,
      },
      {
        investor_name: 'Ashish Kacholia',
        company_name: 'Garware Hi-Tech Films',
        mcap_cr: 4500,
        current_qtr_pct: 3.2,
        prev_qtr_pct: 3.0,
        is_increase: true,
        report_date: today,
      },
      {
        investor_name: 'Porinju Veliyath',
        company_name: 'Orient Bell',
        mcap_cr: 310,
        current_qtr_pct: 5.5,
        prev_qtr_pct: 5.9,
        is_increase: false,
        report_date: today,
      },
      {
        investor_name: 'Mukul Agrawal',
        company_name: 'Aurionpro Solutions',
        mcap_cr: 3100,
        current_qtr_pct: 2.85,
        prev_qtr_pct: 2.6,
        is_increase: true,
        report_date: today,
      },
      {
        investor_name: 'Radhakishan Damani',
        company_name: 'Avenue Supermarts (DMart)',
        mcap_cr: 220000,
        current_qtr_pct: 25.0,
        prev_qtr_pct: 24.9,
        is_increase: true,
        report_date: today,
      },
    ];
  }
}

// ---------------------------------------------------------------------------
// 3. Insider Trade Scraper — secform4.com via axios + cheerio
// ---------------------------------------------------------------------------

const SECFORM4_URL = 'https://www.secform4.com/insider-trading/';

// Column indices in the secform4.com insider trading table (0-based).
// Verify against live HTML if the site layout changes.
const COL = {
  TRADE_DATE: 0,
  TICKER: 1,
  INSIDER_NAME: 2,
  INSIDER_TITLE: 3,
  TRADE_TYPE: 4,
  SHARES: 5,
  VALUE_USD: 6,
} as const;

export class InsiderTradeScraperAdapter implements IScraper<InsiderTrade> {
  async scrape(): Promise<InsiderTrade[]> {
    const { data: html } = await axios.get<string>(SECFORM4_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; StockDashboard/1.0; +https://github.com/stock-dashboard)',
        Accept: 'text/html,application/xhtml+xml',
      },
      timeout: 15_000,
    });

    return this.parse(html);
  }

  parse(html: string): InsiderTrade[] {
    const $ = cheerio.load(html);
    const trades: InsiderTrade[] = [];

    // secform4.com renders results in the first data table on the page.
    // Each <tr> after the header row contains one filing.
    $('table tr').each((_idx, row) => {
      const cells = $(row).find('td');
      if (cells.length < 7) return; // skip header rows or malformed rows

      const rawDate = cells.eq(COL.TRADE_DATE).text().trim();
      const ticker = cells.eq(COL.TICKER).text().trim();
      const insiderName = cells.eq(COL.INSIDER_NAME).text().trim();
      const insiderTitle = cells.eq(COL.INSIDER_TITLE).text().trim();
      const tradeType = cells.eq(COL.TRADE_TYPE).text().trim();
      const rawShares = cells.eq(COL.SHARES).text().trim().replace(/,/g, '');
      const rawValue = cells.eq(COL.VALUE_USD).text().trim().replace(/[$,]/g, '');

      if (!ticker || !tradeType) return;

      const shares = parseInt(rawShares, 10);
      const value_usd = parseFloat(rawValue);

      if (isNaN(shares) || isNaN(value_usd)) return;

      // Parse date — expected formats: MM/DD/YYYY or YYYY-MM-DD
      const parsedDate = this.parseDate(rawDate);
      if (!parsedDate) return;

      trades.push({
        ticker,
        insider_name: insiderName || undefined,
        insider_title: insiderTitle || 'Unknown',
        trade_type: tradeType,
        shares: Math.min(shares, Number.MAX_SAFE_INTEGER), // guard against overflow
        value_usd,
        trade_date: parsedDate,
      });
    });

    return trades;
  }

  private parseDate(raw: string): string | null {
    if (!raw) return null;

    // Try MM/DD/YYYY
    const mdy = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (mdy) {
      const d = new Date(`${mdy[3]}-${mdy[1].padStart(2, '0')}-${mdy[2].padStart(2, '0')}T00:00:00Z`);
      return isNaN(d.getTime()) ? null : d.toISOString();
    }

    // Try YYYY-MM-DD
    const ymd = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (ymd) {
      const d = new Date(`${raw}T00:00:00Z`);
      return isNaN(d.getTime()) ? null : d.toISOString();
    }

    return null;
  }
}
