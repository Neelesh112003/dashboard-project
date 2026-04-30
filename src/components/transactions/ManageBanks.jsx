import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateForm from "../CreateForm";
import CreateTable from "../CreateTable";
import {
  Plus,
  Building2,
  Hash,
  CreditCard,
  Eye,
  Trash2,
} from "lucide-react";

export default function ManageBanks() {
  const [activeForm, setActiveForm] = useState(false);
  const [banks, setBanks] = useState([]);

  const navigate = useNavigate();

  const handleAdd = (data) => {
    setBanks((prev) => [{ ...data, id: Date.now() }, ...prev]);
    setActiveForm(false);
  };

  const handleDelete = (id) => {
    setBanks((prev) => prev.filter((b) => b.id !== id));
  };

  const initialState = {
    name: "",
    ifsc: "",
    accountType: "",
    accountNumber: "",
  };

  const fields = [
    {
      name: "name",
      label: "Bank Name",
      icon: Building2,
      type: "text",
    },
    {
      name: "ifsc",
      label: "IFSC Code",
      icon: Hash,
      type: "text",
    },
    {
      name: "accountType",
      label: "Account Type",
      icon: CreditCard,
      type: "select",
      options: ["Savings", "Current"],
    },
    {
      name: "accountNumber",
      label: "Account Number",
      icon: CreditCard,
      type: "text",
    },
  ];

  const columns = [
    { label: "Bank Name", key: "name" },
    { label: "IFSC", key: "ifsc" },
    { label: "Type", key: "accountType" },
    { label: "Account No.", key: "accountNumber" },
  ];

  const actions = [
    {
      label: "View",
      icon: Eye,
      onClick: (row) =>
        navigate(`/transactions/bank-book?bank=${row.name}`),
    },
    {
      label: "Delete",
      icon: Trash2,
      onClick: (row) => handleDelete(row.id),
      className: "border-red-200 text-red-500 hover:bg-red-50",
    },
  ];

  return (
    <>
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setActiveForm(true)}
          className="flex items-center gap-2 bg-[#44a83e] px-5 py-2 rounded-xl text-white"
        >
          <Plus className="h-4 w-4" /> Add Bank
        </button>
      </div>

      <div className="space-y-8">
        {activeForm && (
          <CreateForm
            title="Add Bank"
            subtitle="Manage your bank accounts"
            fields={fields}
            initialState={initialState}
            onSubmit={handleAdd}
            onImport={(data) => data.forEach(handleAdd)}
          />
        )}

        <CreateTable
          title="Manage Banks"
          data={banks}
          columns={columns}
          filtersConfig={["accountType"]}
          actions={actions}
        />
      </div>
    </>
  );
}