import { useState, useEffect } from "react";
import { X, Users, ShieldCheck, Briefcase, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const ROLE_META = {
  super_admin: { color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: ShieldCheck, label: "Super Admin" },
  admin:       { color: "#3a3c44", bg: "rgba(58,60,68,0.1)",  icon: Users,       label: "Admin"       },
  user:        { color: "#2d6e2a", bg: "rgba(45,110,42,0.1)", icon: Briefcase,   label: "User"        },
};

export default function ViewAdmin({ admin, onClose, onEnrich }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!admin?.id) { setDetail(null); return; }

    const controller = new AbortController();

    const fetchDetail = async () => {
      setLoading(true);
      setError("");
      setDetail(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Session expired. Please log in again.");

        const res = await fetch(`${API_URL}/v1/users/${admin.id}`, {
          method: "GET",
          headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        let data = null;
        try { data = await res.json(); } catch { throw new Error("Unexpected response from server."); }

        if (!res.ok) throw new Error(data?.message || "Failed to fetch user details.");

        // Handle: { successvar:1, data: { data: {...} } } or { successvar:1, data: {...} }
        const user = data?.data?.data ?? data?.data ?? data;
        setDetail(user);

        // ✅ Push full details back up to AdminList so the row gets enriched
        onEnrich?.(user);
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Network error. Please check your connection.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchDetail();
    return () => controller.abort();
  }, [admin?.id]);

  if (!admin) return null;

  const d = detail ?? admin;
  const isActive = d.status === "active";
  const meta = ROLE_META[d.user_type] ?? ROLE_META.admin;
  const RoleIcon = meta.icon;

  const fields = [
    { label: "Full Name",   value: d.name },
    { label: "Email",       value: d.email },
    { label: "Username",    value: d.username },
    { label: "Contact",     value: d.contact },
    { label: "Department",  value: d.department_name },
    { label: "Designation", value: d.designation },
    { label: "City",        value: d.city },
    { label: "State",       value: d.state },
    { label: "Country",     value: d.country },
    { label: "Remarks",     value: d.remarks },
    { label: "Type",        value: d.user_type },
    { label: "Status",      value: d.status },
    {
      label: "Created By",
      value: d.created_by_username
        ? `${d.created_by_username} (${d.created_by_user_type ?? ""})`
        : null,
    },
    {
      label: "Created On",
      value: d.created_at
        ? new Date(d.created_at).toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric",
          })
        : null,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={!loading ? onClose : undefined}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0d1528]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ backgroundColor: "#44a83e" }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg text-white shrink-0"
              style={{ backgroundColor: "rgba(245,245,245,0.15)" }}
            >
              {(d.name || "?").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-base text-white truncate">
                {d.name || "Unknown User"}
              </h3>
              <p className="text-xs" style={{ color: "rgba(245,245,245,0.6)" }}>
                {d.username ? `@${d.username}` : "Admin Details"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          ) : (
            <div className="space-y-1">
              {fields.map(({ label, value }) => {
                const isType   = label === "Type";
                const isStatus = label === "Status";

                return (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 py-3 border-b border-slate-100 dark:border-[#162033] last:border-0"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
                      {label}
                    </span>

                    {isType ? (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
                        style={{ backgroundColor: meta.bg, color: meta.color }}
                      >
                        <RoleIcon className="h-3.5 w-3.5" />
                        {meta.label}
                      </span>
                    ) : isStatus ? (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
                        style={{
                          backgroundColor: isActive ? "rgba(45,110,42,0.1)" : "rgba(239,68,68,0.1)",
                          color: isActive ? "#2d6e2a" : "#ef4444",
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: isActive ? "#2d6e2a" : "#ef4444" }}
                        />
                        {isActive ? "Active" : "Inactive"}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-right max-w-[60%] wrap-break-word">
                        {value || "—"}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}