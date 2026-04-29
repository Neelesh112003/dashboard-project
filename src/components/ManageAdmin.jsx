import { useState } from "react";
import AdminList from "./ManageAdmin/AdminList";

const dummyAdmins = [
  {
    id: 1,
    fullName: "Neelesh Gupta",
    email: "neelesh@company.com",
    department: "Engineering",
    contact: "+91 98765 43210",
    role: "Admin",
    username: "neelesh_gupta",
    remarks: "",
    status: "active",
    addedOn: "27 Apr 2026",
  },
  {
    id: 2,
    fullName: "Amit Kumar",
    email: "amit@company.com",
    department: "IT & Security",
    contact: "+91 91234 56789",
    role: "Super Admin",
    username: "amit_kumar",
    remarks: "",
    status: "active",
    addedOn: "24 Apr 2026",
  },
  {
    id: 3,
    fullName: "Rahul Sharma",
    email: "rahul@company.com",
    department: "Operations",
    contact: "+91 99887 76655",
    role: "Manager",
    username: "rahul_sharma",
    remarks: "",
    status: "active",
    addedOn: "20 Apr 2026",
  },
];

export default function ManageAdmins() {
  const [admins, setAdmins] = useState(dummyAdmins);

  const handleAdd = (admin) => {
    setAdmins((prev) => [...prev, admin]);
  };

  const handleDelete = (id) => {
    setAdmins((prev) => prev.filter((admin) => admin.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1220] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <AdminList admins={admins} onAdd={handleAdd} onDelete={handleDelete} />
      </div>
    </div>
  );
}