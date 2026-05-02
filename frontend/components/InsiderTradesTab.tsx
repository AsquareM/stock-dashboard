import { InsiderTrade } from "@/lib/types";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function InsiderTradesTab({ data }: { data: InsiderTrade[] }) {
  if (!data.length) {
    return <p className="text-zinc-500 text-sm px-4 py-8 text-center">No data available</p>;
  }

  return (
    <ul className="divide-y divide-zinc-800">
      {data.map((item) => (
        <li key={item.$id} className="flex items-center justify-between px-4 py-3">
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">{item.ticker}</p>
            <p className="text-xs text-zinc-400 truncate">{item.insider_title}</p>
          </div>
          <div className="ml-4 flex flex-col items-end shrink-0">
            <span
              className={`text-xs font-semibold px-1.5 py-0.5 rounded ${
                item.trade_type.toLowerCase() === "buy"
                  ? "bg-emerald-900 text-emerald-300"
                  : "bg-red-900 text-red-300"
              }`}
            >
              {item.trade_type.toUpperCase()}
            </span>
            <span className="text-sm font-semibold text-white mt-0.5">
              {USD.format(item.value_usd)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
