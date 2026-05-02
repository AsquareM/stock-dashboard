import { Client, Databases, ID } from 'node-appwrite';
import { IRepository } from '../../application/interfaces';

export class AppwriteRepository implements IRepository {
  private readonly databases: Databases;

  constructor(
    private readonly client: Client,
    private readonly databaseId: string
  ) {
    this.databases = new Databases(client);
  }

  async save<T extends Record<string, unknown>>(
    collectionId: string,
    doc: T
  ): Promise<void> {
    await this.databases.createDocument(
      this.databaseId,
      collectionId,
      ID.unique(),
      doc
    );
  }
}
