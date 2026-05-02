# Project Requirements Document (PRD): Financial Pulse Dashboard

## 1. Project Overview
**Financial Pulse** is a high-performance, minimalist financial dashboard designed to replicate the UI/UX of StockEdge. It provides a consolidated view of "Volume Shockers" (NSE/BSE), "Key Investor Changes" (Indian HNIs), and "US Insider Trades" (SEC Form 4 filings). 

The system is built on a **Clean Architecture (Hexagonal)** foundation and utilizes a **Serverless/BaaS** infrastructure via Appwrite to ensure the project remains free, accessible from anywhere, and requires zero manual infrastructure management.

## 2. Target Audience
*   **Primary User**: Stock market traders doing Technical & Fundamental Analysis
*   **Goal**: Quick identification of market anomalies and institutional moves without navigating multiple paid platforms.

## 3. Core Features & Functional Requirements

### Tab 1: Volume Shockers (Indian Market)
*   **Data Points**: Symbol, Company Name, Current Price, % Price Change, Current Volume, Average Volume (10/50 day), and Volume Multiplier (Current/Avg).
*   **Logic**: Identify stocks where current volume is significantly higher (e.g., >2x) than the historical average.
*   **Source**: Yahoo Finance (`yfinance` or `yahoo-finance2`).

### Tab 2: Key Changes (Indian Investor Portfolios)
*   **Data Points**: Investor Name, Company Name, Market Cap (Cr), Current Quarter Holding %, Previous Quarter Holding %, and Change Indicator (Increase/Decrease).
*   **Logic**: Track quarterly shareholding pattern changes for prominent Indian individual investors (HNIs).
*   **Source**: Web scraping (e.g., Screener.in or NSE filings).

### Tab 3: US Insider Trades
*   **Data Points**: Ticker, Insider Name (Executive), Title (CEO/CFO), Transaction Type (Buy/Sell), Shares, Value ($USD), and Date.
*   **Logic**: Specifically monitor C-suite transactions (e.g., "CEO Selling $4M", "CFO Bought 50k shares").
*   **Source**: `secform4.com`.

---

## 4. Technical Architecture

### Tech Stack
*   **Frontend**: Next.js (App Router), Tailwind CSS, TypeScript, shadcn/ui.
*   **Backend/BaaS**: Appwrite (Database, Functions, Cron).
*   **Database**: Appwrite Relational Tables (MariaDB-backed).
*   **Scraping/API**: `axios`, `cheerio`, `yahoo-finance2`.

### Clean Architecture Layers
1.  **Domain Layer**: Pure TypeScript entities and interfaces. No dependencies.
2.  **Application Layer**: Use cases (e.g., `SyncDataUseCase`) and port definitions (`IScraper`, `IRepository`).
3.  **Infrastructure Layer**: Adapters for Appwrite (Repository) and external sites (Scrapers).
4.  **Delivery Layer**: Appwrite Functions (Triggers) and Next.js UI.

---

## 5. Data Model (Appwrite Tables)

### Table: `volume_shockers`
| Attribute | Type |
| :--- | :--- |
| `symbol` | String |
| `name` | String |
| `price` | Float |
| `multiplier` | Float |
| `sector` | String |

### Table: `investor_holdings`
| Attribute | Type |
| :--- | :--- |
| `investor_name` | String |
| `company_name` | String |
| `current_qtr_pct` | Float |
| `prev_qtr_pct` | Float |
| `is_increase` | Boolean |

### Table: `insider_trades`
| Attribute | Type |
| :--- | :--- |
| `ticker` | String |
| `insider_title` | String |
| `trade_type` | String (Buy/Sell) |
| `value_usd` | Float |

---

## 6. Constraints & Limitations
*   **Appwrite Free Tier**: Restricted to 2 Functions. Must use a **Monofunction** approach (one function handles all scraping/syncing logic).
*   **Inactivity**: Appwrite projects pause after 1 week of inactivity; the frontend must trigger a read at least once a week to stay active.
*   **Data Frequency**: Sync jobs should run via Cron every 4-12 hours to respect source rate limits and Appwrite execution limits.

## 7. Success Metrics for Agents (The North Star)
1.  **Strict Separation**: No scraping logic should exist in the Use Case; no Appwrite SDK calls should exist in the Domain.
2.  **Idempotency**: Sync jobs must not create duplicate records; they should update existing entries or clear/refill tables as appropriate.
3.  **Visual Fidelity**: The Next.js frontend must accurately mirror the StockEdge UI (clean lists, green/red indicators, specific mobile-first padding).