import AdminList from "./ManageAdmin/AdminList";

export default function ManageAdmins() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1220] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <AdminList />
      </div>
    </div>
  );
}