import { X, Users, ShieldCheck, Briefcase } from "lucide-react";

export default function ViewAdmin({ admin, onClose }) {
  if (!admin) return null;

  const isActive = admin.status === "active";

  const fields = [
    { label: "Full Name",  value: admin.fullName   },
    { label: "Email",      value: admin.email      },
    { label: "Department", value: admin.department },
    { label: "Contact",    value: admin.contact    },
    { label: "Role",       value: admin.role       },
    { label: "Username",   value: admin.username   },
    { label: "Remarks",    value: admin.remarks    },
    { label: "Status",     value: admin.status     },
    { label: "Added On",   value: admin.addedOn    },
  ];

  const ROLE_META = {
  "Super Admin": { color: "#ef4444", bg: "rgba(239,68,68,0.1)",  icon: ShieldCheck },
  "Admin":       { color: "#3a3c44", bg: "rgba(58,60,68,0.1)",   icon: Users       },
  "Manager":     { color: "#2d6e2a", bg: "rgba(45,110,42,0.1)",  icon: Briefcase   },
  "Moderator":   { color: "#7c3aed", bg: "rgba(124,58,237,0.1)", icon: ShieldCheck },
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0d1528]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ backgroundColor: "#44a83e" }}>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg text-white"
              style={{ backgroundColor: "rgba(245,245,245,0.15)" }}
            >
              {admin.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">{admin.fullName}</h3>
              <p className="text-xs" style={{ color: "rgba(245,245,245,0.6)" }}>Admin Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-1">
          {fields.map(({ label, value }) => {
            const isRole   = label === "Role";
            const isStatus = label === "Status";
            const meta     = isRole ? (ROLE_META[value] ?? ROLE_META["Admin"]) : null;
            const RoleIcon = meta?.icon;

            return (
              <div
                key={label}
                className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-[#162033] last:border-0"
              >
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {label}
                </span>

                {isRole ? (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
                    style={{ backgroundColor: meta.bg, color: meta.color }}
                  >
                    <RoleIcon className="h-3.5 w-3.5" />
                    {value}
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
      </div>
    </div>
  );
}