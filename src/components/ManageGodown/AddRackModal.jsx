import { useState } from "react";
import { X, Grid, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { rackApi, apiErrorMessage } from "./Godownapi";

function Field({ label, required, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-red-500 mt-1">{error}</p> : null}
    </div>
  );
}

const RACK_TYPES = ["Metal", "Wooden", "Plastic", "Heavy Duty", "Light Duty"];
const RACK_CATEGORIES = ["Standard", "Heavy Duty", "Light Duty", "Premium", "Other"];

const initialForm = {
  rack_code: "",
  rack_name: "",
  rack_type: "",
  rack_category: "",
  rack_remarks: "",
  status: "active",
};

export default function AddRackModal({ godownId, sectionId, floorId, onAdd, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState(null);

  const set = (field, val) => {
    setForm((f) => ({ ...f, [field]: val }));
    setErrors((e) => ({ ...e, [field]: "" }));
    setFormMsg(null);
  };

  const validate = () => {
    const e = {};
    if (!form.rack_code.trim()) e.rack_code = "Rack code is required";
    else if (form.rack_code.trim().length < 2) e.rack_code = "Min. 2 characters";
    if (!form.rack_name.trim()) e.rack_name = "Rack name is required";
    if (!form.status) e.status = "Status is required";
    return e;
  };

  const handleAdd = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSubmitting(true);
    setFormMsg(null);

    const payload = {
      godown_id: godownId,
      section_id: sectionId,
      floor_id: floorId,
      rack_code: form.rack_code.trim(),
      rack_name: form.rack_name.trim(),
      status: form.status,
      ...(form.rack_type && { rack_type: form.rack_type }),
      ...(form.rack_category && { rack_category: form.rack_category }),
      ...(form.rack_remarks && { rack_remarks: form.rack_remarks }),
    };

    const result = await rackApi.create(payload);
    setSubmitting(false);

    if (result.ok) {
      setFormMsg({ type: "success", text: result.message || "Rack created successfully." });
      onAdd?.(result.data);
      setTimeout(() => onClose?.(), 1400);
    } else {
      if (result.errorCode === "102") {
        const msg = result.message || "";
        if (msg.toLowerCase().includes("code")) {
          setErrors((e) => ({ ...e, rack_code: result.message }));
        } else if (msg.toLowerCase().includes("name")) {
          setErrors((e) => ({ ...e, rack_name: result.message }));
        } else {
          setFormMsg({ type: "error", text: result.message });
        }
      } else {
        setFormMsg({ type: "error", text: apiErrorMessage(result.errorCode, result.message) });
      }
    }
  };

  const inp = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 ${
      errors[field]
        ? "border-red-500 focus:border-red-400 focus:ring-1 focus:ring-red-400/20"
        : "border-slate-200 dark:border-[#1b2740] focus:border-green-400 focus:ring-1 focus:ring-green-400/20"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={!submitting ? onClose : undefined}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0d1528]">
        {/* Header */}
        <div
          className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ background: "linear-gradient(135deg, #2f3138 0%, #3a3c44 45%, #4b5563 100%)" }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Grid className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Add Rack</h2>
            <p className="text-xs text-white/60">Create a new rack on this floor</p>
          </div>
          <button
            type="button"
            onClick={!submitting ? onClose : undefined}
            disabled={submitting}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          <div>
            <p className="mb-4 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-[#162033]">
              Rack Information
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Rack Code" required error={errors.rack_code}>
                <input
                  type="text"
                  placeholder="e.g. RK-01"
                  value={form.rack_code}
                  onChange={(e) => set("rack_code", e.target.value)}
                  className={inp("rack_code")}
                />
              </Field>

              <Field label="Rack Name" required error={errors.rack_name}>
                <input
                  type="text"
                  placeholder="e.g. Rack 01"
                  value={form.rack_name}
                  onChange={(e) => set("rack_name", e.target.value)}
                  className={inp("rack_name")}
                />
              </Field>

              <Field label="Type" error={errors.rack_type}>
                <select value={form.rack_type} onChange={(e) => set("rack_type", e.target.value)} className={inp("rack_type")}>
                  <option value="">Select type</option>
                  {RACK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>

              <Field label="Category" error={errors.rack_category}>
                <select value={form.rack_category} onChange={(e) => set("rack_category", e.target.value)} className={inp("rack_category")}>
                  <option value="">Select category</option>
                  {RACK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Status" required error={errors.status}>
                <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inp("status")}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>

              <div className="md:col-span-2">
                <Field label="Remarks" error={errors.rack_remarks}>
                  <textarea
                    rows={2}
                    placeholder="Optional remarks..."
                    value={form.rack_remarks}
                    onChange={(e) => set("rack_remarks", e.target.value)}
                    className={`${inp("rack_remarks")} resize-none`}
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Form-level message */}
          {formMsg && (
            <div
              className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                formMsg.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                  : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
              }`}
            >
              {formMsg.type === "success"
                ? <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
                : <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />}
              <span>{formMsg.text}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center gap-3 border-t border-slate-100 px-6 py-4 dark:border-[#162033]">
          <button
            onClick={handleAdd}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #44a83e 0%, #378f32 50%, #2f7d2b 100%)" }}
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Grid className="h-4 w-4" />}
            {submitting ? "Creating..." : "Add Rack"}
          </button>

          <button
            onClick={() => { setForm(initialForm); setErrors({}); setFormMsg(null); }}
            disabled={submitting}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#11182b] disabled:opacity-50"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}