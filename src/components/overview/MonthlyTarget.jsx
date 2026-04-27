import { useState } from "react";
import { MoreHorizontal } from "lucide-react";

export default function MonthlyTarget() {
  const [isOpen, setIsOpen] = useState(false);
  const percentage = 75.55;
  const radius = 80;
  const circumference = Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/3">
      {/* Top white card */}
      <div className="rounded-2xl bg-white px-5 pt-5 pb-11 shadow-sm dark:bg-gray-900 sm:px-6 sm:pt-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Monthly Target
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Target you've set for each month
            </p>
          </div>
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

        {/* Radial gauge */}
        <div className="relative flex items-center justify-center">
          <svg
            width="260"
            height="160"
            viewBox="0 0 200 120"
            className="overflow-visible"
          >
            {/* Track */}
            <path
              d={`M 20 110 A 80 80 0 0 1 180 110`}
              fill="none"
              stroke="#E4E7EC"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Progress */}
            <path
              d={`M 20 110 A 80 80 0 0 1 180 110`}
              fill="none"
              stroke="#44a83e"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          {/* Center labels */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 mt-6">
            <span className="text-4xl font-semibold text-gray-800 dark:text-white/90">
              {percentage}%
            </span>
            <span className="rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-500">
              +10%
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-95 text-center text-sm text-gray-500 sm:text-base dark:text-gray-400">
          You earn $3287 today, it's higher than last month. Keep up your good
          work!
        </p>
      </div>

      {/* Bottom stats row */}
      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        <StatItem label="Target" value="$20K" trend="down" />
        <div className="h-7 w-px bg-gray-200 dark:bg-gray-800" />
        <StatItem label="Revenue" value="$20K" trend="up" />
        <div className="h-7 w-px bg-gray-200 dark:bg-gray-800" />
        <StatItem label="Today" value="$20K" trend="up" />
      </div>
    </div>
  );
}

function StatItem({ label, value, trend }) {
  return (
    <div className="text-center">
      <p className="mb-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
        {label}
      </p>
      <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
        {value}
        {trend === "up" ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z"
              fill="#039855"
            />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z"
              fill="#D92D20"
            />
          </svg>
        )}
      </p>
    </div>
  );
}
