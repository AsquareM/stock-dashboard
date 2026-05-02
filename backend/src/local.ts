/**
 * Local development entry point.
 * Run: npx ts-node src/local.ts
 * 
 * Outputs CSV files to the current working directory so you can inspect
 * what the scrapers are actually returning.
 */
import { CSVRepository } from './infrastructure/adapters/CSVRepository';
import { ScraperAdapter } from './infrastructure/adapters/ScraperAdapter';
import { SyncDataUseCase } from './application/use-cases/SyncDataUseCase';
import { ILogger } from './application/interfaces';

const logger: ILogger = {
  log: (msg: string) => console.log(`[LOG] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
};

async function main() {
  try {
    console.log('🚀 Starting local sync with CSV output...\n');

    const scraper = new ScraperAdapter();
    const repo = new CSVRepository(process.cwd());
    const useCase = new SyncDataUseCase(scraper, repo, logger);

    await useCase.run();

    console.log('\n✅ Local sync completed. Check CSV files in current directory.');
  } catch (err) {
    console.error('❌ Sync failed:', err);
    process.exit(1);
  }
}

main();
