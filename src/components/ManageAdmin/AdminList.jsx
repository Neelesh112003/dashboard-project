import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Eye,
  Trash2,
  Users,
  UserPlus,
  Pencil,
  ShieldCheck,
  Briefcase,
  Search,
  X,
} from "lucide-react";
import AddAdminForm from "./AddAdminForm";
import ViewAdmin from "./ViewAdmin";

const API_URL = import.meta.env.VITE_API_URL;

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

const initialFilters = {
  name: "",
  contact: "",
  email: "",
  department: "",
  type: "",
  status: "",
};

const getUserType = (u) => u?.user_type || u?.type || "";

export default function AdminList() {
  const [admins, setAdmins] = useState([]);
  const [viewAdmin, setViewAdmin] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const getToken = () => localStorage.getItem("token");

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${getToken()}`,
  });

  const parseJsonSafe = async (response) => {
    try { return await response.json(); } catch { return null; }
  };

  const fetchAdmins = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const token = getToken();
      if (!token) {
        setError("Session expired. Please log in again.");
        setAdmins([]);
        return;
      }

      const res = await fetch(`${API_URL}/v1/users`, {
        method: "GET",
        headers: getAuthHeaders(),
        signal,
      });

      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data?.message || "Failed to fetch users.");

      // Handle paginated: { successvar:1, data: { data: [...] } }
      const allUsers =
        Array.isArray(data?.data?.data) ? data.data.data :
        Array.isArray(data?.data)       ? data.data :
        Array.isArray(data)             ? data : [];

      // Show ALL users — type filtering happens in the UI dropdown
      setAdmins(allUsers);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Network error. Please check your connection.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchAdmins(controller.signal);
    return () => controller.abort();
  }, [fetchAdmins]);

  const handleAdd = () => {
    const controller = new AbortController();
    fetchAdmins(controller.signal);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");
    try {
      const token = getToken();
      if (!token) throw new Error("Session expired. Please log in again.");

      const res = await fetch(`${API_URL}/v1/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data?.message || "Failed to delete user.");

      setAdmins((prev) => prev.filter((a) => a.id !== id));
      if (viewAdmin?.id === id) setViewAdmin(null);
    } catch (err) {
      setError(err.message || "Network error. Please check your connection.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (admin) => {
    const nextStatus = admin.status === "active" ? "inactive" : "active";
    const endpoint =
      admin.status === "active"
        ? `${API_URL}/v1/users/${admin.id}/deactivate`
        : `${API_URL}/v1/users/${admin.id}/activate`;

    setTogglingId(admin.id);
    setError("");

    try {
      const token = getToken();
      if (!token) throw new Error("Session expired. Please log in again.");

      const res = await fetch(endpoint, { method: "PATCH", headers: getAuthHeaders() });
      const data = await parseJsonSafe(res);
      if (!res.ok) throw new Error(data?.message || "Failed to update status.");

      const updatedStatus = data?.data?.status ?? data?.status ?? nextStatus;

      setAdmins((prev) =>
        prev.map((a) => a.id === admin.id ? { ...a, status: updatedStatus } : a)
      );
      if (viewAdmin?.id === admin.id) {
        setViewAdmin((prev) => prev ? { ...prev, status: updatedStatus } : prev);
      }
    } catch (err) {
      setError(err.message || "Network error. Please check your connection.");
    } finally {
      setTogglingId(null);
    }
  };

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () => setFilters(initialFilters);

  const isFiltered = Object.values(filters).some(Boolean);

  const filtered = useMemo(() => {
    const name       = filters.name.toLowerCase().trim();
    const contact    = filters.contact.toLowerCase().trim();
    const email      = filters.email.toLowerCase().trim();
    const department = filters.department.toLowerCase().trim();

    return admins.filter((a) => {
      const userType = getUserType(a);
      return (
        (!name       || (a.name || "").toLowerCase().includes(name)) &&
        (!contact    || String(a.contact || "").toLowerCase().includes(contact)) &&
        (!email      || (a.email || "").toLowerCase().includes(email)) &&
        (!department || (a.department_name || "").toLowerCase().includes(department)) &&
        (!filters.type   || userType === filters.type) &&
        (!filters.status || a.status === filters.status)
      );
    });
  }, [admins, filters]);

  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-[#162033] bg-white dark:bg-[#0d1528] overflow-hidden shadow-sm">
        <div
          className="px-6 py-5 border-b border-slate-200 dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(245,245,245,0.12)" }}
              >
                <Users className="h-5 w-5" style={{ color: "#f5f5f5" }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: "#f5f5f5" }}>
                  Admin List
                </h2>
                <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>
                  {admins.length} member{admins.length !== 1 ? "s" : ""} registered
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#44a83e", color: "#fff" }}
            >
              <UserPlus className="h-4 w-4" />
              Create Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#162033] bg-slate-50 dark:bg-[#0f1a2e] flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-37.5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name…"
              value={filters.name}
              onChange={(e) => updateFilter("name", e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1b2740] bg-white dark:bg-[#11182b] text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#44a83e] transition-colors"
            />
          </div>

          <div className="flex-1 min-w-35">
            <input
              type="text"
              placeholder="Contact number…"
              value={filters.contact}
              onChange={(e) =>
                updateFilter("contact", e.target.value.replace(/[^\d]/g, "").slice(0, 10))
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1b2740] bg-white dark:bg-[#11182b] text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#44a83e] transition-colors"
            />
          </div>

          <div className="flex-1 min-w-40">
            <input
              type="text"
              placeholder="Email address…"
              value={filters.email}
              onChange={(e) => updateFilter("email", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1b2740] bg-white dark:bg-[#11182b] text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#44a83e] transition-colors"
            />
          </div>

          <div className="flex-1 min-w-35">
            <input
              type="text"
              placeholder="Department…"
              value={filters.department}
              onChange={(e) => updateFilter("department", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1b2740] bg-white dark:bg-[#11182b] text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#44a83e] transition-colors"
            />
          </div>

          <select
            value={filters.type}
            onChange={(e) => updateFilter("type", e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1b2740] bg-white dark:bg-[#11182b] text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#44a83e] transition-colors min-w-32.5"
          >
            <option value="">All Types</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1b2740] bg-white dark:bg-[#11182b] text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#44a83e] transition-colors min-w-30"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </button>
          )}

          {isFiltered && (
            <span className="text-xs text-slate-400 whitespace-nowrap ml-auto">
              Showing {filtered.length} of {admins.length}
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#44a83e]" />
          </div>
        ) : admins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#11182b] mb-4">
              <Users className="h-7 w-7 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No users yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Click "Create Admin" to add your first account.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#44a83e" }}
            >
              <UserPlus className="h-4 w-4" />
              Create Admin
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No results found</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {["S.No", "Name", "Contact", "Department", "Type", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
                {filtered.map((admin, idx) => {
                  const userType = getUserType(admin);
                  const meta = ROLE_META[userType] ?? ROLE_META.user;
                  const RoleIcon = meta.icon;
                  const isActive = admin.status === "active";

                  return (
                    <tr
                      key={admin.id}
                      className="hover:bg-slate-50 dark:hover:bg-[#11182b] transition-colors"
                    >
                      <td className="px-5 py-4 text-xs text-slate-400">{idx + 1}</td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-bold shrink-0"
                            style={{ backgroundColor: "#3a3c44" }}
                          >
                            {(admin.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                              {admin.name || "—"}
                            </p>
                            <p className="text-xs text-slate-400">{admin.email || "—"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {admin.contact || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {admin.department_name || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          <RoleIcon className="h-3.5 w-3.5" />
                          {meta.label}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleToggleStatus(admin)}
                          disabled={togglingId === admin.id}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap transition-opacity hover:opacity-75 disabled:opacity-50"
                          style={{
                            backgroundColor: isActive ? "rgba(45,110,42,0.1)" : "rgba(239,68,68,0.1)",
                            color: isActive ? "#2d6e2a" : "#ef4444",
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: isActive ? "#2d6e2a" : "#ef4444" }}
                          />
                          {togglingId === admin.id ? "Updating..." : isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewAdmin(admin)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#1b2740] px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#11182b] transition-colors whitespace-nowrap"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>

                          <button
                            type="button"
                            className="flex items-center gap-1.5 rounded-lg border border-blue-200 dark:border-blue-900/40 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors whitespace-nowrap"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>

                          <button
                            onClick={() => handleDelete(admin.id)}
                            disabled={deletingId === admin.id}
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900/40 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap disabled:opacity-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {deletingId === admin.id ? "Deleting..." : "Delete"}
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

      {viewAdmin && <ViewAdmin admin={viewAdmin} onClose={() => setViewAdmin(null)} />}
      {showCreate && <AddAdminForm onAdd={handleAdd} onClose={() => setShowCreate(false)} />}
    </>
  );
}