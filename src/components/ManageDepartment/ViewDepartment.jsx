import {
  X,
  Building2,
  MapPin,
  Tag,
  UserCircle,
} from "lucide-react";

export default function ViewDepartment({ department, onClose }) {
  if (!department) return null;

  const isActive = department.status === "active";

  const fields = [
    { label: "Department Name", value: department.name },
    { label: "Work Location", value: department.workLocation },
    { label: "Category", value: department.category },
    { label: "Department Head", value: department.departmentHead },
    { label: "Remarks", value: department.remarks },
    { label: "Status", value: department.status },
    { label: "Created On", value: department.createdOn },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0d1528]"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ backgroundColor: "#44a83e" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: "rgba(245,245,245,0.15)" }}
            >
              {department.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {department.name}
              </h3>
              <p className="text-xs" style={{ color: "rgba(245,245,245,0.6)" }}>
                Department Details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-1 p-6">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0 dark:border-[#162033]"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {label}
              </span>

              {label === "Status" ? (
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(45,110,42,0.1)"
                      : "rgba(239,68,68,0.1)",
                    color: isActive ? "#2d6e2a" : "#ef4444",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: isActive ? "#2d6e2a" : "#ef4444",
                    }}
                  />
                  {isActive ? "Active" : "Inactive"}
                </span>
              ) : (
                <span className="max-w-[60%] wrap-break-word text-right text-sm font-medium text-slate-700 dark:text-slate-200">
                  {value || "—"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}