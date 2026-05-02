"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppwriteRepository_1 = require("./infrastructure/adapters/AppwriteRepository");
const ScraperAdapter_1 = require("./infrastructure/adapters/ScraperAdapter");
const SyncDataUseCase_1 = require("./application/use-cases/SyncDataUseCase");
// ---------------------------------------------------------------------------
// Appwrite Function v4 entry point
// Context shape: { req, res, log, error }
// ---------------------------------------------------------------------------
exports.default = async ({ res, log, error, }) => {
    const logger = { log, error };
    try {
        const scraper = new ScraperAdapter_1.ScraperAdapter();
        const repository = new AppwriteRepository_1.AppwriteRepository();
        const useCase = new SyncDataUseCase_1.SyncDataUseCase(scraper, repository, logger);
        logger.log('[main] Starting SyncDataUseCase.run()...');
        await useCase.run();
        logger.log('[main] Sync completed.');
        return res.json({ success: true });
    }
    catch (err) {
        logger.error(`[main] Sync failed: ${String(err)}`);
        return res.json({ success: false, error: 'Sync failed' }, 500);
    }
};
//# sourceMappingURL=main.js.map