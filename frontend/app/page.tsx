import { Client, Databases, Query } from "appwrite";
import { Dashboard } from "@/components/Dashboard";
import { VolumeShocker, InvestorHolding, InsiderTrade } from "@/lib/types";

async function fetchTable<T>(databases: Databases, databaseId: string, tableId: string): Promise<T[]> {
  try {
    const res = await databases.listDocuments(databaseId, tableId, [Query.limit(100)]);
    return res.documents as unknown as T[];
  } catch {
    return [];
  }
}

export default async function Home() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
  const databases = new Databases(client);
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;

  const [volumeShockers, investorHoldings, insiderTrades] = await Promise.all([
    fetchTable<VolumeShocker>(databases, dbId, "volume_shockers"),
    fetchTable<InvestorHolding>(databases, dbId, "investor_holdings"),
    fetchTable<InsiderTrade>(databases, dbId, "insider_trades"),
  ]);

  return (
    <Dashboard
      volumeShockers={volumeShockers}
      investorHoldings={investorHoldings}
      insiderTrades={insiderTrades}
    />
  );
}

