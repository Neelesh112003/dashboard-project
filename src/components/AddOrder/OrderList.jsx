import { useState } from "react";
import { Filter, Upload, Download, Trash2, ClipboardList } from "lucide-react";

const STATUS_META = {
  Delivered:  { color: "#44a83e", bg: "rgba(68,168,62,0.1)"   },
  Pending:    { color: "#f59e0b", bg: "rgba(245,158,11,0.1)"  },
  Processing: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)"  },
  Cancelled:  { color: "#ef4444", bg: "rgba(239,68,68,0.1)"   },
};

export default function OrderList({ orders, onDelete }) {
  const [search,     setSearch]     = useState("");
  const [filterCat,  setFilterCat]  = useState("All");
  const [filterStat, setFilterStat] = useState("All");
  const [showFilter, setShowFilter] = useState(false);

  const categories = ["All", ...Array.from(new Set(orders.map((o) => o.category)))];
  const statuses   = ["All", "Pending", "Processing", "Delivered", "Cancelled"];

  const filtered = orders.filter((o) => {
    const matchSearch = o.product.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCat  === "All" || o.category === filterCat;
    const matchStat   = filterStat === "All" || o.status   === filterStat;
    return matchSearch && matchCat && matchStat;
  });

  const handleExport = () => {
    const csv  = ["Product,Variants,Price,Category,Status,Added On",
      ...orders.map((o) => `${o.product},${o.variants},${o.price},${o.category},${o.status},${o.addedOn}`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href = url; a.download = "orders.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (!orders.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[#162033] bg-white dark:bg-[#0d1528] overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-slate-200 dark:border-[#162033]" style={{ backgroundColor: "#3a3c44" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: "rgba(68,168,62,0.2)" }}>
              <ClipboardList className="h-5 w-5" style={{ color: "#44a83e" }} />
            </div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: "#f5f5f5" }}>Recent Orders</h2>
              <p className="text-xs" style={{ color: "rgba(245,245,245,0.5)" }}>{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-lg border px-3 py-1.5 text-xs outline-none bg-white/10 text-white placeholder:text-white/40 border-white/20 focus:border-[#44a83e] w-36"
            />
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
              style={{ color: "#f5f5f5" }}
            >
              <Filter className="h-3.5 w-3.5" /> Filter
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-white/10"
              style={{ color: "#f5f5f5" }}
            >
              <Download className="h-3.5 w-3.5" /> Export File
            </button>
          </div>
        </div>

        {showFilter && (
          <div className="mt-4 flex flex-wrap gap-3 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "rgba(245,245,245,0.6)" }}>Category:</span>
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs text-white outline-none"
              >
                {categories.map((c) => <option key={c} className="text-slate-800">{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "rgba(245,245,245,0.6)" }}>Status:</span>
              <select
                value={filterStat}
                onChange={(e) => setFilterStat(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-1 text-xs text-white outline-none"
              >
                {statuses.map((s) => <option key={s} className="text-slate-800">{s}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#162033]">
              {["Products", "Price", "Category", "Status", "Added On", "Action"].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">No orders match your filter.</td>
              </tr>
            ) : filtered.map((order) => {
              const meta = STATUS_META[order.status] || STATUS_META.Pending;
              return (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-[#11182b] transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{order.product}</p>
                    {order.variants && <p className="text-xs text-slate-400 mt-0.5">{order.variants}</p>}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">$ {order.price}</td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
                      style={{ backgroundColor: meta.bg, color: meta.color }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">{order.addedOn}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onDelete(order.id)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900/40 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}