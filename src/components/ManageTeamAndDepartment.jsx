import { useState } from "react";
import TeamList from "./ManageTeam/TeamList";
import DepartmentList from "./ManageDepartment/DepartmentList";

const dummyDepartments = [
  {
    id: 1,
    name: "Engineering",
    workLocation: "Delhi Office",
    category: "Engineering",
    remarks: "Handles product development and technical delivery.",
    status: "active",
    createdOn: "27 Apr 2026",
  },
  {
    id: 2,
    name: "Human Resources",
    workLocation: "Mumbai Office",
    category: "Human Resources",
    remarks: "Manages hiring, employee engagement, and policies.",
    status: "active",
    createdOn: "24 Apr 2026",
  },
  {
    id: 3,
    name: "Finance",
    workLocation: "Bangalore Office",
    category: "Finance",
    remarks: "Responsible for budgeting, payroll, and accounts.",
    status: "inactive",
    createdOn: "20 Apr 2026",
  },
  {
    id: 4,
    name: "IT Security",
    workLocation: "Hyderabad Office",
    category: "IT & Security",
    remarks: "Oversees infrastructure, access control, and security compliance.",
    status: "active",
    createdOn: "18 Apr 2026",
  },
];

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

export default function ManageTeamAndDepartment() {
  const [departments, setDepartments] = useState(dummyDepartments);
  const [teams, setTeams] = useState(dummyTeams);

  const handleAddDepartment = (department) => {
    setDepartments((prev) => [...prev, department]);
  };

  const handleDeleteDepartment = (id) => {
    setDepartments((prev) => prev.filter((department) => department.id !== id));
  };

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
          departments={departments}
          onAdd={handleAddTeam}
          onDelete={handleDeleteTeam}
        />

        <DepartmentList
          departments={departments}
          onAdd={handleAddDepartment}
          onDelete={handleDeleteDepartment}
        />
      </div>
    </div>
  );
}