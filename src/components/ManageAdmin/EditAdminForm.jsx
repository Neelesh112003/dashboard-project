import { useEffect, useState } from "react";
import { Pencil, Eye, EyeOff, X, Save } from "lucide-react";

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

const FIELD_KEY_MAP = {
  username: "username",
  email: "email",
  name: "name",
  password: "password",
  contact: "contact",
  department_id: "department_id",
  designation: "designation",
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
      (httpStatus === 401
        ? "Session expired. Please log in again."
        : httpStatus === 409
        ? "Username or email already exists."
        : "Failed to update user.");
  }

  return { fieldErrors, globalError };
}

export default function EditAdminForm({ admin, onUpdate, onClose }) {
  const initialForm = {
    name: admin?.name || "",
    email: admin?.email || "",
    username: admin?.username || "",
    password: "",
    confirmPassword: "",
    contact: admin?.contact || "",
    department_id: admin?.department_id ? String(admin.department_id) : "",
    designation: admin?.designation || "",
    remarks: admin?.remarks || "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const clearFieldError = (field) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    clearFieldError(field);
    setGlobalError("");
  };

  /* ── Fetch departments ── */
  useEffect(() => {
    const controller = new AbortController();

    const fetchDepartments = async () => {
      setDeptLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) { setGlobalError("Session expired."); return; }

        const res = await fetch(`${API_URL}/v1/departments`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to fetch departments.");

        const deptList = Array.isArray(data?.data?.data)
          ? data.data.data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setDepartments(deptList);
      } catch (err) {
        if (err.name === "AbortError") return;
        setDepartments([]);
      } finally {
        setDeptLoading(false);
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
      e.email = "Enter a valid email";
    }

    if (!form.username.trim()) {
      e.username = "Username is required";
    } else if (form.username.trim().length < 5) {
      e.username = "Minimum 5 characters";
    } else if (form.username.trim().length > 15) {
      e.username = "Maximum 15 characters";
    }

    if (changePassword) {
      if (!form.password) {
        e.password = "Password is required";
      } else if (form.password.length < 8) {
        e.password = "Minimum 8 characters";
      }

      if (!form.confirmPassword) {
        e.confirmPassword = "Please confirm password";
      } else if (form.password !== form.confirmPassword) {
        e.confirmPassword = "Passwords do not match";
      }
    }

    if (form.contact && !/^\d{10}$/.test(form.contact.trim())) {
      e.contact = "Enter a valid 10-digit number";
    }

    return e;
  };

  const handleSave = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) { setGlobalError("Session expired. Please login again."); return; }

    setLoading(true);
    setGlobalError("");
    setSuccessMsg(false);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        contact: form.contact.trim(),
        department_id: form.department_id || null,
        designation: form.designation.trim(),
        remarks: form.remarks.trim(),
      };

      if (changePassword && form.password) {
        payload.password = form.password;
        payload.password_confirmation = form.confirmPassword;
      }

      const res = await fetch(`${API_URL}/v1/users/${admin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        const { fieldErrors, globalError: gErr } = parseApiError(data, res.status);
        if (Object.keys(fieldErrors).length) setErrors((prev) => ({ ...prev, ...fieldErrors }));
        setGlobalError(gErr || "Failed to update user.");
        return;
      }

      setSuccessMsg(true);
      onUpdate?.(data?.data ?? { ...admin, ...payload });

      setTimeout(() => {
        setSuccessMsg(false);
        onClose?.();
      }, 1400);
    } catch (err) {
      setGlobalError(err.message || "Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const inp = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 ${
      errors[field]
        ? "border-red-500 focus:ring-2 focus:ring-red-200"
        : "border-slate-200 dark:border-[#1b2740] focus:border-[#44a83e] focus:ring-2 focus:ring-[#44a83e]/20"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!loading ? onClose : undefined}
      />

      <div className="relative z-10 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0d1528] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-[#44a83e] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Pencil className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-white text-lg font-semibold">Edit User</h2>
              <p className="text-xs text-blue-200">Updating: {admin?.name || "—"}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Full Name" required error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter full name"
                className={inp("name")}
              />
            </Field>

            <Field label="Email" required error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Enter email"
                className={inp("email")}
              />
            </Field>

            <Field label="Username" required error={errors.username}>
              <input
                type="text"
                value={form.username}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="Username"
                className={inp("username")}
              />
            </Field>

            <Field label="Contact" error={errors.contact}>
              <input
                type="tel"
                value={form.contact}
                onChange={(e) =>
                  handleChange("contact", e.target.value.replace(/[^\d]/g, "").slice(0, 10))
                }
                placeholder="10-digit number"
                className={inp("contact")}
              />
            </Field>

            <Field label="Department" error={errors.department_id}>
              <select
                value={form.department_id}
                onChange={(e) => {
                  handleChange("department_id", e.target.value);
                }}
                className={inp("department_id")}
                disabled={deptLoading}
              >
                <option value="">
                  {deptLoading ? "Loading departments..." : "Select Department"}
                </option>
                {departments.map((dept) => (
                  <option key={dept.id} value={String(dept.id)}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Designation" error={errors.designation}>
              <input
                type="text"
                value={form.designation}
                onChange={(e) => handleChange("designation", e.target.value)}
                placeholder="Enter designation"
                className={inp("designation")}
              />
            </Field>
          </div>

          {/* Change password toggle */}
          <div className="rounded-xl border border-slate-200 dark:border-[#1b2740] overflow-hidden">
            <button
              type="button"
              onClick={() => {
                setChangePassword((p) => !p);
                if (changePassword) {
                  handleChange("password", "");
                  handleChange("confirmPassword", "");
                  setErrors((prev) => ({ ...prev, password: "", confirmPassword: "" }));
                }
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#11182b] hover:bg-slate-100 dark:hover:bg-[#162033] transition-colors"
            >
              <span>Change Password</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium transition-colors ${
                  changePassword
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-slate-200 text-slate-500 dark:bg-[#1b2740] dark:text-slate-500"
                }`}
              >
                {changePassword ? "Enabled" : "Disabled"}
              </span>
            </button>

            {changePassword && (
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-[#0d1528]">
                <Field label="New Password" required error={errors.password}>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="New password"
                      className={inp("password") + " pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </Field>

                <Field label="Confirm Password" required error={errors.confirmPassword}>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      placeholder="Confirm new password"
                      className={inp("confirmPassword") + " pr-10"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                  </div>
                </Field>
              </div>
            )}
          </div>

          <Field label="Remarks">
            <textarea
              rows={3}
              value={form.remarks}
              onChange={(e) => handleChange("remarks", e.target.value)}
              placeholder="Remarks..."
              className="w-full rounded-xl border border-slate-200 dark:border-[#1b2740] px-4 py-2.5 text-sm outline-none bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 resize-none focus:border-[#2d5da8] focus:ring-2 focus:ring-[#2d5da8]/20 transition-all"
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-[#162033] space-y-3">
          {successMsg && (
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
              User updated successfully.
            </div>
          )}

          {globalError && (
            <div className="text-sm text-red-500">{globalError}</div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-[#44a83e] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={onClose}
              disabled={loading}
              className="border border-slate-300 dark:border-[#1b2740] px-5 py-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#11182b] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}