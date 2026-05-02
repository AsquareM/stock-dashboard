import { InvestorHolding } from "@/lib/types";

export function InvestorHoldingsTab({ data }: { data: InvestorHolding[] }) {
  if (!data.length) {
    return <p className="text-zinc-500 text-sm px-4 py-8 text-center">No data available</p>;
  }

  return (
    <ul className="divide-y divide-zinc-800">
      {data.map((item) => {
        const change = (item.current_qtr_pct - item.prev_qtr_pct).toFixed(2);
        return (
          <li key={item.$id} className="flex items-center justify-between px-4 py-3">
            <div className="min-w-0">
              <p className="font-semibold text-sm text-white truncate">{item.company_name}</p>
              <p className="text-xs text-zinc-400 truncate">{item.investor_name}</p>
            </div>
            <div className="ml-4 flex flex-col items-end shrink-0">
              <span className="text-sm font-semibold text-white">
                {item.current_qtr_pct.toFixed(2)}%
              </span>
              <span
                className={`text-xs font-medium ${
                  item.is_increase ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {item.is_increase ? "▲" : "▼"} {Math.abs(Number(change))}%
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
