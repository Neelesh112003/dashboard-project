import { useState } from "react";
import { UserPlus, Eye, EyeOff, X } from "lucide-react";

function Field({ label, required, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {children}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}

export default function AddAdminForm({ onAdd, onClose }) {
  const initialForm = {
    fullName: "", email: "", department: "", contact: "",
    role: "", username: "", password: "", confirmPassword: "",
    remarks: "", status: "active",
  };

  const [form, setForm]                 = useState(initialForm);
  const [errors, setErrors]             = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [successMsg, setSuccessMsg]     = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())   e.fullName   = "Full name is required";
    if (!form.email.trim())      e.email      = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.department)        e.department = "Please select a department";
    if (!form.contact.trim())    e.contact    = "Contact number is required";
    else if (!/^[\d\s+\-()]{7,15}$/.test(form.contact)) e.contact = "Enter a valid contact number";
    if (!form.role)              e.role       = "Please select a role";
    if (!form.username.trim())   e.username   = "Username is required";
    else if (form.username.trim().length < 3) e.username = "Min. 3 characters";
    if (!form.password)          e.password   = "Password is required";
    else if (form.password.length < 8) e.password = "Min. 8 characters";
    if (!form.confirmPassword)   e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd?.({
      ...form,
      id: Date.now(),
      addedOn: new Date().toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric",
      }),
    });
    setForm(initialForm);
    setErrors({});
    setSuccessMsg(true);
    setTimeout(() => { setSuccessMsg(false); onClose?.(); }, 1500);
  };

  const inp = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 ${
      errors[field] ? "border-red-500" : "border-slate-200 dark:border-[#1b2740]"
    }`;

   

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
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
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                Admin account created successfully.
              </div>
            )}

            {/* Personal Information */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Personal Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Full Name" required error={errors.fullName}>
                  <input
                    type="text" placeholder="Enter full name" value={form.fullName}
                    onChange={(e) => { setForm({ ...form, fullName: e.target.value }); setErrors({ ...errors, fullName: "" }); }}
                    className={inp("fullName")}
                  />
                </Field>

                <Field label="Email Address" required error={errors.email}>
                  <input
                    type="email" placeholder="Enter email address" value={form.email}
                    onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                    className={inp("email")}
                  />
                </Field>

                <Field label="Department" required error={errors.department}>
                  <select
                    value={form.department}
                    onChange={(e) => { setForm({ ...form, department: e.target.value }); setErrors({ ...errors, department: "" }); }}
                    className={inp("department")}
                  >
                    <option value="">Select department</option>
                    {["Engineering","Human Resources","Finance","Marketing","Operations","Sales","IT & Security","Legal"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Contact Number" required error={errors.contact}>
                  <input
                    type="tel" placeholder="Enter contact number" value={form.contact}
                    onChange={(e) => { setForm({ ...form, contact: e.target.value }); setErrors({ ...errors, contact: "" }); }}
                    className={inp("contact")}
                  />
                </Field>
              </div>
            </div>

            {/* Account Details */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Account Details
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Role" required error={errors.role}>
                  <select
                    value={form.role}
                    onChange={(e) => { setForm({ ...form, role: e.target.value }); setErrors({ ...errors, role: "" }); }}
                    className={inp("role")}
                  >
                    <option value="">Select role</option>
                    {["Super Admin","Admin","Manager","Moderator"].map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Username" required error={errors.username}>
                  <input
                    type="text" placeholder="Enter username" value={form.username}
                    onChange={(e) => { setForm({ ...form, username: e.target.value }); setErrors({ ...errors, username: "" }); }}
                    className={inp("username")}
                  />
                </Field>

                <Field label="Password" required error={errors.password}>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters" value={form.password}
                      onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: "" }); }}
                      className={inp("password") + " pr-11"}
                    />
                    <button
                      type="button" onClick={() => setShowPassword(!showPassword)}
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
                      placeholder="Re-enter password" value={form.confirmPassword}
                      onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: "" }); }}
                      className={inp("confirmPassword") + " pr-11"}
                    />
                    <button
                      type="button" onClick={() => setShowConfirm(!showConfirm)}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Remarks">
                  <textarea
                    rows={3} placeholder="Any notes about this admin account..."
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-[#1b2740] px-4 py-2.5 text-sm outline-none bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 resize-none"
                  />
                </Field>

                <Field label="Status">
                  <div className="flex gap-3">
                    {["active", "inactive"].map((s) => (
                      <button
                        key={s} type="button"
                        onClick={() => setForm({ ...form, status: s })}
                        className={`flex-1 flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium capitalize transition-all ${
                          form.status === s
                            ? s === "active"
                              ? "border-green-300 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400"
                              : "border-red-300 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400"
                            : "border-slate-200 dark:border-[#1b2740] bg-slate-50 dark:bg-[#11182b] text-slate-500"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${
                          form.status === s
                            ? s === "active" ? "bg-green-500" : "bg-red-500"
                            : "bg-slate-300 dark:bg-slate-600"
                        }`} />
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
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
            <UserPlus className="h-4 w-4" />
            Create Admin
          </button>
          <button
            onClick={() => { setForm(initialForm); setErrors({}); }}
            className="rounded-xl border border-slate-200 dark:border-[#1b2740] px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#11182b] transition-all"
          >
            Reset
          </button>
        </div>

      </div>
    </div>
  );
}