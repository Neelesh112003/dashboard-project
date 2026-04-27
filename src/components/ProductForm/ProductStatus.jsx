import { Activity } from "lucide-react";

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#f5f5f5]/50";

export default function ProductStatus({ value, onChange }) {
  return (
    <div>
      <label className={labelClass}>Product Status</label>
      <div className="flex flex-wrap gap-3">
        {["active", "draft", "discontinued"].map((s) => (
          <label key={s} className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="status" value={s}
              checked={value === s} onChange={onChange} className="hidden" />
            <span className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
              value === s
                ? "border-[#44a83e] bg-[#ccf0ca] text-[#1a5c18] dark:bg-[#1a2e44] dark:text-[#44a83e]"
                : "border-slate-200 bg-[#f5f5f5] text-slate-500 dark:border-[#162033] dark:bg-[#0d1528] dark:text-[#f5f5f5]/50"
            }`}>
              <Activity className="h-3 w-3" />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}