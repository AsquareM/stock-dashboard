"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppwriteRepository = void 0;
const axios_1 = __importDefault(require("axios"));
const node_appwrite_1 = require("node-appwrite");
const COLLECTION_VOLUME_SHOCKERS = 'volume_shockers';
const COLLECTION_INVESTOR_HOLDINGS = 'investor_holdings';
const COLLECTION_INSIDER_TRADES = 'insider_trades';
class AppwriteRepository {
    constructor() {
        const apiKey = process.env['APPWRITE_API_KEY'];
        const projectId = process.env['APPWRITE_PROJECT_ID'];
        const databaseId = process.env['APPWRITE_DATABASE_ID'];
        const endpoint = process.env['APPWRITE_ENDPOINT'] ?? 'https://fra.cloud.appwrite.io/v1';
        if (!apiKey || !projectId || !databaseId) {
            throw new Error('Missing APPWRITE_API_KEY, APPWRITE_PROJECT_ID, or APPWRITE_DATABASE_ID');
        }
        this.databaseId = databaseId;
        this.endpoint = endpoint;
        this.projectId = projectId;
        this.apiKey = apiKey;
    }
    async saveInsiderTrades(records) {
        for (const record of records) {
            await this.createRow(COLLECTION_INSIDER_TRADES, record);
        }
    }
    async saveVolumeShockers(records) {
        for (const record of records) {
            await this.createRow(COLLECTION_VOLUME_SHOCKERS, record);
        }
    }
    async saveInvestorHoldings(records) {
        for (const record of records) {
            await this.createRow(COLLECTION_INVESTOR_HOLDINGS, record);
        }
    }
    async createRow(tableId, data) {
        await axios_1.default.post(`${this.endpoint}/tablesdb/${this.databaseId}/tables/${tableId}/rows`, {
            rowId: node_appwrite_1.ID.unique(),
            data,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-Appwrite-Project': this.projectId,
                'X-Appwrite-Key': this.apiKey,
            },
            timeout: 20000,
        });
    }
}
exports.AppwriteRepository = AppwriteRepository;
//# sourceMappingURL=AppwriteRepository.js.map