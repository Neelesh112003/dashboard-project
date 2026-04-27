import { Save, RotateCcw, Eye, CheckCircle } from "lucide-react";

export default function ProductFormActions({ onReset, submitted }) {
  return (
    <div className="space-y-4 border-t border-slate-100 pt-5 dark:border-[#162033]">
      {submitted && (
        <div className="flex items-center gap-3 rounded-xl border border-[#44a83e]/30 bg-[#ccf0ca] px-4 py-3 dark:bg-[#1a2e44]">
          <CheckCircle className="h-5 w-5 text-[#44a83e]" />
          <p className="text-sm font-medium text-[#1a5c18] dark:text-[#44a83e]">Product saved successfully!</p>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit"
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
          style={{ backgroundColor: "#44a83e" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#379932"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#44a83e"}>
          <Save className="h-4 w-4" /> Save Product
        </button>

        <button type="button" onClick={onReset}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-[#f5f5f5] px-5 py-2.5 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 dark:border-[#162033] dark:bg-[#0d1528] dark:text-[#f5f5f5]/70 dark:hover:bg-[#162033]">
          <RotateCcw className="h-4 w-4" /> Reset Form
        </button>

        <button type="button"
          className="inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5"
          style={{ borderColor: "#44a83e", color: "#44a83e" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#ccf0ca"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}>
          <Eye className="h-4 w-4" /> Preview
        </button>
      </div>
    </div>
  );
}