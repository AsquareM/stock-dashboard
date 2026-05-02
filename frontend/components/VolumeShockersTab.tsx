import { VolumeShocker } from "@/lib/types";

const INR_DECIMAL = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const INDIAN_INT = new Intl.NumberFormat("en-IN");

export function VolumeShockersTab({ data }: { data: VolumeShocker[] }) {
  const displayDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(data[0]?.$createdAt ? new Date(data[0].$createdAt) : new Date());

  if (!data.length) {
    return <p className="text-slate-400 text-sm px-4 py-8 text-center">No data available</p>;
  }

  return (
    <div>
      <div className="px-4 pt-4 pb-2 bg-slate-50 border-b border-slate-100">
        <p className="text-sm text-slate-500">{displayDate}</p>
        <div className="mt-3 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
          Major Stocks
        </div>
      </div>

      <ul className="divide-y divide-slate-100">
        {data.map((item) => {
          const isUp = item.pct_change >= 0;
          const logoLetter = (item.name?.[0] ?? item.symbol?.[0] ?? "?").toUpperCase();

          return (
            <li key={item.$id} className="flex items-center justify-between px-4 py-4 bg-white">
              <div className="min-w-0 flex items-center gap-3">
                <div className="h-10 w-10 shrink-0 rounded-md bg-blue-600 text-white text-lg font-semibold flex items-center justify-center">
                  {logoLetter}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-[15px] text-slate-900 truncate">{item.name}</p>
                  <p className="text-[13px] text-slate-700 truncate">
                    {INR_DECIMAL.format(item.price)}{" "}
                    <span className={isUp ? "text-emerald-600" : "text-red-600"}>
                      ({isUp ? "▲" : "▼"}{Math.abs(item.pct_change).toFixed(1)}%)
                    </span>
                  </p>
                  <p className="text-[13px] text-slate-500 truncate">{item.sector}</p>
                </div>
              </div>

              <div className="ml-4 flex flex-col items-end shrink-0">
                <span className="text-[15px] font-semibold text-slate-900">
                  {INDIAN_INT.format(item.volume)}
                </span>
                <span className="text-[13px] text-slate-700">
                  Avg: {INDIAN_INT.format(item.avg_volume)}
                </span>
                <span className="text-[16px] font-medium text-emerald-600">
                  {item.multiplier.toFixed(1)}x
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
