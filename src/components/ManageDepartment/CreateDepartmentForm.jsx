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

const FIELD_KEY_MAP = {
  department_code: "department_code",
  department_name: "department_name",
  work_location: "work_location",
  category: "category",
  department_head_name: "department_head_name",
  remarks: "remarks",
  department_status: "department_status",
};

function parseApiError(data, httpStatus) {
  const fieldErrors = {};
  let globalError = null;

  const errorBag = data?.errors ?? data?.validatorerror ?? null;

  if (errorBag && typeof errorBag === "object") {
    Object.entries(errorBag).forEach(([key, messages]) => {
      const msgs = Array.isArray(messages) ? messages : [String(messages)];
      const formKey = FIELD_KEY_MAP[key];

      if (formKey) {
        fieldErrors[formKey] = msgs[0];
      } else {
        globalError = (globalError ? globalError + " " : "") + msgs[0];
      }
    });
  }

  if (!Object.keys(fieldErrors).length && !globalError) {
    globalError =
      data?.message ||
      (httpStatus === 409
        ? "A conflict occurred. This department code or name may already exist."
        : httpStatus === 500
        ? "Server error. Please check your input and try again."
        : "Failed to create department. Please try again.");
  }

  return { fieldErrors, globalError };
}

export default function CreateDepartmentForm({ onAdd, onClose }) {
  const initialForm = {
    department_code: "",
    department_name: "",
    work_location: "",
    category: "",
    department_head_name: "",
    remarks: "",
    department_status: "active",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const clearFieldError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
    setGlobalError("");
  };

  const validate = () => {
    const e = {};
    if (!form.department_code.trim()) e.department_code = "Department code is required";
    if (!form.department_name.trim()) e.department_name = "Department name is required";
    else if (form.department_name.trim().length < 2) e.department_name = "Min. 2 characters";
    if (!form.work_location.trim()) e.work_location = "Work location is required";
    if (!form.category) e.category = "Please select a category";
    return e;
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setGlobalError("");
    setSuccessMsg(false);
  };

  const handleAdd = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);
    setGlobalError("");
    setSuccessMsg(false);

    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_API_URL;

      const payload = {
        department_code: form.department_code.trim(),
        department_name: form.department_name.trim(),
        work_location: form.work_location.trim(),
        category: form.category,
        department_status: form.department_status,
      };

      if (form.department_head_name.trim()) {
        payload.department_head_name = form.department_head_name.trim();
      }

      if (form.remarks.trim()) {
        payload.remarks = form.remarks.trim();
      }

      const response = await fetch(`${baseUrl}/v1/departments/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {}

      if (!response.ok) {
        const { fieldErrors, globalError: gErr } = parseApiError(data, response.status);

        if (Object.keys(fieldErrors).length) {
          setErrors((prev) => ({ ...prev, ...fieldErrors }));
        }

        if (gErr) setGlobalError(gErr);
        return;
      }

      if (typeof onAdd === "function") {
        await onAdd(data);
      }

      resetForm();
      setSuccessMsg(true);

      setTimeout(() => {
        setSuccessMsg(false);
        onClose?.();
      }, 1200);
    } catch {
      setGlobalError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const inp = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 ${
      errors[field]
        ? "border-red-500 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-900"
        : "border-slate-200 dark:border-[#1b2740] focus:border-[#44a83e] focus:ring-2 focus:ring-[#44a83e]/20"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={!loading ? onClose : undefined}
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
            <h2 className="text-lg font-semibold text-white">Create Department</h2>
            <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>
              Fill in the details to create a new department
            </p>
          </div>

          <button
            type="button"
            onClick={!loading ? onClose : undefined}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            <div>
              <p className="mb-4 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-[#162033]">
                Department Information
              </p>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Department Code" required error={errors.department_code}>
                  <input
                    type="text"
                    placeholder="e.g. DPT-001"
                    value={form.department_code}
                    onChange={(e) => handleChange("department_code", e.target.value)}
                    className={inp("department_code")}
                    disabled={loading}
                  />
                </Field>

                <Field label="Department Name" required error={errors.department_name}>
                  <input
                    type="text"
                    placeholder="Enter department name"
                    value={form.department_name}
                    onChange={(e) => handleChange("department_name", e.target.value)}
                    className={inp("department_name")}
                    disabled={loading}
                  />
                </Field>

                <Field label="Work Location" required error={errors.work_location}>
                  <input
                    type="text"
                    placeholder="Enter work location"
                    value={form.work_location}
                    onChange={(e) => handleChange("work_location", e.target.value)}
                    className={inp("work_location")}
                    disabled={loading}
                  />
                </Field>

                <Field label="Category" required error={errors.category}>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className={inp("category")}
                    disabled={loading}
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
                        onClick={() => handleChange("department_status", s)}
                        disabled={loading}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                          form.department_status === s
                            ? s === "active"
                              ? "border-green-300 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : "border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/20 dark:text-red-400"
                            : "border-slate-200 bg-slate-50 text-slate-500 dark:border-[#1b2740] dark:bg-[#11182b]"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            form.department_status === s
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
              <p className="mb-4 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:border-[#162033]">
                Additional Info
              </p>

              <div className="grid grid-cols-1 gap-5">
                <Field label="Department Head Name" error={errors.department_head_name}>
                  <input
                    type="text"
                    placeholder="Enter department head name"
                    value={form.department_head_name}
                    onChange={(e) => handleChange("department_head_name", e.target.value)}
                    className={inp("department_head_name")}
                    disabled={loading}
                  />
                </Field>

                <Field label="Remarks" error={errors.remarks}>
                  <textarea
                    rows={3}
                    placeholder="Any notes about this department..."
                    value={form.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#44a83e] focus:ring-2 focus:ring-[#44a83e]/20 dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-100"
                    disabled={loading}
                  />
                </Field>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 border-t border-slate-100 px-6 pt-3 pb-4 dark:border-[#162033]">
          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Department created successfully.
            </div>
          )}

          {globalError && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              <svg
                className="mt-0.5 h-4 w-4 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {globalError}
            </div>
          )}

          {!globalError && !successMsg && Object.values(errors).some(Boolean) && (
            <p className="pl-1 text-xs text-red-500">
              Please fix the highlighted fields above before submitting.
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "#44a83e" }}
            >
              <Building2 className="h-4 w-4" />
              {loading ? "Creating…" : "Create Department"}
            </button>

            <button
              onClick={resetForm}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#11182b] disabled:opacity-60"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}