import { useState } from "react";
import CreateForm from "../CreateForm";
import CreateTable from "../CreateTable";
import { Package, Boxes, Hash, Trash2 } from "lucide-react";

export default function ProductList() {
  const [activeForm, setActiveForm] = useState(null);
  const [products, setProducts] = useState([]);

  // ✅ ADD
  const handleAdd = (product) => {
    setProducts((prev) => [
      {
        ...product,
        id: Date.now(),
        productId: prev.length + 1, // auto increment
      },
      ...prev,
    ]);
  };

  // ✅ DELETE
  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ INITIAL STATE
  const initialState = {
    productId: "",

    productCode: "",
    productHSN: "",
    productName: "",

    type: "",
    productType: "",

    category: "",
    subType: "",
    subCategory: "",

    productStatus: "Active",

    productGroupId: "",
    productGroupName: "",
    productGroupCode: "",

    hsnGroupId: "",
    hsnGroupName: "",
    hsnGroupCode: "",

    mainUnit: "",
    subUnit: "",

    size: "",
    color: "",

    productDetails: "",
  };

  // ✅ FORM FIELDS
  const fields = [
    // BASIC
    { name: "productCode", label: "Product Code", icon: Hash, type: "text" },
    { name: "productHSN", label: "Product HSN", icon: Hash, type: "number" },
    { name: "productName", label: "Product Name", icon: Package, type: "text" },

    // TYPE
    { name: "type", label: "Type", icon: Boxes, type: "text" },
    {
      name: "productType",
      label: "Product Type",
      icon: Boxes,
      type: "select",
      options: ["Raw Material", "Finished Goods"],
    },

    // CATEGORY
    { name: "category", label: "Category", icon: Hash, type: "text" },
    { name: "subType", label: "Sub-Type", icon: Boxes, type: "text" },
    { name: "subCategory", label: "Sub-Category", icon: Hash, type: "text" },

    // GROUP
    {
      name: "productGroupId",
      label: "Product Group ID",
      icon: Hash,
      type: "text",
    },
    {
      name: "productGroupName",
      label: "Product Group Name",
      icon: Boxes,
      type: "text",
    },
    {
      name: "productGroupCode",
      label: "Product Group Code",
      icon: Hash,
      type: "text",
    },

    // HSN GROUP
    { name: "hsnGroupId", label: "HSN Group ID", icon: Hash, type: "text" },
    {
      name: "hsnGroupName",
      label: "HSN Group Name",
      icon: Boxes,
      type: "text",
    },
    { name: "hsnGroupCode", label: "HSN Group Code", icon: Hash, type: "text" },

    // UNITS
    { name: "mainUnit", label: "Main Unit", icon: Package, type: "text" },
    { name: "subUnit", label: "Sub Unit", icon: Package, type: "text" },

    // ATTRIBUTES
    { name: "size", label: "Size", icon: Hash, type: "text" },
    { name: "color", label: "Color", icon: Hash, type: "text" },

    // STATUS
    {
      name: "productStatus",
      label: "Status",
      icon: Hash,
      type: "select",
      options: ["Active", "Inactive"],
    },

    // DETAILS
    {
      name: "productDetails",
      label: "Description",
      icon: Package,
      type: "textarea",
    },
  ];

  // ✅ TABLE COLUMNS
  const columns = [
    { label: "ID", key: "productId" },
    { label: "Code", key: "productCode" },
    { label: "Name", key: "productName" },
    { label: "HSN", key: "productHSN" },
    { label: "Type", key: "productType" },
    { label: "Category", key: "category" },
    { label: "Group", key: "productGroupName" },
    { label: "Status", key: "productStatus" },
  ];

  // ✅ ACTION BUTTONS
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
            onImport={(data) => data.forEach((item) => handleAdd(item))}
          />
        )}

        {/* ✅ UNIVERSAL TABLE */}
        <CreateTable
          title="Product List"
          data={products}
          columns={columns}
          filtersConfig={[
            "productType",
            "category",
            "productGroupName",
            "productStatus",
          ]}
          actions={actions}
        />
      </div>
    </>
  );
}
