import { useState } from "react";
import { Plus, Eye, Warehouse, MapPin, Layers3 } from "lucide-react";
import AddGodownModal from "./ManageGodown/AddGodownForm";
import ViewGodownModal from "./ManageGodown/ViewGodownModal";

export default function GodownManagement() {
  const [godowns, setGodowns] = useState([
    {
      id: 1,
      godownCode: "GDN-001",
      godownName: "Main Storage",
      type: "Finished Goods",
      location: "Noida",
      sections: [],
    },
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleAdd = (g) => setGodowns([...godowns, g]);

  const updateGodown = (updated) => {
    setGodowns(godowns.map((g) => (g.id === updated.id ? updated : g)));
    setSelected(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#081120]">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
          <div
            className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between"
            style={{
              background:
                "linear-gradient(135deg, #2f3138 0%, #3a3c44 45%, #4b5563 100%)",
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <Warehouse className="h-6 w-6 text-white" />
              </div>

              <div>
                <h1 className="text-xl font-semibold text-white">
                  Godown Management
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  Manage all godowns, their type, location, and section details.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 active:scale-95"
              style={{
                background:
                  "linear-gradient(135deg, #44a83e 0%, #378f32 50%, #2f7d2b 100%)",
              }}
            >
              <Plus className="h-4 w-4" />
              Add New Godown
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-slate-100 p-6 sm:grid-cols-2 xl:grid-cols-3 dark:border-[#162033]">
            {godowns.map((g) => (
              <div
                key={g.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-[#1b2740] dark:bg-[#11182b]"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 text-green-700 dark:from-green-900/30 dark:to-emerald-900/10 dark:text-green-400">
                    <Warehouse className="h-5 w-5" />
                  </div>

                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-[#243047] dark:bg-[#0d1528] dark:text-slate-300">
                    {g.type}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                    {g.godownName}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {g.godownCode}
                  </p>
                </div>

                <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-[#162033] dark:bg-[#0d1528]">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span>{g.location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Layers3 className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <span>{g.sections?.length || 0} Sections</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Inventory Unit
                  </div>

                  <button
                    onClick={() => setSelected(g)}
                    className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-all hover:bg-green-100 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAdd && (
        <AddGodownModal
          onAdd={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}

      {selected && (
        <ViewGodownModal
          godown={selected}
          updateGodown={updateGodown}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}