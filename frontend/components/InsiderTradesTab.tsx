import { InsiderTrade } from "@/lib/types";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function InsiderTradesTab({ data }: { data: InsiderTrade[] }) {
  if (!data.length) {
    return <p className="text-slate-400 text-sm px-4 py-8 text-center">No data available</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {data.map((item) => (
        <li key={item.$id} className="flex items-center justify-between px-4 py-3 bg-white">
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900 truncate">{item.ticker}</p>
            <p className="text-xs text-slate-500 truncate">{item.insider_title}</p>
          </div>
          <div className="ml-4 flex flex-col items-end shrink-0">
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                item.trade_type.toLowerCase() === "buy"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {item.trade_type.toUpperCase()}
            </span>
            <span className="text-sm font-semibold text-slate-900 mt-0.5">
              {USD.format(item.value_usd)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
