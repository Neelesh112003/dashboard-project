import { useState } from "react";
import {
  Eye,
  Trash2,
  Building2,
  UserPlus,
  Pencil,
  MapPin,
  Tag,
  Users,
  DollarSign,
  Megaphone,
  Settings,
  TrendingUp,
  Shield,
  Scale,
  Beaker,
} from "lucide-react";
import CreateDepartmentForm from "./CreateDepartmentForm";
import ViewDepartment from "./ViewDepartment";

export default function DepartmentList({ departments = [], onDelete, onAdd }) {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

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

        {departments.length === 0 ? (
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
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {["#", "Department", "Location", "Category", "Head", "Status", "Created On", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
                {departments.map((dept, idx) => {
                  const meta = CATEGORY_META[dept.category] ?? CATEGORY_META.Engineering;
                  const CategoryIcon = meta.icon;
                  const isActive = dept.status === "active";

                  return (
                    <tr
                      key={dept.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-[#11182b]"
                    >
                      <td className="px-5 py-4 text-xs text-slate-400">{idx + 1}</td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3a3c44] text-sm font-bold text-white">
                            {dept.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="whitespace-nowrap font-semibold text-slate-800 dark:text-slate-100">
                              {dept.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {dept.remarks ? `${dept.remarks.substring(0, 50)}...` : "No remarks"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {dept.workLocation || "—"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold"
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          <CategoryIcon className="h-3.5 w-3.5" />
                          {dept.category}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {dept.departmentHead || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1 text-xs font-semibold"
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
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-xs text-slate-400">
                        {dept.createdOn || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedDepartment(dept)}
                            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300 dark:hover:bg-[#11182b]"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>

                          <button className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-900/40 dark:hover:bg-blue-900/20">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>

                          <button
                            onClick={() => onDelete?.(dept.id)}
                            className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
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

      {showCreate && (
        <CreateDepartmentForm
          onAdd={onAdd}
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