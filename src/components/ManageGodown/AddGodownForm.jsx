import { useState } from "react";
import { Building2, X, CheckCircle } from "lucide-react";

function Field({ label, required, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

export default function AddGodownModal({ onAdd, onClose }) {
  const initialForm = {
    godownCode: "",
    godownName: "",
    type: "",
    location: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.godownCode.trim()) e.godownCode = "Godown code is required";
    else if (form.godownCode.trim().length < 2) e.godownCode = "Min. 2 characters";

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
      id: Date.now(),
      sections: [],
      createdOn: new Date().toLocaleDateString("en-IN", {
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
      errors[field] ? "border-red-500" : "border-slate-200 dark:border-[#1b2740]"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0d1528]">
        <div
          className="flex shrink-0 items-center gap-3 border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(245,245,245,0.12)" }}
          >
            <Building2 className="h-5 w-5 text-white" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Add Godown</h2>
            <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>
              Fill in the details to create a new godown
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            {successMsg ? (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Godown created successfully.
              </div>
            ) : null}

            <div>
              <p className="mb-4 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-[#162033]">
                Godown Information
              </p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Godown Code" required error={errors.godownCode}>
                  <input
                    type="text"
                    placeholder="Enter godown code"
                    value={form.godownCode}
                    onChange={(e) => {
                      setForm({ ...form, godownCode: e.target.value });
                      setErrors({ ...errors, godownCode: "" });
                    }}
                    className={inp("godownCode")}
                  />
                </Field>

                <Field label="Godown Name" required error={errors.godownName}>
                  <input
                    type="text"
                    placeholder="Enter godown name"
                    value={form.godownName}
                    onChange={(e) => {
                      setForm({ ...form, godownName: e.target.value });
                      setErrors({ ...errors, godownName: "" });
                    }}
                    className={inp("godownName")}
                  />
                </Field>

                <Field label="Type" required error={errors.type}>
                  <select
                    value={form.type}
                    onChange={(e) => {
                      setForm({ ...form, type: e.target.value });
                      setErrors({ ...errors, type: "" });
                    }}
                    className={inp("type")}
                  >
                    <option value="">Select type</option>
                    {["Raw Material", "Finished Goods", "Packaging", "Cold Storage", "General"].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Location" required error={errors.location}>
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={form.location}
                    onChange={(e) => {
                      setForm({ ...form, location: e.target.value });
                      setErrors({ ...errors, location: "" });
                    }}
                    className={inp("location")}
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 border-t border-slate-100 px-6 py-4 dark:border-[#162033]">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#44a83e" }}
          >
            <Building2 className="h-4 w-4" />
            Add Godown
          </button>

          <button
            onClick={() => {
              setForm(initialForm);
              setErrors({});
            }}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#11182b]"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}