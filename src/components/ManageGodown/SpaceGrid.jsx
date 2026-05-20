import { CheckCircle, XCircle, MinusCircle, Grid3x3, Plus } from "lucide-react";
import { rackSpaceApi } from "./Godownapi";
import AddRackSpaceModal from "./AddRackSpaceModal";
import { useState } from "react";

const STATUS_LABEL = { empty: "Empty", occupied: "Occupied", reserved: "Reserved" };

function getStatusStyle(status) {
  const base = "flex items-center justify-center rounded-xl border text-xs font-semibold cursor-pointer transition-all active:scale-95 h-10 gap-1";
  if (status === "empty" || status === "available")
    return `${base} border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 text-green-700 hover:from-green-100 hover:to-emerald-200 dark:border-green-900/40 dark:from-green-900/20 dark:to-emerald-900/10 dark:text-green-400`;
  if (status === "occupied")
    return `${base} border-red-200 bg-gradient-to-br from-red-50 to-rose-100 text-red-700 hover:from-red-100 hover:to-rose-200 dark:border-red-900/40 dark:from-red-900/20 dark:to-rose-900/10 dark:text-red-400`;
  return `${base} border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-100 text-yellow-700 hover:from-yellow-100 hover:to-amber-200 dark:border-yellow-900/40 dark:from-yellow-900/20 dark:to-amber-900/10 dark:text-yellow-400`;
}

function getStatusIcon(status) {
  if (status === "empty" || status === "available") return <CheckCircle className="h-3.5 w-3.5" />;
  if (status === "occupied") return <XCircle className="h-3.5 w-3.5" />;
  return <MinusCircle className="h-3.5 w-3.5" />;
}

export default function SpaceGrid({ rack, section, floor, godown, onSpaceAdded, onSpaceStatusChanged }) {
  const [showAddSpace, setShowAddSpace] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const spaces = rack.spaces || rack.rack_spaces || [];

  const handleToggle = async (space) => {
    if (togglingId) return;
    const spaceId = space.space_id || space.rack_space_id || space.id;
    setTogglingId(spaceId);
    const result = await rackSpaceApi.toggleStatus(spaceId);
    setTogglingId(null);
    if (result.ok) {
      onSpaceStatusChanged?.(rack, result.data);
    }
  };

  const stats = spaces.reduce((acc, s) => {
    const status = s.space_status || s.rack_space_status || s.status || "empty";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#1b2740] dark:bg-[#11182b]">
      {/* Legend + title + add button */}
      <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
          <Grid3x3 className="h-4 w-4 text-green-600 dark:text-green-400" />
          {rack.rack_name || rack.name} — Spaces
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1 text-green-700 dark:text-green-400">
              <CheckCircle className="h-3 w-3" /> {(stats.empty || 0) + (stats.available || 0)} Empty
            </span>
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <XCircle className="h-3 w-3" /> {stats.occupied || 0} Occupied
            </span>
            <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
              <MinusCircle className="h-3 w-3" /> {stats.reserved || 0} Reserved
            </span>
          </div>
          <button
            onClick={() => setShowAddSpace(true)}
            className="flex items-center gap-1 rounded-xl border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 transition-all hover:bg-green-100 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
          >
            <Plus className="h-3.5 w-3.5" /> Add Space
          </button>
        </div>
      </div>

      {/* Grid */}
      {spaces.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-5 text-center text-sm text-slate-500 dark:border-[#2a3754] dark:bg-[#0d1528] dark:text-slate-400">
          No spaces added to this rack yet.
        </div>
      ) : (
        <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))" }}>
          {spaces.map((s) => {
            const spaceId = s.space_id || s.rack_space_id || s.id;
            const status = s.space_status || s.rack_space_status || s.status || "empty";
            const code = s.space_code || s.rack_space_code || s.code;
            const isToggling = togglingId === spaceId;
            return (
              <div
                key={spaceId}
                onClick={() => !isToggling && handleToggle(s)}
                className={`${getStatusStyle(status)} ${isToggling ? "opacity-60 cursor-wait" : ""}`}
                title={`${code} — ${STATUS_LABEL[status] || status}. Click to toggle status.`}
              >
                {getStatusIcon(status)}
                <span className="truncate">{code}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-3 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 dark:border-[#162033] dark:bg-[#0d1528] dark:text-slate-400">
        Click any space to toggle status via API (Empty → Occupied → Reserved → Empty)
      </div>

      {showAddSpace && (
        <AddRackSpaceModal
          godownId={godown.godown_id || godown.id}
          sectionId={section.section_id || section.id}
          floorId={floor.floor_id || floor.id}
          rackId={rack.rack_id || rack.id}
          onAdd={(newSpace) => {
            onSpaceAdded?.(rack, newSpace);
            setShowAddSpace(false);
          }}
          onClose={() => setShowAddSpace(false)}
        />
      )}
    </div>
  );
}