/**
 * Application-layer contracts (ports).
 * Infrastructure adapters implement these interfaces; the domain and use-cases depend
 * only on these abstractions — never on concrete implementations.
 */

/**
 * Generic scraper port.
 * Each scraper implementation fetches and maps raw data to a domain entity array.
 */
export interface IScraper<T> {
  scrape(): Promise<T[]>;
}

/**
 * Persistence port.
 * Accepts any plain-object document and routes it to the correct collection.
 */
export interface IRepository {
  save<T extends Record<string, unknown>>(
    collectionId: string,
    doc: T
  ): Promise<void>;
}

/**
 * Logger port.
 * Matches the signature of Appwrite Function context.log / context.error
 * so that the concrete logger can be swapped for tests without mocking the SDK.
 */
export interface ILogger {
  log(message: string): void;
  error(message: string): void;
}
