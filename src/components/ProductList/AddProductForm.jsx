import { useState } from "react";
import {
  Package,
  X,
  CheckCircle,
  Hash,
  Shapes,
  Tags,
  Boxes,
  FolderTree,
  ToggleLeft,
  FileText,
  Layers3,
} from "lucide-react";

function Field({ label, required, children, error }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  );
}

export default function CreateProductForm({ onAdd, onClose }) {
  const initialForm = {
    productCode: "",
    productHsn: "",
    productName: "",
    type: "",
    category: "",
    productGroup: "",
    hsnGroupName: "",
    hsnGroupCode: "",
    subType: "",
    subCategory: "",
    productStatus: "active",
    productDetails: "",
  };

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState(false);

  const validate = () => {
    const e = {};

    if (!form.productCode.trim()) e.productCode = "Product code is required";
    if (!form.productHsn.trim()) e.productHsn = "Product HSN is required";
    else if (!/^\d{6}$/.test(form.productHsn.trim())) e.productHsn = "HSN must be 6 digits";

    if (!form.productName.trim()) e.productName = "Product name is required";
    if (!form.type.trim()) e.type = "Type is required";
    if (!form.category.trim()) e.category = "Category is required";
    if (!form.productGroup.trim()) e.productGroup = "Product group is required";
    if (!form.hsnGroupName.trim()) e.hsnGroupName = "HSN group name is required";
    if (!form.hsnGroupCode.trim()) e.hsnGroupCode = "HSN group code is required";
    else if (!/^\d{6}$/.test(form.hsnGroupCode.trim())) e.hsnGroupCode = "HSN group code must be 6 digits";

    if (!form.subType.trim()) e.subType = "Sub-type is required";
    if (!form.subCategory.trim()) e.subCategory = "Sub-category is required";
    if (!form.productDetails.trim()) e.productDetails = "Product details are required";

    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleAdd = () => {
    const e = validate();

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    onAdd?.({
      ...form,
      id: Date.now(),
      createdOn: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    });

    setForm(initialForm);
    setErrors({});
    setSuccessMsg(true);

    setTimeout(() => {
      setSuccessMsg(false);
      onClose?.();
    }, 1500);
  };

  const inp = (field) =>
    `w-full rounded-xl border px-4 py-2.5 text-sm outline-none transition-all bg-slate-50 dark:bg-[#11182b] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 ${
      errors[field] ? "border-red-500" : "border-slate-200 dark:border-[#1b2740]"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-[#0d1528] max-h-[90vh] flex flex-col">
        <div
          className="px-6 py-5 border-b border-slate-200 dark:border-[#162033] flex items-center gap-3 shrink-0"
          style={{ backgroundColor: "#3a3c44" }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(245,245,245,0.12)" }}
          >
            <Package className="h-5 w-5 text-white" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Create Product</h2>
            <p className="text-xs" style={{ color: "rgba(245,245,245,0.55)" }}>
              Fill in the details to create a new product
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="p-6 space-y-6">
            {successMsg ? (
              <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Product created successfully.
              </div>
            ) : null}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Product Information
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <Field label="Product Code" required error={errors.productCode}>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="productCode"
                      placeholder="Enter product code"
                      value={form.productCode}
                      onChange={handleChange}
                      className={inp("productCode") + " pl-11"}
                    />
                  </div>
                </Field>

                <Field label="Product HSN" required error={errors.productHsn}>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="productHsn"
                      maxLength={6}
                      placeholder="Enter 6 digit HSN"
                      value={form.productHsn}
                      onChange={handleChange}
                      className={inp("productHsn") + " pl-11"}
                    />
                  </div>
                </Field>

                <Field label="Product Name" required error={errors.productName}>
                  <div className="relative">
                    <Package className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="productName"
                      placeholder="Enter product name"
                      value={form.productName}
                      onChange={handleChange}
                      className={inp("productName") + " pl-11"}
                    />
                  </div>
                </Field>

                <Field label="Type" required error={errors.type}>
                  <div className="relative">
                    <Shapes className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="type"
                      placeholder="Enter type"
                      value={form.type}
                      onChange={handleChange}
                      className={inp("type") + " pl-11"}
                    />
                  </div>
                </Field>

                <Field label="Category" required error={errors.category}>
                  <div className="relative">
                    <Tags className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="category"
                      placeholder="Enter category"
                      value={form.category}
                      onChange={handleChange}
                      className={inp("category") + " pl-11"}
                    />
                  </div>
                </Field>

                <Field label="Product Group" required error={errors.productGroup}>
                  <div className="relative">
                    <Boxes className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="productGroup"
                      placeholder="Enter product group"
                      value={form.productGroup}
                      onChange={handleChange}
                      className={inp("productGroup") + " pl-11"}
                    />
                  </div>
                </Field>

                <Field label="HSN Group Name" required error={errors.hsnGroupName}>
                  <div className="relative">
                    <FolderTree className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="hsnGroupName"
                      placeholder="Enter group name"
                      value={form.hsnGroupName}
                      onChange={handleChange}
                      className={inp("hsnGroupName") + " pl-11"}
                    />
                  </div>
                </Field>

                <Field label="HSN Group Code" required error={errors.hsnGroupCode}>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="hsnGroupCode"
                      maxLength={6}
                      placeholder="Enter 6 digit HSN code"
                      value={form.hsnGroupCode}
                      onChange={handleChange}
                      className={inp("hsnGroupCode") + " pl-11"}
                    />
                  </div>
                </Field>

                <Field label="Sub-Type" required error={errors.subType}>
                  <div className="relative">
                    <Layers3 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="subType"
                      placeholder="Enter sub-type"
                      value={form.subType}
                      onChange={handleChange}
                      className={inp("subType") + " pl-11"}
                    />
                  </div>
                </Field>

                <Field label="Sub-Category" required error={errors.subCategory}>
                  <div className="relative">
                    <Tags className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      name="subCategory"
                      placeholder="Enter sub-category"
                      value={form.subCategory}
                      onChange={handleChange}
                      className={inp("subCategory") + " pl-11"}
                    />
                  </div>
                </Field>

                <Field label="Product Status" required error={errors.productStatus}>
                  <div className="relative">
                    <ToggleLeft className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <select
                      name="productStatus"
                      value={form.productStatus}
                      onChange={handleChange}
                      className={inp("productStatus") + " pl-11"}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </Field>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 pb-2 border-b border-slate-100 dark:border-[#162033]">
                Product Details
              </p>

              <div className="grid grid-cols-1 gap-5">
                <Field label="Product Details" required error={errors.productDetails}>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                    <textarea
                      rows={4}
                      name="productDetails"
                      placeholder="Enter detailed product information..."
                      value={form.productDetails}
                      onChange={handleChange}
                      className={inp("productDetails") + " pl-11 py-3"}
                    />
                  </div>
                </Field>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-[#162033] flex items-center gap-3 shrink-0">
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#44a83e" }}
          >
            <Package className="h-4 w-4" />
            Create Product
          </button>

          <button
            onClick={() => {
              setForm(initialForm);
              setErrors({});
            }}
            className="rounded-xl border border-slate-200 dark:border-[#1b2740] px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#11182b] transition-all"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}