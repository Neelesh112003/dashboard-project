import { useState } from "react";
import {
  Eye,
  Trash2,
  Users,
  UserPlus,
  Pencil,
  MapPin,
  Building2,
  UserCircle,
} from "lucide-react";
import CreateTeamForm from "./CreateTeamForm";
import ViewTeam from "./ViewTeam";

export default function TeamList({ teams = [], departments = [], onDelete, onAdd }) {
  const [viewTeam, setViewTeam] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <div className="rounded-2xl border border-slate-200 dark:border-[#162033] bg-white dark:bg-[#0d1528] overflow-hidden shadow-sm">
        <div
          className="px-6 py-5 border-b border-slate-200 dark:border-[#162033]"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg"
                style={{ backgroundColor: "rgba(245,245,245,0.12)" }}
              >
                <Users className="h-5 w-5" style={{ color: "#f5f5f5" }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: "#f5f5f5" }}>
                  Team List
                </h2>
                <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>
                  {teams.length} team{teams.length !== 1 ? "s" : ""} registered
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: "#44a83e", color: "#fff" }}
            >
              <UserPlus className="h-4 w-4" />
              Create Team
            </button>
          </div>
        </div>

        {teams.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#11182b] mb-4">
              <Users className="h-7 w-7 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
              No teams yet
            </p>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Click "Create Team" to add your first team.
            </p>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ backgroundColor: "#44a83e" }}
            >
              <UserPlus className="h-4 w-4" />
              Create Team
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#162033]">
                  {[
                    "#",
                    "Team",
                    "Department",
                    "Lead",
                    "Location",
                    "Members",
                    "Status",
                    "Created On",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-[#162033]">
                {teams.map((team, idx) => {
                  const isActive = team.status === "active";

                  return (
                    <tr
                      key={team.id}
                      className="hover:bg-slate-50 dark:hover:bg-[#11182b] transition-colors"
                    >
                      <td className="px-5 py-4 text-xs text-slate-400">{idx + 1}</td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-full text-white text-sm font-bold shrink-0"
                            style={{ backgroundColor: "#3a3c44" }}
                          >
                            {team.teamName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                              {team.teamName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {team.remarks ? `${team.remarks.substring(0, 50)}...` : "No remarks"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4 text-slate-400" />
                          {team.department || "—"}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <UserCircle className="h-4 w-4 text-slate-400" />
                          {team.teamLead || "—"}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          {team.workLocation || "—"}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {team.members || 0}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold whitespace-nowrap"
                          style={{
                            backgroundColor: isActive
                              ? "rgba(45,110,42,0.1)"
                              : "rgba(239,68,68,0.1)",
                            color: isActive ? "#2d6e2a" : "#ef4444",
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                              backgroundColor: isActive ? "#2d6e2a" : "#ef4444",
                            }}
                          />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-400 whitespace-nowrap">
                        {team.createdOn || "—"}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewTeam(team)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#1b2740] px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#11182b] transition-colors whitespace-nowrap"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>

                          <button className="flex items-center gap-1.5 rounded-lg border border-blue-200 dark:border-blue-900/40 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors whitespace-nowrap">
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>

                          <button
                            onClick={() => onDelete?.(team.id)}
                            className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-900/40 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors whitespace-nowrap"
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

      {viewTeam && <ViewTeam team={viewTeam} onClose={() => setViewTeam(null)} />}

      {showCreate && (
        <CreateTeamForm
          onAdd={onAdd}
          onClose={() => setShowCreate(false)}
          departments={departments}
        />
      )}
    </>
  );
}