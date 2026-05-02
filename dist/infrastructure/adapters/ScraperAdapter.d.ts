import { IScraper } from '../../application/interfaces';
import { VolumeShocker, InvestorHolding, InsiderTrade } from '../../domain/entities';
export declare class ScraperAdapter implements IScraper {
    scrapeVolumeShockers(): Promise<VolumeShocker[]>;
    scrapeInvestorHoldings(): Promise<InvestorHolding[]>;
    scrapeInsiders(): Promise<InsiderTrade[]>;
    private fetchTicker;
    private parseInsiderTable;
    private parseDate;
}
//# sourceMappingURL=ScraperAdapter.d.ts.map