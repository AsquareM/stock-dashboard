import { VolumeShocker } from "@/lib/types";

export function VolumeShockersTab({ data }: { data: VolumeShocker[] }) {
  if (!data.length) {
    return <p className="text-slate-400 text-sm px-4 py-8 text-center">No data available</p>;
  }

  return (
    <ul className="divide-y divide-slate-100">
      {data.map((item) => (
        <li key={item.$id} className="flex items-center justify-between px-4 py-3 bg-white">
          <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900 truncate">{item.symbol}</p>
            <p className="text-xs text-slate-500 truncate">{item.name}</p>
            {item.sector ? (
              <p className="text-xs text-slate-400 mt-0.5 truncate">{item.sector}</p>
            ) : null}
          </div>
          <div className="ml-4 flex flex-col items-end shrink-0">
            <span className="text-sm font-semibold text-slate-900">
              ₹{item.price.toFixed(2)}
            </span>
            <span className="text-xs font-medium text-amber-600">
              {item.multiplier.toFixed(1)}x vol
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
