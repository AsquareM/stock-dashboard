import { VolumeShocker } from "@/lib/types";

export function VolumeShockersTab({ data }: { data: VolumeShocker[] }) {
  if (!data.length) {
    return <p className="text-zinc-500 text-sm px-4 py-8 text-center">No data available</p>;
  }

  return (
    <ul className="divide-y divide-zinc-800">
      {data.map((item) => (
        <li key={item.$id} className="flex items-center justify-between px-4 py-3">
          <div className="min-w-0">
            <p className="font-semibold text-sm text-white truncate">{item.symbol}</p>
            <p className="text-xs text-zinc-400 truncate">{item.name}</p>
            {item.sector ? (
              <p className="text-xs text-zinc-600 mt-0.5 truncate">{item.sector}</p>
            ) : null}
          </div>
          <div className="ml-4 flex flex-col items-end shrink-0">
            <span className="text-sm font-semibold text-white">
              ₹{item.price.toFixed(2)}
            </span>
            <span className="text-xs font-medium text-amber-400">
              {item.multiplier.toFixed(1)}x vol
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
