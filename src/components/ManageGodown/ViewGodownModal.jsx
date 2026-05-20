import { useState, useEffect, useCallback } from "react";
import {
  X, Plus, Warehouse, MapPin, Layers3, FolderKanban, Grid2x2Plus,
  PackageOpen, Layers, ChevronDown, ChevronRight, Trash2, ToggleLeft,
  ToggleRight, Loader2, AlertCircle, RefreshCw,
} from "lucide-react";
import AddSectionModal from "./AddSectionModal";
import AddFloorModal from "./AddFloorModal";
import AddRackModal from "./AddRackModal";
import SpaceGrid from "./SpaceGrid";
import { sectionApi, floorApi, rackApi, apiErrorMessage } from "./Godownapi";

// ── Small inline alert ──────────────────────────────────────────────────────
function InlineAlert({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
      msg.type === "error"
        ? "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
        : "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
    }`}>
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span className="flex-1">{msg.text}</span>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

export default function ViewGodownModal({ godown, onClose }) {
  const godownId = godown.godown_id || godown.id;

  // local state mirroring the hierarchy fetched from API
  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(true);
  const [alertMsg, setAlertMsg] = useState(null);

  // modal visibility
  const [showSection, setShowSection] = useState(false);
  const [addFloorTo, setAddFloorTo] = useState(null);   // { sectionId }
  const [addRackTo, setAddRackTo] = useState(null);     // { sectionId, floorId }

  // collapse state: key = "sec-{id}" or "floor-{id}"
  const [collapsed, setCollapsed] = useState({});
  const toggleCollapse = (key) => setCollapsed((p) => ({ ...p, [key]: !p[key] }));

  // action loading: key = "del-sec-{id}", "tog-sec-{id}", etc.
  const [busy, setBusy] = useState({});
  const setBusyKey = (key, val) => setBusy((p) => ({ ...p, [key]: val }));

  // ref to trigger manual refresh without adding fetchSections to effect deps
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);


  /* ── Fetch sections (with floors and racks via nested lists) ── */
  useEffect(() => {
    let cancelled = false;

    async function loadSections() {
      setLoadingSections(true);

      const secRes = await sectionApi.list({ godown_id: godownId, per_page: 100 });

      if (cancelled) return;

      if (!secRes.ok) {
        setAlertMsg({ type: "error", text: apiErrorMessage(secRes.errorCode, secRes.message) });
        setLoadingSections(false);
        return;
      }

      const rawSections = secRes.data?.data ?? secRes.data ?? [];

      const enriched = await Promise.all(
        rawSections.map(async (sec) => {
          const secId = sec.section_id || sec.id;
          const floorRes = await floorApi.list({ godown_id: godownId, section_id: secId, per_page: 100 });
          const rawFloors = floorRes.ok ? (floorRes.data?.data ?? floorRes.data ?? []) : [];

          const floorsWithRacks = await Promise.all(
            rawFloors.map(async (fl) => {
              const floorId = fl.floor_id || fl.id;
              const rackRes = await rackApi.list({ godown_id: godownId, section_id: secId, floor_id: floorId, per_page: 100 });
              const rawRacks = rackRes.ok ? (rackRes.data?.data ?? rackRes.data ?? []) : [];
              return { ...fl, racks: rawRacks };
            })
          );

          return { ...sec, floors: floorsWithRacks };
        })
      );

      if (cancelled) return;

      setSections(enriched);
      setLoadingSections(false);
    }

    loadSections();

    return () => { cancelled = true; };
  }, [godownId, refreshKey]); // refreshKey lets the Refresh button re-run this effect

  /* ── Helpers to patch local state without re-fetching everything ── */
  const addSectionLocal = (sec) => setSections((prev) => [...prev, { ...sec, floors: [] }]);

  const addFloorLocal = (sectionId, floor) =>
    setSections((prev) =>
      prev.map((s) =>
        (s.section_id || s.id) === sectionId
          ? { ...s, floors: [...(s.floors || []), { ...floor, racks: [] }] }
          : s
      )
    );

  const addRackLocal = (sectionId, floorId, rack) =>
    setSections((prev) =>
      prev.map((s) =>
        (s.section_id || s.id) === sectionId
          ? {
              ...s,
              floors: (s.floors || []).map((f) =>
                (f.floor_id || f.id) === floorId
                  ? { ...f, racks: [...(f.racks || []), { ...rack, spaces: [] }] }
                  : f
              ),
            }
          : s
      )
    );

  const addSpaceLocal = (sectionId, floorId, rackId, space) =>
    setSections((prev) =>
      prev.map((s) =>
        (s.section_id || s.id) === sectionId
          ? {
              ...s,
              floors: (s.floors || []).map((f) =>
                (f.floor_id || f.id) === floorId
                  ? {
                      ...f,
                      racks: f.racks.map((r) =>
                        (r.rack_id || r.id) === rackId
                          ? { ...r, spaces: [...(r.spaces || []), space] }
                          : r
                      ),
                    }
                  : f
              ),
            }
          : s
      )
    );

  const updateSpaceLocal = (sectionId, floorId, rackId, updatedSpace) => {
    const spaceId = updatedSpace.space_id || updatedSpace.rack_space_id || updatedSpace.id;
    setSections((prev) =>
      prev.map((s) =>
        (s.section_id || s.id) === sectionId
          ? {
              ...s,
              floors: (s.floors || []).map((f) =>
                (f.floor_id || f.id) === floorId
                  ? {
                      ...f,
                      racks: f.racks.map((r) =>
                        (r.rack_id || r.id) === rackId
                          ? {
                              ...r,
                              spaces: (r.spaces || []).map((sp) =>
                                (sp.space_id || sp.rack_space_id || sp.id) === spaceId ? updatedSpace : sp
                              ),
                            }
                          : r
                      ),
                    }
                  : f
              ),
            }
          : s
      )
    );
  };

  /* ── Delete / Toggle helpers ── */
  const handleDeleteSection = async (sec) => {
    const id = sec.section_id || sec.id;
    if (!window.confirm(`Delete section "${sec.section_name || sec.name}"? This cannot be undone.`)) return;
    setBusyKey(`del-sec-${id}`, true);
    const res = await sectionApi.delete(id);
    setBusyKey(`del-sec-${id}`, false);
    if (res.ok) {
      setSections((prev) => prev.filter((s) => (s.section_id || s.id) !== id));
      setAlertMsg({ type: "success", text: res.message || "Section deleted." });
    } else {
      setAlertMsg({ type: "error", text: apiErrorMessage(res.errorCode, res.message) });
    }
  };

  const handleToggleSection = async (sec) => {
    const id = sec.section_id || sec.id;
    setBusyKey(`tog-sec-${id}`, true);
    const res = await sectionApi.toggleStatus(id);
    setBusyKey(`tog-sec-${id}`, false);
    if (res.ok) {
      setSections((prev) =>
        prev.map((s) => (s.section_id || s.id) === id ? { ...s, ...res.data } : s)
      );
    } else {
      setAlertMsg({ type: "error", text: apiErrorMessage(res.errorCode, res.message) });
    }
  };

  const handleDeleteFloor = async (sec, fl) => {
    const secId = sec.section_id || sec.id;
    const floorId = fl.floor_id || fl.id;
    if (!window.confirm(`Delete floor "${fl.floor_name || fl.name}"?`)) return;
    setBusyKey(`del-fl-${floorId}`, true);
    const res = await floorApi.delete(floorId);
    setBusyKey(`del-fl-${floorId}`, false);
    if (res.ok) {
      setSections((prev) =>
        prev.map((s) =>
          (s.section_id || s.id) === secId
            ? { ...s, floors: s.floors.filter((f) => (f.floor_id || f.id) !== floorId) }
            : s
        )
      );
      setAlertMsg({ type: "success", text: res.message || "Floor deleted." });
    } else {
      setAlertMsg({ type: "error", text: apiErrorMessage(res.errorCode, res.message) });
    }
  };

  const handleToggleFloor = async (sec, fl) => {
    const secId = sec.section_id || sec.id;
    const floorId = fl.floor_id || fl.id;
    setBusyKey(`tog-fl-${floorId}`, true);
    const res = await floorApi.toggleStatus(floorId);
    setBusyKey(`tog-fl-${floorId}`, false);
    if (res.ok) {
      setSections((prev) =>
        prev.map((s) =>
          (s.section_id || s.id) === secId
            ? { ...s, floors: s.floors.map((f) => (f.floor_id || f.id) === floorId ? { ...f, ...res.data } : f) }
            : s
        )
      );
    } else {
      setAlertMsg({ type: "error", text: apiErrorMessage(res.errorCode, res.message) });
    }
  };

  const handleDeleteRack = async (sec, fl, rack) => {
    const secId = sec.section_id || sec.id;
    const floorId = fl.floor_id || fl.id;
    const rackId = rack.rack_id || rack.id;
    if (!window.confirm(`Delete rack "${rack.rack_name || rack.name}"?`)) return;
    setBusyKey(`del-rk-${rackId}`, true);
    const res = await rackApi.delete(rackId);
    setBusyKey(`del-rk-${rackId}`, false);
    if (res.ok) {
      setSections((prev) =>
        prev.map((s) =>
          (s.section_id || s.id) === secId
            ? {
                ...s,
                floors: s.floors.map((f) =>
                  (f.floor_id || f.id) === floorId
                    ? { ...f, racks: f.racks.filter((r) => (r.rack_id || r.id) !== rackId) }
                    : f
                ),
              }
            : s
        )
      );
      setAlertMsg({ type: "success", text: res.message || "Rack deleted." });
    } else {
      setAlertMsg({ type: "error", text: apiErrorMessage(res.errorCode, res.message) });
    }
  };

  const handleToggleRack = async (sec, fl, rack) => {
    const secId = sec.section_id || sec.id;
    const floorId = fl.floor_id || fl.id;
    const rackId = rack.rack_id || rack.id;
    setBusyKey(`tog-rk-${rackId}`, true);
    const res = await rackApi.toggleStatus(rackId);
    setBusyKey(`tog-rk-${rackId}`, false);
    if (res.ok) {
      setSections((prev) =>
        prev.map((s) =>
          (s.section_id || s.id) === secId
            ? {
                ...s,
                floors: s.floors.map((f) =>
                  (f.floor_id || f.id) === floorId
                    ? { ...f, racks: f.racks.map((r) => (r.rack_id || r.id) === rackId ? { ...r, ...res.data } : r) }
                    : f
                ),
              }
            : s
        )
      );
    } else {
      setAlertMsg({ type: "error", text: apiErrorMessage(res.errorCode, res.message) });
    }
  };

  /* ── Shared status badge ── */
  const StatusBadge = ({ status }) => (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
      status === "active"
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
    }`}>
      {status}
    </span>
  );

  /* ── Render ── */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-[#0d1528]">
        {/* ── Header ── */}
        <div
          className="flex shrink-0 items-start gap-4 border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
          style={{ background: "linear-gradient(135deg, #2f3138 0%, #3a3c44 45%, #4b5563 100%)" }}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <Warehouse className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">{godown.godown_name || godown.godownName}</h2>
            <p className="mt-1 text-sm text-white/65">Sections → Floors → Racks → Spaces</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">

            {/* Info cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {[
                { icon: <Layers3 className="h-4 w-4 text-green-600 dark:text-green-400" />, label: "Godown Code", value: godown.godown_code || godown.godownCode },
                { icon: <PackageOpen className="h-4 w-4 text-green-600 dark:text-green-400" />, label: "Type", value: godown.godown_type || godown.type || "—" },
                { icon: <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />, label: "City", value: godown.city || godown.godown_location || godown.location || "—" },
                { icon: <Warehouse className="h-4 w-4 text-green-600 dark:text-green-400" />, label: "Status", value: godown.status || "—" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#1b2740] dark:bg-[#11182b]">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{icon} {label}</div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
                </div>
              ))}
            </div>

            {/* Alert */}
            {alertMsg && <InlineAlert msg={alertMsg} onClose={() => setAlertMsg(null)} />}

            {/* Section management */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#11182b]">
              <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 dark:border-[#162033] md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Section Management</p>
                  <h3 className="mt-1 text-base font-semibold text-slate-800 dark:text-slate-100">Sections, Floors & Racks</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={triggerRefresh}
                    disabled={loadingSections}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#0d1528]"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${loadingSections ? "animate-spin" : ""}`} />
                    Refresh
                  </button>
                  <button
                    onClick={() => setShowSection(true)}
                    className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #44a83e 0%, #378f32 50%, #2f7d2b 100%)" }}
                  >
                    <Plus className="h-4 w-4" /> Add Section
                  </button>
                </div>
              </div>

              <div className="space-y-4 p-6">
                {loadingSections ? (
                  <div className="flex items-center justify-center gap-3 py-12 text-sm text-slate-500 dark:text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin" /> Loading sections...
                  </div>
                ) : sections.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center dark:border-[#2a3754] dark:bg-[#0d1528]">
                    <FolderKanban className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                    <h4 className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">No sections added yet</h4>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create a section first, then add floors → racks → spaces.</p>
                  </div>
                ) : (
                  sections.map((sec) => {
                    const secId = sec.section_id || sec.id;
                    const secCollapsed = collapsed[`sec-${secId}`];
                    return (
                      <div key={secId} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 dark:border-[#1b2740] dark:bg-[#0d1528]">
                        {/* Section header */}
                        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 dark:border-[#162033] md:flex-row md:items-center md:justify-between">
                          <button
                            className="flex items-center gap-3 text-left flex-1"
                            onClick={() => toggleCollapse(`sec-${secId}`)}
                          >
                            {secCollapsed ? <ChevronRight className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              <FolderKanban className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{sec.section_name || sec.name}</h4>
                                <StatusBadge status={sec.status} />
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {sec.section_code} · {(sec.floors || []).length} floor(s) · {(sec.floors || []).reduce((a, f) => a + (f.racks || []).length, 0)} rack(s)
                              </p>
                            </div>
                          </button>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleToggleSection(sec)}
                              disabled={!!busy[`tog-sec-${secId}`]}
                              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-all hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-400 disabled:opacity-50"
                              title="Toggle status"
                            >
                              {busy[`tog-sec-${secId}`]
                                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                : sec.status === "active"
                                  ? <ToggleRight className="h-3.5 w-3.5 text-green-600" />
                                  : <ToggleLeft className="h-3.5 w-3.5" />}
                            </button>
                            <button
                              onClick={() => handleDeleteSection(sec)}
                              disabled={!!busy[`del-sec-${secId}`]}
                              className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-all hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400 disabled:opacity-50"
                            >
                              {busy[`del-sec-${secId}`] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                            </button>
                            <button
                              onClick={() => setAddFloorTo({ sectionId: secId })}
                              className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-medium text-blue-700 transition-all hover:bg-blue-100 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-400"
                            >
                              <Layers className="h-3.5 w-3.5" /> Add Floor
                            </button>
                          </div>
                        </div>

                        {/* Floors */}
                        {!secCollapsed && (
                          <div className="p-5 space-y-4">
                            {(sec.floors || []).length === 0 ? (
                              <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-6 text-sm text-slate-500 dark:border-[#2a3754] dark:bg-[#11182b] dark:text-slate-400">
                                No floors added in this section.
                              </div>
                            ) : (
                              (sec.floors || []).map((floor) => {
                                const floorId = floor.floor_id || floor.id;
                                const floorKey = `floor-${floorId}`;
                                const isFloorCollapsed = collapsed[floorKey];

                                return (
                                  <div key={floorId} className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-[#1b2740] dark:bg-[#11182b]">
                                    {/* Floor header */}
                                    <div
                                      className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-100 dark:border-[#162033]"
                                      style={{ background: "linear-gradient(135deg, #1e2738 0%, #263145 100%)" }}
                                    >
                                      <button
                                        className="flex items-center gap-2 text-left flex-1"
                                        onClick={() => toggleCollapse(floorKey)}
                                      >
                                        {isFloorCollapsed
                                          ? <ChevronRight className="h-4 w-4 text-white/60" />
                                          : <ChevronDown className="h-4 w-4 text-white/60" />}
                                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500/20 text-orange-400">
                                          <Layers className="h-3.5 w-3.5" />
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-white">{floor.floor_name || floor.name}</span>
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                              floor.status === "active" ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"
                                            }`}>{floor.status}</span>
                                          </div>
                                          <span className="text-xs text-white/50">{floor.floor_code} · {(floor.racks || []).length} rack(s)</span>
                                        </div>
                                      </button>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <button
                                          onClick={() => handleToggleFloor(sec, floor)}
                                          disabled={!!busy[`tog-fl-${floorId}`]}
                                          className="flex items-center justify-center h-7 w-7 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-all disabled:opacity-50"
                                          title="Toggle status"
                                        >
                                          {busy[`tog-fl-${floorId}`] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ToggleRight className="h-3.5 w-3.5" />}
                                        </button>
                                        <button
                                          onClick={() => handleDeleteFloor(sec, floor)}
                                          disabled={!!busy[`del-fl-${floorId}`]}
                                          className="flex items-center justify-center h-7 w-7 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
                                          title="Delete floor"
                                        >
                                          {busy[`del-fl-${floorId}`] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                        </button>
                                        <button
                                          onClick={() => setAddRackTo({ sectionId: secId, floorId })}
                                          className="flex items-center gap-1.5 rounded-xl border border-green-700/50 bg-green-900/30 px-3 py-1.5 text-xs font-medium text-green-400 transition-all hover:bg-green-900/50"
                                        >
                                          <Grid2x2Plus className="h-3.5 w-3.5" /> Add Rack
                                        </button>
                                      </div>
                                    </div>

                                    {/* Racks */}
                                    {!isFloorCollapsed && (
                                      <div className="p-4 space-y-4">
                                        {(floor.racks || []).length === 0 ? (
                                          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500 dark:border-[#2a3754] dark:bg-[#0d1528] dark:text-slate-400">
                                            No racks added on this floor.
                                          </div>
                                        ) : (
                                          (floor.racks || []).map((rack) => {
                                            const rackId = rack.rack_id || rack.id;
                                            return (
                                              <div key={rackId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-[#1b2740] dark:bg-[#0d1528]">
                                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                                  <div className="flex items-center gap-2">
                                                    <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-[#11182b] dark:text-slate-200">
                                                      <Layers3 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                      {rack.rack_name || rack.name}
                                                    </div>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400">{rack.rack_code}</span>
                                                    <StatusBadge status={rack.status} />
                                                  </div>
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                                      {(rack.spaces || []).length} spaces
                                                    </span>
                                                    <button
                                                      onClick={() => handleToggleRack(sec, floor, rack)}
                                                      disabled={!!busy[`tog-rk-${rackId}`]}
                                                      className="flex items-center justify-center h-7 w-7 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-400 disabled:opacity-50"
                                                      title="Toggle status"
                                                    >
                                                      {busy[`tog-rk-${rackId}`] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ToggleRight className="h-3.5 w-3.5" />}
                                                    </button>
                                                    <button
                                                      onClick={() => handleDeleteRack(sec, floor, rack)}
                                                      disabled={!!busy[`del-rk-${rackId}`]}
                                                      className="flex items-center justify-center h-7 w-7 rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400 disabled:opacity-50"
                                                      title="Delete rack"
                                                    >
                                                      {busy[`del-rk-${rackId}`] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                                                    </button>
                                                  </div>
                                                </div>

                                                <SpaceGrid
                                                  rack={rack}
                                                  section={sec}
                                                  floor={floor}
                                                  godown={godown}
                                                  onSpaceAdded={(r, space) => addSpaceLocal(secId, floorId, rackId, space)}
                                                  onSpaceStatusChanged={(r, updatedSpace) => updateSpaceLocal(secId, floorId, rackId, updatedSpace)}
                                                />
                                              </div>
                                            );
                                          })
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Child modals ── */}
      {showSection && (
        <AddSectionModal
          godownId={godownId}
          onAdd={(sec) => { addSectionLocal(sec); setShowSection(false); }}
          onClose={() => setShowSection(false)}
        />
      )}
      {addFloorTo && (
        <AddFloorModal
          godownId={godownId}
          sectionId={addFloorTo.sectionId}
          onAdd={(floor) => { addFloorLocal(addFloorTo.sectionId, floor); setAddFloorTo(null); }}
          onClose={() => setAddFloorTo(null)}
        />
      )}
      {addRackTo && (
        <AddRackModal
          godownId={godownId}
          sectionId={addRackTo.sectionId}
          floorId={addRackTo.floorId}
          onAdd={(rack) => { addRackLocal(addRackTo.sectionId, addRackTo.floorId, rack); setAddRackTo(null); }}
          onClose={() => setAddRackTo(null)}
        />
      )}
    </div>
  );
}