import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";

const DUMMY_SUPPLIERS = [
  {
    id: 1,
    code: "VND-001",
    partyName: "Ravi Enterprises",
    companyName: "Ravi Electronics Pvt Ltd",
    category: "Electronic components",
    type: "Manufacturer",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    pincode: "400093",
    gstin: "27AABCU9603R1ZX",
    contact: "+91 98201 44312",
    email: "rajesh@ravielectronics.com",
    whatsapp: "+91 98201 44312",
    contactPersonName: "Rajesh Kumar",
    paymentTerms: "Net 30",
    industry: "Electronics",
    sector: "Private",
    website: "https://ravielectronics.com",
    status: "Active",
    address: "123 Electronics Park, Thane",
  },
  {
    id: 2,
    code: "VND-002",
    partyName: "Bharat PCB",
    companyName: "Bharat PCB Works",
    category: "PCB & substrates",
    type: "Trader",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    pincode: "560001",
    gstin: "29AAACB1234K1ZP",
    contact: "+91 80501 22134",
    email: "suresh@bharatpcb.com",
    whatsapp: "+91 80501 22134",
    contactPersonName: "Suresh Patil",
    paymentTerms: "Net 15",
    industry: "Electronics",
    sector: "Private",
    address: "456 Industrial Complex, Whitefield",
  },
  {
    id: 3,
    code: "VND-003",
    partyName: "Shree Packaging Co.",
    companyName: "Shree Packaging Solutions",
    category: "Packaging Materials",
    type: "Supplier",
    city: "Delhi",
    state: "Delhi",
    country: "India",
    pincode: "110001",
    gstin: "07AAACB5678M1ZQ",
    contact: "+91 11 4567 8900",
    email: "info@shreepackaging.com",
    whatsapp: "+91 98765 43210",
    contactPersonName: "Amit Singh",
    paymentTerms: "Net 45",
    industry: "Packaging",
    sector: "Private",
    address: "789 Business Park, Okhla",
  },
  {
    id: 4,
    code: "VND-004",
    partyName: "Global Tech Supplies",
    companyName: "Global Tech Supplies Ltd",
    category: "Technology Components",
    type: "Distributor",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    pincode: "600001",
    gstin: "33AAACD9012N1ZR",
    contact: "+91 44 4321 0987",
    email: "sales@globaltech.com",
    whatsapp: "+91 98765 12345",
    contactPersonName: "Priya Sharma",
    paymentTerms: "Net 30",
    industry: "Technology",
    sector: "Private",
    address: "321 Tech Hub, Taramani",
  },
];

