import { useState } from "react";
import GodownList from "./ManageGodown/GodownList";

const dummyGodowns = [
  {
    id: 1,
    godownCode: "GDN-001",
    godownName: "Main Storage Warehouse",
    type: "Finished Goods",
    location: "Plot 12, Sector 5, Noida, UP",
  },
  {
    id: 2,
    godownCode: "GDN-002",
    godownName: "Raw Material Store",
    type: "Raw Material",
    location: "Block B, Industrial Area, Ghaziabad",
  },
  {
    id: 3,
    godownCode: "GDN-003",
    godownName: "SMT Component Store",
    type: "Semi-Finished",
    location: "Unit 4, Phase II, Noida",
  },
  {
    id: 4,
    godownCode: "GDN-004",
    godownName: "Scrap Yard",
    type: "Scrap",
    location: "Rear Compound, Factory Gate 3",
  },
];

export default function Godowns() {
  const [godowns, setGodowns] = useState(dummyGodowns);

  const handleAdd = (newGodown) => {
    setGodowns((prev) => [...prev, newGodown]);
  };

  const handleDelete = (id) => {
    setGodowns((prev) =>
      prev.filter((godown) => godown.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#0b1220]">
      <div className="mx-auto max-w-7xl">
        <GodownList
          godowns={godowns}
          onAdd={handleAdd}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}