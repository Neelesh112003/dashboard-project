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
      const msgs = Array.isArray(messages)
        ? messages
        : [String(messages)];

      const formKey = FIELD_KEY_MAP[key];

      if (formKey) {
        fieldErrors[formKey] = msgs[0];
      } else {
        globalError =
          (globalError ? globalError + " " : "") + msgs[0];
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
        : "Failed to create admin.");
  }

  return { fieldErrors, globalError };
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
    designation: "",
    remarks: "",
    type: "admin",
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

  const clearFieldError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    clearFieldError(field);
    setGlobalError("");
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchDepartments = async () => {
      setDeptLoading(true);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setGlobalError("Session expired. Please login again.");
          return;
        }

        const response = await fetch(
          `${API_URL}/v1/departments`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        console.log("DEPARTMENT RESPONSE:", data);

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch departments."
          );
        }

        const deptList = Array.isArray(data?.data?.data)
          ? data.data.data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setDepartments(deptList);
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error(error);

        setDepartments([]);

        setGlobalError(
          error.message || "Unable to fetch departments."
        );
      } finally {
        setDeptLoading(false);
      }
    };

    fetchDepartments();

    return () => controller.abort();
  }, []);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) {
      e.name = "Full name is required";
    }

    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      e.email = "Enter valid email";
    }

    if (!form.username.trim()) {
      e.username = "Username is required";
    } else if (form.username.trim().length < 5) {
      e.username = "Minimum 5 characters";
    } else if (form.username.trim().length > 15) {
      e.username = "Maximum 15 characters";
    }

    if (!form.password) {
      e.password = "Password is required";
    } else if (form.password.length < 8) {
      e.password = "Minimum 8 characters";
    }

    if (!form.confirmPassword) {
      e.confirmPassword = "Confirm password";
    } else if (form.password !== form.confirmPassword) {
      e.confirmPassword = "Passwords do not match";
    }

    if (
      form.contact &&
      !/^\d{10}$/.test(form.contact.trim())
    ) {
      e.contact = "Enter valid 10 digit number";
    }

    return e;
  };

  const resetForm = () => {
    setForm(initialForm);
    setErrors({});
    setGlobalError("");
    setSuccessMsg(false);
    setShowPassword(false);
    setShowConfirm(false);
  };

  const handleDepartmentChange = (value) => {
    setForm((prev) => ({
      ...prev,
      department_id: value,
    }));

    clearFieldError("department_id");
    setGlobalError("");
  };

  const handleAdd = async () => {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setGlobalError("Session expired. Please login again.");
      return;
    }

    setLoading(true);
    setGlobalError("");
    setSuccessMsg(false);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        username: form.username.trim(),
        password: form.password,
        password_confirmation: form.confirmPassword,
        contact: form.contact.trim(),
        department_id: form.department_id || null,
        designation: form.designation.trim(),
        remarks: form.remarks.trim(),
        type: form.type,
      };

      console.log("PAYLOAD:", payload);

      const response = await fetch(`${API_URL}/v1/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log("CREATE USER RESPONSE:", data);

      if (!response.ok) {
        const { fieldErrors, globalError: gErr } =
          parseApiError(data, response.status);

        if (Object.keys(fieldErrors).length) {
          setErrors((prev) => ({
            ...prev,
            ...fieldErrors,
          }));
        }

        setGlobalError(gErr || "Failed to create admin.");

        return;
      }

      setSuccessMsg(true);

      onAdd?.(data?.data);

      resetForm();

      setTimeout(() => {
        setSuccessMsg(false);
        onClose?.();
      }, 1500);
    } catch (error) {
      console.error(error);

      setGlobalError(
        error.message ||
          "Network error. Please check your connection."
      );
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
        <div className="px-6 py-5 bg-[#3a3c44] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-white text-lg font-semibold">
                Create User
              </h2>

              <p className="text-xs text-slate-300">
                Fill details to create user account
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-white hover:bg-white/10 p-2 rounded-lg"
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
                onChange={(e) =>
                  handleChange("name", e.target.value)
                }
                placeholder="Enter full name"
                className={inp("name")}
              />
            </Field>

            <Field label="Email" required error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  handleChange("email", e.target.value)
                }
                placeholder="Enter email"
                className={inp("email")}
              />
            </Field>

            <Field
              label="Department"
              error={errors.department_id}
            >
              <select
                value={form.department_id}
                onChange={(e) =>
                  handleDepartmentChange(e.target.value)
                }
                className={inp("department_id")}
                disabled={deptLoading}
              >
                <option value="">
                  {deptLoading
                    ? "Loading departments..."
                    : "Select Department"}
                </option>

                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Contact" error={errors.contact}>
              <input
                type="tel"
                value={form.contact}
                onChange={(e) =>
                  handleChange(
                    "contact",
                    e.target.value
                      .replace(/[^\d]/g, "")
                      .slice(0, 10)
                  )
                }
                placeholder="10 digit number"
                className={inp("contact")}
              />
            </Field>

            <Field
              label="Designation"
              error={errors.designation}
            >
              <input
                type="text"
                value={form.designation}
                onChange={(e) =>
                  handleChange(
                    "designation",
                    e.target.value
                  )
                }
                placeholder="Enter designation"
                className={inp("designation")}
              />
            </Field>

            <Field label="Type" required>
              <select
                value={form.type}
                onChange={(e) =>
                  handleChange("type", e.target.value)
                }
                className={inp("type")}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </Field>

            <Field
              label="Username"
              required
              error={errors.username}
            >
              <input
                type="text"
                value={form.username}
                onChange={(e) =>
                  handleChange("username", e.target.value)
                }
                placeholder="Username"
                className={inp("username")}
              />
            </Field>

            <Field
              label="Password"
              required
              error={errors.password}
            >
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                  placeholder="Password"
                  className={inp("password") + " pr-10"}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
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

            <Field
              label="Confirm Password"
              required
              error={errors.confirmPassword}
            >
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange(
                      "confirmPassword",
                      e.target.value
                    )
                  }
                  placeholder="Confirm Password"
                  className={inp("confirmPassword") + " pr-10"}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm((prev) => !prev)
                  }
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

          <Field label="Remarks">
            <textarea
              rows={3}
              value={form.remarks}
              onChange={(e) =>
                handleChange("remarks", e.target.value)
              }
              placeholder="Remarks..."
              className="w-full rounded-xl border border-slate-200 dark:border-[#1b2740] px-4 py-2.5 text-sm outline-none bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 resize-none"
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-[#162033] space-y-3">
          {successMsg && (
            <div className="text-sm text-green-600">
              Admin created successfully.
            </div>
          )}

          {globalError && (
            <div className="text-sm text-red-500">
              {globalError}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={loading}
              className="bg-[#44a83e] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create User"}
            </button>

            <button
              onClick={resetForm}
              disabled={loading}
              className="border border-slate-300 px-5 py-2.5 rounded-xl text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}