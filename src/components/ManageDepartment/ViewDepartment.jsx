import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

export default function ViewDepartment({ department, onClose }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (!department?.id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_BASE_URL}/v1/departments/${department.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data?.message || "Failed to fetch department details.");
          return;
        }

        // Handle: { successvar: 1, data: { ...dept } } or { successvar: 1, data: { data: {...} } }
        const dept =
          data?.data?.data ?? data?.data ?? data;

        setDetail(dept);
      } catch {
        setError("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [department?.id, API_BASE_URL]);

  if (!department) return null;

  const dept = detail ?? department;
  const isActive = dept.status === "active";

  const fields = [
    { label: "Department Code",  value: dept.department_code },
    { label: "Department Name",  value: dept.department_name },
    { label: "Work Location",    value: dept.work_location },
    { label: "Category",         value: dept.category },
    { label: "Department Head",  value: dept.department_head_name },
    { label: "Remarks",          value: dept.remarks },
    { label: "Status",           value: dept.status },
    {
      label: "Created By",
      value: dept.created_by_username
        ? `${dept.created_by_username} (${dept.created_by_user_type ?? ""})`
        : null,
    },
    {
      label: "Created On",
      value: dept.created_at
        ? new Date(dept.created_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : null,
    },
    {
      label: "Last Updated",
      value: dept.updated_at
        ? new Date(dept.updated_at).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : null,
    },
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
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ backgroundColor: "#44a83e" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: "rgba(245,245,245,0.15)" }}
            >
              {dept.department_name?.charAt(0).toUpperCase() ?? "D"}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {dept.department_name ?? "—"}
              </h3>
              <p className="text-xs" style={{ color: "rgba(245,245,245,0.6)" }}>
                {dept.department_code ?? "Department Details"}
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

        {/* Body */}
        <div className="p-6">
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
              {fields.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 py-3 last:border-0 dark:border-[#162033]"
                >
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
                        style={{ backgroundColor: isActive ? "#2d6e2a" : "#ef4444" }}
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
          )}
        </div>
      </div>
    </div>
  );
}