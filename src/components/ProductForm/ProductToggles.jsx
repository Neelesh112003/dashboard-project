import { Star, ShoppingCart } from "lucide-react";

function Toggle({ label, icon, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <div className="relative">
        <input type="checkbox" className="hidden" checked={checked} onChange={onChange} />
        <div className={`h-6 w-11 rounded-full transition-all duration-300 ${checked ? "bg-[#44a83e]" : "bg-slate-200 dark:bg-[#162033]"}`} />
        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${checked ? "left-5.5" : "left-0.5"}`} />
      </div>
      <span className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-[#f5f5f5]/70">
        {icon} {label}
      </span>
    </label>
  );
}

export default function ProductToggles({ form, setForm }) {
  return (
    <div className="flex flex-wrap gap-6">
      <Toggle
        label="Featured Product" icon={<Star className="h-4 w-4" />}
        checked={form.featured}
        onChange={() => setForm(f => ({ ...f, featured: !f.featured }))}
      />
      <Toggle
        label="Available for Sale" icon={<ShoppingCart className="h-4 w-4" />}
        checked={form.availableForSale}
        onChange={() => setForm(f => ({ ...f, availableForSale: !f.availableForSale }))}
      />
    </div>
  );
}