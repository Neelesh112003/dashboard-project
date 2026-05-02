import { useState, useRef, useEffect } from "react";
import { Boxes, X, Search, ChevronDown, ArrowRightLeft, PackagePlus, Pencil } from "lucide-react";

// ── Mock product catalogue ────────────────────────────────────────────────────
const PRODUCT_CATALOGUE = [
  { itemName: "Capacitor 100µF 25V",   code: "CAP-100-25",  hsn: "85322500", alias: "Cap 100µF",       unit: "Pcs"  },
  { itemName: "Capacitor 470µF 16V",   code: "CAP-470-16",  hsn: "85322500", alias: "Cap 470µF",       unit: "Pcs"  },
  { itemName: "Resistor 10kΩ 1/4W",    code: "RES-10K-QW",  hsn: "85334000", alias: "Res 10K",         unit: "Pcs"  },
  { itemName: "Resistor 1kΩ 1/4W",     code: "RES-1K-QW",   hsn: "85334000", alias: "Res 1K",          unit: "Pcs"  },
  { itemName: "IC NE555 Timer",         code: "IC-NE555",    hsn: "85422990", alias: "555 Timer",       unit: "Pcs"  },
  { itemName: "IC LM358 Op-Amp",        code: "IC-LM358",    hsn: "85422990", alias: "LM358",           unit: "Pcs"  },
  { itemName: "PCB SMT 100x80mm",       code: "PCB-SMT-100", hsn: "85340000", alias: "SMT Board 100",   unit: "Pcs"  },
  { itemName: "PCB THT 200x150mm",      code: "PCB-THT-200", hsn: "85340000", alias: "THT Board 200",   unit: "Pcs"  },
  { itemName: "LED Red 5mm",            code: "LED-R-5MM",   hsn: "85414000", alias: "Red LED",         unit: "Pcs"  },
  { itemName: "LED Green 5mm",          code: "LED-G-5MM",   hsn: "85414000", alias: "Green LED",       unit: "Pcs"  },
  { itemName: "Transformer 12V 1A",     code: "TRF-12-1",    hsn: "85043100", alias: "12V Transformer", unit: "Nos"  },
  { itemName: "Copper Wire 1.5mm",      code: "CW-1.5MM",    hsn: "74081100", alias: "CW 1.5",          unit: "Mtrs" },
  { itemName: "Copper Wire 2.5mm",      code: "CW-2.5MM",    hsn: "74081100", alias: "CW 2.5",          unit: "Mtrs" },
  { itemName: "Solder Wire 60/40",      code: "SOL-6040",    hsn: "83113000", alias: "Solder 60/40",    unit: "Kg"   },
  { itemName: "Flux Paste 500g",        code: "FLX-500G",    hsn: "38109000", alias: "Flux Paste",      unit: "Kg"   },
];

const GODOWNS = [
  { code: "GDN-001", name: "Main Storage Warehouse" },
  { code: "GDN-002", name: "Raw Material Store"     },
  { code: "GDN-003", name: "SMT Component Store"    },
  { code: "GDN-004", name: "Scrap Yard"             },
];

const UNITS   = ["Pcs", "Nos", "Kg", "Mtrs", "Ltrs", "Box", "Set", "Roll"];
const TRANSACTIONS = [
  { value: "entry",    label: "Entry",             icon: PackagePlus,    color: "#2d6e2a", bg: "rgba(45,110,42,0.12)"   },
  { value: "drawings", label: "Drawings",          icon: Pencil,         color: "#1d4ed8", bg: "rgba(29,78,216,0.12)"   },
  { value: "transfer", label: "Godown Transfer",   icon: ArrowRightLeft, color: "#7c3aed", bg: "rgba(124,58,237,0.12)"  },
];

