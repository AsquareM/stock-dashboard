import axios from 'axios';
import { ID } from 'node-appwrite';
import { IRepository } from '../../application/interfaces';
import { InsiderTrade, InvestorHolding, VolumeShocker } from '../../domain/entities';

const COLLECTION_VOLUME_SHOCKERS = 'volume_shockers';
const COLLECTION_INVESTOR_HOLDINGS = 'investor_holdings';
const COLLECTION_INSIDER_TRADES = 'insider_trades';

export class AppwriteRepository implements IRepository {
  private readonly endpoint: string;
  private readonly projectId: string;
  private readonly apiKey: string;
  private readonly databaseId: string;

  constructor() {
    const apiKey = process.env['APPWRITE_API_KEY'];
    const projectId = process.env['APPWRITE_PROJECT_ID'];
    const databaseId = process.env['APPWRITE_DATABASE_ID'];
    const endpoint = process.env['APPWRITE_ENDPOINT'] ?? 'https://fra.cloud.appwrite.io/v1';

    if (!apiKey || !projectId || !databaseId) {
      throw new Error(
        'Missing APPWRITE_API_KEY, APPWRITE_PROJECT_ID, or APPWRITE_DATABASE_ID'
      );
    }

    this.databaseId = databaseId;
    this.endpoint = endpoint;
    this.projectId = projectId;
    this.apiKey = apiKey;
  }

  async saveInsiderTrades(records: InsiderTrade[]): Promise<void> {
    for (const record of records) {
      await this.createRow(COLLECTION_INSIDER_TRADES, record);
    }
  }

  async saveVolumeShockers(records: VolumeShocker[]): Promise<void> {
    for (const record of records) {
      await this.createRow(COLLECTION_VOLUME_SHOCKERS, record);
    }
  }

  async saveInvestorHoldings(records: InvestorHolding[]): Promise<void> {
    for (const record of records) {
      await this.createRow(COLLECTION_INVESTOR_HOLDINGS, record);
    }
  }

  private async createRow(
    tableId: string,
    data: InsiderTrade | InvestorHolding | VolumeShocker
  ): Promise<void> {
    await axios.post(
      `${this.endpoint}/tablesdb/${this.databaseId}/tables/${tableId}/rows`,
      {
        rowId: ID.unique(),
        data,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': this.projectId,
          'X-Appwrite-Key': this.apiKey,
        },
        timeout: 20_000,
      }
    );
  }
}
