import { CheckCircle, XCircle, MinusCircle, Grid3x3 } from "lucide-react";

export default function SpaceGrid({ rack, section, godown, updateGodown }) {
  const toggleStatus = (spaceId) => {
    const updated = {
      ...godown,
      sections: godown.sections.map((sec) =>
        sec.id === section.id
          ? {
              ...sec,
              racks: sec.racks.map((r) =>
                r.id === rack.id
                  ? {
                      ...r,
                      spaces: r.spaces.map((s) => {
                        if (s.id !== spaceId) return s;

                        const next =
                          s.status === "available"
                            ? "occupied"
                            : s.status === "occupied"
                            ? "reserved"
                            : "available";

                        return { ...s, status: next };
                      }),
                    }
                  : r
              ),
            }
          : sec
      ),
    };

    updateGodown(updated);
  };

  const getStatusStyle = (status) => {
    const base =
      "flex items-center justify-center rounded-xl border text-xs font-semibold cursor-pointer transition-all active:scale-95";

    if (status === "available")
      return `${base} border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 text-green-700 hover:from-green-100 hover:to-emerald-200 dark:border-green-900/40 dark:from-green-900/20 dark:to-emerald-900/10 dark:text-green-400`;
    if (status === "occupied")
      return `${base} border-red-200 bg-gradient-to-br from-red-50 to-rose-100 text-red-700 hover:from-red-100 hover:to-rose-200 dark:border-red-900/40 dark:from-red-900/20 dark:to-rose-900/10 dark:text-red-400`;
    return `${base} border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-100 text-yellow-700 hover:from-yellow-100 hover:to-amber-200 dark:border-yellow-900/40 dark:from-yellow-900/20 dark:to-amber-900/10 dark:text-yellow-400`;
  };

  const getStatusIcon = (status) => {
    if (status === "available")
      return <CheckCircle className="h-3.5 w-3.5 mr-1" />;
    if (status === "occupied")
      return <XCircle className="h-3.5 w-3.5 mr-1" />;
    return <MinusCircle className="h-3.5 w-3.5 mr-1" />;
  };

  const columns = rack.columns || 4;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#1b2740] dark:bg-[#11182b]">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <Grid3x3 className="h-4 w-4 text-green-600 dark:text-green-400" />
          Storage Spaces — {rack.name}
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-green-50 to-emerald-100 border border-green-200 dark:border-green-900/40" />
            <span className="text-slate-600 dark:text-slate-400">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-red-50 to-rose-100 border border-red-200 dark:border-red-900/40" />
            <span className="text-slate-600 dark:text-slate-400">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-linear-to-br from-yellow-50 to-amber-100 border border-yellow-200 dark:border-yellow-900/40" />
            <span className="text-slate-600 dark:text-slate-400">Reserved</span>
          </div>
        </div>
      </div>

      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {rack.spaces.map((s) => (
          <div
            key={s.id}
            onClick={() => toggleStatus(s.id)}
            className={getStatusStyle(s.status)}
            title={`Click to change status: ${s.status}`}
          >
            {getStatusIcon(s.status)}
            <span>{s.code}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-600 dark:border-[#162033] dark:bg-[#0d1528] dark:text-slate-400">
        Click any space to cycle: Available → Occupied → Reserved → Available
      </div>
    </div>
  );
}