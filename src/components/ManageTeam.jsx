import { useState } from "react";
import TeamList from "./ManageTeam/TeamList";

const dummyTeams = [
  {
    id: 1,
    teamName: "Frontend Team",
    department: "Engineering",
    teamLead: "Rahul Sharma",
    contact: "+91 98765 43210",
    workLocation: "Delhi Office",
    members: 8,
    remarks: "Handles dashboard and UI development.",
    status: "active",
    createdOn: "27 Apr 2026",
  },
  {
    id: 2,
    teamName: "Backend Team",
    department: "Engineering",
    teamLead: "Amit Kumar",
    contact: "+91 91234 56789",
    workLocation: "Delhi Office",
    members: 6,
    remarks: "Manages APIs, database, and server logic.",
    status: "active",
    createdOn: "25 Apr 2026",
  },
  {
    id: 3,
    teamName: "Recruitment Team",
    department: "Human Resources",
    teamLead: "Priya Verma",
    contact: "+91 99887 76655",
    workLocation: "Mumbai Office",
    members: 5,
    remarks: "Manages hiring pipeline and interviews.",
    status: "inactive",
    createdOn: "22 Apr 2026",
  },
];

export default function ManageTeam() {

  const [teams, setTeams] = useState(dummyTeams);

  const handleAddTeam = (team) => {
    setTeams((prev) => [...prev, team]);
  };

  const handleDeleteTeam = (id) => {
    setTeams((prev) => prev.filter((team) => team.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1220] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <TeamList
          teams={teams}
          onAdd={handleAddTeam}
          onDelete={handleDeleteTeam}
        />
      </div>
    </div>
  );
}