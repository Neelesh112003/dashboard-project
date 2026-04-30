import { useState } from "react";
import CreateForm from "../components/CreateForm";
import CreateTable from "../components/CreateTable";
import { Plus, Package, Hash, Trash2 } from "lucide-react";

export default function HSNGroups() {
  const [activeForm, setActiveForm] = useState(false);
  const [hsnGroups, setHsnGroups] = useState([]);

  // ✅ ADD
  const handleAdd = (data) => {
    setHsnGroups((prev) => [
      { ...data, id: Date.now() },
      ...prev,
    ]);
    setActiveForm(false);
  };

  // ✅ DELETE
  const handleDelete = (id) => {
    setHsnGroups((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // ✅ INITIAL STATE
  const initialState = {
    name: "",
    code: "",
  };

  // ✅ FORM FIELDS
  const fields = [
    {
      name: "name",
      label: "HSN Group Name",
      icon: Package,
      type: "text",
      placeholder: "Textiles",
    },
    {
      name: "code",
      label: "HSN Code",
      icon: Hash,
      type: "text",
      placeholder: "123456",
    },
  ];

  // ✅ TABLE COLUMNS
  const columns = [
    { label: "Group Name", key: "name" },
    { label: "HSN Code", key: "code" },
  ];

  // ✅ ACTIONS
  const actions = [
    {
      label: "Delete",
      icon: Trash2,
      onClick: (row) => handleDelete(row.id),
      className:
        "border-red-200 text-red-500 hover:bg-red-50",
    },
  ];

  return (
    <>
      {/* TOP BUTTON */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setActiveForm(true)}
          className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          <Plus className="h-4 w-4" />
          Add HSN Group
        </button>

        {activeForm && (
          <button
            onClick={() => setActiveForm(false)}
            className="rounded-xl border px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* ✅ UNIVERSAL FORM */}
        {activeForm && (
          <CreateForm
            title="Add HSN Group"
            subtitle="Add your HSN group details"
            fields={fields}
            initialState={initialState}
            onSubmit={(data) => {
              // ✅ VALIDATION (moved here)
              if (!/^\d{6}$/.test(data.code)) {
                alert("HSN Code must be exactly 6 digits");
                return;
              }

              handleAdd(data);
            }}
            onImport={(data) =>
              data.forEach((item) => {
                if (/^\d{6}$/.test(item.code)) {
                  handleAdd(item);
                }
              })
            }
          />
        )}

        {/* ✅ UNIVERSAL TABLE */}
        <CreateTable
          title="HSN Group List"
          data={hsnGroups}
          columns={columns}
          filtersConfig={["name", "code"]}
          actions={actions}
        />
      </div>
    </>
  );
}