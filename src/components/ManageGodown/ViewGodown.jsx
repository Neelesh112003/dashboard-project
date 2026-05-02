import { X, Warehouse } from "lucide-react";

const TYPE_META = {
  "Finished Goods": {
    color: "#2d6e2a",
    bg: "rgba(45,110,42,0.1)",
  },
  "Raw Material": {
    color: "#1d4ed8",
    bg: "rgba(29,78,216,0.1)",
  },
  "Semi-Finished": {
    color: "#b45309",
    bg: "rgba(180,83,9,0.1)",
  },
  Scrap: {
    color: "#6b7280",
    bg: "rgba(107,114,128,0.1)",
  },
  Transit: {
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.1)",
  },
  "Cold Storage": {
    color: "#0891b2",
    bg: "rgba(8,145,178,0.1)",
  },
  Hazardous: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
  },
};

export default function ViewGodown({ godown, onClose }) {
  if (!godown) return null;

  const typeMeta = TYPE_META[godown.type] ?? {
    color: "#3a3c44",
    bg: "rgba(58,60,68,0.1)",
  };

  const fields = [
    {
      label: "Godown Code",
      value: godown.godownCode,
    },
    {
      label: "Godown Name",
      value: godown.godownName,
    },
    {
      label: "Type",
      value: godown.type,
      isType: true,
    },
    {
      label: "Location",
      value: godown.location,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0d1528]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            >
              <Warehouse className="h-5 w-5 text-white" />
            </div>

            <div>
              <h3 className="text-base font-semibold text-white">
                {godown.godownName}
              </h3>
              <p className="text-xs text-white/60">
                {godown.godownCode}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-1 p-6">
          {fields.map((field) => (
            <div
              key={field.label}
              className="flex items-center justify-between border-b border-slate-100 py-4 last:border-0 dark:border-[#162033]"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {field.label}
              </span>

              {field.isType ? (
                <span
                  className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: typeMeta.bg,
                    color: typeMeta.color,
                  }}
                >
                  {field.value || "—"}
                </span>
              ) : (
                <span className="max-w-[60%] text-right text-sm font-medium text-slate-700 wrap-break-word dark:text-slate-200">
                  {field.value || "—"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}