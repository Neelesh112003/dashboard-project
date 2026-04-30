import { useState} from "react";
import { useSearchParams } from "react-router-dom";
import CreateForm from "../CreateForm";
import CreateTable from "../CreateTable";
import {
  Plus,
  Calendar,
  FileText,
  IndianRupee,
  Building2,
  Trash2,
} from "lucide-react";

export default function BankBook() {
  const [activeForm, setActiveForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [banks, setBanks] = useState(["SBI", "HDFC","UNION","ICICI","PUNJAB"]); // later from DB

  const [searchParams] = useSearchParams();
  const selectedBank = searchParams.get("bank");

  const handleAdd = (data) => {
    setTransactions((prev) => [{ ...data, id: Date.now() }, ...prev]);
    setActiveForm(false);
  };

  const handleDelete = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const initialState = {
    date: "",
    particular: "",
    amount: "",
    bank: banks[0] || "",
    type: "entry",
  };

  const fields = [
    { name: "date", label: "Date", icon: Calendar, type: "date" },
    {
      name: "particular",
      label: "Particular",
      icon: FileText,
      type: "text",
      placeholder: "Details",
    },
    {
      name: "amount",
      label: "Amount",
      icon: IndianRupee,
      type: "number",
    },
    {
      name: "bank",
      label: "Bank",
      icon: Building2,
      type: "select",
      options: banks,
    },
    {
      name: "type",
      label: "Type",
      icon: FileText,
      type: "select",
      options: ["entry", "drawing"],
    },
  ];

  const columns = [
    { label: "Date", key: "date" },
    { label: "Particular", key: "particular" },
    { label: "Amount", key: "amount" },
    { label: "Bank", key: "bank" },
    { label: "Type", key: "type" },
  ];

  const actions = [
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
          <Plus className="h-4 w-4" /> Add Bank Transaction
        </button>
      </div>

      <div className="space-y-8">
        {activeForm && (
          <CreateForm
            title="Bank Transaction"
            subtitle="Add bank entry"
            fields={fields}
            initialState={initialState}
            onSubmit={handleAdd}
            onImport={(data) => data.forEach(handleAdd)}
          />
        )}

        <CreateTable
          title="Bank Book"
          data={
            selectedBank
              ? transactions.filter((t) => t.bank === selectedBank)
              : transactions
          }
          columns={columns}
          filtersConfig={["bank", "type"]}
          actions={actions}
        />
      </div>
    </>
  );
}