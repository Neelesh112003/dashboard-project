import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

const data = [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const maxVal = 400;

export default function MonthlySalesChart() {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Monthly Sales
        </h3>

        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center rounded-lg p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute right-0 z-20 mt-1 w-36 rounded-xl border border-gray-100 bg-white py-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-3 py-1.5 text-left text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  View More
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full px-3 py-1.5 text-left text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-180 xl:min-w-full">
          <div className="flex gap-3">
            {/* Y Axis Labels */}
            <div className="relative h-52 w-10 pb-6">
              <div className="absolute inset-0 flex flex-col justify-between pb-6 text-xs text-gray-400 dark:text-gray-500">
                {[400, 300, 200, 100, 0].map((label) => (
                  <span key={label} className="translate-y-1/2">
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Chart Area */}
            <div className="relative h-52 flex-1">
              {/* Grid Lines */}
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-6">
                {[400, 300, 200, 100, 0].map((label) => (
                  <div
                    key={label}
                    className="w-full border-t border-dashed border-gray-100 dark:border-gray-800"
                  />
                ))}
              </div>

              {/* Bars */}
              <div className="relative flex h-full items-end gap-2 pb-6">
                {data.map((val, i) => {
                  const heightPct = (val / maxVal) * 100;

                  return (
                    <div
                      key={i}
                      className="relative flex flex-1 flex-col items-center justify-end h-full"
                      onMouseEnter={() => setTooltip(i)}
                      onMouseLeave={() => setTooltip(null)}
                    >
                      {tooltip === i && (
                        <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-800 px-2 py-1 text-xs text-white dark:bg-gray-700">
                          {val}
                        </div>
                      )}

                      <div
                        className="w-3 rounded-t-md bg-[#465fff] transition-opacity hover:opacity-80"
                        style={{ height: `${heightPct}%` }}
                      />

                      <span className="absolute -bottom-5 text-xs text-gray-500 dark:text-gray-400">
                        {months[i]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}