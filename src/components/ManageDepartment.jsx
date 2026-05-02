import { useState } from "react";
import DepartmentList from "./ManageDepartment/DepartmentList";

const dummyDepartments = [
  {
    id: 1,
    name: "Engineering",
    workLocation: "Delhi Office",
    category: "Engineering",
    departmentHead: "Amit Sharma",
    remarks: "Handles product development and technical delivery.",
    status: "active",
    createdOn: "27 Apr 2026",
  },
  {
    id: 2,
    name: "Human Resources",
    workLocation: "Mumbai Office",
    category: "Human Resources",
    departmentHead: "Neha Verma",
    remarks: "Manages hiring, employee engagement, and policies.",
    status: "active",
    createdOn: "24 Apr 2026",
  },
  {
    id: 3,
    name: "Finance",
    workLocation: "Bangalore Office",
    category: "Finance",
    departmentHead: "Rohit Mehta",
    remarks: "Responsible for budgeting, payroll, and accounts.",
    status: "inactive",
    createdOn: "20 Apr 2026",
  },
  {
    id: 4,
    name: "IT Security",
    workLocation: "Hyderabad Office",
    category: "IT & Security",
    departmentHead: "Priya Nair",
    remarks: "Oversees infrastructure, access control, and security compliance.",
    status: "active",
    createdOn: "18 Apr 2026",
  },
];

export default function ManageDepartment() {
  const [departments, setDepartments] = useState(dummyDepartments);

  const handleAddDepartment = (department) => {
    setDepartments((prev) => [...prev, department]);
  };

  const handleDeleteDepartment = (id) => {
    setDepartments((prev) =>
      prev.filter((department) => department.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#0b1220]">
      <div className="mx-auto max-w-6xl space-y-8">
        <DepartmentList
          departments={departments}
          onAdd={handleAddDepartment}
          onDelete={handleDeleteDepartment}
        />
      </div>
    </div>
  );
}