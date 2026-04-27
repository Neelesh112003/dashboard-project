import { useState } from "react";
import AddOrderForm from "./AddOrder/AddOrderForm";
import OrderList    from "./AddOrder/OrderList";

const SAMPLE_ORDERS = [
  { id: 1, product: "MacBook Pro 13\"", variants: "2 Variants", price: "2399.00", category: "Laptop",     status: "Delivered",  addedOn: "27 Apr 2026" },
  { id: 2, product: "Apple Watch Ultra", variants: "1 Variant",  price: "879.00",  category: "Watch",      status: "Pending",    addedOn: "27 Apr 2026" },
  { id: 3, product: "iPhone 15 Pro Max", variants: "2 Variants", price: "1869.00", category: "SmartPhone", status: "Delivered",  addedOn: "26 Apr 2026" },
];

export default function PurchaseOrders() {
  const [orders, setOrders] = useState(SAMPLE_ORDERS);

  const handleAdd    = (order) => setOrders((prev) => [order, ...prev]);
  const handleDelete = (id)    => setOrders((prev) => prev.filter((o) => o.id !== id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1220] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <AddOrderForm onAdd={handleAdd} />
        <OrderList orders={orders} onDelete={handleDelete} />
      </div>
    </div>
  );
}