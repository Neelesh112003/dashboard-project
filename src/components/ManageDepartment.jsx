import DepartmentList from "./ManageDepartment/DepartmentList";

export default function ManageDepartment() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#0b1220]">
      <div className="mx-auto max-w-6xl space-y-8">
        <DepartmentList />
      </div>
    </div>
  );
}