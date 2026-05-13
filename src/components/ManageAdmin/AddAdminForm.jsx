import { useEffect, useState } from "react";
import { UserPlus, Eye, EyeOff, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

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

export default function AddAdminForm({ onAdd, onClose }) {
  const initialForm = {
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    contact: "",
    department_id: "",
    department_name: "",
    department_code: "",
    designation: "",
    remarks: "",
    type: "admin",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);

  const clearFieldError = (field) => setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
    setApiError("");
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchDepartments = async () => {
      setDeptLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) { setApiError("Session expired. Please log in again."); return; }

        const res = await fetch(`${API_URL}/v1/departments`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          signal: controller.signal,
        });

        let data = null;
        try { data = await res.json(); } catch { throw new Error("Invalid departments response."); }

        if (!res.ok) throw new Error(data?.message || "Failed to load departments.");

        // Paginated response: { successvar:1, data: { data: [...] } }
        const deptList =
          Array.isArray(data?.data?.data) ? data.data.data :
          Array.isArray(data?.data) ? data.data :
          Array.isArray(data) ? data : [];

        setDepartments(deptList);
      } catch (error) {
        if (error.name === "AbortError") return;
        setDepartments([]);
        setApiError(error.message || "Unable to fetch departments.");
      } finally {
        if (!controller.signal.aborted) setDeptLoading(false);
      }
    };

    fetchDepartments();
    return () => controller.abort();
  }, []);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Full name is required";

    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Enter a valid email address";
    }

    if (!form.username.trim()) {
      e.username = "Username is required";
    } else if (form.username.trim().length < 5) {
      e.username = "Min. 5 characters";
    } else if (form.username.trim().length > 15) {
      e.username = "Max. 15 characters";
    }

    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 8) {
      e.password = "Min. 8 characters";
    }

    if (!form.confirmPassword) {
      e.confirmPassword = "Please confirm your password";
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    if (form.contact && !/^\d{10}$/.test(form.contact.trim())) {
      e.contact = "Enter a valid 10-digit number";
    }

    return e;
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setApiError("");
    setShowPassword(false);
    setShowConfirm(false);
  };

  const handleDepartmentChange = (value) => {
    // Use department_name and department_code from schema
    const dept = departments.find((d) => String(d.id) === value);

    setForm((prev) => ({
      ...prev,
      department_id: value,
      department_name: dept?.department_name ?? "",
      department_code: dept?.department_code ?? "",
    }));

    clearFieldError("department_id");
    setApiError("");
  };

  const handleAdd = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) { setApiError("Session expired. Please log in again."); return; }

    setLoading(true);
    setApiError("");

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        contact: form.contact.trim() || undefined,
        department_id: form.department_id || undefined,
        department_name: form.department_name || undefined,
        department_code: form.department_code || undefined,
        designation: form.designation.trim() || undefined,
        remarks: form.remarks.trim() || undefined,
        type: form.type,
      };

      const response = await fetch(`${API_URL}/v1/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try { data = await response.json(); } catch { throw new Error("Unexpected response from server."); }

      if (!response.ok) {
        const msg =
          data?.message ||
          (data?.validatorerror
            ? Object.values(data.validatorerror).flat().join(" ")
            : data?.errors
            ? Object.values(data.errors).flat().join(" ")
            : "Failed to create admin.");
        throw new Error(msg);
      }

      onAdd?.(data);
      resetForm();
      setSuccessMsg(true);

      setTimeout(() => {
        setSuccessMsg(false);
        onClose?.();
      }, 1500);
    } catch (error) {
      setApiError(error.message || "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
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
        onClick={!loading ? onClose : undefined}
      />

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
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Create Admin</h2>
            <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>
              Fill in the details to create an admin account
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6">
            {successMsg && (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Admin account created successfully.
              </div>
            )}

            {apiError && (
              <div className="rounded-xl border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {apiError}
              </div>
            )}

            {/* Personal Information */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Personal Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Full Name" required error={errors.name}>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={inp("name")}
                  />
                </Field>

                <Field label="Email Address" required error={errors.email}>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={inp("email")}
                  />
                </Field>

                <Field label="Department" error={errors.department_id}>
                  <select
                    value={form.department_id}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className={inp("department_id")}
                    disabled={deptLoading}
                  >
                    <option value="">
                      {deptLoading ? "Loading departments..." : "Select department"}
                    </option>
                    {departments.map((d) => (
                      <option key={d.id} value={String(d.id)}>
                        {d.department_name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Contact Number" error={errors.contact}>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={form.contact}
                    onChange={(e) =>
                      handleChange("contact", e.target.value.replace(/[^\d]/g, "").slice(0, 10))
                    }
                    className={inp("contact")}
                    maxLength={10}
                  />
                </Field>

                <Field label="Designation">
                  <input
                    type="text"
                    placeholder="Enter designation"
                    value={form.designation}
                    onChange={(e) => handleChange("designation", e.target.value)}
                    className={inp("designation")}
                  />
                </Field>

                <Field label="Type" required>
                  <select
                    value={form.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className={inp("type")}
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* Account Details */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Account Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Username" required error={errors.username}>
                  <input
                    type="text"
                    placeholder="5–15 characters"
                    value={form.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    className={inp("username")}
                  />
                </Field>

                <Field label="Password" required error={errors.password}>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className={inp("password") + " pr-11"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>

                <Field label="Confirm Password" required error={errors.confirmPassword}>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      className={inp("confirmPassword") + " pr-11"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Additional Info
              </p>
              <div className="grid grid-cols-1 gap-5">
                <Field label="Remarks">
                  <textarea
                    rows={3}
                    placeholder="Any notes about this admin account..."
                    value={form.remarks}
                    onChange={(e) => handleChange("remarks", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-[#1b2740] px-4 py-2.5 text-sm outline-none bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 resize-none"
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
            disabled={loading}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#44a83e" }}
          >
            <UserPlus className="h-4 w-4" />
            {loading ? "Creating..." : "Create Admin"}
          </button>

          <button
            onClick={resetForm}
            disabled={loading}
            className="rounded-xl border border-slate-200 dark:border-[#1b2740] px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#11182b] transition-all disabled:opacity-60"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}