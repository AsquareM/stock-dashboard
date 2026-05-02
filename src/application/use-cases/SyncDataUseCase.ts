import { IScraper, IRepository, ILogger } from '../interfaces';
import { VolumeShocker, InvestorHolding, InsiderTrade } from '../../domain/entities';

// Appwrite collection IDs — must match appwrite.config.json exactly
const COLLECTION_VOLUME_SHOCKERS = 'volume_shockers';
const COLLECTION_INVESTOR_HOLDINGS = 'investor_holdings';
const COLLECTION_INSIDER_TRADES = 'insider_trades';

export class SyncDataUseCase {
  constructor(
    private readonly volumeScraper: IScraper<VolumeShocker>,
    private readonly holdingsScraper: IScraper<InvestorHolding>,
    private readonly insiderScraper: IScraper<InsiderTrade>,
    private readonly repo: IRepository,
    private readonly logger: ILogger
  ) {}

  async execute(): Promise<void> {
    await this.syncVolumeShokers();
    await this.syncInvestorHoldings();
    await this.syncInsiderTrades();
  }

  private async syncVolumeShokers(): Promise<void> {
    try {
      this.logger.log('[SyncDataUseCase] Scraping Volume Shockers...');
      const records = await this.volumeScraper.scrape();
      this.logger.log(`[SyncDataUseCase] Fetched ${records.length} Volume Shockers. Saving...`);

      let saved = 0;
      for (const record of records) {
        try {
          await this.repo.save<Record<string, unknown>>(
            COLLECTION_VOLUME_SHOCKERS,
            record as unknown as Record<string, unknown>
          );
          saved++;
        } catch (err) {
          this.logger.error(
            `[SyncDataUseCase] Failed to save VolumeShocker ${record.symbol}: ${String(err)}`
          );
        }
      }

      this.logger.log(`[SyncDataUseCase] Volume Shockers: saved ${saved}/${records.length}.`);
    } catch (err) {
      this.logger.error(`[SyncDataUseCase] Volume Shockers scraper failed: ${String(err)}`);
    }
  }

  private async syncInvestorHoldings(): Promise<void> {
    try {
      this.logger.log('[SyncDataUseCase] Scraping Investor Holdings...');
      const records = await this.holdingsScraper.scrape();
      this.logger.log(`[SyncDataUseCase] Fetched ${records.length} Investor Holdings. Saving...`);

      let saved = 0;
      for (const record of records) {
        try {
          await this.repo.save<Record<string, unknown>>(
            COLLECTION_INVESTOR_HOLDINGS,
            record as unknown as Record<string, unknown>
          );
          saved++;
        } catch (err) {
          this.logger.error(
            `[SyncDataUseCase] Failed to save InvestorHolding for ${record.investor_name} / ${record.company_name}: ${String(err)}`
          );
        }
      }

      this.logger.log(`[SyncDataUseCase] Investor Holdings: saved ${saved}/${records.length}.`);
    } catch (err) {
      this.logger.error(`[SyncDataUseCase] Investor Holdings scraper failed: ${String(err)}`);
    }
  }

  private async syncInsiderTrades(): Promise<void> {
    try {
      this.logger.log('[SyncDataUseCase] Scraping Insider Trades...');
      const records = await this.insiderScraper.scrape();
      this.logger.log(`[SyncDataUseCase] Fetched ${records.length} Insider Trades. Saving...`);

      let saved = 0;
      for (const record of records) {
        try {
          await this.repo.save<Record<string, unknown>>(
            COLLECTION_INSIDER_TRADES,
            record as unknown as Record<string, unknown>
          );
          saved++;
        } catch (err) {
          this.logger.error(
            `[SyncDataUseCase] Failed to save InsiderTrade for ${record.ticker}: ${String(err)}`
          );
        }
      }

      this.logger.log(`[SyncDataUseCase] Insider Trades: saved ${saved}/${records.length}.`);
    } catch (err) {
      this.logger.error(`[SyncDataUseCase] Insider Trades scraper failed: ${String(err)}`);
    }
  }
}
