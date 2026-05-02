import { IScraper, IRepository, ILogger } from '../interfaces';
export declare class SyncDataUseCase {
    private readonly scraper;
    private readonly repo;
    private readonly logger;
    constructor(scraper: IScraper, repo: IRepository, logger: ILogger);
    run(): Promise<void>;
}
//# sourceMappingURL=SyncDataUseCase.d.ts.map