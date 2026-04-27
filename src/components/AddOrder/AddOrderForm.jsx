import { useState } from "react";
import { ShoppingCart, Plus } from "lucide-react";

const CATEGORIES = ["Laptop", "SmartPhone", "Watch", "Tablet", "Accessory", "Other"];
const STATUSES   = ["Pending", "Processing", "Delivered", "Cancelled"];

export default function AddOrderForm({ onAdd }) {
  const [form, setForm]     = useState({ product: "", variants: "", price: "", category: "Laptop", status: "Pending" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.product.trim()) e.product = "Product name is required";
    if (!form.price.trim())   e.price   = "Price is required";
    else if (isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = "Enter a valid price";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      ...form,
      id:        Date.now(),
      price:     parseFloat(form.price).toFixed(2),
      addedOn:   new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    });
    setForm({ product: "", variants: "", price: "", category: "Laptop", status: "Pending" });
    setErrors({});
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(58,60,68,0.6)" }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: "" }); }}
        className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#44a83e]"
        style={{ borderColor: errors[key] ? "#ef4444" : "#e2e8f0" }}
      />
      {errors[key] && <p className="text-xs text-red-500">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[#162033] bg-white dark:bg-[#0d1528] overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-[#162033]" style={{ backgroundColor: "#3a3c44" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(68,168,62,0.2)" }}>
            <ShoppingCart className="h-5 w-5" style={{ color: "#44a83e" }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "#f5f5f5" }}>Add Purchase Order</h2>
            <p className="text-xs" style={{ color: "rgba(245,245,245,0.5)" }}>Fill in the details to create a new order</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {field("Product Name", "product", "text", "e.g. MacBook Pro 13\"")}
        {field("Variants",     "variants", "text", "e.g. 2 Variants")}
        {field("Price (₹/$)",  "price",    "number", "e.g. 2399")}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(58,60,68,0.6)" }}>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-xl border border-slate-200 dark:border-[#1b2740] px-4 py-2.5 text-sm outline-none bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 focus:border-[#44a83e]"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(58,60,68,0.6)" }}>Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full rounded-xl border border-slate-200 dark:border-[#1b2740] px-4 py-2.5 text-sm outline-none bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 focus:border-[#44a83e]"
          >
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#44a83e" }}
        >
          <Plus className="h-4 w-4" />
          Add Order
        </button>
      </div>
    </div>
  );
}