export default function POSearch({ onSelectSupplier }) {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSupplierData, setSelectedSupplierData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (value) => {
    setSearchInput(value);
    if (value.trim() === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = DUMMY_SUPPLIERS.filter(supplier =>
      supplier.partyName.toLowerCase().includes(value.toLowerCase()) ||
      supplier.companyName.toLowerCase().includes(value.toLowerCase()) ||
      supplier.code.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSelectSupplier = (supplier) => {
    setSelectedSupplierData(supplier);
    setSearchInput(supplier.partyName);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleFetchDetails = () => {
    if (!selectedSupplierData) return;
    setLoading(true);
    setTimeout(() => {
      onSelectSupplier(selectedSupplierData);
      setLoading(false);
    }, 500);
  };

  const labelStyle = { display: "block", marginBottom: 8, fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" };
  const inputStyle = { width: "100%", padding: "12px 12px 12px 40px", borderRadius: 10, border: "1px solid #e2e8f0", backgroundColor: "#fff", fontSize: 13, outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "#1e293b" }}>Search Supplier</h2>
        <p style={{ margin: "0 0 24px", fontSize: 13, color: "#64748b" }}>Find and select a supplier to create a purchase order</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 180px 180px", gap: 12, alignItems: "flex-end" }}>
          {/* Search Input */}
          <div style={{ position: "relative" }}>
            <label style={labelStyle}>Search by Name, Company, or Code</label>
            <div style={{ position: "relative" }}>
              <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "#9ca3af", pointerEvents: "none" }} />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => searchInput && setShowSuggestions(true)}
                style={inputStyle}
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, maxHeight: 300, overflowY: "auto" }}>
                {suggestions.map((supplier) => (
                  <button key={supplier.id} onClick={() => handleSelectSupplier(supplier)}
                    style={{ width: "100%", padding: "12px 16px", borderBottom: "1px solid #f1f5f9", backgroundColor: "transparent", border: "none", textAlign: "left", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <div>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{supplier.partyName}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>{supplier.code} • {supplier.city}</p>
                    </div>
                    <ChevronRight style={{ width: 16, height: 16, color: "#9ca3af" }} />
                  </button>
                ))}
              </div>
            )}

            {showSuggestions && suggestions.length === 0 && searchInput && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: 16, textAlign: "center", color: "#64748b", fontSize: 13 }}>
                No suppliers found
              </div>
            )}
          </div>

          {/* Selection Info */}
          <div style={{ padding: "10px 16px", backgroundColor: selectedSupplierData ? "#f0fdf4" : "#f8fafc", borderRadius: 10, border: `1px solid ${selectedSupplierData ? "#86efac" : "#e2e8f0"}`, fontSize: 12, color: selectedSupplierData ? "#2d6e2a" : "#64748b", fontWeight: 600, textAlign: "center" }}>
            {selectedSupplierData ? "✓ Selected" : "No selection"}
          </div>

          {/* Fetch Details Button */}
          <button onClick={handleFetchDetails} disabled={!selectedSupplierData || loading}
            style={{ padding: "12px 20px", borderRadius: 10, border: "none", backgroundColor: selectedSupplierData && !loading ? "#44a83e" : "#e2e8f0", color: selectedSupplierData && !loading ? "#fff" : "#9ca3af", fontSize: 13, fontWeight: 600, cursor: selectedSupplierData && !loading ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
            {loading ? "Fetching..." : "Fetch Details"}
          </button>
        </div>
      </div>

      {!selectedSupplierData && (
        <div style={{ backgroundColor: "#f0f9ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 40, textAlign: "center" }}>
          <Search style={{ width: 48, height: 48, color: "#3b82f6", margin: "0 auto 16px" }} />
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>Search for a Supplier</h3>
          <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
            Start typing a supplier name, company name, or code to find and select a supplier for creating a purchase order.
          </p>
        </div>
      )}

      {selectedSupplierData && (
        <div style={{ backgroundColor: "#fff", borderRadius: 12, border: "2px solid #e2e8f0", overflow: "hidden", marginTop: 24 }}>
          <div style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", padding: "16px 24px" }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Supplier Preview</h3>
          </div>
          <div style={{ padding: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 24 }}>
              {[
                { label: "Party Name", value: selectedSupplierData.partyName },
                { label: "Company Name", value: selectedSupplierData.companyName },
                { label: "Supplier Code", value: selectedSupplierData.code, mono: true },
                { label: "Contact Person", value: selectedSupplierData.contactPersonName },
                { label: "Email", value: selectedSupplierData.email },
                { label: "Contact", value: selectedSupplierData.contact },
                { label: "GSTIN", value: selectedSupplierData.gstin, mono: true },
                { label: "Payment Terms", value: selectedSupplierData.paymentTerms },
              ].map((field, idx) => (
                <div key={idx}>
                  <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: "#64748b" }}>{field.label}</p>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: "#1e293b", ...(field.mono && { fontFamily: "monospace", fontSize: 12, backgroundColor: "#f1f5f9", padding: "2px 6px", borderRadius: 4 }) }}>
                    {field.value || "—"}
                  </p>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
              <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: "#64748b" }}>Address</p>
              <p style={{ margin: 0, fontSize: 13, color: "#1e293b" }}>
                {selectedSupplierData.address}, {selectedSupplierData.city}, {selectedSupplierData.state} {selectedSupplierData.pincode}, {selectedSupplierData.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}