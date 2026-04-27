import { useState } from "react";
import {
  Plus,
  Package,
  IndianRupee,
  Boxes,
  FileText,
  Hash,
  DollarSignIcon,
} from "lucide-react";

const initialState = {
  name: "",
  price: "",
  stock: "",
  category: "",
  sku: "",
  description: "",
};

export default function AddProductForm({ onAdd }) {
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
      price: Number(formData.price),
      stock: Number(formData.stock),
    });

    setFormData(initialState);
  };

  const fields = [
    {
      name: "name",
      label: "Product Name",
      icon: Package,
      type: "text",
      placeholder: "e.g. Wireless Mouse",
    },
    {
      name: "price",
      label: "Price",
      icon: DollarSignIcon,
      type: "number",
      placeholder: "e.g. 1499",
    },
    {
      name: "stock",
      label: "Stock Quantity",
      icon: Boxes,
      type: "number",
      placeholder: "e.g. 250",
    },
    {
      name: "category",
      label: "Category",
      icon: Hash,
      type: "text",
      placeholder: "e.g. Electronics",
    },
    {
      name: "sku",
      label: "SKU Code",
      icon: Hash,
      type: "text",
      placeholder: "e.g. WM-2026-001",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
      {/* Header */}
      <div
        className="border-b border-slate-200 px-6 py-5 dark:border-[#162033]"
        style={{ backgroundColor: "#3a3c44" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            <Plus className="h-5 w-5 text-white" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white">
              Add New Product
            </h2>
            <p className="text-xs text-white/60">
              Fill in the details to create a new product
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-3">
          {fields.map((field) => {
            const Icon = field.icon;

            return (
              <div key={field.name} className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {field.label}
                </label>

                <div className="relative">
                  <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#44a83e] focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-100 dark:focus:ring-green-900/20"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Description */}
        <div className="px-6 pb-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Product Description
            </label>

            <div className="relative">
              <FileText className="absolute left-4 top-4 h-4 w-4 text-slate-400" />

              <textarea
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter detailed product description..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#44a83e] focus:bg-white focus:ring-4 focus:ring-green-100 dark:border-[#1b2740] dark:bg-[#11182b] dark:text-slate-100 dark:focus:ring-green-900/20"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="px-6 pb-6">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-[#44a83e] px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#3c9437] active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
}