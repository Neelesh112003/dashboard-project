import { useState } from "react";
import {
  Eye,
  Trash2,
  Pencil,
  Warehouse,
  Plus,
} from "lucide-react";
import AddGodownForm from "./AddGodownForm";
import ViewGodown from "./ViewGodown";

const TYPE_META = {
  "Finished Goods": {
    color: "#2d6e2a",
    bg: "rgba(45,110,42,0.1)",
  },
  "Raw Material": {
    color: "#1d4ed8",
    bg: "rgba(29,78,216,0.1)",
  },
  "Semi-Finished": {
    color: "#b45309",
    bg: "rgba(180,83,9,0.1)",
  },
  Scrap: {
    color: "#6b7280",
    bg: "rgba(107,114,128,0.1)",
  },
  Transit: {
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.1)",
  },
  "Cold Storage": {
    color: "#0891b2",
    bg: "rgba(8,145,178,0.1)",
  },
  Hazardous: {
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
  },
};

export default function GodownList({
  godowns = [],
  onDelete,
  onAdd,
}) {
  const [viewGodown, setViewGodown] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
        {/* Header */}
        <div
          className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.12)",
                }}
              >
                <Warehouse className="h-5 w-5 text-white" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  Godown Management
                </h2>
                <p className="text-xs text-white/60">
                  {godowns.length} Godown
                  {godowns.length !== 1 ? "s" : ""} Registered
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#44a83e" }}
            >
              <Plus className="h-4 w-4" />
              Add Godown
            </button>
          </div>
        </div>

        {/* Empty State */}
        {godowns.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#11182b]">
              <Warehouse className="h-8 w-8 text-slate-400" />
            </div>

            <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
              No Godowns Available
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create your first godown to get started.
            </p>

            <button
              onClick={() => setShowCreate(true)}
              className="mt-5 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#44a83e" }}
            >
              <Plus className="h-4 w-4" />
              Add Godown
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {[
                    "#",
                    "Godown Code",
                    "Godown Name",
                    "Type",
                    "Location",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
                {godowns.map((godown, index) => {
                  const meta =
                    TYPE_META[godown.type] || {
                      color: "#3a3c44",
                      bg: "rgba(58,60,68,0.1)",
                    };

                  return (
                    <tr
                      key={godown.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-[#11182b]"
                    >
                      {/* Serial Number */}
                      <td className="px-5 py-4 text-xs text-slate-400">
                        {index + 1}
                      </td>

                      {/* Godown Code */}
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-3 py-1 font-mono text-sm font-semibold text-slate-700 dark:bg-[#11182b] dark:text-slate-200">
                          {godown.godownCode}
                        </span>
                      </td>

                      {/* Godown Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl"
                            style={{ backgroundColor: "#3a3c44" }}
                          >
                            <Warehouse className="h-5 w-5 text-white" />
                          </div>

                          <span className="whitespace-nowrap font-semibold text-slate-800 dark:text-slate-100">
                            {godown.godownName}
                          </span>
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold"
                          style={{
                            backgroundColor: meta.bg,
                            color: meta.color,
                          }}
                        >
                          {godown.type || "—"}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="max-w-xs truncate px-5 py-4 text-sm text-slate-600 dark:text-slate-300">
                        {godown.location || "—"}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setViewGodown(godown)
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300 dark:hover:bg-[#11182b]"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </button>

                          <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-900/40 dark:hover:bg-blue-900/20">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              onDelete?.(godown.id)
                            }
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-900/20"
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
        )}
      </div>

      {/* View Modal */}
      {viewGodown && (
        <ViewGodown
          godown={viewGodown}
          onClose={() => setViewGodown(null)}
        />
      )}

      {/* Add Modal */}
      {showCreate && (
        <AddGodownForm
          onAdd={onAdd}
          onClose={() => setShowCreate(false)}
        />
      )}
    </>
  );
}