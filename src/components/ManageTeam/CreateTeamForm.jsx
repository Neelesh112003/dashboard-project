import { useState } from "react";
import { Users, X, CheckCircle } from "lucide-react";

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

export default function CreateTeamForm({ onAdd, onClose, departments = [] }) {
  const initialForm = {
    teamName: "",
    department: "",
    teamLead: "",
    contact: "",
    workLocation: "",
    members: "",
    remarks: "",
    status: "active",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.teamName.trim()) e.teamName = "Team name is required";
    if (!form.department) e.department = "Please select a department";
    if (!form.teamLead.trim()) e.teamLead = "Team lead is required";
    if (!form.contact.trim()) e.contact = "Contact is required";
    if (!form.workLocation.trim()) e.workLocation = "Work location is required";
    if (!form.members.trim()) e.members = "Number of members is required";
    else if (isNaN(form.members) || Number(form.members) < 1) e.members = "Enter a valid number";
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
      members: Number(form.members),
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
            <Users className="h-5 w-5 text-white" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Create Team</h2>
            <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>
              Fill in the details to create a new team
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
            {successMsg && (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Team created successfully.
              </div>
            )}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Team Information
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Team Name" required error={errors.teamName}>
                  <input
                    type="text"
                    placeholder="Enter team name"
                    value={form.teamName}
                    onChange={(e) => {
                      setForm({ ...form, teamName: e.target.value });
                      setErrors({ ...errors, teamName: "" });
                    }}
                    className={inp("teamName")}
                  />
                </Field>

                <Field label="Department" required error={errors.department}>
                  <select
                    value={form.department}
                    onChange={(e) => {
                      setForm({ ...form, department: e.target.value });
                      setErrors({ ...errors, department: "" });
                    }}
                    className={inp("department")}
                  >
                    <option value="">Select department</option>
                    {departments.map((d) => (
                      <option key={d.id || d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Team Lead" required error={errors.teamLead}>
                  <input
                    type="text"
                    placeholder="Enter team lead name"
                    value={form.teamLead}
                    onChange={(e) => {
                      setForm({ ...form, teamLead: e.target.value });
                      setErrors({ ...errors, teamLead: "" });
                    }}
                    className={inp("teamLead")}
                  />
                </Field>

                <Field label="Contact" required error={errors.contact}>
                  <input
                    type="text"
                    placeholder="Enter contact number"
                    value={form.contact}
                    onChange={(e) => {
                      setForm({ ...form, contact: e.target.value });
                      setErrors({ ...errors, contact: "" });
                    }}
                    className={inp("contact")}
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

                <Field label="Members" required error={errors.members}>
                  <input
                    type="number"
                    placeholder="Enter number of members"
                    value={form.members}
                    onChange={(e) => {
                      setForm({ ...form, members: e.target.value });
                      setErrors({ ...errors, members: "" });
                    }}
                    className={inp("members")}
                  />
                </Field>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Additional Info
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Remarks">
                  <textarea
                    rows={3}
                    placeholder="Any notes about this team..."
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-[#1b2740] px-4 py-2.5 text-sm outline-none bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 resize-none"
                  />
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
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-[#162033] flex items-center gap-3 shrink-0">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#44a83e" }}
          >
            <Users className="h-4 w-4" />
            Create Team
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