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
    const existingRows = await this.listRows<InsiderTrade>(COLLECTION_INSIDER_TRADES);
    const rowByKey = new Map<string, string>();

    for (const row of existingRows) {
      const key = this.getInsiderKey(row.data, row.createdAt);
      if (!rowByKey.has(key)) {
        rowByKey.set(key, row.id);
      }
    }

    for (const record of records) {
      const key = this.getInsiderKey(record);
      const existingId = rowByKey.get(key);
      if (existingId) {
        await this.updateRow(COLLECTION_INSIDER_TRADES, existingId, record);
      } else {
        const createdId = await this.createRow(COLLECTION_INSIDER_TRADES, record);
        rowByKey.set(key, createdId);
      }
    }
  }

  async saveVolumeShockers(records: VolumeShocker[]): Promise<void> {
    const today = this.toDateOnly(new Date().toISOString());
    const existingRows = await this.listRows<VolumeShocker>(COLLECTION_VOLUME_SHOCKERS);
    const rowByKey = new Map<string, string>();

    for (const row of existingRows) {
      const key = this.getVolumeKey(row.data, row.createdAt);
      if (!rowByKey.has(key)) {
        rowByKey.set(key, row.id);
      }
    }

    for (const record of records) {
      const key = this.getVolumeKey(record, `${today}T00:00:00.000Z`);
      const existingId = rowByKey.get(key);
      if (existingId) {
        await this.updateRow(COLLECTION_VOLUME_SHOCKERS, existingId, record);
      } else {
        const createdId = await this.createRow(COLLECTION_VOLUME_SHOCKERS, record);
        rowByKey.set(key, createdId);
      }
    }
  }

  async saveInvestorHoldings(records: InvestorHolding[]): Promise<void> {
    const existingRows = await this.listRows<InvestorHolding>(COLLECTION_INVESTOR_HOLDINGS);
    const rowByKey = new Map<string, string>();

    for (const row of existingRows) {
      const key = this.getHoldingKey(row.data, row.createdAt);
      if (!rowByKey.has(key)) {
        rowByKey.set(key, row.id);
      }
    }

    for (const record of records) {
      const key = this.getHoldingKey(record);
      const existingId = rowByKey.get(key);
      if (existingId) {
        await this.updateRow(COLLECTION_INVESTOR_HOLDINGS, existingId, record);
      } else {
        const createdId = await this.createRow(COLLECTION_INVESTOR_HOLDINGS, record);
        rowByKey.set(key, createdId);
      }
    }
  }

  private async listRows<T>(tableId: string): Promise<Array<{ id: string; createdAt: string; data: T }>> {
    const rows: Array<{ id: string; createdAt: string; data: T }> = [];
    const pageSize = 100;
    let offset = 0;

    while (true) {
      const response = await axios.get<{
        rows?: Array<T & { $id?: string; $createdAt?: string }>;
        documents?: Array<T & { $id?: string; $createdAt?: string }>;
        total?: number;
      }>(
      `${this.endpoint}/tablesdb/${this.databaseId}/tables/${tableId}/rows`,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Appwrite-Project': this.projectId,
          'X-Appwrite-Key': this.apiKey,
        },
        params: {
          limit: pageSize,
          offset,
        },
        timeout: 20_000,
      }
    );

      const page = response.data.rows ?? response.data.documents ?? [];
      for (const row of page) {
        if (typeof row.$id !== 'string' || typeof row.$createdAt !== 'string') {
          continue;
        }

        const { $id, $createdAt, ...data } = row;
        rows.push({
          id: $id,
          createdAt: $createdAt,
          data: data as T,
        });
      }

      if (page.length < pageSize) {
        break;
      }
      offset += page.length;
    }

    return rows;
  }

  private async updateRow(
    tableId: string,
    rowId: string,
    data: InsiderTrade | InvestorHolding | VolumeShocker
  ): Promise<void> {
    await axios.patch(
      `${this.endpoint}/tablesdb/${this.databaseId}/tables/${tableId}/rows/${rowId}`,
      { data },
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

  private async createRow(
    tableId: string,
    data: InsiderTrade | InvestorHolding | VolumeShocker
  ): Promise<string> {
    const rowId = ID.unique();
    await axios.post(
      `${this.endpoint}/tablesdb/${this.databaseId}/tables/${tableId}/rows`,
      {
        rowId,
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

    return rowId;
  }

  private getHoldingKey(record: InvestorHolding, createdAt?: string): string {
    const investor = this.normalizeText(record.investor_name);
    const company = this.normalizeText(record.company_name);
    const date = this.toDateOnly(record.report_date ?? createdAt ?? new Date().toISOString());
    return `${investor}|${company}|${date}`;
  }

  private getInsiderKey(record: InsiderTrade, createdAt?: string): string {
    const ticker = this.normalizeText(record.ticker);
    const insider = this.normalizeText(record.insider_name ?? '');
    const tradeType = this.normalizeText(record.trade_type);
    const date = this.toDateOnly(record.trade_date ?? createdAt ?? new Date().toISOString());
    return `${ticker}|${insider}|${tradeType}|${date}`;
  }

  private getVolumeKey(record: VolumeShocker, createdAt?: string): string {
    const symbol = this.normalizeText(record.symbol);
    const date = this.toDateOnly(createdAt ?? new Date().toISOString());
    return `${symbol}|${date}`;
  }

  private toDateOnly(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value.slice(0, 10);
    }
    return date.toISOString().slice(0, 10);
  }

  private normalizeText(value: string): string {
    return value.trim().toLowerCase();
  }

  private async deleteRow(tableId: string, rowId: string): Promise<void> {
    await axios.delete(`${this.endpoint}/tablesdb/${this.databaseId}/tables/${tableId}/rows/${rowId}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': this.projectId,
        'X-Appwrite-Key': this.apiKey,
      },
      timeout: 20_000,
    });
  }
}
