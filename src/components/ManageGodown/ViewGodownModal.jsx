import { useState } from "react";
import {
  X,
  Plus,
  Warehouse,
  MapPin,
  Layers3,
  FolderKanban,
  Grid2x2Plus,
  PackageOpen,
} from "lucide-react";
import AddSectionModal from "./AddSectionModal";
import AddRackModal from "./AddRackModal";
import SpaceGrid from "./SpaceGrid";

export default function ViewGodownModal({ godown, updateGodown, onClose }) {
  const [showSection, setShowSection] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const addSection = (sec) => {
    const updated = {
      ...godown,
      sections: [...(godown.sections || []), { ...sec, racks: [] }],
    };
    updateGodown(updated);
  };

  const addRack = (rack) => {
    if (!selectedSection) return;

    const updated = {
      ...godown,
      sections: (godown.sections || []).map((s) =>
        s.id === selectedSection.id
          ? { ...s, racks: [...(s.racks || []), rack] }
          : s
      ),
    };

    updateGodown(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0d1528]">
        <div
          className="flex shrink-0 items-start gap-4 border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{
            background: "linear-gradient(135deg, #2f3138 0%, #3a3c44 45%, #4b5563 100%)",
          }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Warehouse className="h-6 w-6 text-white" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">{godown.godownName}</h2>
            <p className="mt-1 text-sm text-white/65">
              Manage sections, racks, and storage spaces for this godown
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#1b2740] dark:bg-[#11182b]">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <Layers3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Godown Code
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {godown.godownCode}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#1b2740] dark:bg-[#11182b]">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <PackageOpen className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Type
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {godown.type}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#1b2740] dark:bg-[#11182b]">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                  Location
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {godown.location}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#11182b]">
              <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 dark:border-[#162033] md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Section Management
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-slate-800 dark:text-slate-100">
                    Sections and racks
                  </h3>
                </div>

                <button
                  onClick={() => setShowSection(true)}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, #44a83e 0%, #378f32 50%, #2f7d2b 100%)",
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Add Section
                </button>
              </div>

              <div className="space-y-4 p-6">
                {(godown.sections || []).length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-[#2a3754] dark:bg-[#0d1528]">
                    <FolderKanban className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                    <h4 className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      No sections added yet
                    </h4>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Create a section first, then add racks and storage spaces inside it.
                    </p>
                  </div>
                ) : (
                  (godown.sections || []).map((sec) => (
                    <div
                      key={sec.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-[#1b2740] dark:bg-[#0d1528]"
                    >
                      <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-[#162033] md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-green-100 to-emerald-50 text-green-700 dark:from-green-900/30 dark:to-emerald-900/10 dark:text-green-400">
                            <FolderKanban className="h-5 w-5" />
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {sec.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {(sec.racks || []).length} rack(s) in this section
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedSection(sec)}
                          className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-all hover:bg-green-100 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                        >
                          <Grid2x2Plus className="h-4 w-4" />
                          Add Rack
                        </button>
                      </div>

                      <div className="p-5">
                        {(sec.racks || []).length === 0 ? (
                          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500 dark:border-[#2a3754] dark:bg-[#11182b] dark:text-slate-400">
                            No racks added in this section.
                          </div>
                        ) : (
                          <div className="space-y-5">
                            {(sec.racks || []).map((r) => (
                              <div
                                key={r.id}
                                className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-[#1b2740] dark:bg-[#11182b]"
                              >
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                  <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-[#0d1528] dark:text-slate-200">
                                    <Layers3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    {r.name}
                                  </div>

                                  <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    {(r.spaces || []).length} spaces
                                  </div>
                                </div>

                                {r.spaces && r.spaces.length > 0 ? (
                                  <SpaceGrid
                                    rack={r}
                                    section={sec}
                                    godown={godown}
                                    updateGodown={updateGodown}
                                  />
                                ) : (
                                  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500 dark:border-[#2a3754] dark:bg-[#0d1528] dark:text-slate-400">
                                    No spaces defined for this rack.
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {showSection && (
          <AddSectionModal
            onAdd={addSection}
            onClose={() => setShowSection(false)}
          />
        )}

        {selectedSection && (
          <AddRackModal
            onAdd={addRack}
            onClose={() => setSelectedSection(null)}
          />
        )}
      </div>
    </div>
  );
}