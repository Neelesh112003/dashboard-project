import { useState } from "react";
import { Package } from "lucide-react";
import {
  ProductBasicFields,
  ProductCategoryFields,
  ProductPricingFields,
} from "../ProductForm/ProductFormFields";
import ProductStatus from "../ProductForm/ProductStatus";
import ProductDescription from "../ProductForm/ProductDescription";
import ProductUploads from "../ProductForm/ProductUploads";
import ProductToggles from "../ProductForm/ProductToggles";
import ProductFormActions from "../ProductForm/ProductFormActions";

const defaultForm = {
  name: "",
  sku: "",
  category: "",
  price: "",
  stock: "",
  reorder: "",
  warehouse: "",
  status: "active",
  description: "",
  featured: false,
  availableForSale: true,
};

export default function AddProduct() {
  const [form, setForm] = useState(defaultForm);
  const [productImage, setProductImage] = useState(null);
  const [specSheet, setSpecSheet] = useState(null);
  const [imageDrag, setImageDrag] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleGenerateSKU = () => {
    const prefix = form.category
      ? form.category.slice(0, 3).toUpperCase()
      : "PRD";
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setForm((f) => ({ ...f, sku: `${prefix}-${random}` }));
  };

  const handleReset = () => {
    setForm(defaultForm);
    setProductImage(null);
    setSpecSheet(null);
    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-[#162033] dark:bg-[#0b1220]">
      {/* Header */}
      <div className="border-b border-slate-100 px-6 py-5 dark:border-[#162033]">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ backgroundColor: "#44a83e" }}
          >
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-medium text-slate-900 dark:text-[#f5f5f5]">
              Add Product
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#f5f5f5]/50">
              Create and register a new product instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          <ProductBasicFields
            form={form}
            onChange={handleChange}
            onGenerateSKU={handleGenerateSKU}
          />
          <ProductCategoryFields form={form} onChange={handleChange} />
          <ProductPricingFields form={form} onChange={handleChange} />
          <ProductStatus value={form.status} onChange={handleChange} />
          <ProductDescription
            value={form.description}
            onChange={handleChange}
          />
          <ProductUploads
            productImage={productImage}
            setProductImage={setProductImage}
            specSheet={specSheet}
            setSpecSheet={setSpecSheet}
            imageDrag={imageDrag}
            setImageDrag={setImageDrag}
          />
          <ProductToggles form={form} setForm={setForm} />
          <ProductFormActions onReset={handleReset} submitted={submitted} />
        </div>
      </form>
    </div>
  );
}
