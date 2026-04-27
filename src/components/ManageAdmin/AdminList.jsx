import { useState } from "react";
import { Eye, Trash2, Users, ShieldCheck, Briefcase, X } from "lucide-react";

const ROLE_META = {
  "Super Admin": { color: "#ef4444", bg: "rgba(239,68,68,0.1)",  icon: ShieldCheck },
  "Admin":       { color: "#3a3c44", bg: "rgba(58,60,68,0.1)",   icon: Users       },
  "Manager":     { color: "#2d6e2a", bg: "rgba(45,110,42,0.1)",  icon: Briefcase   },
};



export default function AdminList({ admins, onDelete }) {
  const [viewAdmin, setViewAdmin] = useState(null);

  if (!admins.length) return null;

  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-[#162033] bg-white dark:bg-[#0d1528] overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-[#162033]" style={{ backgroundColor: "#3a3c44" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(245,245,245,0.12)" }}>
              <Users className="h-5 w-5" style={{ color: "#f5f5f5" }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: "#f5f5f5" }}>Admin List</h2>
              <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>{admins.length} member{admins.length !== 1 ? "s" : ""} registered</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-[#162033]">
                {["Name", "Role", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
              {admins.map((admin) => {
                const meta = ROLE_META[admin.role];
                const RoleIcon = meta.icon;
                return (
                  <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-[#11182b] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-bold shrink-0"
                          style={{ backgroundColor: "#3a3c44" }}>
                          {admin.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-100">{admin.fullName}</p>
                          <p className="text-xs text-slate-400">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
                        style={{ backgroundColor: meta.bg, color: meta.color }}>
                        <RoleIcon className="h-3.5 w-3.5" />
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
                        style={{ backgroundColor: "rgba(45,110,42,0.1)", color: "#2d6e2a" }}>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2d6e2a]" />
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewAdmin(admin)}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#1b2740] px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#11182b] transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => onDelete(admin.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900/40 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {viewAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
          onClick={() => setViewAdmin(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
            style={{ backgroundColor: "#fff" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-5" style={{ backgroundColor: "#3a3c44" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full text-white font-bold text-lg"
                  style={{ backgroundColor: "rgba(245,245,245,0.15)" }}>
                  {viewAdmin.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-base" style={{ color: "#f5f5f5" }}>{viewAdmin.fullName}</h3>
                  <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>Admin Details</p>
                </div>
              </div>
              <button
                onClick={() => setViewAdmin(null)}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                style={{ color: "#f5f5f5" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(245,245,245,0.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 bg-white dark:bg-[#0d1528]">
              {[
                { label: "Full Name",     value: viewAdmin.fullName },
                { label: "Email Address", value: viewAdmin.email    },
                { label: "Role",          value: viewAdmin.role     },
                { label: "Status",        value: viewAdmin.status   },
                { label: "Added On",      value: viewAdmin.addedOn  },
              ].map(({ label, value }) => {
                const isRole   = label === "Role";
                const isStatus = label === "Status";
                const meta     = isRole ? ROLE_META[value] : null;
                const RoleIcon = meta?.icon;
                return (
                  <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-[#162033] last:border-0">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</span>
                    {isRole ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
                        style={{ backgroundColor: meta.bg, color: meta.color }}>
                        <RoleIcon className="h-3.5 w-3.5" />
                        {value}
                      </span>
                    ) : isStatus ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
                        style={{ backgroundColor: "rgba(45,110,42,0.1)", color: "#2d6e2a" }}>
                        <span className="h-1.5 w-1.5 rounded-full bg-[#2d6e2a]" />
                        {value}
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}