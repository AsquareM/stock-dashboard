"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperAdapter = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
let yahooFinancePromise = null;
async function getYahooFinance() {
    if (!yahooFinancePromise) {
        yahooFinancePromise = Promise.resolve().then(() => __importStar(require('yahoo-finance2'))).then((mod) => (mod.default ?? mod));
    }
    return yahooFinancePromise;
}
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const INDIAN_TICKERS = [
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
class ScraperAdapter {
    async scrapeVolumeShockers() {
        const results = await Promise.allSettled(INDIAN_TICKERS.map((t) => this.fetchTicker(t.symbol, t.name)));
        const shockers = [];
        for (const result of results) {
            if (result.status === 'fulfilled' && result.value !== null) {
                shockers.push(result.value);
            }
        }
        return shockers;
    }
    async scrapeInvestorHoldings() {
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
                investor_name: 'Vijay Kedia',
                company_name: 'Tejas Networks',
                mcap_cr: 7200,
                current_qtr_pct: 2.3,
                prev_qtr_pct: 2.1,
                is_increase: true,
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
                investor_name: 'Mukul Agrawal',
                company_name: 'Aurionpro Solutions',
                mcap_cr: 3100,
                current_qtr_pct: 2.85,
                prev_qtr_pct: 2.6,
                is_increase: true,
                report_date: today,
            },
        ];
    }
    async scrapeInsiders() {
        const { data: html } = await axios_1.default.get(SECFORM4_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; StockDashboard/1.0; +https://github.com/stock-dashboard)',
                Accept: 'text/html,application/xhtml+xml',
            },
            timeout: 15000,
        });
        return this.parseInsiderTable(html);
    }
    async fetchTicker(symbol, fallbackName) {
        const yahooFinance = await getYahooFinance();
        const [quote, summary] = await Promise.all([
            yahooFinance.quote(symbol),
            yahooFinance.quoteSummary(symbol, { modules: ['assetProfile'] }).catch(() => null),
        ]);
        const price = quote.regularMarketPrice ?? 0;
        const pctChange = quote.regularMarketChangePercent ?? 0;
        const volume = quote.regularMarketVolume ?? 0;
        const avgVolume = quote.averageDailyVolume3Month ?? quote.averageDailyVolume10Day ?? 1;
        if (avgVolume === 0)
            return null;
        const multiplier = parseFloat((volume / avgVolume).toFixed(2));
        if (multiplier < VOLUME_SHOCKER_MIN_MULTIPLIER)
            return null;
        const sector = summary?.assetProfile?.sector ?? 'Unknown';
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
    parseInsiderTable(html) {
        const $ = cheerio.load(html);
        const trades = [];
        // secform4.com renders results in the first data table on the page.
        // Each <tr> after the header row contains one filing.
        $('table tr').each((_idx, row) => {
            const cells = $(row).find('td');
            if (cells.length < 7)
                return; // skip header rows or malformed rows
            const rawDate = cells.eq(COL.TRADE_DATE).text().trim();
            const ticker = cells.eq(COL.TICKER).text().trim();
            const insiderName = cells.eq(COL.INSIDER_NAME).text().trim();
            const insiderTitle = cells.eq(COL.INSIDER_TITLE).text().trim();
            const tradeType = cells.eq(COL.TRADE_TYPE).text().trim();
            const rawShares = cells.eq(COL.SHARES).text().trim().replace(/,/g, '');
            const rawValue = cells.eq(COL.VALUE_USD).text().trim().replace(/[$,]/g, '');
            if (!ticker || !tradeType)
                return;
            const shares = parseInt(rawShares, 10);
            const value_usd = parseFloat(rawValue);
            if (isNaN(shares) || isNaN(value_usd))
                return;
            // Parse date — expected formats: MM/DD/YYYY or YYYY-MM-DD
            const parsedDate = this.parseDate(rawDate);
            if (!parsedDate)
                return;
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
    parseDate(raw) {
        if (!raw)
            return null;
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
exports.ScraperAdapter = ScraperAdapter;
// Insider Trade Scraper — secform4.com via axios + cheerio
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
};
//# sourceMappingURL=ScraperAdapter.js.map