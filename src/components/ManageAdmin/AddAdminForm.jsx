import { useState } from "react";
import { UserPlus } from "lucide-react";

export default function AddAdminForm({ onAdd }) {
  const [form, setForm] = useState({ fullName: "", email: "", role: "Admin" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email address";
    return e;
  };

  const handleAdd = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onAdd({
      ...form,
      id: Date.now(),
      status: "Active",
      addedOn: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    });
    setForm({ fullName: "", email: "", role: "Admin" });
    setErrors({});
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[#162033] bg-white dark:bg-[#0d1528] overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-[#162033]" style={{ backgroundColor: "#3a3c44" }}>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(245,245,245,0.12)" }}>
            <UserPlus className="h-5 w-5" style={{ color: "#f5f5f5" }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: "#f5f5f5" }}>Add New Admin</h2>
            <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>Fill in the details to create an admin account</p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name</label>
          <input
            type="text"
            placeholder="Enter Your Full Name"
            value={form.fullName}
            onChange={(e) => { setForm({ ...form, fullName: e.target.value }); setErrors({ ...errors, fullName: "" }); }}
            className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            style={{ borderColor: errors.fullName ? "#ef4444" : "" }}
          />
          {errors.fullName && <p className="text-xs text-red-500">{errors.fullName}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address</label>
          <input
            type="email"
            placeholder="Enter Your Email Address"
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
            className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            style={{ borderColor: errors.email ? "#ef4444" : "" }}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role</label>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-xl border border-slate-200 dark:border-[#1b2740] px-4 py-2.5 text-sm outline-none bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100"
          >
            <option>Super Admin</option>
            <option>Admin</option>
            <option>Manager</option>
          </select>
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#44a83e" }}
        >
          <UserPlus className="h-4 w-4" />
          Add Admin
        </button>
      </div>
    </div>
  );
}