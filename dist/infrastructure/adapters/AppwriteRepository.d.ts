import { IRepository } from '../../application/interfaces';
import { InsiderTrade, InvestorHolding, VolumeShocker } from '../../domain/entities';
export declare class AppwriteRepository implements IRepository {
    private readonly endpoint;
    private readonly projectId;
    private readonly apiKey;
    private readonly databaseId;
    constructor();
    saveInsiderTrades(records: InsiderTrade[]): Promise<void>;
    saveVolumeShockers(records: VolumeShocker[]): Promise<void>;
    saveInvestorHoldings(records: InvestorHolding[]): Promise<void>;
    private createRow;
}
//# sourceMappingURL=AppwriteRepository.d.ts.map