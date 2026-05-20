import { useState, useEffect, useCallback } from "react";
import {
  Plus, Eye, Warehouse, MapPin, Layers3, Search, ToggleLeft,
  ToggleRight, Trash2, Loader2, AlertCircle, RefreshCw, X,
} from "lucide-react";
import AddGodownModal from "./ManageGodown/AddGodownForm";
import ViewGodownModal from "./ManageGodown/ViewGodownModal";
import { godownApi, apiErrorMessage } from "./ManageGodown/Godownapi";

function AlertBanner({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
      msg.type === "success"
        ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
        : "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
    }`}>
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span className="flex-1">{msg.text}</span>
      <button onClick={onClose}><X className="h-4 w-4 opacity-60 hover:opacity-100" /></button>
    </div>
  );
}

export default function GodownManagement() {
  const [godowns, setGodowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);

  // per-card busy states
  const [busy, setBusy] = useState({});
  const setBusyKey = (key, val) => setBusy((p) => ({ ...p, [key]: val }));

  /* ── Fetch list ── */
  const fetchGodowns = useCallback(async () => {
    setLoading(true);
    const params = {};
    if (searchTerm.trim()) params.search = searchTerm.trim();
    if (filterStatus) params.status = filterStatus;

    const res = await godownApi.list(params);
    setLoading(false);
    if (res.ok) {
      setGodowns(res.data?.data ?? res.data ?? []);
    } else {
      setAlertMsg({ type: "error", text: apiErrorMessage(res.errorCode, res.message) });
    }
  }, [searchTerm, filterStatus]);

  useEffect(() => { fetchGodowns(); }, [fetchGodowns]);

  /* ── Add ── */
  const handleAdd = (g) => {
    setGodowns((prev) => [g, ...prev]);
    setShowAdd(false);
  };

  /* ── Toggle status ── */
  const handleToggle = async (g) => {
    const id = g.godown_id || g.id;
    setBusyKey(`tog-${id}`, true);
    const res = await godownApi.toggleStatus(id);
    setBusyKey(`tog-${id}`, false);
    if (res.ok) {
      setGodowns((prev) => prev.map((gd) => (gd.godown_id || gd.id) === id ? { ...gd, ...res.data } : gd));
      setAlertMsg({ type: "success", text: res.message || "Status updated." });
    } else {
      setAlertMsg({ type: "error", text: apiErrorMessage(res.errorCode, res.message) });
    }
  };

  /* ── Delete ── */
  const handleDelete = async (g) => {
    const id = g.godown_id || g.id;
    if (!window.confirm(`Delete godown "${g.godown_name || g.godownName}"? This cannot be undone.`)) return;
    setBusyKey(`del-${id}`, true);
    const res = await godownApi.delete(id);
    setBusyKey(`del-${id}`, false);
    if (res.ok) {
      setGodowns((prev) => prev.filter((gd) => (gd.godown_id || gd.id) !== id));
      setAlertMsg({ type: "success", text: res.message || "Godown deleted." });
    } else {
      setAlertMsg({ type: "error", text: apiErrorMessage(res.errorCode, res.message) });
    }
  };

  const StatusBadge = ({ status }) => (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
      status === "active"
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
    }`}>
      {status || "—"}
    </span>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#081120]">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Main card ── */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">

          {/* Header */}
          <div
            className="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between"
            style={{ background: "linear-gradient(135deg, #2f3138 0%, #3a3c44 45%, #4b5563 100%)" }}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <Warehouse className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-white">Godown Management</h1>
                <p className="mt-1 text-sm text-white/70">Manage all godowns, sections, floors, racks and spaces.</p>
              </div>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 active:scale-95"
              style={{ background: "linear-gradient(135deg, #44a83e 0%, #378f32 50%, #2f7d2b 100%)" }}
            >
              <Plus className="h-4 w-4" />
              Add New Godown
            </button>
          </div>

          {/* Search / Filter bar */}
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 dark:border-[#162033] md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-100 placeholder:text-slate-400 focus:border-green-400"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-100 focus:border-green-400"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              onClick={fetchGodowns}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-400 dark:hover:bg-[#11182b] disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Alert */}
          {alertMsg && (
            <div className="px-6 pt-4">
              <AlertBanner msg={alertMsg} onClose={() => setAlertMsg(null)} />
            </div>
          )}

          {/* Cards */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500 dark:text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading godowns...
              </div>
            ) : godowns.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-[#2a3754] dark:bg-[#11182b]">
                <Warehouse className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
                <h4 className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">No godowns found</h4>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add your first godown to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {godowns.map((g) => {
                  const id = g.godown_id || g.id;
                  return (
                    <div
                      key={id}
                      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-[#1b2740] dark:bg-[#11182b]"
                    >
                      {/* Card top */}
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-green-100 to-emerald-50 text-green-700 dark:from-green-900/30 dark:to-emerald-900/10 dark:text-green-400">
                          <Warehouse className="h-5 w-5" />
                        </div>
                        <StatusBadge status={g.status} />
                      </div>

                      {/* Name & code */}
                      <div className="space-y-1">
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{g.godown_name || g.godownName}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{g.godown_code || g.godownCode}</p>
                      </div>

                      {/* Details */}
                      <div className="mt-4 space-y-2 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-[#162033] dark:bg-[#0d1528]">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <MapPin className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                          <span className="truncate">{g.city || g.godown_location || g.location || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <Layers3 className="h-4 w-4 text-slate-400 dark:text-slate-500 shrink-0" />
                          <span>{g.sections_count ?? g.total_sections ?? 0} Sections · {g.floors_count ?? g.total_floors ?? 0} Floors · {g.racks_count ?? g.total_racks ?? 0} Racks</span>
                        </div>
                        {g.godown_type && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">Type: {g.godown_type}</div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {/* Toggle */}
                          <button
                            onClick={() => handleToggle(g)}
                            disabled={!!busy[`tog-${id}`]}
                            className="flex items-center justify-center h-9 w-9 rounded-xl border border-slate-200 text-slate-500 transition-all hover:bg-slate-50 dark:border-[#1b2740] dark:text-slate-400 disabled:opacity-50"
                            title={g.status === "active" ? "Deactivate" : "Activate"}
                          >
                            {busy[`tog-${id}`]
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : g.status === "active"
                                ? <ToggleRight className="h-4 w-4 text-green-600" />
                                : <ToggleLeft className="h-4 w-4" />}
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(g)}
                            disabled={!!busy[`del-${id}`]}
                            className="flex items-center justify-center h-9 w-9 rounded-xl border border-red-200 bg-red-50 text-red-500 transition-all hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400 disabled:opacity-50"
                            title="Delete godown"
                          >
                            {busy[`del-${id}`]
                              ? <Loader2 className="h-4 w-4 animate-spin" />
                              : <Trash2 className="h-4 w-4" />}
                          </button>
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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showAdd && (
        <AddGodownModal onAdd={handleAdd} onClose={() => setShowAdd(false)} />
      )}
      {selected && (
        <ViewGodownModal
          godown={selected}
          onClose={() => setSelected(null)}
          onGodownUpdated={(updated) => {
            setGodowns((prev) => prev.map((g) => (g.godown_id || g.id) === (updated.godown_id || updated.id) ? updated : g));
            setSelected(updated);
          }}
        />
      )}
    </div>
  );
}