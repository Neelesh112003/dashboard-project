import { FileText } from "lucide-react";

const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#f5f5f5]/50";
const inputClass = "w-full rounded-xl border border-slate-200 bg-[#f5f5f5] px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all dark:border-[#162033] dark:bg-[#0d1528] dark:text-[#f5f5f5] dark:placeholder-[#f5f5f5]/30";

export default function ProductDescription({ value, onChange }) {
  return (
    <div>
      <label className={labelClass}>Product Description</label>
      <div className="relative">
        <FileText className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-[#f5f5f5]/30" />
        <textarea name="description" value={value} onChange={onChange}
          rows={3} placeholder="Describe the product features, specifications, and use cases..."
          className={`${inputClass} resize-none pl-9 pt-2.5`}
          onFocus={(e) => { e.target.style.border = "1px solid #44a83e"; e.target.style.boxShadow = "0 0 0 3px rgba(68,168,62,0.12)"; }}
          onBlur={(e) => { e.target.style.border = ""; e.target.style.boxShadow = "none"; }} />
      </div>
    </div>
  );
}