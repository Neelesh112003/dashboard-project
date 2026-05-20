import { useState } from "react";
import {
  Building2,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { godownApi, apiErrorMessage } from "./godownApi";

function Field({ label, required, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {children}
      {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

const GODOWN_TYPES = [
  { label: "Dry Storage", value: "dry_storage" },
  { label: "Cold Storage", value: "cold_storage" },
  { label: "Raw Material", value: "raw_material" },
  { label: "Finished Goods", value: "finished_goods" },
  { label: "Packaging", value: "packaging" },
  { label: "General", value: "general" },
  { label: "Main", value: "main" },
];

const GODOWN_CATEGORIES = [
  { label: "Primary", value: "primary" },
  { label: "Secondary", value: "secondary" },
  { label: "Tertiary", value: "tertiary" },
];

const initialForm = {
  godown_name: "",
  godown_location: "",
  godown_address: "",
  godown_city: "",
  godown_state: "",
  godown_country: "India",
  godown_pincode: "",
  godown_type: "",
  godown_category: "",
};

export default function AddGodownModal({ onAdd, onClose }) {
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

    if (!form.godown_name.trim()) {
      e.godown_name = "Godown name is required";
    }

    if (
      form.godown_pincode.trim() &&
      !/^\d{1,10}$/.test(form.godown_pincode.trim())
    ) {
      e.godown_pincode = "Pincode must be numeric (max 10 digits)";
    }

    return e;
  };

  const handleAdd = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSubmitting(true);
    setFormMsg(null);

    const payload = {
      godown_name: form.godown_name.trim(),
      godown_location: form.godown_location.trim(),
      godown_address: form.godown_address.trim(),
      city: form.godown_city.trim(),
      state: form.godown_state.trim(),
      country: form.godown_country.trim(),
      pincode: form.godown_pincode.trim(),
      godown_type: form.godown_type,
      godown_category: form.godown_category,
    };

    Object.keys(payload).forEach((key) => {
      if (
        payload[key] === "" ||
        payload[key] === null ||
        payload[key] === undefined
      ) {
        delete payload[key];
      }
    });

    const result = await godownApi.create(payload);
    setSubmitting(false);

    if (result.ok) {
      setFormMsg({
        type: "success",
        text: result.message || "Godown created successfully.",
      });

      onAdd?.(result.data);
      setTimeout(() => {
        onClose?.();
      }, 1200);
      return;
    }

    if (result.errorCode === "102") {
      const msg = (result.message || "").toLowerCase();

      if (msg.includes("name")) {
        setErrors((prev) => ({
          ...prev,
          godown_name: result.message || "Godown name already exists.",
        }));
      } else {
        setFormMsg({
          type: "error",
          text: result.message || "Duplicate record found.",
        });
      }

      return;
    }

    if (result.errorCode === "101" && result.message) {
      setFormMsg({
        type: "error",
        text: result.message,
      });
      return;
    }

    setFormMsg({
      type: "error",
      text: apiErrorMessage(result.errorCode, result.message),
    });
  };

  const handleReset = () => {
    if (submitting) return;
    setForm(initialForm);
    setErrors({});
    setFormMsg(null);
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
        style={{
          backgroundColor: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(4px)",
        }}
        onClick={!submitting ? onClose : undefined}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0d1528]">
        <div
          className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Building2 className="h-5 w-5 text-white" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Add Godown</h2>
            <p className="text-xs text-white/60">
              Fill in the details to create a new godown
            </p>
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

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            <div>
              <p className="mb-4 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-[#162033]">
                Godown Information
              </p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Godown Name" required error={errors.godown_name}>
                  <input
                    type="text"
                    placeholder="e.g. Main Warehouse"
                    value={form.godown_name}
                    onChange={(e) => set("godown_name", e.target.value)}
                    disabled={submitting}
                    className={inp("godown_name")}
                  />
                </Field>

                <Field label="Type" error={errors.godown_type}>
                  <select
                    value={form.godown_type}
                    onChange={(e) => set("godown_type", e.target.value)}
                    disabled={submitting}
                    className={inp("godown_type")}
                  >
                    <option value="">Select type</option>
                    {GODOWN_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Category" error={errors.godown_category}>
                  <select
                    value={form.godown_category}
                    onChange={(e) => set("godown_category", e.target.value)}
                    disabled={submitting}
                    className={inp("godown_category")}
                  >
                    <option value="">Select category</option>
                    {GODOWN_CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>

            <div>
              <p className="mb-4 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-[#162033]">
                Location Details
              </p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Field label="Location" error={errors.godown_location}>
                    <input
                      type="text"
                      placeholder="e.g. North Wing, Building A"
                      value={form.godown_location}
                      onChange={(e) => set("godown_location", e.target.value)}
                      disabled={submitting}
                      className={inp("godown_location")}
                    />
                  </Field>
                </div>

                <Field label="City">
                  <input
                    type="text"
                    placeholder="e.g. Bhopal"
                    value={form.godown_city}
                    onChange={(e) => set("godown_city", e.target.value)}
                    disabled={submitting}
                    className={inp("godown_city")}
                  />
                </Field>

                <Field label="State">
                  <input
                    type="text"
                    placeholder="e.g. Madhya Pradesh"
                    value={form.godown_state}
                    onChange={(e) => set("godown_state", e.target.value)}
                    disabled={submitting}
                    className={inp("godown_state")}
                  />
                </Field>

                <Field label="Country">
                  <input
                    type="text"
                    placeholder="e.g. India"
                    value={form.godown_country}
                    onChange={(e) => set("godown_country", e.target.value)}
                    disabled={submitting}
                    className={inp("godown_country")}
                  />
                </Field>

                <Field label="Pincode" error={errors.godown_pincode}>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]*"
                    placeholder="e.g. 462021"
                    value={form.godown_pincode}
                    onChange={(e) =>
                      set("godown_pincode", e.target.value.replace(/\D/g, ""))
                    }
                    disabled={submitting}
                    className={inp("godown_pincode")}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Address">
                    <input
                      type="text"
                      placeholder="e.g. Plot No. 12, Industrial Area"
                      value={form.godown_address}
                      onChange={(e) => set("godown_address", e.target.value)}
                      disabled={submitting}
                      className={inp("godown_address")}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {formMsg && (
              <div
                className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
                  formMsg.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {formMsg.type === "success" ? (
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                )}
                <span>{formMsg.text}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-slate-100 px-6 py-4 dark:border-[#162033]">
          <button
            onClick={handleAdd}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            style={{ backgroundColor: "#44a83e" }}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4" />
                Add Godown
              </>
            )}
          </button>

          <button
            onClick={handleReset}
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