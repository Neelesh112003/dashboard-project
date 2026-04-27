import { useState } from "react";
import AddProductForm from "./ProductList/AddProductForm";
import ProductPreview from "./ProductList/ProductPreview";

const initialProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    price: 299,
    stock: 75,
    category: "Audio",
    sku: "WBH-001",
    description:
      "Premium wireless headphones with noise cancellation and 30-hour battery life.",
  },
  {
    id: 2,
    name: "Gaming Mechanical Keyboard",
    price: 549,
    stock: 42,
    category: "Computer Accessories",
    sku: "GMK-002",
    description:
      "RGB mechanical keyboard with blue switches and customizable backlighting.",
  },
  {
    id: 3,
    name: "4K Smart LED Monitor",
    price: 2999,
    stock: 18,
    category: "Monitors",
    sku: "MON-003",
    description:
      "27-inch Ultra HD 4K monitor with HDR support and ultra-thin bezels.",
  },
  {
    id: 4,
    name: "Portable SSD 1TB",
    price: 999,
    stock: 56,
    category: "Storage Devices",
    sku: "SSD-004",
    description:
      "High-speed external SSD with USB-C connectivity and shock resistance.",
  },
  {
    id: 5,
    name: "Smart Fitness Watch",
    price: 999,
    stock: 93,
    category: "Wearables",
    sku: "SFW-005",
    description:
      "Advanced fitness smartwatch with heart-rate monitoring and GPS tracking.",
  },
];

export default function ProductList() {
  const [products, setProducts] = useState(initialProducts);

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
    setProducts((prev) =>
      prev.filter((product) => product.id !== id)
    );
  };

  return (
    <div className="space-y-8">
      <AddProductForm onAdd={handleAdd} />
      <ProductPreview
        products={products}
        onDelete={handleDelete}
      />
    </div>
  );
}