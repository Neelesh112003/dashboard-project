import { useState } from "react";
import CreateForm from "../CreateForm";
import CreateTable from "../CreateTable";
import { Boxes, Hash, Package, Trash2 } from "lucide-react";

export default function ProductGroups() {
  const [activeForm, setActiveForm] = useState(null);
  const [groups, setGroups] = useState([]);

  // ✅ ADD
  const handleAddGroup = (group) => {
    setGroups((prev) => [
      {
        ...group,
        id: Date.now(),
      },
      ...prev,
    ]);

    setActiveForm(null);
  };

  // ✅ DELETE
  const handleDeleteGroup = (id) => {
    setGroups((prev) => prev.filter((group) => group.id !== id));
  };

  // ✅ INITIAL STATE
  const initialState = {
    groupCode: "",
    groupName: "",
    groupType: "",
    industry: "",
    sector: "",
    categoryStatus: "active",
  };

  // ✅ FORM FIELDS
  const fields = [
    {
      name: "groupCode",
      label: "Group Code",
      icon: Hash,
      type: "text",
      placeholder: "GRP001",
    },
    {
      name: "groupName",
      label: "Group Name",
      icon: Boxes,
      type: "text",
      placeholder: "Red T-Shirt",
    },
    {
      name: "groupType",
      label: "Group Type",
      icon: Hash,
      type: "text",
      placeholder: "Regular",
    },
    {
      name: "industry",
      label: "Industry",
      icon: Package,
      type: "text",
      placeholder: "Clothing",
    },
    {
      name: "sector",
      label: "Sector",
      icon: Package,
      type: "select",
      options: [
        "Apparel & Textiles",
        "Electronics",
        "Automotive",
        "FMCG",
        "Pharmaceuticals",
        "Footwear",
      ],
    },
    {
      name: "categoryStatus",
      label: "Category Status",
      icon: Hash,
      type: "select",
      options: ["active", "inactive"],
    },
  ];

  // ✅ TABLE COLUMNS
  const columns = [
    { label: "Group Code", key: "groupCode" },
    { label: "Group Name", key: "groupName" },
    { label: "Group Type", key: "groupType" },
    { label: "Industry", key: "industry" },
    { label: "Sector", key: "sector" },
    { label: "Category Status", key: "categoryStatus" },
  ];

  // ✅ ACTION BUTTONS (DYNAMIC)
  const actions = [
    {
      label: "Delete",
      icon: Trash2,
      onClick: (row) => handleDeleteGroup(row.id),
      className: "border-red-200 text-red-500 hover:bg-red-50",
    },
  ];

  return (
    <>
      {/* TOP BUTTONS */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setActiveForm("group")}
          className="rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          + Add Group
        </button>

        {activeForm && (
          <button
            onClick={() => setActiveForm(null)}
            className="rounded-xl border px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
          >
            Close
          </button>
        )}
      </div>

      <div className="space-y-8">
        {/* ✅ UNIVERSAL FORM */}
        {activeForm === "group" && (
          <CreateForm
            title="Add Product Group"
            subtitle="Add your product group details"
            fields={fields}
            initialState={initialState}
            onSubmit={(data) => {
              if (!data.groupCode || !data.groupName) {
                alert("Group Code and Name are required");
                return;
              }

              handleAddGroup(data);
            }}
            onImport={(data) => data.forEach((item) => handleAddGroup(item))}
          />
        )}

        {/* ✅ UNIVERSAL TABLE */}
        <CreateTable
          title="Product Group List"
          data={groups}
          columns={columns}
          filtersConfig={["groupType", "industry", "sector", "categoryStatus"]}
          actions={actions}
        />
      </div>
    </>
  );
}
