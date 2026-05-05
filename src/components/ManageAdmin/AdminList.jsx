import { useState, useMemo } from "react";
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

export default function AdminList({ admins = [], onDelete, onAdd }) {
  const [viewAdmin, setViewAdmin] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const [filters, setFilters] = useState({
    name: "",
    contact: "",
    email: "",
    department: "",
    position: "",
    status: "",
  });

  const ROLE_META = {
    "Super Admin": { color: "#ef4444", bg: "rgba(239,68,68,0.1)",  icon: ShieldCheck },
    "Admin":       { color: "#3a3c44", bg: "rgba(58,60,68,0.1)",   icon: Users       },
    "Manager":     { color: "#2d6e2a", bg: "rgba(45,110,42,0.1)",  icon: Briefcase   },
    "Moderator":   { color: "#7c3aed", bg: "rgba(124,58,237,0.1)", icon: ShieldCheck },
  };

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const resetFilters = () =>
    setFilters({ name: "", contact: "", email: "", department: "", position: "", status: "" });

  const isFiltered = Object.values(filters).some(Boolean);

  const filtered = useMemo(() => {
    return admins.filter((a) => {
      const name       = filters.name.toLowerCase();
      const contact    = filters.contact.toLowerCase();
      const email      = filters.email.toLowerCase();
      const department = filters.department.toLowerCase();
      return (
        (!name       || a.fullName.toLowerCase().includes(name)) &&
        (!contact    || (a.contact    || "").toLowerCase().includes(contact)) &&
        (!email      || a.email.toLowerCase().includes(email)) &&
        (!department || (a.department || "").toLowerCase().includes(department)) &&
        (!filters.position || a.role   === filters.position) &&
        (!filters.status   || a.status === filters.status)
      );
    });
  }, [admins, filters]);

  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-[#162033] bg-white dark:bg-[#0d1528] overflow-hidden shadow-sm">

        {/* ── Header ── */}
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

        {/* ── Filter Bar ── */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-[#162033] bg-slate-50 dark:bg-[#0f1a2e] flex flex-wrap gap-3 items-center">

          {/* Name */}
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

          {/* Contact */}
          <div className="flex-1 min-w-35">
            <input
              type="text"
              placeholder="Contact number…"
              value={filters.contact}
              onChange={(e) => updateFilter("contact", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1b2740] bg-white dark:bg-[#11182b] text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#44a83e] transition-colors"
            />
          </div>

          {/* Email */}
          <div className="flex-1 min-w-40">
            <input
              type="text"
              placeholder="Email address…"
              value={filters.email}
              onChange={(e) => updateFilter("email", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1b2740] bg-white dark:bg-[#11182b] text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#44a83e] transition-colors"
            />
          </div>

          {/* Department — text input */}
          <div className="flex-1 min-w-35">
            <input
              type="text"
              placeholder="Department…"
              value={filters.department}
              onChange={(e) => updateFilter("department", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1b2740] bg-white dark:bg-[#11182b] text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:border-[#44a83e] transition-colors"
            />
          </div>

          {/* Position — dropdown */}
          <select
            value={filters.position}
            onChange={(e) => updateFilter("position", e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1b2740] bg-white dark:bg-[#11182b] text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#44a83e] transition-colors min-w-32.5"
          >
            <option value="">All Positions</option>
            <option>Super Admin</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Moderator</option>
          </select>

          {/* Status — dropdown */}
          <select
            value={filters.status}
            onChange={(e) => updateFilter("status", e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-[#1b2740] bg-white dark:bg-[#11182b] text-slate-700 dark:text-slate-300 focus:outline-none focus:border-[#44a83e] transition-colors min-w-30"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Reset button — only shown when any filter is active */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-red-200 dark:border-red-900/40 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap"
            >
              <X className="h-3.5 w-3.5" />
              Reset
            </button>
          )}

          {/* Result count */}
          {isFiltered && (
            <span className="text-xs text-slate-400 whitespace-nowrap ml-auto">
              Showing {filtered.length} of {admins.length}
            </span>
          )}
        </div>

        {/* ── Body ── */}
        {admins.length === 0 ? (
          /* No admins at all */
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#11182b] mb-4">
              <Users className="h-7 w-7 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No admins yet
            </p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Click "Create Admin" to add your first admin account.
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
          /* Filters produced no results */
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <Search className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              No results found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {["S.No", "Name", "Contact", "Department", "Position", "Status", "Actions"].map((h) => (
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
                  const meta     = ROLE_META[admin.role] ?? ROLE_META["Admin"];
                  const RoleIcon = meta.icon;
                  const isActive = admin.status === "active";

                  return (
                    <tr
                      key={admin.id}
                      className="hover:bg-slate-50 dark:hover:bg-[#11182b] transition-colors"
                    >
                      {/* S.No */}
                      <td className="px-5 py-4 text-xs text-slate-400">{idx + 1}</td>

                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-bold shrink-0"
                            style={{ backgroundColor: "#3a3c44" }}
                          >
                            {admin.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                              {admin.fullName}
                            </p>
                            <p className="text-xs text-slate-400">{admin.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {admin.contact || "—"}
                      </td>

                      {/* Department */}
                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {admin.department || "—"}
                      </td>

                      {/* Position / Role */}
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          <RoleIcon className="h-3.5 w-3.5" />
                          {admin.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap"
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
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewAdmin(admin)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#1b2740] px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#11182b] transition-colors whitespace-nowrap"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                          <button
                            className="flex items-center gap-1.5 rounded-lg border border-blue-200 dark:border-blue-900/40 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors whitespace-nowrap"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => onDelete?.(admin.id)}
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900/40 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
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

      {/* Modals */}
      {viewAdmin && (
        <ViewAdmin admin={viewAdmin} onClose={() => setViewAdmin(null)} />
      )}
      {showCreate && (
        <AddAdminForm onAdd={onAdd} onClose={() => setShowCreate(false)} />
      )}
    </>
  );
}