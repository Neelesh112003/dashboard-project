import { X, Users, Building2, MapPin, Phone, UserCircle } from "lucide-react";

export default function ViewTeam({ team, onClose }) {
  if (!team) return null;

  const isActive = team.status === "active";

  const fields = [
    { label: "Team Name", value: team.teamName },
    { label: "Department", value: team.department },
    { label: "Team Lead", value: team.teamLead },
    { label: "Contact", value: team.contact },
    { label: "Work Location", value: team.workLocation },
    { label: "Members", value: team.members },
    { label: "Remarks", value: team.remarks },
    { label: "Status", value: team.status },
    { label: "Created On", value: team.createdOn },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0d1528]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5" style={{ backgroundColor: "#44a83e" }}>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-lg text-white"
              style={{ backgroundColor: "rgba(245,245,245,0.15)" }}
            >
              {team.teamName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">{team.teamName}</h3>
              <p className="text-xs" style={{ color: "rgba(245,245,245,0.6)" }}>
                Team Details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-1">
          {fields.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-[#162033] last:border-0 gap-4"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {label}
              </span>

              {label === "Status" ? (
                <span
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold"
                  style={{
                    backgroundColor: isActive ? "rgba(45,110,42,0.1)" : "rgba(239,68,68,0.1)",
                    color: isActive ? "#2d6e2a" : "#ef4444",
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: isActive ? "#2d6e2a" : "#ef4444" }}
                  />
                  {isActive ? "Active" : "Inactive"}
                </span>
              ) : (
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 text-right max-w-[60%] wrap-break-word">
                  {value || "—"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}