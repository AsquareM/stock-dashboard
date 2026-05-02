import { InvestorHolding } from "@/lib/types";

export function InvestorHoldingsTab({ data }: { data: InvestorHolding[] }) {
  if (!data.length) {
    return <p className="text-slate-400 text-sm px-4 py-8 text-center">No data available</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {data.map((item) => {
        const change = (item.current_qtr_pct - item.prev_qtr_pct).toFixed(2);
        return (
          <li key={item.$id} className="flex items-center justify-between px-4 py-3 bg-white">
            <div className="min-w-0">
              <p className="font-semibold text-sm text-slate-900 truncate">{item.company_name}</p>
              <p className="text-xs text-slate-500 truncate">{item.investor_name}</p>
            </div>
            <div className="ml-4 flex flex-col items-end shrink-0">
              <span className="text-sm font-semibold text-slate-900">
                {item.current_qtr_pct.toFixed(2)}%
              </span>
              <span
                className={`text-xs font-medium ${
                  item.is_increase ? "text-emerald-600" : "text-red-500"
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
