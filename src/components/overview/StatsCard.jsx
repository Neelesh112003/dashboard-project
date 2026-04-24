export default function StatsCard({ title, value, icon: Icon, trend, trendType = "up" }) {
  const trendStyles =
    trendType === "up"
      ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
      : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400";

  const TrendIcon = trendType === "up"
    ? () => (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      )
    : () => (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      );

  return (
    <div className=" bg-white dark:bg-[#11182b] border border-slate-200 dark:border-[#162033] rounded-xl p-6">
      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-[#0f172a] flex items-center justify-center mb-3.5">
        <Icon className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{title}</p>

      <div className="flex items-end justify-between gap-2">
        <span className="text-[26px] font-medium leading-none tracking-tight text-slate-900 dark:text-white">
          {value}
        </span>
        <span className={`flex items-center gap-1 text-[11px] font-medium rounded-full px-2 py-1 whitespace-nowrap ${trendStyles}`}>
          <TrendIcon />
          {trend}
        </span>
      </div>
    </div>
  );
}