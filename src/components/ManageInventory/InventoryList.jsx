import { useState } from "react";
import { Eye, Trash2, Pencil, Boxes, Plus, PackagePlus, ArrowRightLeft, Search } from "lucide-react";
import AddInventoryForm from "./AddInventoryForm";
import ViewInventory from "./ViewInventory";

const TRANSACTION_META = {
  entry:    { label: "Entry",           color: "#2d6e2a", bg: "rgba(45,110,42,0.12)",  icon: PackagePlus    },
  drawings: { label: "Drawings",        color: "#1d4ed8", bg: "rgba(29,78,216,0.12)",  icon: Pencil         },
  transfer: { label: "Godown Transfer", color: "#7c3aed", bg: "rgba(124,58,237,0.12)", icon: ArrowRightLeft },
};

const GODOWN_NAMES = {
  "GDN-001": "Main Storage Warehouse",
  "GDN-002": "Raw Material Store",
  "GDN-003": "SMT Component Store",
  "GDN-004": "Scrap Yard",
};

export default function InventoryList({ entries = [], onDelete, onAdd }) {
  const [viewEntry, setViewEntry] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [txFilter, setTxFilter] = useState("all");

  const filtered = entries.filter((e) => {
    const matchSearch =
      !search.trim() ||
      (e.itemName  || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.productCode || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.productHSN  || "").toLowerCase().includes(search.toLowerCase());
    const matchTx = txFilter === "all" || e.transaction === txFilter;
    return matchSearch && matchTx;
  });

  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-[#162033] bg-white dark:bg-[#0d1528] overflow-hidden shadow-sm">

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-[#162033]" style={{ backgroundColor: "#3a3c44" }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(245,245,245,0.12)" }}>
                <Boxes className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Inventory Management</h2>
                <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>
                  {entries.length} entr{entries.length !== 1 ? "ies" : "y"} recorded
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#44a83e", color: "#fff" }}
            >
              <Plus className="h-4 w-4" />
              New Entry
            </button>
          </div>
        </div>

        {/* Filters */}
        {entries.length > 0 && (
          <div className="px-6 py-4 border-b border-slate-100 dark:border-[#162033] flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-50">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search item, code, HSN…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-[#1b2740] bg-slate-50 dark:bg-[#11182b] pl-9 pr-4 py-2 text-sm text-slate-800 dark:text-slate-100 outline-none"
              />
            </div>
            <div className="flex gap-2">
              {["all", "entry", "drawings", "transfer"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTxFilter(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                    txFilter === t
                      ? "bg-[#3a3c44] text-white"
                      : "bg-slate-100 dark:bg-[#11182b] text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#162033]"
                  }`}
                >
                  {t === "all" ? "All" : TRANSACTION_META[t]?.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#11182b] mb-4">
              <Boxes className="h-7 w-7 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No inventory entries yet</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Click "New Entry" to record your first inventory transaction.</p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#44a83e" }}
            >
              <Plus className="h-4 w-4" />
              New Entry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <Search className="h-8 w-8 text-slate-300 mb-3" />
            <p className="text-sm font-semibold text-slate-500">No matching entries</p>
            <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {["#", "Item", "Code", "HSN", "Qty", "Rate", "Value", "Transaction", "Godown", "Rack / Section", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
                {filtered.map((entry, idx) => {
                  const txMeta   = TRANSACTION_META[entry.transaction] ?? TRANSACTION_META.entry;
                  const TxIcon   = txMeta.icon;
                  const isTransfer = entry.transaction === "transfer";

                  const godownLabel = isTransfer
                    ? `${entry.godownFrom} → ${entry.godownTo}`
                    : entry.godown
                    ? `${GODOWN_NAMES[entry.godown] ?? entry.godown}`
                    : "—";

                  return (
                    <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-[#11182b] transition-colors">
                      <td className="px-4 py-4 text-xs text-slate-400">{idx + 1}</td>

                      {/* Item */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg shrink-0" style={{ backgroundColor: "#3a3c44" }}>
                            <Boxes className="h-3.5 w-3.5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap text-xs">{entry.itemName || "—"}</p>
                            <p className="text-xs text-slate-400">{entry.productAlias || ""}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#11182b] px-2 py-0.5 rounded-lg whitespace-nowrap">
                          {entry.productCode || "—"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        {entry.productHSN || "—"}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                        {entry.quantity} <span className="text-xs font-normal text-slate-400">{entry.unit}</span>
                      </td>

                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {entry.rate ? `₹${parseFloat(entry.rate).toLocaleString("en-IN")}` : "—"}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                        {entry.value ? `₹${parseFloat(entry.value).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "—"}
                      </td>

                      {/* Transaction */}
                      <td className="px-4 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold whitespace-nowrap"
                          style={{ backgroundColor: txMeta.bg, color: txMeta.color }}
                        >
                          <TxIcon className="h-3 w-3" />
                          {txMeta.label}
                        </span>
                      </td>

                      {/* Godown */}
                      <td className="px-4 py-4 text-xs text-slate-600 dark:text-slate-300 max-w-37.5 truncate" title={godownLabel}>
                        {godownLabel}
                      </td>

                      {/* Rack / Section */}
                      <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {!isTransfer && (entry.rack || entry.section)
                          ? `${entry.rack || "—"} / ${entry.section || "—"}`
                          : "—"}
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-400 whitespace-nowrap">{entry.addedOn || "—"}</td>

                      {/* Actions */}
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewEntry(entry)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#1b2740] px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#11182b] transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                          <button className="flex items-center gap-1 rounded-lg border border-blue-200 dark:border-blue-900/40 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => onDelete?.(entry.id)}
                            className="flex items-center gap-1 rounded-lg border border-red-200 dark:border-red-900/40 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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

      {viewEntry  && <ViewInventory  entry={viewEntry}   onClose={() => setViewEntry(null)}   />}
      {showCreate && <AddInventoryForm onAdd={onAdd}     onClose={() => setShowCreate(false)} />}
    </>
  );
}