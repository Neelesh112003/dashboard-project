import { useState } from "react";
import { Warehouse, X } from "lucide-react";

function Field({ label, required, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

const GODOWN_TYPES = [
  "Finished Goods",
  "Raw Material",
  "Semi-Finished",
  "Scrap",
  "Transit",
  "Cold Storage",
  "Hazardous",
];

export default function AddGodownForm({ onAdd, onClose }) {
  const initialForm = {
    godownCode: "",
    godownName: "",
    type: "",
    location: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState(false);

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.godownCode.trim()) e.godownCode = "Godown code is required";
    else if (!/^[A-Za-z0-9\-_]{2,12}$/.test(form.godownCode.trim()))
      e.godownCode = "2–12 alphanumeric characters only";
    if (!form.godownName.trim()) e.godownName = "Godown name is required";
    if (!form.type) e.type = "Please select a type";
    if (!form.location.trim()) e.location = "Location is required";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onAdd?.({
      ...form,
      godownCode: form.godownCode.trim().toUpperCase(),
      id: Date.now(),
      addedOn: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });
    setForm(initialForm);
    setErrors({});
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose?.();
    }, 1500);
  };

  const inp = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 ${
      errors[field]
        ? "border-red-500"
        : "border-slate-200 dark:border-[#1b2740]"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0d1528] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div
          className="px-6 py-5 border-b border-slate-200 dark:border-[#162033] flex items-center gap-3 shrink-0"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(245,245,245,0.12)" }}
          >
            <Warehouse className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Add Godown</h2>
            <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>
              Fill in the details to register a new godown
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6">
            {/* Success Banner */}
            {successMsg && (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                <svg
                  className="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Godown registered successfully.
              </div>
            )}

            {/* Godown Information */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Godown Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Godown Code" required error={errors.godownCode}>
                  <input
                    type="text"
                    placeholder="e.g. GDN-001"
                    value={form.godownCode}
                    onChange={(e) => set("godownCode", e.target.value)}
                    className={inp("godownCode")}
                  />
                </Field>

                <Field label="Godown Name" required error={errors.godownName}>
                  <input
                    type="text"
                    placeholder="Enter godown name"
                    value={form.godownName}
                    onChange={(e) => set("godownName", e.target.value)}
                    className={inp("godownName")}
                  />
                </Field>

                <Field label="Type" required error={errors.type}>
                  <select
                    value={form.type}
                    onChange={(e) => set("type", e.target.value)}
                    className={inp("type")}
                  >
                    <option value="">Select type</option>
                    {GODOWN_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Location" required error={errors.location}>
                  <input
                    type="text"
                    placeholder="e.g. Plot 12, Sector 5, Noida"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                    className={inp("location")}
                  />
                </Field>
              </div>
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
            <Warehouse className="h-4 w-4" />
            Add Godown
          </button>
          <button
            onClick={() => {
              setForm(initialForm);
              setErrors({});
            }}
            className="rounded-xl border border-slate-200 dark:border-[#1b2740] px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#11182b] transition-all"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
