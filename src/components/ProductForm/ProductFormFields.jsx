import { Tag, Hash, Boxes, Warehouse, DollarSign, AlertTriangle, Wand2 } from "lucide-react";

const inputClass = "w-full rounded-xl border border-slate-200 bg-[#f5f5f5] px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all dark:border-[#162033] dark:bg-[#0d1528] dark:text-[#f5f5f5] dark:placeholder-[#f5f5f5]/30";
const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-[#f5f5f5]/50";
const iconWrap = "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#f5f5f5]/30";

const focusOn = (e) => {
  e.target.style.border = "1px solid #44a83e";
  e.target.style.boxShadow = "0 0 0 3px rgba(68,168,62,0.12)";
};
const focusOff = (e) => {
  e.target.style.border = "";
  e.target.style.boxShadow = "none";
};

export function ProductBasicFields({ form, onChange, onGenerateSKU }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Product Name</label>
        <div className="relative">
          <span className={iconWrap}><Tag className="h-4 w-4" /></span>
          <input name="name" value={form.name} onChange={onChange}
            placeholder="e.g. LED Downlight 10W"
            className={`${inputClass} pl-9`}
            onFocus={focusOn} onBlur={focusOff} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Product SKU</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className={iconWrap}><Hash className="h-4 w-4" /></span>
            <input name="sku" value={form.sku} onChange={onChange}
              placeholder="e.g. ELC-A1B2C3"
              className={`${inputClass} pl-9`}
              onFocus={focusOn} onBlur={focusOff} />
          </div>
          <button type="button" onClick={onGenerateSKU}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-[#f5f5f5] px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-[#44a83e] hover:text-[#44a83e] dark:border-[#162033] dark:bg-[#0d1528] dark:text-[#f5f5f5]/70">
            <Wand2 className="h-3.5 w-3.5" /> Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductCategoryFields({ form, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Category</label>
        <div className="relative">
          <span className={iconWrap}><Boxes className="h-4 w-4" /></span>
          <select name="category" value={form.category} onChange={onChange}
            className={`${inputClass} pl-9 appearance-none`}
            onFocus={focusOn} onBlur={focusOff}>
            <option value="">Select category</option>
            <option>Electronics</option>
            <option>Furniture</option>
            <option>Raw Materials</option>
            <option>Accessories</option>
            <option>Components</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Warehouse / Godown</label>
        <div className="relative">
          <span className={iconWrap}><Warehouse className="h-4 w-4" /></span>
          <select name="warehouse" value={form.warehouse} onChange={onChange}
            className={`${inputClass} pl-9 appearance-none`}
            onFocus={focusOn} onBlur={focusOff}>
            <option value="">Select warehouse</option>
            <option>Main Warehouse</option>
            <option>North Godown</option>
            <option>South Storage</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export function ProductPricingFields({ form, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div>
        <label className={labelClass}>Unit Price (₹)</label>
        <div className="relative">
          <span className={iconWrap}><DollarSign className="h-4 w-4" /></span>
          <input name="price" type="number" value={form.price} onChange={onChange}
            placeholder="0.00" className={`${inputClass} pl-9`}
            onFocus={focusOn} onBlur={focusOff} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Stock Quantity</label>
        <div className="relative">
          <span className={iconWrap}><Boxes className="h-4 w-4" /></span>
          <input name="stock" type="number" value={form.stock} onChange={onChange}
            placeholder="0" className={`${inputClass} pl-9`}
            onFocus={focusOn} onBlur={focusOff} />
        </div>
      </div>
      <div>
        <label className={labelClass}>Reorder Level</label>
        <div className="relative">
          <span className={iconWrap}><AlertTriangle className="h-4 w-4" /></span>
          <input name="reorder" type="number" value={form.reorder} onChange={onChange}
            placeholder="0" className={`${inputClass} pl-9`}
            onFocus={focusOn} onBlur={focusOff} />
        </div>
      </div>
    </div>
  );
}