import { useState } from "react";
import { Plus, Package } from "lucide-react";
import CreateProductForm from "./ProductList/AddProductForm";
import ProductPreview from "./ProductList/ProductPreview";

const initialProducts = [
  {
    id: 1,
    productCode: "PRD-1001",
    productHsn: "847130",
    productName: "Wireless Bluetooth Headphones",
    type: "Finished Goods",
    category: "Audio",
    productGroup: "Electronics Accessories",
    hsnGroupName: "Audio Devices",
    hsnGroupCode: "851830",
    subType: "Wireless",
    subCategory: "Headphones",
    productStatus: "active",
    productDetails:
      "Premium wireless headphones with noise cancellation and 30-hour battery life.",
    createdOn: "27 Apr 2026",
  },
  {
    id: 2,
    productCode: "PRD-1002",
    productHsn: "847160",
    productName: "Gaming Mechanical Keyboard",
    type: "Finished Goods",
    category: "Computer Accessories",
    productGroup: "Peripherals",
    hsnGroupName: "Input Devices",
    hsnGroupCode: "847160",
    subType: "Mechanical",
    subCategory: "Keyboard",
    productStatus: "active",
    productDetails:
      "RGB mechanical keyboard with blue switches and customizable backlighting.",
    createdOn: "26 Apr 2026",
  },
  {
    id: 3,
    productCode: "PRD-1003",
    productHsn: "852852",
    productName: "4K Smart LED Monitor",
    type: "Finished Goods",
    category: "Monitors",
    productGroup: "Display Units",
    hsnGroupName: "Visual Display",
    hsnGroupCode: "852852",
    subType: "LED",
    subCategory: "4K Monitor",
    productStatus: "active",
    productDetails:
      "27-inch Ultra HD 4K monitor with HDR support and ultra-thin bezels.",
    createdOn: "25 Apr 2026",
  },
  {
    id: 4,
    productCode: "PRD-1004",
    productHsn: "847170",
    productName: "Portable SSD 1TB",
    type: "Finished Goods",
    category: "Storage Devices",
    productGroup: "External Storage",
    hsnGroupName: "Storage Media",
    hsnGroupCode: "847170",
    subType: "SSD",
    subCategory: "Portable Drive",
    productStatus: "inactive",
    productDetails:
      "High-speed external SSD with USB-C connectivity and shock resistance.",
    createdOn: "24 Apr 2026",
  },
  {
    id: 5,
    productCode: "PRD-1005",
    productHsn: "851762",
    productName: "Smart Fitness Watch",
    type: "Finished Goods",
    category: "Wearables",
    productGroup: "Smart Devices",
    hsnGroupName: "Wearable Tech",
    hsnGroupCode: "851762",
    subType: "Smart Watch",
    subCategory: "Fitness Wearable",
    productStatus: "active",
    productDetails:
      "Advanced fitness smartwatch with heart-rate monitoring and GPS tracking.",
    createdOn: "23 Apr 2026",
  },
];

export default function ProductList() {
  const [products, setProducts] = useState(initialProducts);
  const [showCreateProduct, setShowCreateProduct] = useState(false);

  const handleAdd = (product) => {
    setProducts((prev) => [
      {
        ...product,
        id: Date.now(),
      },
      ...prev,
    ]);
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm dark:border-[#162033] dark:bg-[#0d1528]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-[#44a83e] dark:bg-green-900/20 dark:text-green-400">
            <Package className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Manage Products
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Create and manage your product master list
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateProduct(true)}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#44a83e" }}
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <ProductPreview products={products} onDelete={handleDelete} />

      {showCreateProduct && (
        <CreateProductForm
          onAdd={handleAdd}
          onClose={() => setShowCreateProduct(false)}
        />
      )}
    </div>
  );
}