// ── helpers ──────────────────────────────────────────────────────────────────
function Field({ label, required, children, error, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const inp = (err) =>
  `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 ${
    err ? "border-red-500" : "border-slate-200 dark:border-[#1b2740]"
  }`;

// ── ItemSearch ────────────────────────────────────────────────────────────────
function ItemSearch({ value, onChange, onSelect, error }) {
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState(value || "");
  const ref                 = useRef(null);

  const filtered = query.trim().length >= 1
    ? PRODUCT_CATALOGUE.filter((p) =>
        p.itemName.toLowerCase().includes(query.toLowerCase()) ||
        p.code.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    : [];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleInput = (e) => {
    setQuery(e.target.value);
    onChange(e.target.value);
    setOpen(true);
  };

  const handlePick = (product) => {
    setQuery(product.itemName);
    setOpen(false);
    onSelect(product);
  };

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Type item name or code…"
          value={query}
          onChange={handleInput}
          onFocus={() => query.length >= 1 && setOpen(true)}
          className={`${inp(error)} pl-9`}
        />
      </div>

      {open && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full rounded-xl border border-slate-200 dark:border-[#1b2740] bg-white dark:bg-[#0d1528] shadow-xl overflow-hidden">
          {filtered.map((p) => (
            <li
              key={p.code}
              onMouseDown={() => handlePick(p)}
              className="flex items-center justify-between px-4 py-2.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#11182b] transition-colors border-b border-slate-100 dark:border-[#162033] last:border-0"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{p.itemName}</p>
                <p className="text-xs text-slate-400">{p.code} · HSN {p.hsn}</p>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-[#162033] px-2 py-0.5 rounded-lg">
                {p.unit}
              </span>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

// ── GodownSelect ──────────────────────────────────────────────────────────────
function GodownSelect({ label, required, value, onChange, error, exclude }) {
  const options = GODOWNS.filter((g) => g.code !== exclude);
  return (
    <Field label={label} required={required} error={error}>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inp(error)}>
        <option value="">Select godown</option>
        {options.map((g) => (
          <option key={g.code} value={g.code}>{g.name} ({g.code})</option>
        ))}
      </select>
    </Field>
  );
}

// ── Main Form ─────────────────────────────────────────────────────────────────
export default function AddInventoryForm({ onAdd, onClose }) {
  const blank = {
    itemName: "", productCode: "", productHSN: "", productName: "",
    productAlias: "", quantity: "", unit: "", rate: "", value: "",
    transaction: "entry", godown: "", rack: "", section: "",
    godownFrom: "", godownTo: "",
  };

  const [form, setForm]       = useState(blank);
  const [errors, setErrors]   = useState({});
  const [successMsg, setSuccessMsg] = useState(false);

  const set = (field, val) => {
    setForm((p) => {
      const next = { ...p, [field]: val };
      // auto-calc value
      if (field === "quantity" || field === "rate") {
        const q = parseFloat(field === "quantity" ? val : p.quantity) || 0;
        const r = parseFloat(field === "rate"     ? val : p.rate)     || 0;
        next.value = q && r ? (q * r).toFixed(2) : "";
      }
      return next;
    });
    setErrors((p) => ({ ...p, [field]: "" }));
  };

  const onSelectProduct = (p) => {
    setForm((prev) => ({
      ...prev,
      itemName:     p.itemName,
      productCode:  p.code,
      productHSN:   p.hsn,
      productName:  p.itemName,
      productAlias: p.alias,
      unit:         p.unit,
    }));
    setErrors({});
  };

  const isTransfer = form.transaction === "transfer";

  const validate = () => {
    const e = {};
    if (!form.itemName.trim())  e.itemName  = "Item name is required";
    if (!form.quantity)         e.quantity  = "Quantity is required";
    else if (isNaN(form.quantity) || +form.quantity <= 0) e.quantity = "Enter a valid quantity";
    if (!form.unit)             e.unit      = "Unit is required";
    if (!form.rate)             e.rate      = "Rate is required";
    if (!form.transaction)      e.transaction = "Select a transaction type";
    if (isTransfer) {
      if (!form.godownFrom) e.godownFrom = "Select source godown";
      if (!form.godownTo)   e.godownTo   = "Select destination godown";
      if (form.godownFrom && form.godownTo && form.godownFrom === form.godownTo)
        e.godownTo = "Source and destination cannot be the same";
    } else {
      if (!form.godown) e.godown = "Select a godown";
    }
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd?.({
      ...form,
      id: Date.now(),
      addedOn: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    });
    setForm(blank);
    setErrors({});
    setSuccessMsg(true);
    setTimeout(() => { setSuccessMsg(false); onClose?.(); }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0d1528] max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-[#162033] flex items-center gap-3 shrink-0" style={{ backgroundColor: "#3a3c44" }}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "rgba(245,245,245,0.12)" }}>
            <Boxes className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Inventory Entry</h2>
            <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>Add or transfer stock across godowns</p>
          </div>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6">

            {successMsg && (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg>
                Inventory entry saved successfully.
              </div>
            )}

            {/* Transaction Type */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Transaction Type
              </p>
              <div className="flex gap-3 flex-wrap">
                {TRANSACTIONS.map(({ value, label, icon: Icon, color, bg }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { set("transaction", value); setErrors({}); }}
                    className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold transition-all"
                    style={
                      form.transaction === value
                        ? { backgroundColor: bg, borderColor: color, color }
                        : { backgroundColor: "transparent", borderColor: "#e2e8f0", color: "#94a3b8" }
                    }
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>
              {errors.transaction && <p className="text-xs text-red-500 mt-1">{errors.transaction}</p>}
            </div>

            {/* Item Search */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Item Information
              </p>
              <div className="space-y-5">
                <Field label="Item Name" required>
                  <ItemSearch
                    value={form.itemName}
                    onChange={(v) => set("itemName", v)}
                    onSelect={onSelectProduct}
                    error={errors.itemName}
                  />
                </Field>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Product Code" error={errors.productCode}>
                    <input type="text" placeholder="Auto-filled from item" value={form.productCode}
                      onChange={(e) => set("productCode", e.target.value)} className={inp(errors.productCode)} />
                  </Field>
                  <Field label="Product HSN" error={errors.productHSN}>
                    <input type="text" placeholder="Auto-filled from item" value={form.productHSN}
                      onChange={(e) => set("productHSN", e.target.value)} className={inp(errors.productHSN)} />
                  </Field>
                  <Field label="Product Name" error={errors.productName}>
                    <input type="text" placeholder="Auto-filled from item" value={form.productName}
                      onChange={(e) => set("productName", e.target.value)} className={inp(errors.productName)} />
                  </Field>
                  <Field label="Product Alias Name" error={errors.productAlias}>
                    <input type="text" placeholder="Auto-filled from item" value={form.productAlias}
                      onChange={(e) => set("productAlias", e.target.value)} className={inp(errors.productAlias)} />
                  </Field>
                </div>
              </div>
            </div>

            {/* Quantity / Rate / Value */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Stock Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Field label="Quantity" required error={errors.quantity}>
                  <input type="number" min="0" placeholder="0" value={form.quantity}
                    onChange={(e) => set("quantity", e.target.value)} className={inp(errors.quantity)} />
                </Field>

                <Field label="Unit" required error={errors.unit}>
                  <select value={form.unit} onChange={(e) => set("unit", e.target.value)} className={inp(errors.unit)}>
                    <option value="">Select unit</option>
                    {UNITS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                </Field>

                <Field label="Rate (₹)" required error={errors.rate}>
                  <input type="number" min="0" step="0.01" placeholder="0.00" value={form.rate}
                    onChange={(e) => set("rate", e.target.value)} className={inp(errors.rate)} />
                </Field>

                <Field label="Value (₹) — Auto" className="md:col-span-3">
                  <div className="relative">
                    <input
                      type="text" readOnly
                      value={form.value ? `₹ ${parseFloat(form.value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : ""}
                      placeholder="Calculated automatically"
                      className="w-full rounded-xl border border-slate-200 dark:border-[#1b2740] px-4 py-2.5 text-sm bg-slate-100 dark:bg-[#0b1220] text-slate-700 dark:text-slate-300 font-semibold cursor-not-allowed"
                    />
                  </div>
                </Field>
              </div>
            </div>

            {/* Godown Location */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                {isTransfer ? "Transfer Details" : "Godown Location"}
              </p>

              {isTransfer ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <GodownSelect label="From Godown" required value={form.godownFrom}
                    onChange={(v) => set("godownFrom", v)} error={errors.godownFrom} exclude={form.godownTo} />
                  <div className="flex items-end justify-center pb-2 text-slate-400">
                    <ArrowRightLeft className="h-5 w-5" />
                  </div>
                  <GodownSelect label="To Godown" required value={form.godownTo}
                    onChange={(v) => set("godownTo", v)} error={errors.godownTo} exclude={form.godownFrom} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <GodownSelect label="Select Godown" required value={form.godown}
                    onChange={(v) => set("godown", v)} error={errors.godown} />
                  <Field label="Rack" error={errors.rack}>
                    <input type="text" placeholder="e.g. R-01" value={form.rack}
                      onChange={(e) => set("rack", e.target.value)} className={inp(errors.rack)} />
                  </Field>
                  <Field label="Section" error={errors.section}>
                    <input type="text" placeholder="e.g. S-A" value={form.section}
                      onChange={(e) => set("section", e.target.value)} className={inp(errors.section)} />
                  </Field>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-[#162033] flex items-center gap-3 shrink-0">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#44a83e" }}
          >
            <Boxes className="h-4 w-4" />
            Save Entry
          </button>
          <button
            onClick={() => { setForm(blank); setErrors({}); }}
            className="rounded-xl border border-slate-200 dark:border-[#1b2740] px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#11182b] transition-all"
          >
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}