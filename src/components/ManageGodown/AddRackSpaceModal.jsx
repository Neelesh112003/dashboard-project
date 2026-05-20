import { useState } from "react";
import { X, BoxSelect, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { rackSpaceApi, apiErrorMessage } from "./Godownapi";

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

const SPACE_TYPES = ["General", "Cold", "Dry", "Hazardous"];
const SPACE_CATEGORIES = ["Standard", "Premium", "Other"];

const initialForm = {
  space_code: "",
  space_name: "",
  space_type: "",
  space_category: "",
  rack_space_remarks: "",
  status: "active",
};

export default function AddRackSpaceModal({ godownId, sectionId, floorId, rackId, onAdd, onClose }) {
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
    if (!form.space_code.trim()) e.space_code = "Space code is required";
    else if (form.space_code.trim().length < 2) e.space_code = "Min. 2 characters";
    if (!form.space_name.trim()) e.space_name = "Space name is required";
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
      rack_id: rackId,
      space_code: form.space_code.trim(),
      space_name: form.space_name.trim(),
      status: form.status,
      ...(form.space_type && { space_type: form.space_type }),
      ...(form.space_category && { space_category: form.space_category }),
      ...(form.rack_space_remarks && { rack_space_remarks: form.rack_space_remarks }),
    };

    const result = await rackSpaceApi.create(payload);
    setSubmitting(false);

    if (result.ok) {
      setFormMsg({ type: "success", text: result.message || "Rack space created successfully." });
      onAdd?.(result.data);
      setTimeout(() => onClose?.(), 1400);
    } else {
      if (result.errorCode === "102") {
        const msg = result.message || "";
        if (msg.toLowerCase().includes("code")) {
          setErrors((e) => ({ ...e, space_code: result.message }));
        } else if (msg.toLowerCase().includes("name")) {
          setErrors((e) => ({ ...e, space_name: result.message }));
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
          className="flex items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ background: "linear-gradient(135deg, #2f3138 0%, #3a3c44 45%, #4b5563 100%)" }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <BoxSelect className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Add Rack Space</h2>
            <p className="text-xs text-white/60">Create a new storage space within this rack</p>
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
              Space Information
            </p>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Space Code" required error={errors.space_code}>
                <input
                  type="text"
                  placeholder="e.g. SP-01"
                  value={form.space_code}
                  onChange={(e) => set("space_code", e.target.value)}
                  className={inp("space_code")}
                />
              </Field>

              <Field label="Space Name" required error={errors.space_name}>
                <input
                  type="text"
                  placeholder="e.g. Space 01"
                  value={form.space_name}
                  onChange={(e) => set("space_name", e.target.value)}
                  className={inp("space_name")}
                />
              </Field>

              <Field label="Type" error={errors.space_type}>
                <select value={form.space_type} onChange={(e) => set("space_type", e.target.value)} className={inp("space_type")}>
                  <option value="">Select type</option>
                  {SPACE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>

              <Field label="Category" error={errors.space_category}>
                <select value={form.space_category} onChange={(e) => set("space_category", e.target.value)} className={inp("space_category")}>
                  <option value="">Select category</option>
                  {SPACE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Status" required error={errors.status}>
                <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inp("status")}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </Field>

              <div className="md:col-span-2">
                <Field label="Remarks" error={errors.rack_space_remarks}>
                  <textarea
                    rows={2}
                    placeholder="Optional remarks..."
                    value={form.rack_space_remarks}
                    onChange={(e) => set("rack_space_remarks", e.target.value)}
                    className={`${inp("rack_space_remarks")} resize-none`}
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
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <BoxSelect className="h-4 w-4" />}
            {submitting ? "Creating..." : "Add Space"}
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