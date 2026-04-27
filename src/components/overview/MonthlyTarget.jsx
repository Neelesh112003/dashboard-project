import { useState } from "react";
import {
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function MonthlyTarget() {
  const [isOpen, setIsOpen] = useState(false);

  const percentage = 75.55;
  const radius = 80;
  const circumference = Math.PI * radius;
  const offset =
    circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/3">
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
              className="flex items-center justify-center rounded-lg p-1 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-300"
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
                    className="w-full px-3 py-2 text-left text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                  >
                    View More
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full px-3 py-2 text-left text-sm text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Gauge */}
        <div className="relative flex items-center justify-center">
          <svg
            width="360"
            height="180"
            viewBox="0 0 200 120"
            className="overflow-visible"
          >
            <path
              d="M 20 110 A 80 80 0 0 1 180 110"
              fill="none"
              stroke="#E4E7EC"
              strokeWidth="5"
              strokeLinecap="round"
            />

            <path
              d="M 20 110 A 80 80 0 0 1 180 110"
              fill="none"
              stroke="#44A83E"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>

          <div className="absolute top-1/2 left-1/2 mt-6 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2">
            <span className="text-3xl font-medium text-gray-900 dark:text-white">
              {percentage}%
            </span>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              +10%
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-sm text-center text-sm text-gray-500 dark:text-gray-400 sm:text-base">
          You earned $3,287 today, which is higher than last month.
          Keep up the excellent work!
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-5 px-6 py-4 sm:gap-8 sm:py-5">
        <StatItem label="Target" value="$20K" trend="down" />
        <Divider />
        <StatItem label="Revenue" value="$20K" trend="up" />
        <Divider />
        <StatItem label="Today" value="$20K" trend="up" />
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="h-7 w-px bg-gray-200 dark:bg-gray-800" />
  );
}

function StatItem({ label, value, trend }) {
  return (
    <div className="text-center">
      <p className="mb-1 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
        {label}
      </p>

      <div className="flex items-center justify-center gap-1">
        <span className="text-base font-semibold text-gray-800 dark:text-white sm:text-lg">
          {value}
        </span>

        {trend === "up" ? (
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
      </div>
    </div>
  );
}