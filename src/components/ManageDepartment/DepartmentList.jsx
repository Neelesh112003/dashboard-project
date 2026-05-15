import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Eye,
  Trash2,
  Building2,
  UserPlus,
  Pencil,
  Tag,
  Users,
  DollarSign,
  Megaphone,
  Settings,
  TrendingUp,
  Shield,
  Scale,
  Beaker,
  Search,
  X,
} from "lucide-react";
import CreateDepartmentForm from "./CreateDepartmentForm";
import ViewDepartment from "./ViewDepartment";

const CATEGORY_META = {
  Engineering: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", icon: Tag },
  "Human Resources": { color: "#10b981", bg: "rgba(16,185,129,0.1)", icon: Users },
  Finance: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: DollarSign },
  Marketing: { color: "#ec4899", bg: "rgba(236,72,153,0.1)", icon: Megaphone },
  Operations: { color: "#6366f1", bg: "rgba(99,102,241,0.1)", icon: Settings },
  Sales: { color: "#f97316", bg: "rgba(249,115,22,0.1)", icon: TrendingUp },
  "IT & Security": { color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: Shield },
  Legal: { color: "#6b7280", bg: "rgba(107,114,128,0.1)", icon: Scale },
  "Research & Development": { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", icon: Beaker },
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const normalizeDepartment = (d) => ({
  id: d?.id ?? d?.dept_id,
  dept_id: d?.dept_id ?? d?.id,
  department_code: d?.department_code ?? "",
  department_name: d?.department_name ?? "",
  work_location: d?.work_location ?? "",
  category: d?.category ?? "",
  department_status: d?.department_status ?? d?.status ?? "inactive",
  status: d?.status ?? d?.department_status ?? "inactive",
  department_head_id: d?.department_head_id ?? null,
  department_head_username: d?.department_head_username ?? "",
  department_head_name: d?.department_head_name ?? "",
  department_info: d?.department_info ?? "",
  remarks: d?.remarks ?? "",
  created_at: d?.created_at ?? "",
  updated_at: d?.updated_at ?? "",
  admin: d?.admin ?? "",
  created_by_user_id: d?.created_by_user_id ?? null,
  created_by_username: d?.created_by_username ?? "",
  created_by_user_type: d?.created_by_user_type ?? "",
  updated_by_user_id: d?.updated_by_user_id ?? null,
  updated_by_username: d?.updated_by_username ?? "",
  updated_by_user_type: d?.updated_by_user_type ?? "",
});

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [filters, setFilters] = useState({
    name: "",
    category: "",
    head: "",
    status: "",
  });

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/v1/departments`, {
        headers: getAuthHeaders(),
      });

      const text = await response.text();
      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        setError("Unexpected response from server.");
        return;
      }

      if (!response.ok) {
        setError(data?.message || "Failed to fetch departments.");
        return;
      }

      const list = Array.isArray(data?.data?.data)
        ? data.data.data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];

      setDepartments(list.map(normalizeDepartment));
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleAdd = async () => {
    await fetchDepartments();
    setShowCreate(false);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/v1/departments/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const text = await response.text();
        let data = {};
        try {
          data = JSON.parse(text);
        } catch {}
        setError(data?.message || "Failed to delete department.");
        return;
      }

      setDepartments((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (dept) => {
    const currentStatus = dept.department_status ?? dept.status ?? "inactive";
    const isActive = currentStatus === "active";
    const endpoint = isActive
      ? `${API_BASE_URL}/v1/departments/${dept.id}/deactivate`
      : `${API_BASE_URL}/v1/departments/${dept.id}/activate`;

    setTogglingId(dept.id);
    setError("");

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });

      const text = await response.text();
      let data = {};
      try {
        data = JSON.parse(text);
      } catch {}

      if (!response.ok) {
        setError(data?.message || "Failed to update status.");
        return;
      }

      setDepartments((prev) =>
        prev.map((d) =>
          d.id === dept.id
            ? {
                ...d,
                department_status: isActive ? "inactive" : "active",
                status: isActive ? "inactive" : "active",
              }
            : d
        )
      );
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setTogglingId(null);
    }
  };

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () =>
    setFilters({ name: "", category: "", head: "", status: "" });

  const isFiltered = Object.values(filters).some(Boolean);

  const filtered = useMemo(() => {
    if (!Array.isArray(departments)) return [];

    return departments.filter((d) => {
      const name = filters.name.toLowerCase();
      const category = filters.category.toLowerCase();
      const head = filters.head.toLowerCase();
      const currentStatus = d.department_status ?? d.status ?? "";

      return (
        (!name || (d.department_name || "").toLowerCase().includes(name)) &&
        (!category || (d.category || "").toLowerCase().includes(category)) &&
        (!head || (d.department_head_name || "").toLowerCase().includes(head)) &&
        (!filters.status || currentStatus === filters.status)
      );
    });
  }, [departments, filters]);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
        <div
          className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(245,245,245,0.12)" }}
              >
                <Building2 className="h-5 w-5" style={{ color: "#f5f5f5" }} />
              </div>

              <div>
                <h2 className="text-lg font-semibold" style={{ color: "#f5f5f5" }}>
                  Department List
                </h2>
                <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>
                  {departments.length} department{departments.length !== 1 ? "s" : ""} registered
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#44a83e" }}
            >
              <UserPlus className="h-4 w-4" />
              Create Department
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-[#162033] dark:bg-[#0f1a2e]">
          <div className="relative min-w-37.5 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by department…"
              value={filters.name}
              onChange={(e) => updateFilter("name", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-[#44a83e] focus:outline-none dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-300"
            />
          </div>

          <div className="min-w-35 flex-1">
            <input
              type="text"
              placeholder="Category…"
              value={filters.category}
              onChange={(e) => updateFilter("category", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-[#44a83e] focus:outline-none dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-300"
            />
          </div>

          <div className="min-w-35 flex-1">
            <input
              type="text"
              placeholder="Department head…"
              value={filters.head}
              onChange={(e) => updateFilter("head", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder-slate-400 transition-colors focus:border-[#44a83e] focus:outline-none dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-300"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="min-w-30 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-colors focus:border-[#44a83e] focus:outline-none dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-300"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="whitespace-nowrap rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
            >
              <span className="flex items-center gap-1.5">
                <X className="h-3.5 w-3.5" />
                Reset
              </span>
            </button>
          )}

          {isFiltered && (
            <span className="ml-auto whitespace-nowrap text-xs text-slate-400">
              Showing {filtered.length} of {departments.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#44a83e]" />
          </div>
        ) : departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#11182b]">
              <Building2 className="h-7 w-7 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No departments yet
            </p>
            <p className="mb-4 mt-1 text-xs text-slate-400">
              Click "Create Department" to add your first department.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#44a83e" }}
            >
              <UserPlus className="h-4 w-4" />
              Create Department
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
            <Search className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              No results found
            </p>
            <p className="mt-1 text-xs text-slate-400">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {["S.No", "Code", "Department", "Category", "Head", "Status", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
                {filtered.map((dept, idx) => {
                  const meta = CATEGORY_META[dept.category] ?? CATEGORY_META.Engineering;
                  const CategoryIcon = meta.icon;
                  const currentStatus = dept.department_status ?? dept.status ?? "inactive";
                  const isActive = currentStatus === "active";

                  return (
                    <tr
                      key={dept.id ?? dept.dept_id ?? idx}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-[#11182b]"
                    >
                      <td className="px-5 py-4 text-xs text-slate-400">{idx + 1}</td>

                      <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {dept.department_code || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3a3c44] text-sm font-bold text-white">
                            {dept.department_name?.charAt(0).toUpperCase() || "D"}
                          </div>
                          <p className="whitespace-nowrap font-semibold text-slate-800 dark:text-slate-100">
                            {dept.department_name || "—"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          <CategoryIcon className="h-3.5 w-3.5" />
                          {dept.category || "—"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {dept.department_head_name || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleStatus(dept)}
                          disabled={togglingId === dept.id}
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold transition-opacity hover:opacity-75 disabled:opacity-50"
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
                          {togglingId === dept.id
                            ? "Updating…"
                            : isActive
                            ? "Active"
                            : "Inactive"}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedDepartment(dept)}
                            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300 dark:hover:bg-[#11182b]"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>

                          <button className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-900/40 dark:hover:bg-blue-900/20">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(dept.id)}
                            disabled={deletingId === dept.id}
                            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20 disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {deletingId === dept.id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreateDepartmentForm
          onAdd={handleAdd}
          onClose={() => setShowCreate(false)}
        />
      )}

      {selectedDepartment && (
        <ViewDepartment
          department={selectedDepartment}
          onClose={() => setSelectedDepartment(null)}
        />
      )}
    </>
  );
}