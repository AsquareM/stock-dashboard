import { IScraper, IRepository, ILogger } from '../interfaces';

export class SyncDataUseCase {
  constructor(
    private readonly scraper: IScraper,
    private readonly repo: IRepository,
    private readonly logger: ILogger
  ) {}

  async run(): Promise<void> {
    try {
      this.logger.log('[SyncDataUseCase] Syncing Insider Trades...');
      const records = await this.scraper.scrapeInsiders();
      await this.repo.saveInsiderTrades(records);
      this.logger.log(`[SyncDataUseCase] Insider Trades synced: ${records.length}`);
    } catch (err) {
      this.logger.error(`[SyncDataUseCase] Insider sync failed: ${String(err)}`);
    }

    try {
      this.logger.log('[SyncDataUseCase] Scraping Investor Holdings...');
      const records = await this.scraper.scrapeInvestorHoldings();
      await this.repo.saveInvestorHoldings(records);
      this.logger.log(`[SyncDataUseCase] Investor Holdings synced: ${records.length}`);
    } catch (err) {
      this.logger.error(`[SyncDataUseCase] Investor Holdings sync failed: ${String(err)}`);
    }

    try {
      this.logger.log('[SyncDataUseCase] Scraping Volume Shockers...');
      const records = await this.scraper.scrapeVolumeShockers();
      await this.repo.saveVolumeShockers(records);
      this.logger.log(`[SyncDataUseCase] Volume Shockers synced: ${records.length}`);
    } catch (err) {
      this.logger.error(`[SyncDataUseCase] Volume Shockers sync failed: ${String(err)}`);
    }
  }
}
