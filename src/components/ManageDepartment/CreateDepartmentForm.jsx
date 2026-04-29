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

export default function CreateDepartmentForm({ onAdd, onClose }) {
  const initialForm = {
    name: "",
    workLocation: "",
    category: "",
    remarks: "",
    status: "active",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Department name is required";
    else if (form.name.trim().length < 2) e.name = "Min. 2 characters";

    if (!form.workLocation.trim()) e.workLocation = "Work location is required";
    if (!form.category) e.category = "Please select a category";

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

      <div className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0d1528] max-h-[90vh] flex flex-col">
        <div
          className="px-6 py-5 border-b border-slate-200 dark:border-[#162033] flex items-center gap-3 shrink-0"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(245,245,245,0.12)" }}
          >
            <Building2 className="h-5 w-5 text-white" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Create Department</h2>
            <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>
              Fill in the details to create a new department
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

        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6">
            {successMsg ? (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Department created successfully.
              </div>
            ) : null}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Department Information
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Department Name" required error={errors.name}>
                  <input
                    type="text"
                    placeholder="Enter department name"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      setErrors({ ...errors, name: "" });
                    }}
                    className={inp("name")}
                  />
                </Field>

                <Field label="Work Location" required error={errors.workLocation}>
                  <input
                    type="text"
                    placeholder="Enter work location"
                    value={form.workLocation}
                    onChange={(e) => {
                      setForm({ ...form, workLocation: e.target.value });
                      setErrors({ ...errors, workLocation: "" });
                    }}
                    className={inp("workLocation")}
                  />
                </Field>

                <Field label="Category" required error={errors.category}>
                  <select
                    value={form.category}
                    onChange={(e) => {
                      setForm({ ...form, category: e.target.value });
                      setErrors({ ...errors, category: "" });
                    }}
                    className={inp("category")}
                  >
                    <option value="">Select category</option>
                    {[
                      "Engineering",
                      "Human Resources",
                      "Finance",
                      "Marketing",
                      "Operations",
                      "Sales",
                      "IT & Security",
                      "Legal",
                      "Research & Development",
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Status">
                  <div className="flex gap-3">
                    {["active", "inactive"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setForm({ ...form, status: s })}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                          form.status === s
                            ? s === "active"
                              ? "border-green-300 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400"
                              : "border-red-300 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400"
                            : "border-slate-200 dark:border-[#1b2740] bg-slate-50 dark:bg-[#11182b] text-slate-500"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            form.status === s
                              ? s === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                              : "bg-slate-300 dark:bg-slate-600"
                          }`}
                        />
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Additional Info
              </p>

              <div className="grid grid-cols-1 gap-5">
                <Field label="Remarks">
                  <textarea
                    rows={3}
                    placeholder="Any notes about this department..."
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-[#1b2740] px-4 py-2.5 text-sm outline-none bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 resize-none"
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-[#162033] flex items-center gap-3 shrink-0">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#44a83e" }}
          >
            <Building2 className="h-4 w-4" />
            Create Department
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