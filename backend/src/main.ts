import { AppwriteRepository } from './infrastructure/adapters/AppwriteRepository';
import { ScraperAdapter } from './infrastructure/adapters/ScraperAdapter';
import { SyncDataUseCase } from './application/use-cases/SyncDataUseCase';
import { ILogger } from './application/interfaces';

// ---------------------------------------------------------------------------
// Appwrite Function v4 entry point
// Context shape: { req, res, log, error }
// ---------------------------------------------------------------------------

export default async ({
  res,
  log,
  error,
}: {
  res: {
    json(body: unknown, statusCode?: number): unknown;
  };
  log: (msg: string) => void;
  error: (msg: string) => void;
}) => {
  const logger: ILogger = { log, error };

  try {
    const scraper = new ScraperAdapter();
    const repository = new AppwriteRepository();
    const useCase = new SyncDataUseCase(scraper, repository, logger);

    logger.log('[main] Starting SyncDataUseCase.run()...');
    await useCase.run();
    logger.log('[main] Sync completed.');

    return res.json({ success: true });
  } catch (err) {
    logger.error(`[main] Sync failed: ${String(err)}`);
    return res.json({ success: false, error: 'Sync failed' }, 500);
  }
};
