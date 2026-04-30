import { useState } from "react";
import CreateForm from "../components/CreateForm";
import CreateTable from "../components/CreateTable";
import { Package, Boxes, Hash,Trash2 } from "lucide-react";

export default function ProductList() {
  const [activeForm, setActiveForm] = useState(null);
  const [products, setProducts] = useState([]);

  // ✅ ADD
  const handleAdd = (product) => {
    setProducts((prev) => [
      {
        ...product,
        id: Date.now(),
      },
      ...prev,
    ]);
  };

  // ✅ DELETE
  const handleDelete = (id) => {
    setProducts((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  // ✅ INITIAL STATE
  const initialState = {
    productCode: "",
    productHSN: "",
    productName: "",
    type: "",
    category: "",
    productGroup: "",
    hsnGroup: "",
    subType: "",
    subCategory: "",
    productStatus: "Active",
    productDetails: "",
  };

  // ✅ FORM FIELDS
  const fields = [
    {
      name: "productCode",
      label: "Product Code",
      icon: Hash,
      type: "text",
      placeholder: "PRD-001",
    },
    {
      name: "productHSN",
      label: "Product HSN",
      icon: Hash,
      type: "number",
      placeholder: "8471",
    },
    {
      name: "productName",
      label: "Product Name",
      icon: Package,
      type: "text",
      placeholder: "Wireless Mouse",
    },
    {
      name: "type",
      label: "Type",
      icon: Boxes,
      type: "text",
    },
    {
      name: "category",
      label: "Category",
      icon: Hash,
      type: "text",
    },
    {
      name: "productGroup",
      label: "Product Group",
      icon: Boxes,
      type: "select",
      options: ["Accessories", "Raw Materials", "Finished Goods"],
    },
    {
      name: "hsnGroup",
      label: "HSN Group",
      icon: Hash,
      type: "select",
      options: ["IT Goods", "Textiles", "Electronics"],
    },
    {
      name: "subType",
      label: "Sub-Type",
      icon: Boxes,
      type: "text",
    },
    {
      name: "subCategory",
      label: "Sub-Category",
      icon: Hash,
      type: "text",
    },
    {
      name: "productStatus",
      label: "Status",
      icon: Hash,
      type: "select",
      options: ["Active", "Inactive"],
    },
    {
      name: "productDetails",
      label: "Details",
      icon: Package,
      type: "textarea",
      placeholder: "Description...",
    },
  ];

  // ✅ TABLE COLUMNS
  const columns = [
    { label: "Code", key: "productCode" },
    { label: "HSN", key: "productHSN" },
    { label: "Name", key: "productName" },
    { label: "Type", key: "type" },
    { label: "Category", key: "category" },
    { label: "Group", key: "productGroup" },
    { label: "Status", key: "productStatus" },
  ];

  // ✅ ACTION BUTTONS
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
      {/* TOP BUTTONS */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={() => setActiveForm("product")}
          className="rounded-xl bg-[#44a83e] px-5 py-2 text-sm font-semibold text-white hover:bg-[#3c9437]"
        >
          + Add Product
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
        {activeForm === "product" && (
          <CreateForm
            title="Add New Product"
            subtitle="Fill product details"
            fields={fields}
            initialState={initialState}
            onSubmit={handleAdd}
            onImport={(data) =>
              data.forEach((item) => handleAdd(item))
            }
          />
        )}

        {/* ✅ UNIVERSAL TABLE */}
        <CreateTable
          title="Product List"
          data={products}
          columns={columns}
          filtersConfig={[
            "type",
            "category",
            "productGroup",
            "productStatus",
          ]}
          actions={actions}
        />
      </div>
    </>
  );
}