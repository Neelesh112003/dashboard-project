import { useState } from "react";
import { Plus, X } from "lucide-react";
import SupplierForm from "../suppliers/SupplierForm";
import SupplierList from "../suppliers/SuppliersList";
const dummySuppliers = [
  {
    id: 1,
    code: "VND-001",
    supplierName: "Ravi Enterprises",
    partyName: "Ravi Electronics Pvt Ltd",
    companyName: "Ravi Electronics Pvt Ltd",
    category: "Electronic components",
    type: "Manufacturer",
    industry: "Electronics",
    sector: "Private",
    gstin: "27AABCU9603R1ZX",
    licenseNumber: "",
    website: "https://ravielectronics.com",
    status: "Active",
    address: "123 Electronics Park, Thane",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400093",
    contact: "+91 98201 44312",
    email: "rajesh@ravielectronics.com",
    whatsapp: "+91 98201 44312",
    contactPersonName: "Rajesh Kumar",
    contactPersonDesignation: "Director",
    contactPersonContact: "+91 98201 44312",
    contactPersonEmail: "rajesh@ravielectronics.com",
    contactPersonWhatsapp: "+91 98201 44312",
    details: "Premium electronics components supplier since 2010.",
    createdAt: new Date("2023-03-12").toISOString(),
    updatedAt: new Date("2024-11-01").toISOString(),
  },
  {
    id: 2,
    code: "VND-002",
    supplierName: "Bharat PCB",
    partyName: "Bharat PCB Works",
    companyName: "Bharat PCB Works",
    category: "PCB & substrates",
    type: "Trader",
    industry: "Electronics",
    sector: "Private",
    gstin: "29AAACB1234K1ZP",
    licenseNumber: "",
    website: "",
    status: "Active",
    address: "456 Industrial Complex, Whitefield",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    pincode: "560001",
    contact: "+91 80501 22134",
    email: "suresh@bharatpcb.com",
    whatsapp: "+91 80501 22134",
    contactPersonName: "Suresh Patil",
    contactPersonDesignation: "Manager",
    contactPersonContact: "+91 80501 22134",
    contactPersonEmail: "suresh@bharatpcb.com",
    contactPersonWhatsapp: "+91 80501 22134",
    details: "",
    createdAt: new Date("2023-06-20").toISOString(),
    updatedAt: new Date("2024-10-15").toISOString(),
  },
];

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState(dummySuppliers);
  const [showForm,  setShowForm]  = useState(false);

  const handleAdd = (supplier) => {
    setSuppliers(prev => [{ ...supplier, id: Date.now() }, ...prev]);
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  };

  // Pass live codes and party names so duplicates are checked against current data
  const existingCodes       = suppliers.map(s => s.code);
  const existingPartyNames  = suppliers.map(s => s.partyName);

  return (
    <div style={{ minHeight:"100vh", backgroundColor:"#f5f5f5", padding:24 }}>
      <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexDirection:"column", gap:20 }}>

        {/* Page Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <h1 style={{ margin:0, fontSize:20, fontWeight:700, color:"#30333e" }}>Suppliers</h1>
            <p style={{ margin:0, fontSize:13, color:"#9ca3af", marginTop:2 }}>Manage your vendor master list</p>
          </div>
          <button
            onClick={() => setShowForm(v => !v)}
            style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"9px 18px", borderRadius:10, border:"none",
              fontSize:13, fontWeight:600, cursor:"pointer",
              backgroundColor: showForm ? "#3a3c44" : "#44a83e",
              color:"#fff", transition:"background 0.2s",
            }}>
            {showForm
              ? <><X style={{ width:16, height:16 }} /> Cancel</>
              : <><Plus style={{ width:16, height:16 }} /> Add Supplier</>}
          </button>
        </div>

        {/* Inline Form */}
        {showForm && (
          <div style={{ animation:"slideDown 0.2s ease" }}>
            <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}`}</style>
            <SupplierForm
              onAdd={handleAdd}
              existingCodes={existingCodes}
              existingPartyNames={existingPartyNames}
            />
          </div>
        )}

        {/* Supplier List */}
        <SupplierList
          suppliers={suppliers}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>
    </div>
  );
}