import { Client } from 'node-appwrite';
import { AppwriteRepository } from './infrastructure/adapters/AppwriteRepository';
import {
  VolumeShockerScraper,
  InvestorHoldingsMockScraper,
  InsiderTradeScraperAdapter,
} from './infrastructure/adapters/ScraperAdapter';
import { SyncDataUseCase } from './application/use-cases/SyncDataUseCase';
import { ILogger } from './application/interfaces';

// ---------------------------------------------------------------------------
// Appwrite Function v4 entry point
// Context shape: { req, res, log, error }
// ---------------------------------------------------------------------------

export default async ({
  req,
  res,
  log,
  error,
}: {
  req: unknown;
  res: {
    json(body: unknown, statusCode?: number): unknown;
    send(body: string, statusCode?: number, headers?: Record<string, string>): unknown;
  };
  log: (msg: string) => void;
  error: (msg: string) => void;
}) => {
  // --- Resolve environment variables ---
  const apiKey = process.env['APPWRITE_API_KEY'];
  const projectId = process.env['APPWRITE_PROJECT_ID'];
  const databaseId = process.env['APPWRITE_DATABASE_ID'];
  const endpoint =
    process.env['APPWRITE_ENDPOINT'] ?? 'https://fra.cloud.appwrite.io/v1';

  if (!apiKey || !projectId || !databaseId) {
    error(
      '[main] Missing required environment variables: APPWRITE_API_KEY, APPWRITE_PROJECT_ID, APPWRITE_DATABASE_ID'
    );
    return res.json({ success: false, error: 'Missing environment variables' }, 500);
  }

  // --- Wire Appwrite client ---
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

  // --- Build dependency graph ---
  const logger: ILogger = { log, error };
  const repository = new AppwriteRepository(client, databaseId);

  const volumeScraper = new VolumeShockerScraper();
  const holdingsScraper = new InvestorHoldingsMockScraper();
  const insiderScraper = new InsiderTradeScraperAdapter();

  const useCase = new SyncDataUseCase(
    volumeScraper,
    holdingsScraper,
    insiderScraper,
    repository,
    logger
  );

  // --- Execute ---
  log('[main] Starting SyncDataUseCase...');
  await useCase.execute();
  log('[main] SyncDataUseCase complete.');

  return res.json({ success: true });
};
