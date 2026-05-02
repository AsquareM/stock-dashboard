import { Dashboard } from "@/components/Dashboard";
import { VolumeShocker, InvestorHolding, InsiderTrade } from "@/lib/types";

// Force dynamic rendering — this page fetches live data and uses env vars at runtime
export const dynamic = "force-dynamic";

async function fetchTable<T>(
  endpoint: string,
  projectId: string,
  databaseId: string,
  tableId: string
): Promise<T[]> {
  try {
    const response = await fetch(
      `${endpoint}/tablesdb/${databaseId}/tables/${tableId}/rows?limit=100`,
      {
        headers: {
          "X-Appwrite-Project": projectId,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as { rows?: T[]; documents?: T[] };
    return payload.rows ?? payload.documents ?? [];
  } catch {
    return [];
  }
}

export default async function Home() {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "";
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? "";
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "";

  const [volumeShockers, investorHoldings, insiderTrades] = await Promise.all([
    fetchTable<VolumeShocker>(endpoint, projectId, dbId, "volume_shockers"),
    fetchTable<InvestorHolding>(endpoint, projectId, dbId, "investor_holdings"),
    fetchTable<InsiderTrade>(endpoint, projectId, dbId, "insider_trades"),
  ]);

  return (
    <Dashboard
      volumeShockers={volumeShockers}
      investorHoldings={investorHoldings}
      insiderTrades={insiderTrades}
    />
  );
}

