import { Filter, ChevronLeft, ChevronRight, Boxes } from "lucide-react";
import { useState } from "react";
import ExportTable from "./ExportTable";

const ITEMS_PER_PAGE = 10;

export default function CreateTable({
  title,
  data = [],
  columns = [],
  filtersConfig = [],
  actions = [], // ✅ NEW PROP
}) {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const uniqueValues = (key) => [
    ...new Set(data.map((d) => d[key]).filter(Boolean)),
  ];

  const filteredData = data
    .filter((item) =>
      filtersConfig.every((key) => !filters[key] || item[key] === filters[key]),
    )
    .filter((item) => {
      if (!search) return true;

      return Object.values(item).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase()),
      );
    });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginated = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
      {/* HEADER */}
      <div
        className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
        style={{ backgroundColor: "#3a3c44" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <Boxes className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="text-xs text-white/60">
                {filteredData.length} items
              </p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1); // reset page
            }}
            className="ml-auto rounded-lg border mx-2 border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-blue-400 dark:border-[#1b2740] dark:bg-[#0d1528] dark:text-slate-300"
          />

          <ExportTable title={title} columns={columns} data={filteredData} />
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 bg-slate-50 px-6 py-3 dark:border-[#162033] dark:bg-[#0d1f38]">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Filter className="h-3.5 w-3.5" />
          Filter
        </div>

        {filtersConfig.map((key) => (
          <select
            key={key}
            value={filters[key] || ""}
            onChange={(e) => {
              setFilters({ ...filters, [key]: e.target.value });
              setCurrentPage(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-blue-400 dark:border-[#1b2740] dark:bg-[#0d1528] dark:text-slate-300"
          >
            <option value="">All {key}</option>
            {uniqueValues(key).map((val) => (
              <option key={val}>{val}</option>
            ))}
          </select>
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#162033]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400"
                >
                  {col.label}
                </th>
              ))}

              {/* ✅ ACTION COLUMN */}
              {actions.length > 0 && (
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-10 text-center text-sm text-slate-400"
                >
                  No data found
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-slate-50 dark:hover:bg-[#11182b]"
                >
                  {/* DATA CELLS */}
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      {row[col.key]}
                    </td>
                  ))}

                  {/* ✅ DYNAMIC ACTIONS */}
                  {actions.length > 0 && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {actions.map((action, i) => {
                          const Icon = action.icon;

                          return (
                            <button
                              key={i}
                              onClick={() => action.onClick(row)}
                              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium 
                              ${
                                action.className ||
                                "border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-[#1b2740] dark:text-slate-300 dark:hover:bg-[#11182b]"
                              }`}
                            >
                              {Icon && <Icon className="h-3.5 w-3.5" />}
                              {action.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-[#162033]">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
            <ChevronLeft />
          </button>

          <span>
            {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
