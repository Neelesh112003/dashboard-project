import { useState } from "react";
import { Plus, Boxes, Hash, Package, Upload } from "lucide-react";
const initialState = {
  groupName: "",
  type: "",
  industry: "",
  sector: "",
  category: "",
  status: "active",
};
const fields = [
  {
    name: "groupName",
    label: "Group Name",
    icon: Boxes,
    type: "text",
    placeholder: "e.g. Red T-Shirt",
  },
  {
    name: "type",
    label: "Type",
    icon: Hash,
    type: "text",
    placeholder: "e.g. Regular",
  },
  {
    name: "industry",
    label: "Industry",
    icon: Package,
    type: "text",
    placeholder: "e.g. Clothing",
  },
  {
    name: "sector",
    label: "Sector",
    icon: Package,
    type: "select", // Changed to select
    options: [
      "Apparel & Textiles", 
      "Electronics", 
      "Automotive", 
      "FMCG", 
      "Pharmaceuticals", 
      "Footwear"
    ],
  },
  {
    name: "category",
    label: "Category",
    icon: Hash,
    type: "select", // Changed to select
    options: [
      "On Demand", 
      "Stock Item", 
      "Raw Material", 
      "Work in Progress", 
      "Finished Goods"
    ],
  },
  {
    name: "status",
    label: "Status",
    icon: Hash,
    type: "select",
    options: ["active", "inactive"],
  },
];

export default function AddProductGroupForm({ onAdd }) {
  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAdd({
      ...formData,
      id: Date.now(),
    });

    setFormData(initialState);
  };
  const handleImport = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const text = event.target.result;

    const rows = text.split("\n").map((row) => row.split(","));
    const headers = rows[0];

    const importedGroups = rows.slice(1).map((row) => {
      const obj = {};

      headers.forEach((header, index) => {
        obj[header.trim()] = row[index]?.trim();
      });

      return {
        ...obj,
        id: Date.now() + Math.random(),
      };
    });

    // ✅ directly push to table
    importedGroups.forEach((group) => onAdd(group));
  };

  reader.readAsText(file);
};

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
      
      {/* Header */}
      <div
  className="border-b border-slate-200 px-6 py-5 flex items-center justify-between dark:border-[#162033]"
  style={{ backgroundColor: "#3a3c44" }}
>
  <div className="flex items-center gap-3">
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
      <Plus className="h-5 w-5 text-white" />
    </div>

    <div>
      <h2 className="text-lg font-semibold text-white">
        Add Product Group
      </h2>
      <p className="text-xs text-white/60">
        add your product group details here
      </p>
    </div>
  </div>

  {/* ✅ IMPORT BUTTON */}
  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-medium text-white hover:bg-white/10">
    <Upload className="h-4 w-4" />
    Import
    <input
      type="file"
      accept=".csv"
      onChange={handleImport}
      className="hidden"
    />
  </label>
</div>
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
          {fields.map((field) => {
            const Icon = field.icon;

            return (
              <div key={field.name} className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {field.label}
                </label>

                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none focus:border-[#44a83e] focus:bg-white dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-100"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#44a83e] focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-100 dark:focus:ring-green-900/20"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <div className="px-6 pb-6">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#3c9437] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Create Group
          </button>
           
        </div>
      </form>
    </div>
  );
}