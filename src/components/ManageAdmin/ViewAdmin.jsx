import {
  X,
  Users,
  ShieldCheck,
  Briefcase,
} from "lucide-react";

const ROLE_META = {
  super_admin: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    icon: ShieldCheck,
    label: "Super Admin",
  },

  admin: {
    color: "#3a3c44",
    bg: "rgba(58,60,68,0.1)",
    icon: Users,
    label: "Admin",
  },

  user: {
    color: "#2d6e2a",
    bg: "rgba(45,110,42,0.1)",
    icon: Briefcase,
    label: "User",
  },
};

export default function ViewAdmin({
  admin,
  onClose,
}) {
  if (!admin) return null;

  const role =
    admin.type ||
    admin.user_type ||
    "admin";

  const meta =
    ROLE_META[role] ||
    ROLE_META.admin;

  const RoleIcon = meta.icon;

  const isActive =
    admin.status === "active";

  const fields = [
    {
      label: "Full Name",
      value: admin.name,
    },

    {
      label: "Email",
      value: admin.email,
    },

    {
      label: "Username",
      value: admin.username,
    },

    {
      label: "Contact",
      value: admin.contact,
    },

    {
      label: "Designation",
      value: admin.designation,
    },

    {
      label: "Department",
      value:
        admin.department
          ?.department_name,
    },

    {
      label: "Remarks",
      value: admin.remarks,
    },

    {
      label: "Created On",
      value: admin.created_at
        ? new Date(
            admin.created_at
          ).toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          )
        : null,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor:
          "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0d1528]"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{
            backgroundColor: "#44a83e",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white font-bold"
              style={{
                backgroundColor:
                  "rgba(255,255,255,0.2)",
              }}
            >
              {(admin.name || "?")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <h2 className="text-white font-semibold">
                {admin.name}
              </h2>

              <p className="text-xs text-white/70">
                @{admin.username}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-semibold uppercase text-slate-400">
                Type
              </span>

              <span
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor:
                    meta.bg,
                  color: meta.color,
                }}
              >
                <RoleIcon className="h-3.5 w-3.5" />

                {meta.label}
              </span>
            </div>

            <div className="flex items-center justify-between border-b pb-3">
              <span className="text-xs font-semibold uppercase text-slate-400">
                Status
              </span>

              <span
                className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-semibold"
                style={{
                  backgroundColor:
                    isActive
                      ? "rgba(45,110,42,0.1)"
                      : "rgba(239,68,68,0.1)",

                  color: isActive
                    ? "#2d6e2a"
                    : "#ef4444",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor:
                      isActive
                        ? "#2d6e2a"
                        : "#ef4444",
                  }}
                />

                {isActive
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>

            {fields.map((item) => (
              <div
                key={item.label}
                className="flex items-start justify-between gap-4 border-b pb-3"
              >
                <span className="text-xs font-semibold uppercase text-slate-400">
                  {item.label}
                </span>

                <span className="text-sm text-right break-words max-w-[60%] text-slate-700 dark:text-slate-200">
                  {item.value || "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}