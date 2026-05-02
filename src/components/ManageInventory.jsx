import { useState } from "react";
import InventoryList from "./ManageInventory/InventoryList";

const dummyEntries = [
  {
    id: 1,
    itemName: "Capacitor 100µF 25V",
    productCode: "CAP-100-25",
    productHSN: "85322500",
    productName: "Capacitor 100µF 25V",
    productAlias: "Cap 100µF",
    quantity: "500",
    unit: "Pcs",
    rate: "2.50",
    value: "1250.00",
    transaction: "entry",
    godown: "GDN-002",
    rack: "R-03",
    section: "S-B",
    addedOn: "01 May 2026",
  },
  {
    id: 2,
    itemName: "Resistor 10kΩ 1/4W",
    productCode: "RES-10K-QW",
    productHSN: "85334000",
    productName: "Resistor 10kΩ 1/4W",
    productAlias: "Res 10K",
    quantity: "1000",
    unit: "Pcs",
    rate: "0.80",
    value: "800.00",
    transaction: "entry",
    godown: "GDN-002",
    rack: "R-01",
    section: "S-A",
    addedOn: "28 Apr 2026",
  },
  {
    id: 3,
    itemName: "PCB SMT 100x80mm",
    productCode: "PCB-SMT-100",
    productHSN: "85340000",
    productName: "PCB SMT 100x80mm",
    productAlias: "SMT Board 100",
    quantity: "200",
    unit: "Pcs",
    rate: "45.00",
    value: "9000.00",
    transaction: "drawings",
    godown: "GDN-003",
    rack: "R-02",
    section: "S-C",
    addedOn: "27 Apr 2026",
  },
  {
    id: 4,
    itemName: "Solder Wire 60/40",
    productCode: "SOL-6040",
    productHSN: "83113000",
    productName: "Solder Wire 60/40",
    productAlias: "Solder 60/40",
    quantity: "10",
    unit: "Kg",
    rate: "620.00",
    value: "6200.00",
    transaction: "transfer",
    godownFrom: "GDN-002",
    godownTo: "GDN-003",
    rack: "",
    section: "",
    addedOn: "25 Apr 2026",
  },
];

export default function ManageInventory() {
  const [entries, setEntries] = useState(dummyEntries);

  const handleAdd = (entry) => {
    setEntries((prev) => [...prev, entry]);
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1220] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <InventoryList
          entries={entries}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}