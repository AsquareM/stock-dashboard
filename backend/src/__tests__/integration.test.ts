/**
 * Integration test for the sync pipeline with CSV output.
 * 
 * Run with: npm test
 * 
 * This test:
 * 1. Runs all three scrapers (Volume Shockers, Investor Holdings, Insider Trades)
 * 2. Writes output to CSV files instead of Appwrite
 * 3. Validates that data is captured
 * 
 * Useful for debugging when production sync fails or returns no data.
 */
import { describe, it, expect, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { CSVRepository } from '../src/infrastructure/adapters/CSVRepository';
import { ScraperAdapter } from '../src/infrastructure/adapters/ScraperAdapter';
import { SyncDataUseCase } from '../src/application/use-cases/SyncDataUseCase';
import { ILogger } from '../src/application/interfaces';

const TEST_OUTPUT_DIR = path.join(__dirname, '..', '.test-output');

const logger: ILogger = {
  log: (msg: string) => console.log(`[TEST] ${msg}`),
  error: (msg: string) => console.error(`[TEST ERROR] ${msg}`),
};

describe('SyncDataUseCase Integration Tests', () => {
  afterAll(() => {
    // Cleanup test output directory if needed
    if (fs.existsSync(TEST_OUTPUT_DIR)) {
      const files = fs.readdirSync(TEST_OUTPUT_DIR);
      console.log(`\n📊 Test output files created in ${TEST_OUTPUT_DIR}:`);
      files.forEach(f => console.log(`   - ${f}`));
    }
  });

  it('should scrape volume shockers and save to CSV', async () => {
    if (!fs.existsSync(TEST_OUTPUT_DIR)) {
      fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
    }

    const scraper = new ScraperAdapter();
    const repo = new CSVRepository(TEST_OUTPUT_DIR);

    const shockers = await scraper.scrapeVolumeShockers();
    
    console.log(`\n📈 Volume Shockers: ${shockers.length} records found`);
    if (shockers.length > 0) {
      console.log('   Sample:', shockers[0]);
    }

    await repo.saveVolumeShockers(shockers);

    const csvPath = path.join(TEST_OUTPUT_DIR, 'volume_shockers.csv');
    expect(fs.existsSync(csvPath)).toBe(true);

    const content = fs.readFileSync(csvPath, 'utf-8');
    expect(content).toContain('symbol');
    expect(content.split('\n').length).toBeGreaterThan(1); // At least header + 1 data row
  }, { timeout: 30_000 });

  it('should scrape investor holdings and save to CSV', async () => {
    if (!fs.existsSync(TEST_OUTPUT_DIR)) {
      fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
    }

    const scraper = new ScraperAdapter();
    const repo = new CSVRepository(TEST_OUTPUT_DIR);

    const holdings = await scraper.scrapeInvestorHoldings();
    
    console.log(`\n👥 Investor Holdings: ${holdings.length} records found`);
    if (holdings.length > 0) {
      console.log('   Sample:', holdings[0]);
    }

    await repo.saveInvestorHoldings(holdings);

    const csvPath = path.join(TEST_OUTPUT_DIR, 'investor_holdings.csv');
    expect(fs.existsSync(csvPath)).toBe(true);

    const content = fs.readFileSync(csvPath, 'utf-8');
    expect(content).toContain('investor_name');
    expect(holdings.length).toBeGreaterThan(0);
  });

  it('should scrape insider trades and save to CSV', async () => {
    if (!fs.existsSync(TEST_OUTPUT_DIR)) {
      fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
    }

    const scraper = new ScraperAdapter();
    const repo = new CSVRepository(TEST_OUTPUT_DIR);

    const trades = await scraper.scrapeInsiders();
    
    console.log(`\n💼 Insider Trades: ${trades.length} records found`);
    if (trades.length > 0) {
      console.log('   Sample:', trades[0]);
    }

    await repo.saveInsiderTrades(trades);

    const csvPath = path.join(TEST_OUTPUT_DIR, 'insider_trades.csv');
    expect(fs.existsSync(csvPath)).toBe(true);

    const content = fs.readFileSync(csvPath, 'utf-8');
    expect(content).toContain('ticker');
  }, { timeout: 30_000 });

  it('should run full sync use case with all data sources', async () => {
    if (!fs.existsSync(TEST_OUTPUT_DIR)) {
      fs.mkdirSync(TEST_OUTPUT_DIR, { recursive: true });
    }

    const scraper = new ScraperAdapter();
    const repo = new CSVRepository(TEST_OUTPUT_DIR);
    const useCase = new SyncDataUseCase(scraper, repo, logger);

    await useCase.run();

    const files = ['volume_shockers.csv', 'investor_holdings.csv', 'insider_trades.csv'];
    for (const file of files) {
      const filePath = path.join(TEST_OUTPUT_DIR, file);
      expect(fs.existsSync(filePath)).toBe(true, `${file} should exist`);

      const content = fs.readFileSync(filePath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    }

    console.log(`\n✅ Full sync completed. All CSV files created in ${TEST_OUTPUT_DIR}`);
  }, { timeout: 60_000 });
});
